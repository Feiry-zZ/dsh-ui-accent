import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

/**
 * 本地自测：不依赖浏览器与 React 运行时，验证 client bundle 的工厂函数、
 * 设置面板结构、暂存/应用行为、预览作用域与持久化。
 * React 只作为最小替身注入，重点校验我们自己的逻辑。
 */

/** 假的 localStorage，用于断言持久化行为。 */
const storage = new Map()
/** 根元素 CSS 变量。 */
const cssVariables = new Map()
/** 根元素属性。 */
const rootAttributes = new Map()
/** 记录被注入的 style 标签，便于确认样式随插件生命周期挂载。 */
const styleTags = []

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

globalThis.document = {
  documentElement: {
    style: {
      setProperty: (name, value) => cssVariables.set(name, value),
      removeProperty: (name) => cssVariables.delete(name)
    },
    setAttribute: (name, value) => rootAttributes.set(name, value),
    removeAttribute: (name) => rootAttributes.delete(name)
  },
  createElement(tagName) {
    return {
      tagName,
      dataset: {},
      set textContent(value) {
        this.cssText = value
      },
      remove() {
        this.removed = true
      }
    }
  },
  head: {
    appendChild(tag) {
      styleTags.push(tag)
    }
  }
}

/** React 最小替身：只实现组件用到的 createElement / useState / useEffect / useRef。 */
const ReactStub = {
  createElement(type, props, ...children) {
    return { type, props: { ...(props ?? {}), children } }
  },
  useState(initial) {
    return [typeof initial === 'function' ? initial() : initial, () => {}]
  },
  useEffect() {},
  useRef(value) {
    return { current: value ?? null }
  }
}

await import(new URL('../lib/client.js', import.meta.url).href)
const registration = globalThis.__registration
if (!registration) throw new Error('bundle 没有调用 window.__ModuleLoader__.load')
if (registration.id !== '@feiry-zz/dsh-ui-accent') throw new Error('bundle id 不正确: ' + registration.id)

// 只允许 react；出现其它 require 说明 bundle 依赖失控。
const exports = registration.factory((specifier) => {
  if (specifier === 'react') return ReactStub
  throw new Error('bundle 请求了未声明的模块: ' + specifier)
})

/**
 * 把元素树展开成纯文本，函数组件会被直接调用展开。
 * @param node - React 元素、数组或字符串。
 * @returns 文本内容。
 */
function renderText(node) {
  if (node === null || node === undefined || node === false) return ''
  if (Array.isArray(node)) return node.map(renderText).join('')
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (typeof node.type === 'function') return renderText(node.type(node.props))
  return renderText(node.props?.children)
}

/**
 * 遍历元素树并按条件收集元素。
 * @param node - React 元素、数组或字符串。
 * @param predicate - 命中条件。
 * @param out - 收集结果。
 * @returns 命中的元素列表。
 */
function collectElements(node, predicate, out = []) {
  if (node === null || node === undefined || typeof node === 'boolean') return out
  if (Array.isArray(node)) {
    for (const item of node) collectElements(item, predicate, out)
    return out
  }
  if (typeof node !== 'object') return out
  if (typeof node.type === 'function') {
    collectElements(node.type(node.props), predicate, out)
    return out
  }
  if (predicate(node)) out.push(node)
  collectElements(node.props?.children, predicate, out)
  return out
}

/** 在面板树里找「应用」按钮。 */
function findApplyButton(tree) {
  return collectElements(
    tree,
    (element) => typeof element.props?.className === 'string' && element.props.className.includes('dsh-accent-apply')
  )[0]
}

