function createPresetTemplate({
  id,
  name,
  content,
  category,
  order,
  pinned = false,
  conversationMode,
  displayPreview
}) {
  const now = new Date().toISOString();

  return {
    id,
    name,
    content,
    category,
    order,
    pinned,
    usageCount: 0,
    lastUsedAt: null,
    createdAt: now,
    updatedAt: now,
    conversationMode,
    displayPreview
  };
}

const DEFAULT_DATA = {
  templates: [
    createPresetTemplate({
      id: 'preset-daily-1',
      name: '简单解释概念',
      content: '请用简单易懂的语言解释「{{概念名称}}」，就像在给一个完全不了解这个领域的朋友讲解一样。可以用类比或例子帮助理解。',
      category: '日常',
      order: 1,
      pinned: true,
      conversationMode: {
        newChat: '请用简单易懂的语言解释「{{概念名称}}」，就像在给一个完全不了解这个领域的朋友讲解一样。可以用类比或例子帮助理解。',
        ongoing: '请用更简单的方式解释上述概念'
      },
      displayPreview: '💡 简单解释概念'
    }),
    createPresetTemplate({
      id: 'preset-daily-2',
      name: '头脑风暴',
      content: '我想针对「{{主题}}」进行头脑风暴。请帮我列出 10 个创意想法或解决方案，不用太完美，重点是发散思维、激发灵感。',
      category: '日常',
      order: 2,
      pinned: true,
      conversationMode: {
        newChat: '我想针对「{{主题}}」进行头脑风暴。请帮我列出 10 个创意想法或解决方案，不用太完美，重点是发散思维、激发灵感。',
        ongoing: '请继续帮我发散更多想法'
      },
      displayPreview: '🧠 头脑风暴'
    }),
    createPresetTemplate({
      id: 'preset-daily-3',
      name: '优缺点分析',
      content: '请帮我分析「{{选项或决定}}」的优点和缺点，用表格形式呈现，最后给出你的建议。',
      category: '日常',
      order: 3,
      conversationMode: {
        newChat: '请帮我分析「{{选项或决定}}」的优点和缺点，用表格形式呈现，最后给出你的建议。',
        ongoing: '请分析上述选项的优缺点'
      },
      displayPreview: '⚖️ 优缺点分析'
    }),
    createPresetTemplate({
      id: 'preset-daily-4',
      name: '做决定帮手',
      content: '我正在纠结{{决定描述}}，有以下几个选项：\n{{选项列表}}\n\n请帮我分析每个选项，并给出推荐。',
      category: '日常',
      order: 4,
      conversationMode: {
        newChat: '我正在纠结{{决定描述}}，有以下几个选项：\n{{选项列表}}\n\n请帮我分析每个选项，并给出推荐。',
        ongoing: '请帮我分析上述选项并给出推荐'
      },
      displayPreview: '🤔 做决定帮手'
    }),
    createPresetTemplate({
      id: 'preset-work-1',
      name: '邮件撰写',
      content: '请帮我写一封{{邮件类型}}邮件：\n- 收件人：{{收件人}}\n- 主题：{{主题}}\n- 要点：{{要点}}\n\n语气要{{语气风格}}。',
      category: '工作',
      order: 5,
      pinned: true,
      conversationMode: {
        newChat: '请帮我写一封{{邮件类型}}邮件：\n- 收件人：{{收件人}}\n- 主题：{{主题}}\n- 要点：{{要点}}\n\n语气要{{语气风格}}。',
        ongoing: '请帮我修改上述邮件'
      },
      displayPreview: '📧 邮件撰写'
    }),
    createPresetTemplate({
      id: 'preset-work-2',
      name: '周报生成',
      content: '请根据以下工作内容帮我生成本周周报：\n\n{{本周工作内容}}\n\n格式要求：\n1. 本周完成\n2. 进行中\n3. 下周计划\n4. 需要协助',
      category: '工作',
      order: 6,
      conversationMode: {
        newChat: '请根据以下工作内容帮我生成本周周报：\n\n{{本周工作内容}}\n\n格式要求：\n1. 本周完成\n2. 进行中\n3. 下周计划\n4. 需要协助',
        ongoing: '请根据上述内容生成周报'
      },
      displayPreview: '📋 周报生成'
    }),
    createPresetTemplate({
      id: 'preset-work-3',
      name: '会议纪要整理',
      content: '请将以下会议记录整理成正式的会议纪要，包含：\n1. 会议主题\n2. 参会人员\n3. 讨论要点\n4. 决议事项\n5. 待办事项（标注负责人和截止时间）\n\n会议记录：\n{{会议记录}}',
      category: '工作',
      order: 7,
      conversationMode: {
        newChat: '请将以下会议记录整理成正式的会议纪要，包含：\n1. 会议主题\n2. 参会人员\n3. 讨论要点\n4. 决议事项\n5. 待办事项（标注负责人和截止时间）\n\n会议记录：\n{{会议记录}}',
        ongoing: '请整理上述会议记录'
      },
      displayPreview: '📝 会议纪要'
    }),
    createPresetTemplate({
      id: 'preset-work-4',
      name: '面试准备',
      content: '我要面试{{职位名称}}岗位，请帮我：\n1. 列出可能被问到的 10 个面试问题\n2. 给出每个问题的回答思路\n3. 提供一些加分的提问建议',
      category: '工作',
      order: 8,
      conversationMode: {
        newChat: '我要面试{{职位名称}}岗位，请帮我：\n1. 列出可能被问到的 10 个面试问题\n2. 给出每个问题的回答思路\n3. 提供一些加分的提问建议',
        ongoing: '请继续帮我准备面试'
      },
      displayPreview: '💼 面试准备'
    }),
    createPresetTemplate({
      id: 'preset-study-1',
      name: '知识点总结',
      content: '请帮我总结「{{知识点或章节}}」的核心内容，用以下格式：\n1. 核心概念\n2. 关键要点（分点列出）\n3. 常见误区\n4. 记忆技巧',
      category: '学习',
      order: 9,
      conversationMode: {
        newChat: '请帮我总结「{{知识点或章节}}」的核心内容，用以下格式：\n1. 核心概念\n2. 关键要点（分点列出）\n3. 常见误区\n4. 记忆技巧',
        ongoing: '请总结上述知识点'
      },
      displayPreview: '📚 知识点总结'
    }),
    createPresetTemplate({
      id: 'preset-study-2',
      name: '练习题生成',
      content: '请根据「{{知识点}}」生成 5 道练习题，包含：\n- 2 道基础题\n- 2 道进阶题\n- 1 道综合应用题\n\n每道题后附上答案和解析。',
      category: '学习',
      order: 10,
      conversationMode: {
        newChat: '请根据「{{知识点}}」生成 5 道练习题，包含：\n- 2 道基础题\n- 2 道进阶题\n- 1 道综合应用题\n\n每道题后附上答案和解析。',
        ongoing: '请根据上述知识点生成练习题'
      },
      displayPreview: '✏️ 练习题生成'
    }),
    createPresetTemplate({
      id: 'preset-study-3',
      name: '学习计划制定',
      content: '我想学习{{学习目标}}，预计每天可投入{{时间}}，计划在{{周期}}内完成。请帮我制定一个详细的学习计划，包含每周目标和学习资源推荐。',
      category: '学习',
      order: 11,
      conversationMode: {
        newChat: '我想学习{{学习目标}}，预计每天可投入{{时间}}，计划在{{周期}}内完成。请帮我制定一个详细的学习计划，包含每周目标和学习资源推荐。',
        ongoing: '请帮我制定学习计划'
      },
      displayPreview: '📅 学习计划'
    }),
    createPresetTemplate({
      id: 'preset-life-1',
      name: '旅行规划',
      content: '我计划去{{目的地}}旅行，时间是{{日期}}，共{{天数}}天，预算{{预算}}。\n\n请帮我规划行程，包括：\n1. 每日行程安排\n2. 必去景点推荐\n3. 美食推荐\n4. 住宿建议\n5. 注意事项',
      category: '生活',
      order: 12,
      conversationMode: {
        newChat: '我计划去{{目的地}}旅行，时间是{{日期}}，共{{天数}}天，预算{{预算}}。\n\n请帮我规划行程，包括：\n1. 每日行程安排\n2. 必去景点推荐\n3. 美食推荐\n4. 住宿建议\n5. 注意事项',
        ongoing: '请帮我规划上述旅行'
      },
      displayPreview: '✈️ 旅行规划'
    }),
    createPresetTemplate({
      id: 'preset-life-2',
      name: '菜谱推荐',
      content: '我想做一道{{菜品类型}}，家里有这些食材：{{食材列表}}。\n\n请推荐一个适合的菜谱，包含：\n1. 食材用量\n2. 详细步骤\n3. 烹饪技巧\n4. 预计时间',
      category: '生活',
      order: 13,
      conversationMode: {
        newChat: '我想做一道{{菜品类型}}，家里有这些食材：{{食材列表}}。\n\n请推荐一个适合的菜谱，包含：\n1. 食材用量\n2. 详细步骤\n3. 烹饪技巧\n4. 预计时间',
        ongoing: '请推荐一个菜谱'
      },
      displayPreview: '🍳 菜谱推荐'
    }),
    createPresetTemplate({
      id: 'preset-life-3',
      name: '礼物建议',
      content: '我想给{{送礼对象}}送礼物，对方{{对方特点}}，预算在{{预算}}左右，场合是{{场合}}。请推荐 5 个礼物选项并说明理由。',
      category: '生活',
      order: 14,
      conversationMode: {
        newChat: '我想给{{送礼对象}}送礼物，对方{{对方特点}}，预算在{{预算}}左右，场合是{{场合}}。请推荐 5 个礼物选项并说明理由。',
        ongoing: '请推荐礼物选项'
      },
      displayPreview: '🎁 礼物建议'
    }),
    createPresetTemplate({
      id: 'preset-write-1',
      name: '文章润色',
      content: '请帮我润色以下文章，优化表达，保持原意，使文章更专业、更流畅：\n\n',
      category: '写作',
      order: 15,
      conversationMode: {
        newChat: '请帮我润色以下文章，优化表达，保持原意，使文章更专业、更流畅：\n\n',
        ongoing: '请润色上述文字，使其更专业流畅'
      },
      displayPreview: '✨ 文章润色'
    }),
    createPresetTemplate({
      id: 'preset-write-2',
      name: '总结要点',
      content: '请帮我总结以下内容的核心要点，分点列出：\n\n',
      category: '写作',
      order: 16,
      conversationMode: {
        newChat: '请帮我总结以下内容的核心要点，分点列出：\n\n',
        ongoing: '请总结上述内容的核心要点'
      },
      displayPreview: '📝 总结要点'
    }),
    createPresetTemplate({
      id: 'preset-write-3',
      name: '文案撰写',
      content: '请帮我写一段{{文案类型}}文案：\n- 产品/主题：{{产品或主题}}\n- 目标受众：{{受众}}\n- 风格要求：{{风格}}\n- 字数要求：{{字数}}',
      category: '写作',
      order: 17,
      conversationMode: {
        newChat: '请帮我写一段{{文案类型}}文案：\n- 产品/主题：{{产品或主题}}\n- 目标受众：{{受众}}\n- 风格要求：{{风格}}\n- 字数要求：{{字数}}',
        ongoing: '请帮我撰写文案'
      },
      displayPreview: '✍️ 文案撰写'
    }),
    createPresetTemplate({
      id: 'preset-translate-1',
      name: '中英互译',
      content: '请将以下内容翻译成目标语言，保持专业术语准确，语气自然流畅。如果是中文则翻译成英文，如果是英文则翻译成中文：\n\n',
      category: '翻译',
      order: 18,
      conversationMode: {
        newChat: '请将以下内容翻译成目标语言，保持专业术语准确，语气自然流畅。如果是中文则翻译成英文，如果是英文则翻译成中文：\n\n',
        ongoing: '请翻译上述内容（保持术语准确、语气自然）'
      },
      displayPreview: '🌏 中英互译'
    }),
    createPresetTemplate({
      id: 'preset-translate-2',
      name: '多语言翻译',
      content: '请将以下内容翻译成{{目标语言}}，保持原文风格和语气：\n\n{{待翻译内容}}',
      category: '翻译',
      order: 19,
      conversationMode: {
        newChat: '请将以下内容翻译成{{目标语言}}，保持原文风格和语气：\n\n{{待翻译内容}}',
        ongoing: '请翻译上述内容'
      },
      displayPreview: '🌍 多语言翻译'
    }),
    createPresetTemplate({
      id: 'preset-code-1',
      name: '代码审查',
      content: '请作为一名资深程序员，审查以下代码，从以下维度给出建议：\n1. 安全性\n2. 性能\n3. 可读性\n4. 最佳实践\n\n代码如下：\n',
      category: '代码',
      order: 20,
      conversationMode: {
        newChat: '请作为一名资深程序员，审查以下代码，从以下维度给出建议：\n1. 安全性\n2. 性能\n3. 可读性\n4. 最佳实践\n\n代码如下：\n',
        ongoing: '请从安全性、性能、可读性和最佳实践四个角度审查上述代码'
      },
      displayPreview: '💼 代码审查'
    }),
    createPresetTemplate({
      id: 'preset-code-2',
      name: 'SQL 优化',
      content: '请分析以下 SQL 语句的性能问题，并给出优化建议：\n\n',
      category: '代码',
      order: 21,
      conversationMode: {
        newChat: '请分析以下 SQL 语句的性能问题，并给出优化建议：\n\n',
        ongoing: '请分析上述 SQL 的性能问题并给出优化建议'
      },
      displayPreview: '⚡ SQL 优化'
    }),
    createPresetTemplate({
      id: 'preset-code-3',
      name: '代码解释',
      content: '请详细解释以下代码的功能和实现逻辑，用通俗易懂的语言，适合初学者理解：\n\n',
      category: '代码',
      order: 22,
      conversationMode: {
        newChat: '请详细解释以下代码的功能和实现逻辑，用通俗易懂的语言，适合初学者理解：\n\n',
        ongoing: '请解释上述代码'
      },
      displayPreview: '📖 代码解释'
    }),
    createPresetTemplate({
      id: 'preset-code-4',
      name: 'Bug 排查',
      content: '我的代码遇到了问题：\n\n错误信息：{{错误信息}}\n\n相关代码：\n{{代码}}\n\n请帮我分析可能的原因并给出解决方案。',
      category: '代码',
      order: 23,
      conversationMode: {
        newChat: '我的代码遇到了问题：\n\n错误信息：{{错误信息}}\n\n相关代码：\n{{代码}}\n\n请帮我分析可能的原因并给出解决方案。',
        ongoing: '请帮我排查上述 Bug'
      },
      displayPreview: '🐛 Bug 排查'
    }),
    createPresetTemplate({
      id: 'preset-product-1',
      name: 'PRD 草案生成',
      content: '请根据以下产品需求背景，输出一份结构完整的 PRD 草案：\n- 产品目标：{{产品目标}}\n- 目标用户：{{目标用户}}\n- 核心场景：{{核心场景}}\n- 功能范围：{{功能范围}}\n- 成功指标：{{成功指标}}\n\n请包含：背景、目标、用户故事、功能清单、流程说明、验收标准、风险与待确认项。',
      category: '产品运营',
      order: 24,
      conversationMode: {
        newChat: '请根据以下产品需求背景，输出一份结构完整的 PRD 草案：\n- 产品目标：{{产品目标}}\n- 目标用户：{{目标用户}}\n- 核心场景：{{核心场景}}\n- 功能范围：{{功能范围}}\n- 成功指标：{{成功指标}}\n\n请包含：背景、目标、用户故事、功能清单、流程说明、验收标准、风险与待确认项。',
        ongoing: '请基于上述讨论补全这份 PRD 草案'
      },
      displayPreview: '📦 PRD 草案生成'
    }),
    createPresetTemplate({
      id: 'preset-product-2',
      name: '竞品分析',
      content: '请围绕「{{产品名称}}」做竞品分析，竞品包括：{{竞品列表}}。\n\n请输出：\n1. 目标用户与定位\n2. 核心功能对比\n3. 定价/商业模式\n4. 优势与短板\n5. 对我们的启发与机会点',
      category: '产品运营',
      order: 25,
      conversationMode: {
        newChat: '请围绕「{{产品名称}}」做竞品分析，竞品包括：{{竞品列表}}。\n\n请输出：\n1. 目标用户与定位\n2. 核心功能对比\n3. 定价/商业模式\n4. 优势与短板\n5. 对我们的启发与机会点',
        ongoing: '请继续深化上述竞品分析结论'
      },
      displayPreview: '🧭 竞品分析'
    }),
    createPresetTemplate({
      id: 'preset-data-1',
      name: '数据解读',
      content: '请帮我解读以下数据表现：\n- 指标名称：{{指标名称}}\n- 时间范围：{{时间范围}}\n- 数据内容：{{数据内容}}\n- 业务背景：{{业务背景}}\n\n请输出：关键发现、可能原因、风险点、后续建议。',
      category: '数据分析',
      order: 26,
      conversationMode: {
        newChat: '请帮我解读以下数据表现：\n- 指标名称：{{指标名称}}\n- 时间范围：{{时间范围}}\n- 数据内容：{{数据内容}}\n- 业务背景：{{业务背景}}\n\n请输出：关键发现、可能原因、风险点、后续建议。',
        ongoing: '请继续分析上述数据变化的原因和建议'
      },
      displayPreview: '📈 数据解读'
    }),
    createPresetTemplate({
      id: 'preset-data-2',
      name: '图表结论总结',
      content: '下面是一组图表或报表信息：\n{{图表信息}}\n\n请帮我提炼成适合汇报的结论，要求：\n1. 先给一句总论\n2. 再列出 3-5 个关键洞察\n3. 标出异常点或需要重点关注的问题\n4. 给出下一步行动建议',
      category: '数据分析',
      order: 27,
      conversationMode: {
        newChat: '下面是一组图表或报表信息：\n{{图表信息}}\n\n请帮我提炼成适合汇报的结论，要求：\n1. 先给一句总论\n2. 再列出 3-5 个关键洞察\n3. 标出异常点或需要重点关注的问题\n4. 给出下一步行动建议',
        ongoing: '请继续整理上述图表对应的汇报结论'
      },
      displayPreview: '📊 图表结论总结'
    }),
    createPresetTemplate({
      id: 'preset-social-1',
      name: '小红书种草文案',
      content: '请帮我写一篇适合小红书发布的种草文案：\n- 产品/主题：{{产品或主题}}\n- 目标人群：{{目标人群}}\n- 使用场景：{{使用场景}}\n- 卖点：{{卖点}}\n- 风格：{{风格}}\n\n要求：有标题、正文分段、适量 emoji、结尾互动引导。',
      category: '社交媒体',
      order: 28,
      conversationMode: {
        newChat: '请帮我写一篇适合小红书发布的种草文案：\n- 产品/主题：{{产品或主题}}\n- 目标人群：{{目标人群}}\n- 使用场景：{{使用场景}}\n- 卖点：{{卖点}}\n- 风格：{{风格}}\n\n要求：有标题、正文分段、适量 emoji、结尾互动引导。',
        ongoing: '请继续优化上述小红书文案的吸引力'
      },
      displayPreview: '📕 小红书种草文案'
    }),
    createPresetTemplate({
      id: 'preset-social-2',
      name: '公众号推文草稿',
      content: '请帮我撰写一篇微信公众号推文草稿：\n- 主题：{{主题}}\n- 受众：{{受众}}\n- 核心观点：{{核心观点}}\n- 参考素材：{{参考素材}}\n- 语气：{{语气}}\n\n要求：包含标题、导语、正文结构、小标题和结尾 CTA。',
      category: '社交媒体',
      order: 29,
      conversationMode: {
        newChat: '请帮我撰写一篇微信公众号推文草稿：\n- 主题：{{主题}}\n- 受众：{{受众}}\n- 核心观点：{{核心观点}}\n- 参考素材：{{参考素材}}\n- 语气：{{语气}}\n\n要求：包含标题、导语、正文结构、小标题和结尾 CTA。',
        ongoing: '请根据上述内容继续完善公众号推文'
      },
      displayPreview: '📰 公众号推文草稿'
    }),
    createPresetTemplate({
      id: 'preset-image-1',
      name: 'Midjourney 提示词',
      content: '请把下面的创意需求整理成适合 Midjourney 的英文 Prompt：\n- 主体：{{主体}}\n- 场景：{{场景}}\n- 风格：{{风格}}\n- 构图：{{构图}}\n- 光线：{{光线}}\n- 细节要求：{{细节要求}}\n\n请直接输出可复制的 Prompt，并附一个简短中文说明。',
      category: '图像生成',
      order: 30,
      conversationMode: {
        newChat: '请把下面的创意需求整理成适合 Midjourney 的英文 Prompt：\n- 主体：{{主体}}\n- 场景：{{场景}}\n- 风格：{{风格}}\n- 构图：{{构图}}\n- 光线：{{光线}}\n- 细节要求：{{细节要求}}\n\n请直接输出可复制的 Prompt，并附一个简短中文说明。',
        ongoing: '请继续优化上述 Midjourney Prompt'
      },
      displayPreview: '🎨 Midjourney 提示词'
    }),
    createPresetTemplate({
      id: 'preset-image-2',
      name: 'DALL·E 提示词',
      content: '请根据以下要求生成适合 DALL·E 的高质量图像描述：\n- 画面主题：{{画面主题}}\n- 风格参考：{{风格参考}}\n- 色彩氛围：{{色彩氛围}}\n- 重点元素：{{重点元素}}\n- 禁止元素：{{禁止元素}}\n\n请输出一段清晰、具体、可直接用于生成图片的描述。',
      category: '图像生成',
      order: 31,
      conversationMode: {
        newChat: '请根据以下要求生成适合 DALL·E 的高质量图像描述：\n- 画面主题：{{画面主题}}\n- 风格参考：{{风格参考}}\n- 色彩氛围：{{色彩氛围}}\n- 重点元素：{{重点元素}}\n- 禁止元素：{{禁止元素}}\n\n请输出一段清晰、具体、可直接用于生成图片的描述。',
        ongoing: '请继续优化上述 DALL·E 图像描述'
      },
      displayPreview: '🖼️ DALL·E 提示词'
    })
  ],
  categories: [
    '日常',
    '工作',
    '学习',
    '生活',
    '写作',
    '翻译',
    '代码',
    '产品运营',
    '数据分析',
    '社交媒体',
    '图像生成',
    '其他'
  ],
  settings: {
    showFloatingButton: false,
    enableSlashCommand: true,
    defaultSort: 'lastUsed',
    smartInjection: true,
    addSeparator: true
  }
};

