(function() {
  let quickPanel = null;
  let overlay = null;
  let templates = [];
  let categories = [];
  let settings = {};
  let currentCategory = '全部';
  let searchQuery = '';

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

  async function injectTemplate(template) {
    const success = window.PlatformHelper.injectContent(template.content);
    
    if (success) {
      template.usageCount = (template.usageCount || 0) + 1;
      template.lastUsedAt = new Date().toISOString();
      
      const index = templates.findIndex(t => t.id === template.id);
      if (index !== -1) {
        templates[index] = template;
        chrome.storage.local.set({ templates });
      }
      
      showToast('模板已注入', 'success');
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
      </div>
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
      renderTemplateList();
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

    container.innerHTML = filtered.slice(0, 9).map((tpl, index) => `
      <div class="apt-template-item ${tpl.pinned ? 'pinned' : ''}" data-id="${tpl.id}">
        <span class="apt-template-name">${tpl.name}</span>
        <span class="apt-template-shortcut">${index + 1}</span>
        <div class="apt-template-preview">${escapeHtml(tpl.content.substring(0, 200))}${tpl.content.length > 200 ? '...' : ''}</div>
      </div>
    `).join('');

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
    if (e.key >= '1' && e.key <= '9') {
      const index = parseInt(e.key) - 1;
      const filtered = filterTemplates();
      if (filtered[index]) {
        injectTemplate(filtered[index]);
      }
    } else if (e.key === 'Escape') {
      hideQuickPanel();
    }
  }

  async function showQuickPanel() {
    await loadData();
    createQuickPanel();
    
    currentCategory = '全部';
    searchQuery = '';
    
    renderCategories();
    renderTemplateList();
    
    overlay.classList.add('show');
    quickPanel.classList.add('show');
    
    const searchInput = quickPanel.querySelector('.apt-search-input');
    searchInput.value = '';
    searchInput.focus();
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
      if (template) {
        const success = window.PlatformHelper.injectContent(template.content);
        if (success) {
          showToast('模板已注入', 'success');
        } else {
          showToast('注入失败', 'error');
        }
        sendResponse({ success });
      }
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
