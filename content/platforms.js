const CLAUDE_PLATFORM = {
  name: 'Claude',
  inputSelector: '.ProseMirror[contenteditable="true"], div[contenteditable="true"][data-testid*="chat"], div[contenteditable="true"]',
  submitSelector: 'button[aria-label*="Send"], button[data-testid*="send"]',
  inputType: 'contenteditable',
  version: '2026-04',
  chatDetector: () => {
    const messages = document.querySelectorAll('[data-testid*="message"], article, [class*="message"]');
    return messages.length > 0;
  }
};

const PERPLEXITY_PLATFORM = {
  name: 'Perplexity',
  inputSelector: 'textarea, div[contenteditable="true"][role="textbox"], div[contenteditable="true"]',
  submitSelector: 'button[aria-label*="Submit"], button[aria-label*="Send"], button[type="submit"]',
  inputType: 'mixed',
  version: '2026-04',
  chatDetector: () => {
    const messages = document.querySelectorAll('main article, [data-testid*="thread"], [class*="answer"], [class*="message"]');
    return messages.length > 0;
  }
};

const GROK_PLATFORM = {
  name: 'Grok',
  inputSelector: 'textarea, div[contenteditable="true"][role="textbox"], div[contenteditable="true"]',
  submitSelector: 'button[aria-label*="Send"], button[type="submit"]',
  inputType: 'mixed',
  version: '2026-04',
  chatDetector: () => {
    const messages = document.querySelectorAll('main article, [data-testid*="conversation"], [class*="message"]');
    return messages.length > 0;
  }
};

const DOUBAO_PLATFORM = {
  name: '豆包',
  inputSelector: '[data-testid*="chat_input"], textarea, [contenteditable="true"]',
  submitSelector: 'button[aria-label*="发送"], button[type="submit"], .send-btn',
  inputType: 'mixed',
  version: '2026-04',
  chatDetector: () => {
    const messages = document.querySelectorAll('[class*="message"], [class*="chat"], [data-testid*="message"]');
    return messages.length > 0;
  }
};

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
    inputSelector: 'rich-textarea .ql-editor[contenteditable="true"], rich-textarea [contenteditable="true"], .ql-editor[contenteditable="true"], [aria-label="Enter a prompt here"], [contenteditable="true"]',
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
  },
  'claude.ai': CLAUDE_PLATFORM,
  'perplexity.ai': PERPLEXITY_PLATFORM,
  'www.perplexity.ai': PERPLEXITY_PLATFORM,
  'grok.com': GROK_PLATFORM,
  'x.com': {
    ...GROK_PLATFORM,
    pathPrefix: '/i/grok'
  },
  'doubao.com': DOUBAO_PLATFORM,
  'www.doubao.com': DOUBAO_PLATFORM
};

function getCurrentPlatform() {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  const platform = PLATFORM_CONFIG[hostname];

  if (!platform) return null;
  if (platform.pathPrefix && !pathname.startsWith(platform.pathPrefix)) return null;

  return platform;
}

function findInputElement() {
  const platform = getCurrentPlatform();
  if (!platform) return null;
  
  const selectors = platform.inputSelector.split(',').map((selector) => selector.trim()).filter(Boolean);
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

const VARIABLE_REGEX = /\{\{([^}]+)\}\}/g;

function extractVariables(content) {
  const variables = [];
  const seen = new Set();
  let match;
  while ((match = VARIABLE_REGEX.exec(content)) !== null) {
    const varName = match[1].trim();
    if (!seen.has(varName)) {
      seen.add(varName);
      variables.push(varName);
    }
  }
  VARIABLE_REGEX.lastIndex = 0;
  return variables;
}

function replaceVariables(content, values) {
  return content.replace(VARIABLE_REGEX, (match, varName) => {
    const trimmedName = varName.trim();
    return values[trimmedName] !== undefined ? values[trimmedName] : match;
  });
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
  const platform = getCurrentPlatform();
  
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
    const selection = window.getSelection();

    const selectElementContents = () => {
      const range = document.createRange();
      range.selectNodeContents(element);
      selection.removeAllRanges();
      selection.addRange(range);
      return range;
    };

    const placeCaretAtEnd = () => {
      const range = document.createRange();
      range.selectNodeContents(element);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    };

    const isSelectionInsideElement = () => {
      if (!selection || selection.rangeCount === 0) {
        return false;
      }

      const range = selection.getRangeAt(0);
      return element.contains(range.startContainer) && element.contains(range.endContainer);
    };

    const execInsertText = (text) => {
      if (typeof document.execCommand !== 'function') {
        return false;
      }

      return document.execCommand('insertText', false, text);
    };

    const writeRichTextBlocks = (text) => {
      const fragment = document.createDocumentFragment();
      const lines = text.split('\n');

      lines.forEach((line) => {
        const block = document.createElement('p');
        if (line) {
          block.textContent = line;
        } else {
          block.appendChild(document.createElement('br'));
        }
        fragment.appendChild(block);
      });

      element.innerHTML = '';
      element.appendChild(fragment);
    };

    let inserted = false;

    if (mode === 'append') {
      if (!isSelectionInsideElement()) {
        placeCaretAtEnd();
      }

      inserted = execInsertText(finalContent);

      if (!inserted) {
        const existingText = element.innerText || element.textContent || '';
        const nextText = existingText + finalContent;
        if (platform?.name === 'Gemini' || element.classList.contains('ql-editor')) {
          writeRichTextBlocks(nextText);
        } else {
          element.textContent = nextText;
        }
      }
    } else {
      selectElementContents();

      if (typeof document.execCommand === 'function') {
        document.execCommand('delete', false, null);
      }
      inserted = execInsertText(finalContent);

      if (!inserted) {
        if (platform?.name === 'Gemini' || element.classList.contains('ql-editor')) {
          writeRichTextBlocks(finalContent);
        } else {
          element.textContent = finalContent;
        }
      }
    }

    element.dispatchEvent(new InputEvent('input', { bubbles: true, data: finalContent, inputType: mode === 'append' ? 'insertText' : 'insertReplacementText' }));
    placeCaretAtEnd();
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
    getConversationState,
    extractVariables,
    replaceVariables
  };
}