const SUPPORTED_RULES = [
  { pattern: 'https://chat.openai.com/*', hostname: 'chat.openai.com' },
  { pattern: 'https://chatgpt.com/*', hostname: 'chatgpt.com' },
  { pattern: 'https://gemini.google.com/*', hostname: 'gemini.google.com' },
  { pattern: 'https://chat.deepseek.com/*', hostname: 'chat.deepseek.com' },
  { pattern: 'https://kimi.moonshot.cn/*', hostname: 'kimi.moonshot.cn' },
  { pattern: 'https://tongyi.aliyun.com/*', hostname: 'tongyi.aliyun.com' },
  { pattern: 'https://claude.ai/*', hostname: 'claude.ai' },
  { pattern: 'https://perplexity.ai/*', hostname: 'perplexity.ai' },
  { pattern: 'https://www.perplexity.ai/*', hostname: 'www.perplexity.ai' },
  { pattern: 'https://grok.com/*', hostname: 'grok.com' },
  { pattern: 'https://x.com/i/grok*', hostname: 'x.com', pathPrefix: '/i/grok' },
  { pattern: 'https://doubao.com/*', hostname: 'doubao.com' },
  { pattern: 'https://www.doubao.com/*', hostname: 'www.doubao.com' }
];

function isSupportedUrl(url) {
  if (!url) return false;

  try {
    const parsed = new URL(url);
    return SUPPORTED_RULES.some((rule) => {
      if (parsed.hostname !== rule.hostname) {
        return false;
      }

      if (rule.pathPrefix) {
        return parsed.pathname.startsWith(rule.pathPrefix);
      }

      return true;
    });
  } catch {
    return false;
  }
}

