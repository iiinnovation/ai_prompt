let templates = [];
let categories = [];
let settings = {};
let currentCategory = '全部';
let selectedTemplateId = null;
let pendingImportData = null;

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
      settings = result.settings || {};
      resolve();
    });
  });
}

function setupEventListeners() {
  document.getElementById('addTemplateBtn').addEventListener('click', () => openDetailPanel(null));
  document.getElementById('batchAddBtn').addEventListener('click', () => showModal('batchModal'));
  document.getElementById('exportBtn').addEventListener('click', exportData);
  document.getElementById('importBtn').addEventListener('click', () => showModal('importModal'));
  document.getElementById('addCategoryBtn').addEventListener('click', addCategory);
  
  document.getElementById('closeDetailBtn').addEventListener('click', closeDetailPanel);
  document.getElementById('saveTemplateBtn').addEventListener('click', saveTemplate);
  document.getElementById('deleteTemplateBtn').addEventListener('click', deleteTemplate);
  
  document.getElementById('closeBatchModal').addEventListener('click', () => hideModal('batchModal'));
  document.getElementById('cancelBatchBtn').addEventListener('click', () => hideModal('batchModal'));
  document.getElementById('confirmBatchBtn').addEventListener('click', batchAddTemplates);
  
  document.getElementById('closeImportModal').addEventListener('click', () => hideModal('importModal'));
  document.getElementById('cancelImportBtn').addEventListener('click', () => hideModal('importModal'));
  document.getElementById('selectFileBtn').addEventListener('click', () => document.getElementById('importFile').click());
  document.getElementById('importFile').addEventListener('change', handleFileSelect);
  document.getElementById('confirmImportBtn').addEventListener('click', confirmImport);
}

function renderCategories() {
  const container = document.getElementById('categoryList');
  const allCategories = [{ name: '全部', count: templates.length }, ...categories.map(cat => ({
    name: cat,
    count: templates.filter(t => t.category === cat).length
  }))];
  
  container.innerHTML = allCategories.map(cat => `
    <li class="category-item ${cat.name === currentCategory ? 'active' : ''}" data-category="${cat.name}">
      <span>📁 ${cat.name}</span>
      <span class="count">(${cat.count})</span>
      ${cat.name !== '全部' && cat.name !== '其他' ? `<button class="delete-cat" data-cat="${cat.name}">×</button>` : ''}
    </li>
  `).join('');

  container.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-cat')) return;
      currentCategory = item.dataset.category;
      renderCategories();
      renderTemplateList();
      document.getElementById('currentCategoryTitle').textContent = 
        currentCategory === '全部' ? '全部模板' : `${currentCategory} 分类`;
    });
  });

  container.querySelectorAll('.delete-cat').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteCategory(btn.dataset.cat);
    });
  });
}