const text = renderText(exports.AccentSection())
for (const label of [
  '界面配色',
  '结果与强调文字',
  '结果标题',
  '加粗文字',
  '行内代码',
  '思考',
  '提问',
  '运行命令',
  '编辑',
  '写入',
  '读取',
  '搜索',
  '代码',
  '任务',
  '技能',
  '插件',
  '其他工具',
  '全部恢复默认',
  '应用'
]) {
  if (!text.includes(label)) throw new Error('设置面板缺少文案: ' + label)
}
if (!text.includes('原色')) throw new Error('思考行缺少“原色”标记')
if (!text.includes('链接蓝')) throw new Error('行内代码缺少“链接蓝”标记')
if (!text.includes('效果预览（全部设置）')) throw new Error('预览标题未列举全部设置')

// 全部语言的字典键集必须一致，避免切换语言后出现裸键或漏翻。
const EXPECTED_LOCALES = ['de', 'en', 'es', 'fr', 'ja', 'pt', 'ru', 'zh']
const actualLocales = Object.keys(exports.DICTS).sort()
if (JSON.stringify(actualLocales) !== JSON.stringify(EXPECTED_LOCALES)) {
  throw new Error('语言集合与 DSH 不一致: ' + actualLocales.join(','))
}
const zhKeys = Object.keys(exports.DICTS.zh).sort()
for (const locale of EXPECTED_LOCALES) {
  const keys = Object.keys(exports.DICTS[locale]).sort()
  if (JSON.stringify(keys) !== JSON.stringify(zhKeys)) {
    throw new Error(`${locale} 字典键集与 zh 不一致`)
  }
  for (const key of keys) {
    const value = exports.DICTS[locale][key]
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error(`${locale} 字典存在空文案: ${key}`)
    }
    // 零宽空格与 BOM 会污染界面，DSH 的 i18n 检查同样禁止。
    if (/[\u200B\uFEFF]/.test(value)) {
      throw new Error(`${locale} 字典含零宽字符: ${key}`)
    }
  }
}

// 英文渲染：所有分类、按钮与未应用提示都应显示英文文案。
const enText = renderText(exports.AccentSection({ t: (key) => exports.DICTS.en[key] ?? key }))
for (const label of [
  'Accent colors',
  'Results & emphasis',
  'Result title',
  'Bold text',
  'Inline code',
  'Thinking',
  'Question',
  'Run command',
  'Edit',
  'Write',
  'Read',
  'Search',
  'Code',
  'Task',
  'Skill',
  'Plugin',
  'Other tools',
  'Reset all',
  'Apply',
  'Original',
  'Link blue'
]) {
  if (!enText.includes(label)) throw new Error('英文面板缺少文案: ' + label)
}

// 其他语言抽查：确认面板确实按当前语言渲染，而不是回落到中文。
const localeSpotChecks = {
  ja: ['アクセントカラー', 'ツール行', 'その他のツール', 'すべて既定に戻す', '適用'],
  es: ['Colores de acento', 'Filas de herramientas', 'Otras herramientas', 'Restablecer todo', 'Aplicar'],
  fr: ['Couleurs d’accent', 'Lignes d’outils', 'Autres outils', 'Tout réinitialiser', 'Appliquer'],
  de: ['Akzentfarben', 'Werkzeugzeilen', 'Andere Werkzeuge', 'Alles zurücksetzen', 'Anwenden'],
  ru: ['Акцентные цвета', 'Строки инструментов', 'Другие инструменты', 'Сбросить всё', 'Применить'],
  pt: ['Cores de destaque', 'Linhas de ferramentas', 'Outras ferramentas', 'Restaurar tudo', 'Aplicar']
}
for (const [locale, labels] of Object.entries(localeSpotChecks)) {
  const rendered = renderText(exports.AccentSection({ t: (key) => exports.DICTS[locale][key] ?? key }))
  for (const label of labels) {
    if (!rendered.includes(label)) throw new Error(`${locale} 面板缺少文案: ${label}`)
  }
}

// 初始状态：应用按钮常驻但禁用，且没有未应用播报。
const initialTree = exports.AccentSection()
const initialButton = findApplyButton(initialTree)
if (initialButton === undefined) throw new Error('预览标题行缺少应用按钮')
if (initialButton.props.disabled !== true) throw new Error('无改动时应用按钮应为禁用状态')
if (renderText(initialTree).includes('有未应用的配色更改')) throw new Error('无改动时不应播报未应用状态')