function getFallbackCategories() {
  return [...DEFAULT_DATA.categories];
}

function mergePresetFields(template, preset) {
  if (!preset) {
    return template;
  }

  return {
    ...template,
    category: template.category || preset.category,
    displayPreview: template.displayPreview || preset.displayPreview,
    conversationMode: template.conversationMode || preset.conversationMode
  };
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
      documentUrlPatterns: SUPPORTED_RULES.map((rule) => rule.pattern)
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
    return;
  }

  if (info.menuItemId === 'apt-create-template' && info.selectionText) {
    chrome.storage.local.get(['templates', 'categories'], (result) => {
      const templates = result.templates || [];
      const categories = result.categories || getFallbackCategories();
      const now = new Date().toISOString();

      const newTemplate = {
        id: 'tpl-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9),
        name: info.selectionText.substring(0, 30) + (info.selectionText.length > 30 ? '...' : ''),
        content: info.selectionText,
        category: categories.includes('其他') ? '其他' : categories[0],
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

chrome.commands.onCommand.addListener((command) => {
  if (command === 'show-quick-panel') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id && isSupportedUrl(tabs[0].url)) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'showQuickPanel' }).catch(() => {});
      }
    });
  }
});

function migrateTemplates() {
  chrome.storage.local.get(['templates', 'categories', 'settings', 'dataVersion'], (result) => {
    const currentVersion = 3;
    const storedVersion = result.dataVersion || 1;

    if (storedVersion >= currentVersion) return;

    let templates = result.templates || [];
    let categories = result.categories || [];
    const settings = result.settings || {};
    const presetMap = new Map(DEFAULT_DATA.templates.map((template) => [template.id, template]));
    const existingIds = new Set(templates.map((template) => template.id));
    const newPresetTemplates = DEFAULT_DATA.templates.filter((template) => !existingIds.has(template.id));

    templates = templates.map((template) => mergePresetFields(template, presetMap.get(template.id)));

    if (newPresetTemplates.length > 0) {
      templates = [...templates, ...newPresetTemplates];
    }

    categories = [...new Set([...categories, ...DEFAULT_DATA.categories])];

    if (settings.addSeparator === undefined) {
      settings.addSeparator = true;
    }
    if (settings.smartInjection === undefined) {
      settings.smartInjection = true;
    }

    chrome.storage.local.set({
      templates,
      categories,
      settings,
      dataVersion: currentVersion
    });
  });
}

migrateTemplates();