function renderTemplateList() {
  const container = document.getElementById('templateList');
  let filtered = templates;
  
  if (currentCategory !== '全部') {
    filtered = templates.filter(t => t.category === currentCategory);
  }
  
  filtered.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return (a.order || 0) - (b.order || 0);
  });

  document.getElementById('templateCount').textContent = `${filtered.length} 个模板`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📭</div>
        <div class="empty-state-text">暂无模板，点击上方按钮添加</div>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(tpl => `
    <div class="template-card ${tpl.id === selectedTemplateId ? 'active' : ''}" data-id="${tpl.id}">
      <span class="template-card-icon">${tpl.pinned ? '⭐' : '📝'}</span>
      <div class="template-card-info">
        <div class="template-card-name">${escapeHtml(tpl.name)}</div>
        <div class="template-card-meta">${tpl.category} · 使用 ${tpl.usageCount || 0} 次</div>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.template-card').forEach(card => {
    card.addEventListener('click', () => openDetailPanel(card.dataset.id));
  });
}

function openDetailPanel(id) {
  const panel = document.getElementById('detailPanel');
  const categorySelect = document.getElementById('templateCategory');
  
  categorySelect.innerHTML = categories.map(cat => 
    `<option value="${cat}">${cat}</option>`
  ).join('');

  if (id) {
    const template = templates.find(t => t.id === id);
    if (template) {
      selectedTemplateId = id;
      document.getElementById('detailTitle').textContent = '编辑模板';
      document.getElementById('templateName').value = template.name;
      document.getElementById('templateCategory').value = template.category;
      document.getElementById('templatePinned').checked = template.pinned;
      document.getElementById('templateContent').value = template.content;
      document.getElementById('deleteTemplateBtn').style.display = 'block';
      
      const lastUsed = template.lastUsedAt ? new Date(template.lastUsedAt).toLocaleString('zh-CN') : '从未使用';
      document.getElementById('templateStats').innerHTML = `
        <p>使用次数：${template.usageCount || 0} 次</p>
        <p>最近使用：${lastUsed}</p>
        <p>创建时间：${new Date(template.createdAt).toLocaleString('zh-CN')}</p>
      `;
      document.getElementById('templateStats').style.display = 'block';
    }
  } else {
    selectedTemplateId = null;
    document.getElementById('detailTitle').textContent = '新增模板';
    document.getElementById('templateName').value = '';
    document.getElementById('templateCategory').value = categories[0];
    document.getElementById('templatePinned').checked = false;
    document.getElementById('templateContent').value = '';
    document.getElementById('deleteTemplateBtn').style.display = 'none';
    document.getElementById('templateStats').style.display = 'none';
  }

  panel.classList.add('show');
  renderTemplateList();
}

function closeDetailPanel() {
  document.getElementById('detailPanel').classList.remove('show');
  selectedTemplateId = null;
  renderTemplateList();
}

async function saveTemplate() {
  const name = document.getElementById('templateName').value.trim();
  const category = document.getElementById('templateCategory').value;
  const pinned = document.getElementById('templatePinned').checked;
  const content = document.getElementById('templateContent').value.trim();

  if (!name) {
    showToast('请输入模板名称', 'error');
    return;
  }
  if (!content) {
    showToast('请输入模板内容', 'error');
    return;
  }

  if (selectedTemplateId) {
    const index = templates.findIndex(t => t.id === selectedTemplateId);
    if (index !== -1) {
      templates[index] = {
        ...templates[index],
        name,
        category,
        pinned,
        content,
        updatedAt: new Date().toISOString()
      };
    }
  } else {
    const newTemplate = {
      id: 'tpl-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9),
      name,
      category,
      pinned,
      content,
      order: templates.length + 1,
      usageCount: 0,
      lastUsedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    templates.push(newTemplate);
    selectedTemplateId = newTemplate.id;
  }

  await chrome.storage.local.set({ templates });
  showToast('保存成功', 'success');
  renderCategories();
  renderTemplateList();
}

async function deleteTemplate() {
  if (!selectedTemplateId) return;
  
  if (!confirm('确定要删除这个模板吗？')) return;
  
  templates = templates.filter(t => t.id !== selectedTemplateId);
  await chrome.storage.local.set({ templates });
  
  showToast('删除成功', 'success');
  closeDetailPanel();
  renderCategories();
  renderTemplateList();
}

async function addCategory() {
  const name = prompt('请输入分类名称：');
  if (!name || !name.trim()) return;
  
  if (categories.includes(name.trim())) {
    showToast('分类已存在', 'error');
    return;
  }
  
  categories.push(name.trim());
  await chrome.storage.local.set({ categories });
  showToast('分类已添加', 'success');
  renderCategories();
}

async function deleteCategory(name) {
  if (!confirm(`确定要删除分类"${name}"吗？该分类下的模板将移至"其他"。`)) return;
  
  categories = categories.filter(c => c !== name);
  templates = templates.map(t => {
    if (t.category === name) {
      return { ...t, category: '其他', updatedAt: new Date().toISOString() };
    }
    return t;
  });
  
  await chrome.storage.local.set({ categories, templates });
  
  if (currentCategory === name) {
    currentCategory = '全部';
  }
  
  showToast('分类已删除', 'success');
  renderCategories();
  renderTemplateList();
}

async function batchAddTemplates() {
  const input = document.getElementById('batchInput').value.trim();
  if (!input) {
    showToast('请输入模板内容', 'error');
    return;
  }

  const lines = input.split('\n').filter(line => line.trim());
  const newTemplates = [];
  const now = new Date().toISOString();

  for (const line of lines) {
    const parts = line.split('|').map(p => p.trim());
    if (parts.length >= 3) {
      newTemplates.push({
        id: 'tpl-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9),
        name: parts[0],
        category: categories.includes(parts[1]) ? parts[1] : '其他',
        content: parts.slice(2).join('|'),
        order: templates.length + newTemplates.length + 1,
        pinned: false,
        usageCount: 0,
        lastUsedAt: null,
        createdAt: now,
        updatedAt: now
      });
    }
  }

  if (newTemplates.length === 0) {
    showToast('未能解析任何有效模板', 'error');
    return;
  }

  templates.push(...newTemplates);
  await chrome.storage.local.set({ templates });
  
  hideModal('batchModal');
  document.getElementById('batchInput').value = '';
  showToast(`成功添加 ${newTemplates.length} 个模板`, 'success');
  renderCategories();
  renderTemplateList();
}

async function exportData() {
  const data = {
    templates,
    categories,
    settings,
    exportedAt: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `prompt-templates-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  showToast('导出成功', 'success');
}

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      pendingImportData = JSON.parse(event.target.result);
      
      const preview = document.getElementById('importPreview');
      const tplCount = pendingImportData.templates?.length || 0;
      const catCount = pendingImportData.categories?.length || 0;
      
      preview.innerHTML = `
        <p>文件：${file.name}</p>
        <p>包含 ${tplCount} 个模板，${catCount} 个分类</p>
      `;
      
      const hasConflict = pendingImportData.templates?.some(imp => 
        templates.some(t => t.name === imp.name)
      );
      
      document.getElementById('conflictOptions').style.display = hasConflict ? 'block' : 'none';
      document.getElementById('confirmImportBtn').disabled = false;
    } catch (err) {
      showToast('无效的 JSON 文件', 'error');
    }
  };
  reader.readAsText(file);
}

