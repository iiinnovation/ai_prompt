const PLATFORM_CONFIG = {
  'chat.openai.com': {
    name: 'ChatGPT',
    inputSelector: '#prompt-textarea',
    submitSelector: 'button[data-testid="send-button"]',
    inputType: 'textarea',
    version: '2026-01',
    chatDetector: () => document.querySelectorAll('article[data-testid]').length > 0
  },
  'chatgpt.com': {
    name: 'ChatGPT',
    inputSelector: '#prompt-textarea',
    submitSelector: 'button[data-testid="send-button"]',
    inputType: 'textarea',
    version: '2026-01',
    chatDetector: () => document.querySelectorAll('article[data-testid]').length > 0
  },
  'gemini.google.com': {
    name: 'Gemini',
    inputSelector: '.ql-editor, [contenteditable="true"]',
    submitSelector: 'button[aria-label="Send message"], .send-button',
    inputType: 'contenteditable',
    version: '2026-01',
    chatDetector: () => document.querySelectorAll('.conversation-container message-content, .chat-history .message').length > 0
  },
  'chat.deepseek.com': {
    name: 'DeepSeek',
    inputSelector: '#chat-input, textarea',
    submitSelector: 'button[type="submit"], .send-btn',
    inputType: 'textarea',
    version: '2026-01',
    chatDetector: () => {
      const messageItems = document.querySelectorAll('.message-item, [class*="message-"], .ds-markdown');
      return messageItems.length > 0;
    }
  },
  'kimi.moonshot.cn': {
    name: 'Kimi',
    inputSelector: '[data-testid="chat-input"], .chat-input [contenteditable="true"], textarea',
    submitSelector: '[data-testid="send-button"], .send-btn',
    inputType: 'mixed',
    version: '2026-01',
    chatDetector: () => {
      const segments = document.querySelectorAll('[class*="segment"], [class*="chat-message"], .chat-content .message');
      return segments.length > 0;
    }
  },
  'tongyi.aliyun.com': {
    name: 'Qwen',
    inputSelector: '.chat-input textarea, #chat-input, textarea',
    submitSelector: '.send-btn, button[type="submit"]',
    inputType: 'textarea',
    version: '2026-01',
    chatDetector: () => {
      const messages = document.querySelectorAll('.message-list .message, [class*="chatItem"], .chat-message');
      return messages.length > 0;
    }
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

function isOngoingConversation() {
  const platform = getCurrentPlatform();
  if (!platform) return false;
  
  if (typeof platform.chatDetector === 'function') {
    try {
      return platform.chatDetector();
    } catch (e) {
      console.warn('[AI Prompt Helper] Chat detection failed:', e);
      return false;
    }
  }
  
  return false;
}

function getSmartContent(template, forceMode = null) {
  const isOngoing = forceMode ? (forceMode === 'ongoing') : isOngoingConversation();
  
  if (template.conversationMode) {
    return isOngoing 
      ? (template.conversationMode.ongoing || template.content)
      : (template.conversationMode.newChat || template.content);
  }
  
  return template.content;
}

function getConversationState() {
  return {
    isOngoing: isOngoingConversation(),
    platform: getCurrentPlatform()?.name || 'Unknown'
  };
}

const SEPARATOR_LINE = '\n\n───── ✨ 在下方输入你的问题 ─────\n\n';

function injectContent(content, mode = 'replace', options = {}) {
  const element = findInputElement();
  if (!element) {
    console.warn('[AI Prompt Helper] Input element not found');
    return false;
  }
  
  const inputType = detectInputType(element);
  const addSeparator = options.addSeparator !== false;
  const finalContent = addSeparator ? content + SEPARATOR_LINE : content;
  
  element.focus();
  
  if (inputType === 'textarea' || inputType === 'input') {
    if (mode === 'append') {
      const cursorPos = element.selectionStart || element.value.length;
      const before = element.value.substring(0, cursorPos);
      const after = element.value.substring(cursorPos);
      element.value = before + finalContent + after;
      const newPos = cursorPos + finalContent.length;
      element.setSelectionRange(newPos, newPos);
    } else {
      element.value = finalContent;
      element.setSelectionRange(finalContent.length, finalContent.length);
    }
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.scrollTop = element.scrollHeight;
  } else {
    if (mode === 'append') {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(finalContent));
        range.collapse(false);
      } else {
        element.innerHTML += finalContent;
      }
    } else {
      element.innerHTML = '';
      document.execCommand('insertText', false, finalContent);
    }
    element.dispatchEvent(new InputEvent('input', { bubbles: true, data: finalContent }));
    
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
    element.scrollTop = element.scrollHeight;
  }
  
  return true;
}

if (typeof window !== 'undefined') {
  window.PlatformHelper = {
    PLATFORM_CONFIG,
    getCurrentPlatform,
    findInputElement,
    detectInputType,
    injectContent,
    isOngoingConversation,
    getSmartContent,
    getConversationState
  };
}