// 新的出厂默认：思考与行内代码不覆盖（null），技能沿用橙色，其他工具浅烟紫。
if (exports.getColors().think !== null) throw new Error('思考默认应为不覆盖')
if (exports.getColors().inlineCode !== null) throw new Error('行内代码默认应为不覆盖')
if (exports.getColors().skill !== '#fb923c') throw new Error('技能默认色应为橙色')
if (exports.getColors().bash !== '#b0cef2') throw new Error('运行命令默认色应为 #b0cef2')
if (exports.getColors().other !== '#ded7e5') throw new Error('其他工具默认色应为 #ded7e5')

// 修改只进 draft：不写根变量、不落盘，但按钮变为可用并播报未应用。
exports.setColor('heading', '#123456')
if (exports.getColors().heading !== '#123456') throw new Error('待应用配色未更新')
if (exports.getAppliedColors().heading !== '#c084fc') throw new Error('修改不应影响已应用配色')
if (cssVariables.has('--dsh-accent-heading')) throw new Error('修改不应写入根变量')
if (storage.has('dsh-accent.colors.v3')) throw new Error('修改不应落盘')
const dirtyTree = exports.AccentSection()
const dirtyButton = findApplyButton(dirtyTree)
if (dirtyButton.props.disabled !== false) throw new Error('有改动时应用按钮应启用')
if (!renderText(dirtyTree).includes('有未应用的配色更改')) throw new Error('有改动时应播报未应用状态')

// 点应用：写入差异键一次并落盘；按钮回到禁用，播报消失。
const appliedKeys = exports.applyDraft()
if (appliedKeys.length !== 1 || appliedKeys[0] !== 'heading') {
  throw new Error('应用差异键不正确: ' + JSON.stringify(appliedKeys))
}
if (cssVariables.get('--dsh-accent-heading') !== '#123456') throw new Error('应用后 CSS 变量未更新')
const savedEnvelope = JSON.parse(storage.get('dsh-accent.colors.v3'))
if (savedEnvelope.version !== 3 || savedEnvelope.colors.heading !== '#123456') throw new Error('颜色未持久化')
// v3 只落盘改过的分类，默认色不写入，否则以后调整默认色会被旧值挡住。
if (savedEnvelope.colors.other !== undefined) throw new Error('默认色不应写入存储')
if (exports.dirtyKeys().length !== 0) throw new Error('应用后不应再有未应用键')
const cleanTree = exports.AccentSection()
if (findApplyButton(cleanTree).props.disabled !== true) throw new Error('应用后按钮应回到禁用')
if (renderText(cleanTree).includes('有未应用的配色更改')) throw new Error('应用后不应再播报未应用状态')

// 非法颜色被忽略，不影响 draft 与已应用配色。
exports.setColor('heading', 'red')
if (exports.getColors().heading !== '#123456') throw new Error('非法颜色未被忽略')

// 订阅者必须收到新对象：应用后 applied 变了，如果传旧引用 React 会跳过重渲染，按钮不会复位。
const seenColors = []
const unsubscribeColors = exports.subscribeColors((colors) => seenColors.push(colors))
exports.setColor('strong', '#654321')
exports.applyDraft()
if (seenColors[seenColors.length - 1] === seenColors[seenColors.length - 2]) {
  throw new Error('应用后应发出新的配色对象，否则面板不会重渲染')
}
unsubscribeColors()

// 全部恢复默认也只改 draft；应用后回到默认并把存储里的自定义项清掉。
exports.resetColors()
if (exports.getColors().heading !== '#c084fc') throw new Error('重置未改回默认色')
if (cssVariables.get('--dsh-accent-heading') !== '#123456') throw new Error('重置不应立即写根变量')
exports.applyDraft()
if (cssVariables.get('--dsh-accent-heading') !== '#c084fc') throw new Error('应用重置后变量未更新')
if (JSON.parse(storage.get('dsh-accent.colors.v3')).colors.heading !== undefined) {
  throw new Error('恢复默认后不应把默认色写进存储')
}