async function confirmImport() {
  if (!pendingImportData) return;

  const strategy = document.querySelector('input[name="conflict"]:checked')?.value || 'skip';
  
  let imported = 0;
  const now = new Date().toISOString();
  
  for (const imp of (pendingImportData.templates || [])) {
    const existingIndex = templates.findIndex(t => t.name === imp.name);
    
    if (existingIndex !== -1) {
      if (strategy === 'overwrite') {
        templates[existingIndex] = { ...imp, id: templates[existingIndex].id, updatedAt: now };
        imported++;
      } else if (strategy === 'rename') {
        imp.id = 'tpl-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
        imp.name = `${imp.name} (导入)`;
        templates.push(imp);
        imported++;
      }
    } else {
      imp.id = 'tpl-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
      templates.push(imp);
      imported++;
    }
  }

  const newCategories = (pendingImportData.categories || []).filter(c => !categories.includes(c));
  categories.push(...newCategories);

  await chrome.storage.local.set({ templates, categories });
  
  hideModal('importModal');
  pendingImportData = null;
  document.getElementById('importFile').value = '';
  document.getElementById('importPreview').innerHTML = '';
  document.getElementById('confirmImportBtn').disabled = true;
  
  showToast(`成功导入 ${imported} 个模板`, 'success');
  renderCategories();
  renderTemplateList();
}

function showModal(id) {
  document.getElementById(id).classList.add('show');
}

function hideModal(id) {
  document.getElementById(id).classList.remove('show');
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
