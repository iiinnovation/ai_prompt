const STORAGE_KEYS = {
  TEMPLATES: 'templates',
  CATEGORIES: 'categories',
  SETTINGS: 'settings'
};

const DEFAULT_DATA = {
  templates: [
    // ===== 日常场景 =====
    {
      id: 'preset-daily-1',
      name: '简单解释概念',
      content: '请用简单易懂的语言解释「{{概念名称}}」，就像在给一个完全不了解这个领域的朋友讲解一样。可以用类比或例子帮助理解。',
      category: '日常',
      order: 1,
      pinned: true,
      usageCount: 0,
      lastUsedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      conversationMode: {
        newChat: '请用简单易懂的语言解释「{{概念名称}}」，就像在给一个完全不了解这个领域的朋友讲解一样。可以用类比或例子帮助理解。',
        ongoing: '请用更简单的方式解释上述概念'
      },
      displayPreview: '💡 简单解释概念'
    },
    {
      id: 'preset-daily-2',
      name: '头脑风暴',
      content: '我想针对「{{主题}}」进行头脑风暴。请帮我列出 10 个创意想法或解决方案，不用太完美，重点是发散思维、激发灵感。',
      category: '日常',
      order: 2,
      pinned: true,
      usageCount: 0,
      lastUsedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      conversationMode: {
        newChat: '我想针对「{{主题}}」进行头脑风暴。请帮我列出 10 个创意想法或解决方案，不用太完美，重点是发散思维、激发灵感。',
        ongoing: '请继续帮我发散更多想法'
      },
      displayPreview: '🧠 头脑风暴'
    },
    {
      id: 'preset-daily-3',
      name: '优缺点分析',
      content: '请帮我分析「{{选项或决定}}」的优点和缺点，用表格形式呈现，最后给出你的建议。',
      category: '日常',
      order: 3,
      pinned: false,
      usageCount: 0,
      lastUsedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      conversationMode: {
        newChat: '请帮我分析「{{选项或决定}}」的优点和缺点，用表格形式呈现，最后给出你的建议。',
        ongoing: '请分析上述选项的优缺点'
      },
      displayPreview: '⚖️ 优缺点分析'
    },
    {
      id: 'preset-daily-4',
      name: '做决定帮手',
      content: '我正在纠结{{决定描述}}，有以下几个选项：\n{{选项列表}}\n\n请帮我分析每个选项，并给出推荐。',
      category: '日常',
      order: 4,
      pinned: false,
      usageCount: 0,
      lastUsedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      conversationMode: {
        newChat: '我正在纠结{{决定描述}}，有以下几个选项：\n{{选项列表}}\n\n请帮我分析每个选项，并给出推荐。',
        ongoing: '请帮我分析上述选项并给出推荐'
      },
      displayPreview: '🤔 做决定帮手'
    },
    // ===== 工作场景 =====
    {
      id: 'preset-work-1',
      name: '邮件撰写',
      content: '请帮我写一封{{邮件类型}}邮件：\n- 收件人：{{收件人}}\n- 主题：{{主题}}\n- 要点：{{要点}}\n\n语气要{{语气风格}}。',
      category: '工作',
      order: 5,
      pinned: true,
      usageCount: 0,
      lastUsedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      conversationMode: {
        newChat: '请帮我写一封{{邮件类型}}邮件：\n- 收件人：{{收件人}}\n- 主题：{{主题}}\n- 要点：{{要点}}\n\n语气要{{语气风格}}。',
        ongoing: '请帮我修改上述邮件'
      },
      displayPreview: '📧 邮件撰写'
    },
    {
      id: 'preset-work-2',
      name: '周报生成',
      content: '请根据以下工作内容帮我生成本周周报：\n\n{{本周工作内容}}\n\n格式要求：\n1. 本周完成\n2. 进行中\n3. 下周计划\n4. 需要协助',
      category: '工作',
      order: 6,
      pinned: false,
      usageCount: 0,
      lastUsedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      conversationMode: {
        newChat: '请根据以下工作内容帮我生成本周周报：\n\n{{本周工作内容}}\n\n格式要求：\n1. 本周完成\n2. 进行中\n3. 下周计划\n4. 需要协助',
        ongoing: '请根据上述内容生成周报'
      },
      displayPreview: '📋 周报生成'
    },
    {
      id: 'preset-work-3',
      name: '会议纪要整理',
      content: '请将以下会议记录整理成正式的会议纪要，包含：\n1. 会议主题\n2. 参会人员\n3. 讨论要点\n4. 决议事项\n5. 待办事项（标注负责人和截止时间）\n\n会议记录：\n{{会议记录}}',
      category: '工作',
      order: 7,
      pinned: false,
      usageCount: 0,
      lastUsedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      conversationMode: {
        newChat: '请将以下会议记录整理成正式的会议纪要，包含：\n1. 会议主题\n2. 参会人员\n3. 讨论要点\n4. 决议事项\n5. 待办事项（标注负责人和截止时间）\n\n会议记录：\n{{会议记录}}',
        ongoing: '请整理上述会议记录'
      },
      displayPreview: '📝 会议纪要'
    },
    {
      id: 'preset-work-4',
      name: '面试准备',
      content: '我要面试{{职位名称}}岗位，请帮我：\n1. 列出可能被问到的 10 个面试问题\n2. 给出每个问题的回答思路\n3. 提供一些加分的提问建议',
      category: '工作',
      order: 8,
      pinned: false,
      usageCount: 0,
      lastUsedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      conversationMode: {
        newChat: '我要面试{{职位名称}}岗位，请帮我：\n1. 列出可能被问到的 10 个面试问题\n2. 给出每个问题的回答思路\n3. 提供一些加分的提问建议',
        ongoing: '请继续帮我准备面试'
      },
      displayPreview: '💼 面试准备'
    },
    // ===== 学习场景 =====
    {
      id: 'preset-study-1',
      name: '知识点总结',
      content: '请帮我总结「{{知识点或章节}}」的核心内容，用以下格式：\n1. 核心概念\n2. 关键要点（分点列出）\n3. 常见误区\n4. 记忆技巧',
      category: '学习',
      order: 9,
      pinned: false,
      usageCount: 0,
      lastUsedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      conversationMode: {
        newChat: '请帮我总结「{{知识点或章节}}」的核心内容，用以下格式：\n1. 核心概念\n2. 关键要点（分点列出）\n3. 常见误区\n4. 记忆技巧',
        ongoing: '请总结上述知识点'
      },
      displayPreview: '📚 知识点总结'
    },
    {
      id: 'preset-study-2',
      name: '练习题生成',
      content: '请根据「{{知识点}}」生成 5 道练习题，包含：\n- 2 道基础题\n- 2 道进阶题\n- 1 道综合应用题\n\n每道题后附上答案和解析。',
      category: '学习',
      order: 10,
      pinned: false,
      usageCount: 0,
      lastUsedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      conversationMode: {
        newChat: '请根据「{{知识点}}」生成 5 道练习题，包含：\n- 2 道基础题\n- 2 道进阶题\n- 1 道综合应用题\n\n每道题后附上答案和解析。',
        ongoing: '请根据上述知识点生成练习题'
      },
      displayPreview: '✏️ 练习题生成'
    },
    {
      id: 'preset-study-3',
      name: '学习计划制定',
      content: '我想学习{{学习目标}}，预计每天可投入{{时间}}，计划在{{周期}}内完成。请帮我制定一个详细的学习计划，包含每周目标和学习资源推荐。',
      category: '学习',
      order: 11,
      pinned: false,
      usageCount: 0,
      lastUsedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      conversationMode: {
        newChat: '我想学习{{学习目标}}，预计每天可投入{{时间}}，计划在{{周期}}内完成。请帮我制定一个详细的学习计划，包含每周目标和学习资源推荐。',
        ongoing: '请帮我制定学习计划'
      },
      displayPreview: '📅 学习计划'
    },
    // ===== 生活场景 =====
    {
      id: 'preset-life-1',
      name: '旅行规划',
      content: '我计划去{{目的地}}旅行，时间是{{日期}}，共{{天数}}天，预算{{预算}}。\n\n请帮我规划行程，包括：\n1. 每日行程安排\n2. 必去景点推荐\n3. 美食推荐\n4. 住宿建议\n5. 注意事项',
      category: '生活',
      order: 12,
      pinned: false,
      usageCount: 0,
      lastUsedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      conversationMode: {
        newChat: '我计划去{{目的地}}旅行，时间是{{日期}}，共{{天数}}天，预算{{预算}}。\n\n请帮我规划行程，包括：\n1. 每日行程安排\n2. 必去景点推荐\n3. 美食推荐\n4. 住宿建议\n5. 注意事项',
        ongoing: '请帮我规划上述旅行'
      },
      displayPreview: '✈️ 旅行规划'
    },
    {
      id: 'preset-life-2',
      name: '菜谱推荐',
      content: '我想做一道{{菜品类型}}，家里有这些食材：{{食材列表}}。\n\n请推荐一个适合的菜谱，包含：\n1. 食材用量\n2. 详细步骤\n3. 烹饪技巧\n4. 预计时间',
      category: '生活',
      order: 13,
      pinned: false,
      usageCount: 0,
      lastUsedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      conversationMode: {
        newChat: '我想做一道{{菜品类型}}，家里有这些食材：{{食材列表}}。\n\n请推荐一个适合的菜谱，包含：\n1. 食材用量\n2. 详细步骤\n3. 烹饪技巧\n4. 预计时间',
        ongoing: '请推荐一个菜谱'
      },
      displayPreview: '🍳 菜谱推荐'
    },
    {
      id: 'preset-life-3',
      name: '礼物建议',
      content: '我想给{{送礼对象}}送礼物，对方{{对方特点}}，预算在{{预算}}左右，场合是{{场合}}。请推荐 5 个礼物选项并说明理由。',
      category: '生活',
      order: 14,
      pinned: false,
      usageCount: 0,
      lastUsedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      conversationMode: {
        newChat: '我想给{{送礼对象}}送礼物，对方{{对方特点}}，预算在{{预算}}左右，场合是{{场合}}。请推荐 5 个礼物选项并说明理由。',
        ongoing: '请推荐礼物选项'
      },
      displayPreview: '🎁 礼物建议'
    },
    // ===== 写作场景 =====
    {
      id: 'preset-write-1',
      name: '文章润色',
      content: '请帮我润色以下文章，优化表达，保持原意，使文章更专业、更流畅：\n\n',
      category: '写作',
      order: 15,
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
      id: 'preset-write-2',
      name: '总结要点',
      content: '请帮我总结以下内容的核心要点，分点列出：\n\n',
      category: '写作',
      order: 16,
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
      id: 'preset-write-3',
      name: '文案撰写',
      content: '请帮我写一段{{文案类型}}文案：\n- 产品/主题：{{产品或主题}}\n- 目标受众：{{受众}}\n- 风格要求：{{风格}}\n- 字数要求：{{字数}}',
      category: '写作',
      order: 17,
      pinned: false,
      usageCount: 0,
      lastUsedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      conversationMode: {
        newChat: '请帮我写一段{{文案类型}}文案：\n- 产品/主题：{{产品或主题}}\n- 目标受众：{{受众}}\n- 风格要求：{{风格}}\n- 字数要求：{{字数}}',
        ongoing: '请帮我撰写文案'
      },
      displayPreview: '✍️ 文案撰写'
    },
    // ===== 翻译场景 =====
    {
      id: 'preset-translate-1',
      name: '中英互译',
      content: '请将以下内容翻译成目标语言，保持专业术语准确，语气自然流畅。如果是中文则翻译成英文，如果是英文则翻译成中文：\n\n',
      category: '翻译',
      order: 18,
      pinned: false,
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
      id: 'preset-translate-2',
      name: '多语言翻译',
      content: '请将以下内容翻译成{{目标语言}}，保持原文风格和语气：\n\n{{待翻译内容}}',
      category: '翻译',
      order: 19,
      pinned: false,
      usageCount: 0,
      lastUsedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      conversationMode: {
        newChat: '请将以下内容翻译成{{目标语言}}，保持原文风格和语气：\n\n{{待翻译内容}}',
        ongoing: '请翻译上述内容'
      },
      displayPreview: '🌍 多语言翻译'
    },
    // ===== 代码场景 =====
    {
      id: 'preset-code-1',
      name: '代码审查',
      content: '请作为一名资深程序员，审查以下代码，从以下维度给出建议：\n1. 安全性\n2. 性能\n3. 可读性\n4. 最佳实践\n\n代码如下：\n',
      category: '代码',
      order: 20,
      pinned: false,
      usageCount: 0,
      lastUsedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      conversationMode: {
        newChat: '请作为一名资深程序员，审查以下代码，从以下维度给出建议：\n1. 安全性\n2. 性能\n3. 可读性\n4. 最佳实践\n\n代码如下：\n',
        ongoing: '请从安全性、性能、可读性和最佳实践四个角度审查上述代码'
      },
      displayPreview: '💼 代码审查'
    },
    {
      id: 'preset-code-2',
      name: 'SQL 优化',
      content: '请分析以下 SQL 语句的性能问题，并给出优化建议：\n\n',
      category: '代码',
      order: 21,
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
    },
    {
      id: 'preset-code-3',
      name: '代码解释',
      content: '请详细解释以下代码的功能和实现逻辑，用通俗易懂的语言，适合初学者理解：\n\n',
      category: '代码',
      order: 22,
      pinned: false,
      usageCount: 0,
      lastUsedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      conversationMode: {
        newChat: '请详细解释以下代码的功能和实现逻辑，用通俗易懂的语言，适合初学者理解：\n\n',
        ongoing: '请解释上述代码'
      },
      displayPreview: '📖 代码解释'
    },
    {
      id: 'preset-code-4',
      name: 'Bug 排查',
      content: '我的代码遇到了问题：\n\n错误信息：{{错误信息}}\n\n相关代码：\n{{代码}}\n\n请帮我分析可能的原因并给出解决方案。',
      category: '代码',
      order: 23,
      pinned: false,
      usageCount: 0,
      lastUsedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      conversationMode: {
        newChat: '我的代码遇到了问题：\n\n错误信息：{{错误信息}}\n\n相关代码：\n{{代码}}\n\n请帮我分析可能的原因并给出解决方案。',
        ongoing: '请帮我排查上述 Bug'
      },
      displayPreview: '🐛 Bug 排查'
    }
  ],
  categories: ['日常', '工作', '学习', '生活', '写作', '翻译', '代码'],
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
