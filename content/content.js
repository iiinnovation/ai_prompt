(function() {
  let quickPanel = null;
  let overlay = null;
  let templates = [];
  let categories = [];
  let settings = {};
  let currentCategory = '全部';
  let searchQuery = '';
  let selectedIndex = -1;
  let injectMode = 'replace';
  let smartInjectionEnabled = true;

  function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.apt-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `apt-toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  async function loadData() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['templates', 'categories', 'settings'], (result) => {
        templates = result.templates || [];
        categories = result.categories || ['代码', '写作', '翻译', '其他'];
        settings = result.settings || {};
        smartInjectionEnabled = settings.smartInjection !== false;
        resolve();
      });
    });
  }

  function sortTemplates(list, sortBy = 'lastUsed') {
    return [...list].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      
      switch (sortBy) {
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

  function filterTemplates() {
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
    
    return sortTemplates(filtered, settings.defaultSort || 'lastUsed');
  }

  let variableModal = null;

  function showVariableModal(template, content, variables, callback) {
    hideVariableModal();
    
    variableModal = document.createElement('div');
    variableModal.className = 'apt-variable-modal';
    variableModal.innerHTML = `
      <div class="apt-variable-header">
        <div class="apt-variable-title">填写模板变量</div>
        <div class="apt-variable-subtitle">${escapeHtml(template.name)}</div>
      </div>
      <div class="apt-variable-body">
        ${variables.map((v, i) => `
          <div class="apt-variable-field">
            <label class="apt-variable-label">${escapeHtml(v)}</label>
            <input type="text" class="apt-variable-input" data-var="${escapeHtml(v)}" placeholder="请输入${escapeHtml(v)}" ${i === 0 ? 'autofocus' : ''} />
          </div>
        `).join('')}
      </div>
      <div class="apt-variable-footer">
        <button class="apt-variable-btn apt-variable-btn-cancel">取消</button>
        <button class="apt-variable-btn apt-variable-btn-confirm">确认注入</button>
      </div>
    `;
    document.body.appendChild(variableModal);

    requestAnimationFrame(() => variableModal.classList.add('show'));

    const inputs = variableModal.querySelectorAll('.apt-variable-input');
    const cancelBtn = variableModal.querySelector('.apt-variable-btn-cancel');
    const confirmBtn = variableModal.querySelector('.apt-variable-btn-confirm');

    cancelBtn.addEventListener('click', hideVariableModal);

    confirmBtn.addEventListener('click', () => {
      const values = {};
      inputs.forEach(input => {
        values[input.dataset.var] = input.value || input.placeholder.replace('请输入', '');
      });
      const finalContent = window.PlatformHelper.replaceVariables(content, values);
      hideVariableModal();
      callback(finalContent);
    });

    inputs.forEach((input, index) => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (index < inputs.length - 1) {
            inputs[index + 1].focus();
          } else {
            confirmBtn.click();
          }
        } else if (e.key === 'Escape') {
          hideVariableModal();
        }
      });
    });

    if (inputs.length > 0) inputs[0].focus();
  }

  function hideVariableModal() {
    if (variableModal) {
      variableModal.classList.remove('show');
      setTimeout(() => {
        if (variableModal && variableModal.parentNode) {
          variableModal.parentNode.removeChild(variableModal);
        }
        variableModal = null;
      }, 200);
    }
  }

  async function injectTemplate(template) {
    const contentToInject = smartInjectionEnabled 
      ? window.PlatformHelper.getSmartContent(template)
      : template.content;
    
    const extractFn = window.PlatformHelper.extractVariables;
    const variables = extractFn ? extractFn(contentToInject) : [];
    
    if (variables.length > 0) {
      hideQuickPanel();
      showVariableModal(template, contentToInject, variables, (finalContent) => {
        doInject(template, finalContent, false);
      });
    } else {
      const shouldAddSeparator = contentToInject.length > 100 || contentToInject.includes('\n');
      doInject(template, contentToInject, shouldAddSeparator);
    }
  }

  function doInject(template, content, addSeparator = true) {
    const separatorEnabled = settings.addSeparator !== false && addSeparator;
    const success = window.PlatformHelper.injectContent(content, injectMode, { addSeparator: separatorEnabled });
    
    if (success) {
      template.usageCount = (template.usageCount || 0) + 1;
      template.lastUsedAt = new Date().toISOString();
      
      const index = templates.findIndex(t => t.id === template.id);
      if (index !== -1) {
        templates[index] = template;
        chrome.storage.local.set({ templates });
      }
      
      const state = window.PlatformHelper.getConversationState();
      const modeText = state.isOngoing ? '对话中模式' : '新对话模式';
      showToast(`模板已注入 (${modeText})`, 'success');
      hideQuickPanel();
    } else {
      showToast('注入失败，未找到输入框', 'error');
    }
  }

  function createQuickPanel() {
    if (quickPanel) return;

    overlay = document.createElement('div');
    overlay.className = 'apt-overlay';
    overlay.addEventListener('click', hideQuickPanel);
    document.body.appendChild(overlay);

    quickPanel = document.createElement('div');
    quickPanel.className = 'apt-quick-panel';
    quickPanel.innerHTML = `
      <div class="apt-panel-header">
        <input type="text" class="apt-search-input" placeholder="🔍 搜索模板..." />
        <div class="apt-mode-toggle">
          <button class="apt-mode-btn active" data-mode="replace">覆盖</button>
          <button class="apt-mode-btn" data-mode="append">追加</button>
        </div>
      </div>
      <div class="apt-conversation-status"></div>
      <div class="apt-panel-categories"></div>
      <div class="apt-panel-list"></div>
      <div class="apt-panel-footer">
        <button class="apt-manage-btn">⚙️ 管理模板</button>
      </div>
    `;
    document.body.appendChild(quickPanel);

    const searchInput = quickPanel.querySelector('.apt-search-input');
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      selectedIndex = -1;
      renderTemplateList();
    });

    quickPanel.querySelectorAll('.apt-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        quickPanel.querySelectorAll('.apt-mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        injectMode = btn.dataset.mode;
      });
    });

    const manageBtn = quickPanel.querySelector('.apt-manage-btn');
    manageBtn.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'openOptions' });
      hideQuickPanel();
    });

    quickPanel.addEventListener('keydown', handleKeyboardNavigation);
  }

  function renderCategories() {
    const container = quickPanel.querySelector('.apt-panel-categories');
    const allCategories = ['全部', ...categories];
    
    container.innerHTML = allCategories.map(cat => `
      <button class="apt-category-btn ${cat === currentCategory ? 'active' : ''}" data-category="${cat}">
        ${cat}
      </button>
    `).join('');

    container.querySelectorAll('.apt-category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentCategory = btn.dataset.category;
        container.querySelectorAll('.apt-category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderTemplateList();
      });
    });
  }

  function renderTemplateList() {
    const container = quickPanel.querySelector('.apt-panel-list');
    const filtered = filterTemplates();
    
    if (filtered.length === 0) {
      container.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">没有找到模板</div>';
      return;
    }

    const state = window.PlatformHelper.getConversationState();

    container.innerHTML = filtered.slice(0, 9).map((tpl, index) => {
      const previewText = tpl.displayPreview || escapeHtml(tpl.content.substring(0, 100));
      const smartContent = smartInjectionEnabled && tpl.conversationMode
        ? (state.isOngoing ? tpl.conversationMode.ongoing : tpl.conversationMode.newChat)
        : tpl.content;
      const smartPreview = escapeHtml(smartContent.substring(0, 80));
      
      return `
        <div class="apt-template-item ${tpl.pinned ? 'pinned' : ''}" data-id="${tpl.id}">
          <div class="apt-template-header">
            <span class="apt-template-name">${escapeHtml(tpl.name)}</span>
            <span class="apt-template-shortcut">${index + 1}</span>
          </div>
          <div class="apt-template-preview">${smartPreview}${smartContent.length > 80 ? '...' : ''}</div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.apt-template-item').forEach(item => {
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

  function handleKeyboardNavigation(e) {
    const filtered = filterTemplates();
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, Math.min(filtered.length - 1, 8));
      updatePanelSelection();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, -1);
      updatePanelSelection();
    } else if (e.key === 'Enter' && selectedIndex >= 0 && filtered[selectedIndex]) {
      e.preventDefault();
      injectTemplate(filtered[selectedIndex]);
    } else if (e.key >= '1' && e.key <= '9') {
      const index = parseInt(e.key) - 1;
      if (filtered[index]) {
        injectTemplate(filtered[index]);
      }
    } else if (e.key === 'Escape') {
      hideQuickPanel();
    }
  }

  function updatePanelSelection() {
    const items = quickPanel.querySelectorAll('.apt-template-item');
    items.forEach((item, i) => {
      item.classList.toggle('selected', i === selectedIndex);
    });
    
    if (selectedIndex >= 0 && items[selectedIndex]) {
      items[selectedIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  async function showQuickPanel() {
    await loadData();
    createQuickPanel();
    
    currentCategory = '全部';
    searchQuery = '';
    selectedIndex = -1;
    
    renderConversationStatus();
    renderCategories();
    renderTemplateList();
    
    overlay.classList.add('show');
    quickPanel.classList.add('show');
    
    const searchInput = quickPanel.querySelector('.apt-search-input');
    searchInput.value = '';
    searchInput.focus();
  }

  function renderConversationStatus() {
    const container = quickPanel.querySelector('.apt-conversation-status');
    if (!container || !smartInjectionEnabled) {
      if (container) container.innerHTML = '';
      return;
    }
    
    const state = window.PlatformHelper.getConversationState();
    const statusClass = state.isOngoing ? 'ongoing' : 'new';
    const statusText = state.isOngoing ? '💬 对话中 - 使用精简版' : '✨ 新对话 - 使用完整版';
    
    container.innerHTML = `
      <div class="apt-status-badge ${statusClass}">
        ${statusText}
      </div>
    `;
  }

  function hideQuickPanel() {
    if (overlay) overlay.classList.remove('show');
    if (quickPanel) quickPanel.classList.remove('show');
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'showQuickPanel') {
      showQuickPanel();
      sendResponse({ success: true });
    } else if (request.action === 'injectTemplate') {
      const template = request.template;
      const mode = request.mode || 'replace';
      const useSmartInjection = request.smartInjection !== false;
      const addSeparator = request.addSeparator !== false;
      
      if (template) {
        const contentToInject = useSmartInjection
          ? window.PlatformHelper.getSmartContent(template)
          : template.content;
        
        const success = window.PlatformHelper.injectContent(contentToInject, mode, { addSeparator });
        if (success) {
          const state = window.PlatformHelper.getConversationState();
          const modeText = state.isOngoing ? '对话中' : '新对话';
          showToast(`模板已注入 (${modeText})`, 'success');
        } else {
          showToast('注入失败', 'error');
        }
        sendResponse({ success });
      }
    } else if (request.action === 'getConversationState') {
      const state = window.PlatformHelper.getConversationState();
      sendResponse(state);
    }
    return true;
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
      e.preventDefault();
      showQuickPanel();
    }
  });

  const platform = window.PlatformHelper.getCurrentPlatform();
  if (platform) {
    console.log(`[AI Prompt Helper] Loaded for ${platform.name}`);
  }
})();
