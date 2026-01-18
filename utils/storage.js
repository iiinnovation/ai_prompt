const STORAGE_KEYS = {
  TEMPLATES: 'templates',
  CATEGORIES: 'categories',
  SETTINGS: 'settings'
};

const DEFAULT_DATA = {
  templates: [
    {
      id: 'preset-1',
      name: '代码审查专家',
      content: '请作为一名资深程序员，审查以下代码，从以下维度给出建议：\n1. 安全性\n2. 性能\n3. 可读性\n4. 最佳实践\n\n代码如下：\n',
      category: '代码',
      order: 1,
      pinned: true,
      usageCount: 0,
      lastUsedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      conversationMode: {
        newChat: '请作为一名资深程序员，审查以下代码，从以下维度给出建议：\n1. 安全性\n2. 性能\n3. 可读性\n4. 最佳实践\n\n代码如下：\n',
        ongoing: '请从安全性、性能、可读性和最佳实践四个角度审查上述代码'
      },
      displayPreview: '💼 代码审查（安全/性能/可读性/最佳实践）'
    },
    {
      id: 'preset-2',
      name: '中英互译',
      content: '请将以下内容翻译成目标语言，保持专业术语准确，语气自然流畅。如果是中文则翻译成英文，如果是英文则翻译成中文：\n\n',
      category: '翻译',
      order: 2,
      pinned: true,
      usageCount: 0,
      lastUsedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      conversationMode: {
        newChat: '请将以下内容翻译成目标语言，保持专业术语准确，语气自然流畅。如果是中文则翻译成英文，如果是英文则翻译成中文：\n\n',
        ongoing: '请翻译上述内容（保持术语准确、语气自然）'
      },
      displayPreview: '🌏 中英互译'
    },
    {
      id: 'preset-3',
      name: '文章润色',
      content: '请帮我润色以下文章，优化表达，保持原意，使文章更专业、更流畅：\n\n',
      category: '写作',
      order: 3,
      pinned: false,
      usageCount: 0,
      lastUsedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      conversationMode: {
        newChat: '请帮我润色以下文章，优化表达，保持原意，使文章更专业、更流畅：\n\n',
        ongoing: '请润色上述文字，使其更专业流畅'
      },
      displayPreview: '✨ 文章润色'
    },
    {
      id: 'preset-4',
      name: '总结要点',
      content: '请帮我总结以下内容的核心要点，分点列出：\n\n',
      category: '写作',
      order: 4,
      pinned: false,
      usageCount: 0,
      lastUsedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      conversationMode: {
        newChat: '请帮我总结以下内容的核心要点，分点列出：\n\n',
        ongoing: '请总结上述内容的核心要点'
      },
      displayPreview: '📝 总结要点'
    },
    {
      id: 'preset-5',
      name: 'SQL 优化',
      content: '请分析以下 SQL 语句的性能问题，并给出优化建议：\n\n',
      category: '代码',
      order: 5,
      pinned: false,
      usageCount: 0,
      lastUsedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      conversationMode: {
        newChat: '请分析以下 SQL 语句的性能问题，并给出优化建议：\n\n',
        ongoing: '请分析上述 SQL 的性能问题并给出优化建议'
      },
      displayPreview: '⚡ SQL 优化'
    }
  ],
  categories: ['代码', '写作', '翻译', '其他'],
  settings: {
    showFloatingButton: false,
    enableSlashCommand: true,
    defaultSort: 'lastUsed',
    smartInjection: true,
    addSeparator: true
  }
};

function generateId() {
  return 'tpl-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
}

async function getAllData() {
  return new Promise((resolve) => {
    chrome.storage.local.get(Object.values(STORAGE_KEYS), (result) => {
      resolve({
        templates: result[STORAGE_KEYS.TEMPLATES] || DEFAULT_DATA.templates,
        categories: result[STORAGE_KEYS.CATEGORIES] || DEFAULT_DATA.categories,
        settings: result[STORAGE_KEYS.SETTINGS] || DEFAULT_DATA.settings
      });
    });
  });
}

async function getTemplates() {
  const data = await getAllData();
  return data.templates;
}

async function getCategories() {
  const data = await getAllData();
  return data.categories;
}

async function getSettings() {
  const data = await getAllData();
  return data.settings;
}

async function saveTemplates(templates) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_KEYS.TEMPLATES]: templates }, resolve);
  });
}

async function saveCategories(categories) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_KEYS.CATEGORIES]: categories }, resolve);
  });
}

async function saveSettings(settings) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_KEYS.SETTINGS]: settings }, resolve);
  });
}

