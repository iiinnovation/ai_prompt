# AI Prompt 模板助手

一款轻量级 Chrome 扩展，帮助用户管理常用 Prompt 模板，并在主流 AI 平台上一键注入到输入框。

## 功能特性

- **模板管理** - 增删改查、分类管理、置顶收藏
- **快速注入** - 快捷键 `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`) 呼出面板
- **智能搜索** - 模糊匹配模板名称和内容
- **使用统计** - 记录使用次数，支持按最近使用/最常用排序
- **批量操作** - 批量添加模板、导入导出 JSON
- **多平台支持** - ChatGPT、Gemini、DeepSeek、Kimi、通义千问

## 支持平台

| 平台 | 网址 |
|------|------|
| ChatGPT | chat.openai.com / chatgpt.com |
| Gemini | gemini.google.com |
| DeepSeek | chat.deepseek.com |
| Kimi | kimi.moonshot.cn |
| 通义千问 | tongyi.aliyun.com |

## 安装

### 从源码安装

1. 克隆仓库
```bash
git clone https://github.com/YOUR_USERNAME/prompt-template-extension.git
```

2. 打开 Chrome，访问 `chrome://extensions/`

3. 开启右上角「开发者模式」

4. 点击「加载已解压的扩展程序」

5. 选择项目文件夹

## 使用方法

### 快速注入模板

1. 访问支持的 AI 平台
2. 按 `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`) 或点击扩展图标
3. 搜索或选择模板
4. 模板内容自动填入输入框

### 管理模板

1. 右键扩展图标 → 选项
2. 或在弹出面板底部点击「管理模板」

### 批量添加

格式：每行一个模板，用 `|` 分隔
```
模板名称 | 分类 | 模板内容
```

### 导入导出

- 导出：生成 JSON 文件备份
- 导入：支持冲突处理（覆盖/跳过/重命名）

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl/Cmd + Shift + P` | 打开模板面板 |
| `1-9` | 快速选择前 9 个模板 |
| `Esc` | 关闭面板 |

## 技术栈

- Chrome Extension Manifest V3
- Vanilla JavaScript
- Chrome Storage API

## 项目结构

```
prompt-template-extension/
├── manifest.json        # 扩展配置
├── background/          # Service Worker
├── content/             # 内容脚本
├── popup/               # 弹出面板
├── options/             # 管理页面
├── utils/               # 工具函数
└── icons/               # 扩展图标
```

## License

MIT License
