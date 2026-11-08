/**
 * 迁移自测：模拟用户已有一份 v1 扁平配色（含旧默认值），
 * 验证加载后旧默认被丢弃、用户自定义保留、并以 v3 信封重新落盘。
 * 独立进程运行，避免与 render-test 共享模块缓存。
 */

/** 假的 localStorage，预置 v1 数据。 */
const storage = new Map([
  [
    'dsh-accent.colors.v1',
    JSON.stringify({
      heading: '#123456',
      think: '#fb923c',
      skill: '#2dd4bf',
      other: '#c084fc'
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
/** 迁移测试不渲染组件，React 只需能被 require 到。 */
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
if (colors.heading !== '#123456') throw new Error('用户自定义颜色未保留')
if (colors.think !== null) throw new Error('旧版默认橙色应迁移为“原色”')
if (colors.skill !== '#fb923c') throw new Error('旧版默认青色应迁移为新默认橙色')
if (colors.other !== '#ded7e5') throw new Error('旧版默认紫色应迁移为新默认 #ded7e5')

const saved = storage.get('dsh-accent.colors.v3')
if (saved === undefined) throw new Error('迁移后未写入 v3 存储')
const envelope = JSON.parse(saved)
if (envelope.version !== 3) throw new Error('v3 信封版本不正确')
if (envelope.colors.heading !== '#123456') throw new Error('v3 未保留自定义颜色')
// 迁移后只保留“改过的项”，等值于新默认的分类不该出现在存储里。
if ('skill' in envelope.colors) throw new Error('迁移后仍把默认色写进存储')
if ('other' in envelope.colors) throw new Error('迁移后仍把默认色写进存储')
if (storage.has('dsh-accent.colors.v1')) throw new Error('旧版存储键未清理')

console.log('OK: v1 → v3 配色迁移通过')
