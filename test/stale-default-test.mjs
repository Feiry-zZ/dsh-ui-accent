/**
 * 默认色升级自测：模拟用户已有 v2 存储（整张表落盘，含旧默认的其他工具紫），
 * 验证“没改过的分类跟随新默认、真正改过的分类原样保留”，并落到 v3 存储。
 * 独立进程运行，避免与其它测试共享模块缓存。
 */

/** 假的 localStorage，预置一份 v2 信封数据。 */
const storage = new Map([
  [
    'dsh-accent.colors.v2',
    JSON.stringify({
      version: 2,
      colors: {
        heading: '#c084fc',
        strong: '#f472b6',
        inlineCode: null,
        think: null,
        question: '#f87171',
        bash: '#16457e',
        edit: '#fbbf24',
        write: '#34d399',
        read: '#a5b4fc',
        search: '#38bdf8',
        code: '#a3e635',
        todo: '#e879f9',
        skill: '#fb923c',
        plugin: '#818cf8',
        other: '#c084fc'
      }
    })
  ]
])

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

/** 只提供颜色写入所需的最小 document。 */
globalThis.document = {
  documentElement: {
    style: { setProperty: () => {}, removeProperty: () => {} },
    setAttribute: () => {},
    removeAttribute: () => {}
  }
}

await import(new URL('../lib/client.js', import.meta.url).href)
/** 本测试不渲染组件，React 只需能被 require 到。 */
const ReactStub = {
  createElement: () => null,
  useState: (initial) => [typeof initial === 'function' ? initial() : initial, () => {}],
  useEffect: () => {},
  useRef: (value) => ({ current: value ?? null })
}
const exports = globalThis.__registration.factory((specifier) => {
  if (specifier === 'react') return ReactStub
  throw new Error('bundle 请求了未声明的模块: ' + specifier)
})

const colors = exports.getColors()
if (colors.other !== '#ded7e5') throw new Error('其他工具应跟随新默认 #ded7e5')
if (colors.bash !== '#16457e') throw new Error('用户自选的运行命令颜色被覆盖')
if (colors.think !== null) throw new Error('思考应保持不覆盖')
if (colors.inlineCode !== null) throw new Error('行内代码应保持不覆盖')

const saved = storage.get('dsh-accent.colors.v3')
if (saved === undefined) throw new Error('迁移后未写入 v3 存储')
const envelope = JSON.parse(saved)
if (envelope.version !== 3) throw new Error('v3 信封版本不正确')
if (envelope.colors.bash !== '#16457e') throw new Error('v3 未保留用户自选颜色')
// 与出厂默认相同的分类不落盘，否则下次调默认色又会被旧值挡住。
if ('other' in envelope.colors) throw new Error('默认色不应写入存储')
if ('heading' in envelope.colors) throw new Error('默认色不应写入存储')
if (storage.has('dsh-accent.colors.v2')) throw new Error('旧版存储键未清理')

console.log('OK: 默认色升级（v2 → v3）保留自定义、跟随新默认')