// 行内代码默认不写变量；应用覆盖后写入，应用 null 后清除。
if (cssVariables.has('--dsh-accent-inline-code')) throw new Error('行内代码默认不应写入覆盖变量')
exports.setColor('inlineCode', '#4176e6')
if (cssVariables.has('--dsh-accent-inline-code')) throw new Error('修改行内代码不应立即写根变量')
exports.applyDraft()
if (cssVariables.get('--dsh-accent-inline-code') !== '#4176e6') throw new Error('应用后行内代码变量未写入')
exports.setColor('inlineCode', null)
exports.applyDraft()
if (cssVariables.has('--dsh-accent-inline-code')) throw new Error('行内代码恢复默认后变量未清除')

// 思考：修改只进 draft；应用后写入变量与开关，应用 null 后两者都被清除。
exports.setColor('think', '#fb923c')
if (cssVariables.has('--dsh-accent-think')) throw new Error('修改思考不应立即写根变量')
if (rootAttributes.has('data-dsh-accent-think')) throw new Error('修改思考不应立即打开开关')
exports.applyDraft()
if (cssVariables.get('--dsh-accent-think') !== '#fb923c') throw new Error('应用后思考变量未写入')
if (!rootAttributes.has('data-dsh-accent-think')) throw new Error('应用后思考开关未打开')
exports.setColor('think', null)
exports.applyDraft()
if (cssVariables.has('--dsh-accent-think')) throw new Error('思考恢复默认后变量未清除')
if (rootAttributes.has('data-dsh-accent-think')) throw new Error('思考恢复默认后开关未关闭')

// 面板作用域：draft 变量只写面板节点，根元素保持已应用值。
const scopeWrites = []
const scope = {
  style: {
    setProperty: (name, value) => scopeWrites.push({ name, value }),
    removeProperty: (name) => scopeWrites.push({ name, value: null })
  }
}
exports.beginDraft()
exports.setPreviewScope(scope)
scopeWrites.length = 0
exports.setColor('bash', '#111111')
if (cssVariables.has('--dsh-accent-bash')) throw new Error('预览取色不应改动根变量')
const scopedBash = scopeWrites.filter((write) => write.name === '--dsh-accent-bash')
if (scopedBash.length !== 1 || scopedBash[0].value !== '#111111') {
  throw new Error('预览取色应写面板作用域: ' + JSON.stringify(scopeWrites))
}
exports.applyDraft()
if (cssVariables.get('--dsh-accent-bash') !== '#111111') throw new Error('应用后根变量未更新')

// 关闭面板：丢弃未应用的 draft，回到已应用配色。
exports.setColor('edit', '#000000')
if (exports.dirtyKeys().length !== 1) throw new Error('修改后应产生未应用键')
exports.discardDraft()
if (exports.getColors().edit !== '#fbbf24') throw new Error('关闭面板后 draft 应回到已应用配色')
if (exports.dirtyKeys().length !== 0) throw new Error('丢弃后不应再有未应用键')
exports.setPreviewScope(null)

// 三位十六进制归一化为六位，色块与 draft 都不再见到三位写法。
if (exports.sanitizeColor('#ABC') !== '#aabbcc') throw new Error('三位十六进制未归一化')
exports.setColor('heading', '#ABC')
if (exports.getColors().heading !== '#aabbcc') throw new Error('三位十六进制未写入 draft')

