let templates = [];
let categories = [];
let settings = {};
let currentCategory = '全部';
let searchQuery = '';
let currentSort = 'lastUsed';
let selectedIndex = -1;
let injectMode = 'replace';
let smartInjectionEnabled = true;
let addSeparatorEnabled = true;
let conversationState = { isOngoing: false, platform: 'Unknown' };

document.addEventListener('DOMContentLoaded', init);

async function init() {
  await loadData();
  await fetchConversationState();
  renderConversationStatus();
  renderCategories();
  renderTemplateList();
  setupEventListeners();
}

async function fetchConversationState() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'getConversationState' });
      if (response) {
        conversationState = response;
      }
    }
  } catch (e) {
    conversationState = { isOngoing: false, platform: 'Unknown' };
  }
}

function renderConversationStatus() {
  const container = document.getElementById('conversationStatus');
  if (!container || !smartInjectionEnabled) {
    if (container) container.innerHTML = '';
    return;
  }
  
  const statusClass = conversationState.isOngoing ? 'ongoing' : 'new';
  const statusText = conversationState.isOngoing ? '💬 对话中 - 使用精简版' : '✨ 新对话 - 使用完整版';
  
  container.innerHTML = `
    <div class="status-badge ${statusClass}">
      ${statusText}
    </div>
  `;
}

async function loadData() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['templates', 'categories', 'settings'], (result) => {
      templates = result.templates || [];
      categories = result.categories || ['代码', '写作', '翻译', '其他'];
      settings = result.settings || { defaultSort: 'lastUsed' };
      currentSort = settings.defaultSort || 'lastUsed';
      smartInjectionEnabled = settings.smartInjection !== false;
      addSeparatorEnabled = settings.addSeparator !== false;
      document.getElementById('sortSelect').value = currentSort;
      resolve();
    });
  });
}

function setupEventListeners() {
  document.getElementById('searchInput').addEventListener('input', (e) => {
    searchQuery = e.target.value;
    selectedIndex = -1;
    renderTemplateList();
  });

  document.getElementById('sortSelect').addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderTemplateList();
  });

  document.getElementById('manageBtn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      injectMode = btn.dataset.mode;
    });
  });

  document.addEventListener('keydown', (e) => {
    const filtered = filterAndSortTemplates();
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, filtered.length - 1);
      updateSelection();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, -1);
      updateSelection();
    } else if (e.key === 'Enter' && selectedIndex >= 0 && filtered[selectedIndex]) {
      e.preventDefault();
      injectTemplate(filtered[selectedIndex]);
    } else if (e.key >= '1' && e.key <= '9') {
      const index = parseInt(e.key) - 1;
      if (filtered[index]) {
        injectTemplate(filtered[index]);
      }
    }
  });
}

function updateSelection() {
  const items = document.querySelectorAll('.template-item');
  items.forEach((item, i) => {
    item.classList.toggle('selected', i === selectedIndex);
  });
  
  if (selectedIndex >= 0 && items[selectedIndex]) {
    items[selectedIndex].scrollIntoView({ block: 'nearest' });
  }
}

function renderCategories() {
  const container = document.getElementById('categories');
  const allCategories = ['全部', ...categories];
  
  container.innerHTML = allCategories.map(cat => `
    <button class="category-btn ${cat === currentCategory ? 'active' : ''}" data-category="${cat}">
      ${cat}
    </button>
  `).join('');

  container.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentCategory = btn.dataset.category;
      container.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTemplateList();
    });
  });
}

function filterAndSortTemplates() {
  let filtered = templates;
  
  if (currentCategory && currentCategory !== '全部') {
    filtered = filtered.filter(t => t.category === currentCategory);
  }
  
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(t => 
      t.name.toLowerCase().includes(query) ||
      t.content.toLowerCase().includes(query)
    );
  }
  
  return [...filtered].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    
    switch (currentSort) {
      case 'lastUsed':
        const aTime = a.lastUsedAt ? new Date(a.lastUsedAt).getTime() : 0;
        const bTime = b.lastUsedAt ? new Date(b.lastUsedAt).getTime() : 0;
        return bTime - aTime;
      case 'usageCount':
        return (b.usageCount || 0) - (a.usageCount || 0);
      default:
        return (a.order || 0) - (b.order || 0);
    }
  });
}

function renderTemplateList() {
  const container = document.getElementById('templateList');
  const filtered = filterAndSortTemplates();
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📭</div>
        <div>没有找到模板</div>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((tpl, index) => {
    const smartContent = getSmartContent(tpl);
    const previewText = tpl.displayPreview || escapeHtml(smartContent.substring(0, 80));
    
    return `
      <div class="template-item ${tpl.pinned ? 'pinned' : ''}" data-id="${tpl.id}">
        <div class="template-header">
          <span class="template-icon"></span>
          <span class="template-name">${escapeHtml(tpl.name)}</span>
          ${index < 9 ? `<span class="template-shortcut">${index + 1}</span>` : ''}
        </div>
        <div class="template-preview">${previewText}${smartContent.length > 80 ? '...' : ''}</div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.template-item').forEach(item => {
    item.addEventListener('click', () => {
      const tpl = templates.find(t => t.id === item.dataset.id);
      if (tpl) injectTemplate(tpl);
    });
  });
}

function getSmartContent(template) {
  if (!smartInjectionEnabled || !template.conversationMode) {
    return template.content;
  }
  
  return conversationState.isOngoing
    ? (template.conversationMode.ongoing || template.content)
    : (template.conversationMode.newChat || template.content);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function injectTemplate(template) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  template.usageCount = (template.usageCount || 0) + 1;
  template.lastUsedAt = new Date().toISOString();
  
  const index = templates.findIndex(t => t.id === template.id);
  if (index !== -1) {
    templates[index] = template;
    chrome.storage.local.set({ templates });
  }

  try {
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: 'injectTemplate',
      template: template,
      mode: injectMode,
      smartInjection: smartInjectionEnabled,
      addSeparator: addSeparatorEnabled
    });
    
    if (response?.success) {
      window.close();
    } else {
      copyToClipboard(getSmartContent(template));
    }
  } catch {
    copyToClipboard(getSmartContent(template));
  }
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('已复制到剪贴板');
    setTimeout(() => window.close(), 800);
  } catch {
    showToast('复制失败', true);
  }
}

function showToast(message, isError = false) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.className = `toast ${isError ? 'error' : 'success'}`;
  toast.textContent = message;
  document.body.appendChild(toast);
}
