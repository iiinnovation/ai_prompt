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
      updatedAt: new Date().toISOString()
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
      updatedAt: new Date().toISOString()
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
      updatedAt: new Date().toISOString()
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
      updatedAt: new Date().toISOString()
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
      updatedAt: new Date().toISOString()
    }
  ],
  categories: ['代码', '写作', '翻译', '其他'],
  settings: {
    showFloatingButton: false,
    enableSlashCommand: true,
    defaultSort: 'lastUsed'
  }
};

const SUPPORTED_URLS = [
  'chat.openai.com',
  'chatgpt.com',
  'gemini.google.com',
  'chat.deepseek.com',
  'kimi.moonshot.cn',
  'tongyi.aliyun.com'
];

function isSupportedUrl(url) {
  if (!url) return false;
  try {
    const hostname = new URL(url).hostname;
    return SUPPORTED_URLS.some(supported => hostname.includes(supported));
  } catch {
    return false;
  }
}

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.storage.local.set(DEFAULT_DATA);
  }
  
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'apt-context-menu',
      title: 'AI Prompt 模板助手',
      contexts: ['page'],
      documentUrlPatterns: SUPPORTED_URLS.map(u => `https://${u}/*`)
    });
    
    chrome.contextMenus.create({
      id: 'apt-create-template',
      title: '用选中内容创建模板',
      contexts: ['selection']
    });
  });
});

chrome.storage.local.get(['templates'], (result) => {
  if (!result.templates) {
    chrome.storage.local.set(DEFAULT_DATA);
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'apt-context-menu' && tab?.id && isSupportedUrl(tab.url)) {
    chrome.tabs.sendMessage(tab.id, { action: 'showQuickPanel' }).catch(() => {});
  } else if (info.menuItemId === 'apt-create-template' && info.selectionText) {
    chrome.storage.local.get(['templates', 'categories'], (result) => {
      const templates = result.templates || [];
      const categories = result.categories || ['代码', '写作', '翻译', '其他'];
      const now = new Date().toISOString();
      
      const newTemplate = {
        id: 'tpl-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9),
        name: info.selectionText.substring(0, 30) + (info.selectionText.length > 30 ? '...' : ''),
        content: info.selectionText,
        category: '其他',
        order: templates.length + 1,
        pinned: false,
        usageCount: 0,
        lastUsedAt: null,
        createdAt: now,
        updatedAt: now
      };
      
      templates.push(newTemplate);
      chrome.storage.local.set({ templates }, () => {
        chrome.runtime.openOptionsPage();
      });
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openOptions') {
    chrome.runtime.openOptionsPage();
    sendResponse({ success: true });
  }
  return true;
});