async function addTemplate(template) {
  const templates = await getTemplates();
  const newTemplate = {
    id: generateId(),
    name: template.name,
    content: template.content,
    category: template.category || '其他',
    order: templates.length + 1,
    pinned: false,
    usageCount: 0,
    lastUsedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  templates.push(newTemplate);
  await saveTemplates(templates);
  return newTemplate;
}

async function addTemplates(templateList) {
  const templates = await getTemplates();
  const now = new Date().toISOString();
  const newTemplates = templateList.map((tpl, index) => ({
    id: generateId(),
    name: tpl.name,
    content: tpl.content,
    category: tpl.category || '其他',
    order: templates.length + index + 1,
    pinned: false,
    usageCount: 0,
    lastUsedAt: null,
    createdAt: now,
    updatedAt: now
  }));
  templates.push(...newTemplates);
  await saveTemplates(templates);
  return newTemplates;
}

async function updateTemplate(id, updates) {
  const templates = await getTemplates();
  const index = templates.findIndex(t => t.id === id);
  if (index !== -1) {
    templates[index] = {
      ...templates[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await saveTemplates(templates);
    return templates[index];
  }
  return null;
}

async function deleteTemplate(id) {
  const templates = await getTemplates();
  const filtered = templates.filter(t => t.id !== id);
  await saveTemplates(filtered);
  return filtered;
}

async function deleteTemplates(ids) {
  const templates = await getTemplates();
  const filtered = templates.filter(t => !ids.includes(t.id));
  await saveTemplates(filtered);
  return filtered;
}

async function recordTemplateUsage(id) {
  const templates = await getTemplates();
  const index = templates.findIndex(t => t.id === id);
  if (index !== -1) {
    templates[index].usageCount = (templates[index].usageCount || 0) + 1;
    templates[index].lastUsedAt = new Date().toISOString();
    await saveTemplates(templates);
    return templates[index];
  }
  return null;
}

async function togglePinned(id) {
  const templates = await getTemplates();
  const index = templates.findIndex(t => t.id === id);
  if (index !== -1) {
    templates[index].pinned = !templates[index].pinned;
    templates[index].updatedAt = new Date().toISOString();
    await saveTemplates(templates);
    return templates[index];
  }
  return null;
}

async function searchTemplates(query) {
  const templates = await getTemplates();
  if (!query) return templates;
  
  const lowerQuery = query.toLowerCase();
  return templates.filter(t => 
    t.name.toLowerCase().includes(lowerQuery) ||
    t.content.toLowerCase().includes(lowerQuery)
  );
}

async function filterByCategory(category) {
  const templates = await getTemplates();
  if (!category || category === '全部') return templates;
  return templates.filter(t => t.category === category);
}

function sortTemplates(templates, sortBy = 'lastUsed') {
  const sorted = [...templates];
  
  sorted.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    
    switch (sortBy) {
      case 'lastUsed':
        const aTime = a.lastUsedAt ? new Date(a.lastUsedAt).getTime() : 0;
        const bTime = b.lastUsedAt ? new Date(b.lastUsedAt).getTime() : 0;
        return bTime - aTime;
      case 'usageCount':
        return (b.usageCount || 0) - (a.usageCount || 0);
      case 'order':
      default:
        return (a.order || 0) - (b.order || 0);
    }
  });
  
  return sorted;
}

async function exportData() {
  const data = await getAllData();
  return JSON.stringify(data, null, 2);
}

async function importData(jsonString, conflictStrategy = 'skip') {
  try {
    const importedData = JSON.parse(jsonString);
    const currentData = await getAllData();
    
    let templates = currentData.templates;
    const importedTemplates = importedData.templates || [];
    
    for (const imported of importedTemplates) {
      const existingIndex = templates.findIndex(t => t.name === imported.name);
      
      if (existingIndex !== -1) {
        switch (conflictStrategy) {
          case 'overwrite':
            templates[existingIndex] = {
              ...imported,
              id: templates[existingIndex].id,
              updatedAt: new Date().toISOString()
            };
            break;
          case 'rename':
            imported.id = generateId();
            imported.name = `${imported.name} (导入)`;
            templates.push(imported);
            break;
          case 'skip':
          default:
            break;
        }
      } else {
        imported.id = generateId();
        templates.push(imported);
      }
    }
    
    const categories = [...new Set([
      ...currentData.categories,
      ...(importedData.categories || [])
    ])];
    
    await saveTemplates(templates);
    await saveCategories(categories);
    
    return { success: true, count: importedTemplates.length };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function initStorage() {
  const data = await getAllData();
  if (!data.templates || data.templates.length === 0) {
    await chrome.storage.local.set({
      [STORAGE_KEYS.TEMPLATES]: DEFAULT_DATA.templates,
      [STORAGE_KEYS.CATEGORIES]: DEFAULT_DATA.categories,
      [STORAGE_KEYS.SETTINGS]: DEFAULT_DATA.settings
    });
  }
}

async function addCategory(categoryName) {
  const categories = await getCategories();
  if (!categories.includes(categoryName)) {
    categories.push(categoryName);
    await saveCategories(categories);
  }
  return categories;
}

async function deleteCategory(categoryName) {
  const categories = await getCategories();
  const filtered = categories.filter(c => c !== categoryName);
  await saveCategories(filtered);
  
  const templates = await getTemplates();
  const updated = templates.map(t => {
    if (t.category === categoryName) {
      return { ...t, category: '其他', updatedAt: new Date().toISOString() };
    }
    return t;
  });
  await saveTemplates(updated);
  
  return filtered;
}

if (typeof window !== 'undefined') {
  window.PromptStorage = {
    getAllData,
    getTemplates,
    getCategories,
    getSettings,
    saveTemplates,
    saveCategories,
    saveSettings,
    addTemplate,
    addTemplates,
    updateTemplate,
    deleteTemplate,
    deleteTemplates,
    recordTemplateUsage,
    togglePinned,
    searchTemplates,
    filterByCategory,
    sortTemplates,
    exportData,
    importData,
    initStorage,
    addCategory,
    deleteCategory,
    generateId
  };
}
