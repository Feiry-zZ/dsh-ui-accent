import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * 文档截图生成器：把真实的设置面板组件（lib/client.js 里的 AccentSection）渲染成静态 HTML，
 * 供 README 截图使用，中英文各一份，保证展示的结构与插件实际渲染完全一致。
 *
 * 做法：用一个极小的 React 替身（只支持 createElement / useState / useEffect / useRef）
 * 把组件树渲染成 HTML 字符串，不引入任何第三方依赖。
 */

/** preview 目录。 */
const previewDir = dirname(fileURLToPath(import.meta.url))

/** 极简 React 替身：hooks 只取初始值，副作用不执行。 */
const ReactStub = {
  createElement(type, props, ...children) {
    // 与 React 一致：children 统一放进 props.children，单子节点不额外包数组。
    const merged = { ...(props ?? {}) }
    if (children.length === 1) {
      merged.children = children[0]
    } else if (children.length > 1) {
      merged.children = children
    }
    return { type, props: merged }
  },
  useState(initial) {
    return [typeof initial === 'function' ? initial() : initial, () => {}]
  },
  useEffect() {},
  useRef(value) {
    return { current: value ?? null }
  }
}

/** 把文本转义成可直接嵌入 HTML 的形式。 */
function escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/** 把 React 的 style 对象转成内联样式字符串。 */
function styleToCss(style) {
  return Object.keys(style)
    .map((key) => `${key.replace(/[A-Z]/g, (letter) => '-' + letter.toLowerCase())}:${style[key]}`)
    .join(';')
}

/** 自闭合标签。 */
const VOID_TAGS = new Set(['input', 'img', 'br', 'hr', 'meta', 'link'])

/**
 * 把元素通过属性 map 渲染成 HTML。
 * @param tag - HTML 标签名。
 * @param props - 组件属性（函数型监听器会被忽略）。
 * @param childrenHtml - 已渲染的子节点 HTML。
 * @returns HTML 片段。
 */
function renderTag(tag, props, childrenHtml) {
  const attributes = []
  for (const key of Object.keys(props)) {
    // React 专用字段不进 HTML；ref 是对象，写成属性会变成 [object Object]。
    if (key === 'children' || key === 'ref' || key === 'key') {
      continue
    }
    const value = props[key]
    // 事件监听器与空值不进入静态标记。
    if (typeof value === 'function' || value === null || value === undefined || value === false) {
      continue
    }
    if (key === 'style') {
      attributes.push(`style="${escapeHtml(styleToCss(value))}"`)
      continue
    }
    const name = key === 'className' ? 'class' : key
    attributes.push(`${name}="${escapeHtml(value === true ? name : value)}"`)
  }
  const open = `<${tag}${attributes.length > 0 ? ' ' + attributes.join(' ') : ''}>`
  if (VOID_TAGS.has(tag)) {
    return open
  }
  return `${open}${childrenHtml}</${tag}>`
}

/**
 * 渲染节点：字符串原样转义，函数组件直接调用展开。
 * @param node - React 元素、数组或纯文本。
 * @returns HTML 片段。
 */
function render(node) {
  if (node === null || node === undefined || node === false || node === true) {
    return ''
  }
  if (Array.isArray(node)) {
    return node.map(render).join('')
  }
  if (typeof node === 'string' || typeof node === 'number') {
    return escapeHtml(node)
  }
  // 函数组件：调用后继续渲染其返回值。
  if (typeof node.type === 'function') {
    return render(node.type(node.props))
  }
  return renderTag(node.type, node.props, render(node.props.children))
}

/** 设计令牌：与 DSH 深色主题保持一致，只用于文档截图。 */
const TOKENS = `
    :root {
      --dsw-alias-label-primary: #e8e9ea;
      --dsw-alias-label-secondary: #a8abb0;
      --dsw-alias-label-tertiary: #7f838a;
      --dsw-alias-label-caption: #5b5f66;
      --dsw-alias-label-quaternary: #6a6e75;
      --dsw-alias-border-l2: rgba(255, 255, 255, 0.1);
      --dsw-alias-bg-base: #1b1c1e;
      --dsw-alias-markdown-code-block: #232426;
      --dsw-alias-markdown-inline-code: #2a2b2e;
      --dsw-alias-state-business-primary: #679efe;
      --dsw-alias-interactive-bg-hover: rgba(255, 255, 255, 0.06);
      --ds-font-family-code: Consolas, 'Cascadia Code', monospace;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 24px;
      background: #141516;
      color: var(--dsw-alias-label-primary);
      font-family: 'Segoe UI', 'Microsoft YaHei', system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .settings-card {
      width: 720px;
      padding: 18px 22px 22px;
      border: 1px solid var(--dsw-alias-border-l2);
      border-radius: 16px;
      background: var(--dsw-alias-bg-base);
    }
    .settings-card > .dsh-accent-section { padding-bottom: 4px; }
`

/**
 * 生成单语言的面板页面。
 * @param lang - 语言键（zh / en）。
 * @param component - 渲染好的面板 HTML。
 * @returns 完整 HTML 文档。
 */
function page(lang, component) {
  const title = lang === 'en' ? 'Accent colors · settings panel preview' : '界面配色 · 设置面板预览'
  return `<!doctype html>
<html lang="${lang === 'en' ? 'en' : 'zh-CN'}">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <link rel="stylesheet" href="../src/theme.css" />
    <style>${TOKENS}</style>
  </head>
  <body>
    <div class="settings-card">
${component}
    </div>
  </body>
</html>
`
}

// 模块在渲染时读取 localStorage 恢复配色，文档截图只要默认值，给一个空存储即可。
const storage = new Map()
globalThis.window = {
  localStorage: {
    getItem: (key) => (storage.has(key) ? storage.get(key) : null),
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: (key) => storage.delete(key)
  },
  __ModuleLoader__: {
    load(registration) {
      globalThis.__registration = registration
    }
  }
}

await import(new URL('../lib/client.js', import.meta.url).href)
const registration = globalThis.__registration
if (registration === undefined) {
  throw new Error('preview: 未能加载 client bundle')
}

const exports = registration.factory((specifier) => {
  if (specifier === 'react') {
    return ReactStub
  }
  throw new Error('preview: bundle 请求了未声明的模块: ' + specifier)
})

for (const lang of ['zh', 'en']) {
  const t = (key) => exports.DICTS[lang][key] ?? key
  const component = render(ReactStub.createElement(exports.AccentSection, { t }))
  const file = join(previewDir, lang === 'en' ? 'panel-en.html' : 'panel.html')
  writeFileSync(file, page(lang, component), 'utf8')
  console.log(`preview: 已生成 ${file}（${component.length} 字符）`)
}