// 样式表应包含所有分类钩子、应用按钮与无障碍状态文本。
const css = readFileSync(fileURLToPath(new URL('../src/theme.css', import.meta.url)), 'utf8')
for (const selector of [
  "[class*='_markdown'] :is(h1",
  "[class*='_markdown'] :is(strong",
  "[class*='_markdown'] :not(pre) > code",
  "html[data-dsh-accent-think] [data-variant='think']",
  "[data-tool='ask_user_question']",
  "[data-tool='bash']",
  "[data-tool='edit']",
  "[data-tool='write']",
  "[data-tool='read']",
  "[data-tool='grep']",
  "[data-tool='run_code']",
  "[data-tool='todo_write']",
  "[data-tool='skill']",
  "[data-tool^='cordis_']"
]) {
  if (!css.includes(selector)) throw new Error('样式表缺少选择器: ' + selector)
}
for (const fragment of [
  '.dsh-accent-apply',
  '.dsh-accent-apply:disabled',
  '.dsh-accent-preview-actions',
  '.dsh-accent-sr-only',
  'max-height: 220px',
  'position: sticky'
]) {
  if (!css.includes(fragment)) throw new Error('样式表缺少应用按钮/预览规则: ' + fragment)
}

// 模拟客户端上下文执行 apply：样式表应注入、字典应注册、设置页应注册且不抛错。
const registrations = []
const disposers = []
const dictionaryRegistrations = []
const fakeCtx = {
  effect(factory) {
    disposers.push(factory())
  },
  locale: {
    // 官方签名 register(ns, { zh, en, ... })；这里拆成逐语言记录，便于断言。
    register(ns, localeOrDicts, maybeDict) {
      if (typeof localeOrDicts === 'string') {
        dictionaryRegistrations.push({ ns, locale: localeOrDicts, dict: maybeDict })
        return () => {}
      }
      for (const [locale, dict] of Object.entries(localeOrDicts)) {
        dictionaryRegistrations.push({ ns, locale, dict })
      }
      return () => {}
    },
    bind() {
      return (key) => key
    }
  },
  slots: {
    inject(name, callback) {
      if (name === 'settings.section') callback()
    },
    register(options, Component) {
      const registration = { options, Component }
      registrations.push(registration)
      return registration
    }
  }
}
exports.apply(fakeCtx)
if (styleTags.length !== 1) throw new Error('样式表未注入')
if (!String(styleTags[0].cssText).includes("[data-tool='ask_user_question']")) {
  throw new Error('样式表内容不完整')
}
if (dictionaryRegistrations.length !== EXPECTED_LOCALES.length) {
  throw new Error(`字典注册数量不对：${dictionaryRegistrations.length}`)
}
if (dictionaryRegistrations[0].ns !== exports.SETTINGS_NS) throw new Error('字典命名空间不正确')
const registeredLocales = dictionaryRegistrations.map((entry) => entry.locale).sort()
if (JSON.stringify(registeredLocales) !== JSON.stringify(EXPECTED_LOCALES)) {
  throw new Error('注册的字典语言不全: ' + registeredLocales.join(','))
}
if (registrations.length !== 1) throw new Error('设置页未注册')
if (registrations[0].options.id !== 'accent' || registrations[0].options.name !== 'settings.section') {
  throw new Error('设置页注册参数不正确')
}
if (registrations[0].options.locale !== exports.SETTINGS_NS) throw new Error('设置页未声明 locale 命名空间')
if (typeof registrations[0].options.label !== 'function') throw new Error('设置页导航标题应为可随语言刷新的函数')
if (typeof registrations[0].Component !== 'function') throw new Error('设置页组件不是函数组件')
if (typeof disposers[0] !== 'function') throw new Error('样式清理函数缺失')

// 启动恢复：apply 把已应用配色整表写回根元素，并打上接管标记。
if (rootAttributes.get('data-dsh-accent') !== 'on') throw new Error('启动时未标记配色接管')
if (cssVariables.get('--dsh-accent-bash') !== '#111111') throw new Error('启动时未恢复已应用配色')
if (rootAttributes.has('data-dsh-accent-think')) throw new Error('思考默认不应打开覆盖开关')

console.log('OK: 工厂函数、面板结构、暂存/应用、预览作用域与持久化均通过')
console.log('面板文本长度:', text.length)
