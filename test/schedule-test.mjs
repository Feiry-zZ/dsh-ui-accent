/**
 * 帧合并自测：模拟浏览器环境（有 requestAnimationFrame），验证拖动取色的高频事件
 * 只排一次帧、只写一次 CSS 变量，并且存储延后到停顿（flushPending）之后。
 * 独立进程运行，避免与其它测试共享模块缓存。
 */

/** 假的 localStorage。 */
const storage = new Map()
/** 记录 CSS 变量写入：拖动期间应保持为空。 */
const writes = []
/** 已排期的动画帧回调。 */
let pendingFrame = null
/** 累计排帧次数。 */
let frameCount = 0

globalThis.window = {
  localStorage: {
    getItem: (key) => (storage.has(key) ? storage.get(key) : null),
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: (key) => storage.delete(key)
  },
  requestAnimationFrame(callback) {
    frameCount += 1
    pendingFrame = callback
    return frameCount
  },
  cancelAnimationFrame() {
    pendingFrame = null
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
      setProperty(name, value) {
        writes.push({ name, value })
      },
      removeProperty() {}
    },
    setAttribute() {},
    removeAttribute() {}
  }
}

await import(new URL('../lib/client.js', import.meta.url).href)
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

/** 读取已落盘的配色表，未写入时返回空对象。 */
function readStored() {
  const raw = storage.get('dsh-accent.colors.v3')
  return raw === undefined ? {} : JSON.parse(raw).colors
}

// 一次拖动内的连续取色：不应逐事件写变量，也不排第二个帧。
exports.setColor('bash', '#111111', { live: true })
exports.setColor('bash', '#222222', { live: true })
exports.setColor('bash', '#333333', { live: true })
if (writes.length !== 0) throw new Error('拖动取色不应逐事件写 CSS 变量')
if (frameCount !== 1) throw new Error('同一帧内的多次取色应只排一次动画帧')
if (readStored().bash !== undefined) throw new Error('拖动取色不应立即落盘')

// 执行这一帧：只写一次变量，且是最后一次取色的值。
const frame = pendingFrame
pendingFrame = null
frame(16)
if (writes.length !== 1) throw new Error('一帧内应只写一次 CSS 变量，实际 ' + writes.length)
if (writes[0].name !== '--dsh-accent-bash' || writes[0].value !== '#333333') {
  throw new Error('写入的变量或取值不正确: ' + JSON.stringify(writes[0]))
}
if (readStored().bash !== undefined) throw new Error('落盘应留到取色停顿之后')

// 停顿：落盘最终颜色。
exports.flushPending()
if (readStored().bash !== '#333333') throw new Error('取色停顿后未落盘最终颜色')

// 一次性操作（默认按钮、输入框提交）仍然同步写变量。
exports.setColor('heading', '#123456')
if (writes.length !== 2 || writes[1].value !== '#123456') throw new Error('一次性取色应同步写变量')

console.log('OK: 拖动取色合并到每帧一次、落盘延后到停顿')
