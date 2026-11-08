import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

/**
 * 本地自测：不依赖浏览器与 React 运行时，验证 client bundle 的工厂函数、
 * 设置面板结构、配色写入与持久化行为。
 * React 只作为最小替身注入，重点校验我们自己的逻辑。
 */

/** 假的 localStorage，用于断言持久化行为。 */
const storage = new Map()
/** 记录写入根元素 CSS 变量的键值。 */
const cssVariables = new Map()
/** 记录根元素属性。 */
const rootAttributes = new Map()

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

/** 记录被注入的 style 标签，便于确认样式随插件生命周期挂载。 */
const styleTags = []

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
  '全部恢复默认'
]) {
  if (!text.includes(label)) throw new Error('设置面板缺少文案: ' + label)
}
if (!text.includes('原色')) throw new Error('思考行缺少“原色”标记')
if (!text.includes('链接蓝')) throw new Error('行内代码缺少“链接蓝”标记')
if (!text.includes('效果预览（全部设置）')) throw new Error('预览标题未列举全部设置')

// 中英文字典键集必须一致，避免切换语言后出现裸键。
const zhKeys = Object.keys(exports.DICTS.zh).sort()
const enKeys = Object.keys(exports.DICTS.en).sort()
if (JSON.stringify(zhKeys) !== JSON.stringify(enKeys)) throw new Error('中英文字典键集不一致')
for (const key of zhKeys) {
  if (!exports.DICTS.zh[key] || !exports.DICTS.en[key]) throw new Error('字典存在空文案: ' + key)
}

// 英文渲染：所有分类与按钮都应显示英文文案。
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
  'Original',
  'Link blue'
]) {
  if (!enText.includes(label)) throw new Error('英文面板缺少文案: ' + label)
}

// 新的出厂默认：思考与行内代码不覆盖（null），技能沿用橙色，其他工具浅烟紫。
if (exports.getColors().think !== null) throw new Error('思考默认应为不覆盖')
if (exports.getColors().inlineCode !== null) throw new Error('行内代码默认应为不覆盖')
if (exports.getColors().skill !== '#fb923c') throw new Error('技能默认色应为橙色')
if (exports.getColors().bash !== '#b0cef2') throw new Error('运行命令默认色应为 #b0cef2')
if (exports.getColors().other !== '#ded7e5') throw new Error('其他工具默认色应为 #ded7e5')

// 写入合法颜色应更新 CSS 变量并持久化。
exports.setColor('heading', '#123456')
if (cssVariables.get('--dsh-accent-heading') !== '#123456') throw new Error('CSS 变量未更新')
const savedEnvelope = JSON.parse(storage.get('dsh-accent.colors.v3'))
if (savedEnvelope.version !== 3 || savedEnvelope.colors.heading !== '#123456') throw new Error('颜色未持久化')
// v3 只落盘改过的分类，默认色不写入，否则以后调整默认色会被旧值挡住。
if (savedEnvelope.colors.other !== undefined) throw new Error('默认色不应写入存储')
if (storage.has('dsh-accent.colors.v2')) throw new Error('旧存储键未清理')

// 非法颜色被忽略。
exports.setColor('heading', 'red')
if (exports.getColors().heading !== '#123456') throw new Error('非法颜色未被忽略')

// 恢复默认后回到默认紫色。
exports.resetColors()
if (exports.getColors().heading !== '#c084fc') throw new Error('重置未恢复默认色')

// 模拟客户端上下文执行 apply：样式表应注入、字典应注册、设置页应完成注册且不抛错。
const registrations = []
const disposers = []
const dictionaryRegistrations = []
const fakeCtx = {
  effect(factory) {
    disposers.push(factory())
  },
  locale: {
    register(ns, locale, dict) {
      dictionaryRegistrations.push({ ns, locale, dict })
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
if (dictionaryRegistrations.length !== 2) throw new Error('中英文字典未各注册一次')
if (dictionaryRegistrations[0].ns !== exports.SETTINGS_NS) throw new Error('字典命名空间不正确')
if (registrations.length !== 1) throw new Error('设置页未注册')
if (registrations[0].options.id !== 'accent' || registrations[0].options.name !== 'settings.section') {
  throw new Error('设置页注册参数不正确')
}
if (registrations[0].options.locale !== exports.SETTINGS_NS) throw new Error('设置页未声明 locale 命名空间')
if (typeof registrations[0].options.label !== 'function') throw new Error('设置页导航标题应为可随语言刷新的函数')
if (typeof registrations[0].Component !== 'function') throw new Error('设置页组件不是函数组件')
if (typeof disposers[0] !== 'function') throw new Error('样式清理函数缺失')

// 思考默认不写变量、不带开关属性，页面保持 DSH 原色。
if (cssVariables.has('--dsh-accent-think')) throw new Error('思考默认不应写入覆盖变量')
if (rootAttributes.has('data-dsh-accent-think')) throw new Error('思考默认不应打开覆盖开关')

// 行内代码默认不写变量，样式表回落到超链接蓝。
if (cssVariables.has('--dsh-accent-inline-code')) throw new Error('行内代码默认不应写入覆盖变量')
exports.setColor('inlineCode', '#4176e6')
if (cssVariables.get('--dsh-accent-inline-code') !== '#4176e6') throw new Error('行内代码取色未写入变量')
exports.setColor('inlineCode', null)
if (cssVariables.has('--dsh-accent-inline-code')) throw new Error('行内代码恢复默认后变量未清除')

// 给思考显式取色后写入变量与开关；恢复默认后两者都被清除。
exports.setColor('think', '#fb923c')
if (cssVariables.get('--dsh-accent-think') !== '#fb923c') throw new Error('思考取色未写入变量')
if (!rootAttributes.has('data-dsh-accent-think')) throw new Error('思考取色未打开开关')
exports.setColor('think', null)
if (cssVariables.has('--dsh-accent-think')) throw new Error('思考恢复默认后变量未清除')
if (rootAttributes.has('data-dsh-accent-think')) throw new Error('思考恢复默认后开关未关闭')

// 拖动取色（live）：变量与面板立即更新，但存储延后到停顿后，避免逐事件写盘。
exports.setColor('bash', '#111111', { live: true })
if (cssVariables.get('--dsh-accent-bash') !== '#111111') throw new Error('拖动取色未即时写入变量')
if (JSON.parse(storage.get('dsh-accent.colors.v3')).colors.bash !== undefined) throw new Error('拖动取色不应立即落盘')
exports.flushPending()
if (JSON.parse(storage.get('dsh-accent.colors.v3')).colors.bash !== '#111111') throw new Error('取色停顿后未落盘')

// 样式表应包含所有分类钩子。
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
// 预览区必须可滚动，否则列举全部设置会撑长设置页。
if (!css.includes('max-height: 220px')) throw new Error('预览区缺少滚动高度限制')
// 预览区必须粘在顶部，配置项滚动时保持可见。
if (!css.includes('position: sticky')) throw new Error('预览区缺少粘性定位')

console.log('OK: 工厂函数、面板结构、颜色写入与持久化均通过')
console.log('面板文本长度:', text.length)
