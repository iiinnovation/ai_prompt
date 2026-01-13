let templates = [];
let categories = [];
let settings = {};
let currentCategory = '全部';
let searchQuery = '';
let currentSort = 'lastUsed';

document.addEventListener('DOMContentLoaded', init);

async function init() {
  await loadData();
  renderCategories();
  renderTemplateList();
  setupEventListeners();
}

async function loadData() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['templates', 'categories', 'settings'], (result) => {
      templates = result.templates || [];
      categories = result.categories || ['代码', '写作', '翻译', '其他'];
      settings = result.settings || { defaultSort: 'lastUsed' };
      currentSort = settings.defaultSort || 'lastUsed';
      document.getElementById('sortSelect').value = currentSort;
      resolve();
    });
  });
}

function setupEventListeners() {
  document.getElementById('searchInput').addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderTemplateList();
  });

  document.getElementById('sortSelect').addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderTemplateList();
  });

  document.getElementById('manageBtn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '9') {
      const index = parseInt(e.key) - 1;
      const filtered = filterAndSortTemplates();
      if (filtered[index]) {
        injectTemplate(filtered[index]);
      }
    }
  });
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

  container.innerHTML = filtered.map((tpl, index) => `
    <div class="template-item ${tpl.pinned ? 'pinned' : ''}" data-id="${tpl.id}">
      <span class="template-icon"></span>
      <span class="template-name">${escapeHtml(tpl.name)}</span>
      ${index < 9 ? `<span class="template-shortcut">${index + 1}</span>` : ''}
      <div class="template-preview">${escapeHtml(tpl.content.substring(0, 300))}${tpl.content.length > 300 ? '...' : ''}</div>
    </div>
  `).join('');

  container.querySelectorAll('.template-item').forEach(item => {
    item.addEventListener('click', () => {
      const tpl = templates.find(t => t.id === item.dataset.id);
      if (tpl) injectTemplate(tpl);
    });
  });
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

  chrome.tabs.sendMessage(tab.id, {
    action: 'injectTemplate',
    template: template
  }, (response) => {
    if (response && response.success) {
      window.close();
    }
  });
}
