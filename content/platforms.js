const PLATFORM_CONFIG = {
  'chat.openai.com': {
    name: 'ChatGPT',
    inputSelector: '#prompt-textarea',
    submitSelector: 'button[data-testid="send-button"]',
    inputType: 'textarea',
    version: '2026-01'
  },
  'chatgpt.com': {
    name: 'ChatGPT',
    inputSelector: '#prompt-textarea',
    submitSelector: 'button[data-testid="send-button"]',
    inputType: 'textarea',
    version: '2026-01'
  },
  'gemini.google.com': {
    name: 'Gemini',
    inputSelector: '.ql-editor, [contenteditable="true"]',
    submitSelector: 'button[aria-label="Send message"], .send-button',
    inputType: 'contenteditable',
    version: '2026-01'
  },
  'chat.deepseek.com': {
    name: 'DeepSeek',
    inputSelector: '#chat-input, textarea',
    submitSelector: 'button[type="submit"], .send-btn',
    inputType: 'textarea',
    version: '2026-01'
  },
  'kimi.moonshot.cn': {
    name: 'Kimi',
    inputSelector: '[data-testid="chat-input"], .chat-input [contenteditable="true"], textarea',
    submitSelector: '[data-testid="send-button"], .send-btn',
    inputType: 'mixed',
    version: '2026-01'
  },
  'tongyi.aliyun.com': {
    name: 'Qwen',
    inputSelector: '.chat-input textarea, #chat-input, textarea',
    submitSelector: '.send-btn, button[type="submit"]',
    inputType: 'textarea',
    version: '2026-01'
  }
};

function getCurrentPlatform() {
  const hostname = window.location.hostname;
  return PLATFORM_CONFIG[hostname] || null;
}

function findInputElement() {
  const platform = getCurrentPlatform();
  if (!platform) return null;
  
  const selectors = platform.inputSelector.split(', ');
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) return element;
  }
  return null;
}

function detectInputType(element) {
  if (!element) return null;
  
  if (element.tagName === 'TEXTAREA') return 'textarea';
  if (element.getAttribute('contenteditable') === 'true') return 'contenteditable';
  if (element.tagName === 'INPUT' && element.type === 'text') return 'input';
  
  return 'contenteditable';
}

function injectContent(content) {
  const element = findInputElement();
  if (!element) {
    console.warn('[AI Prompt Helper] Input element not found');
    return false;
  }
  
  const inputType = detectInputType(element);
  element.focus();
  
  if (inputType === 'textarea' || inputType === 'input') {
    element.value = content;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  } else {
    element.innerHTML = '';
    document.execCommand('insertText', false, content);
    element.dispatchEvent(new InputEvent('input', { bubbles: true, data: content }));
  }
  
  const cursorPos = content.length;
  if (element.setSelectionRange) {
    element.setSelectionRange(cursorPos, cursorPos);
  }
  
  return true;
}

if (typeof window !== 'undefined') {
  window.PlatformHelper = {
    PLATFORM_CONFIG,
    getCurrentPlatform,
    findInputElement,
    detectInputType,
    injectContent
  };
}
