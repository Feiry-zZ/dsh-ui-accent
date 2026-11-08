/**
 * 应用自测：模拟浏览器环境，验证拖动取色只写面板作用域、不写根元素与存储；
 * 用户点「应用」时才一次性写差异键并落盘；关闭面板丢弃未应用的 draft。
 * 独立进程运行，避免与其它测试共享模块缓存。
 */

/** 假的 localStorage。 */
const storage = new Map()
/** 根元素 CSS 变量写入记录。 */
const rootWrites = []
/** 面板作用域 CSS 变量写入记录。 */
const scopeWrites = []
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
        rootWrites.push({ name, value })
      },
      removeProperty(name) {
        rootWrites.push({ name, value: null })
      }
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

/** 面板作用域替身：记录写进面板的变量，便于断言根元素未被污染。 */
const scope = {
  style: {
    setProperty(name, value) {
      scopeWrites.push({ name, value })
    },
    removeProperty(name) {
      scopeWrites.push({ name, value: null })
    }
  }
}

/** 读取某数组里最后一个指定变量的写入。 */
function lastWrite(writes, name) {
  for (let index = writes.length - 1; index >= 0; index -= 1) {
    if (writes[index].name === name) {
      return writes[index]
    }
  }
  return undefined
}

// 模块加载不应写根元素；根只由 apply() 或 applyDraft() 写入。
if (rootWrites.length !== 0) throw new Error('模块加载阶段不应写根变量')

// 面板挂载：从已应用配色开始编辑，并把 draft 变量限定在面板作用域。
exports.beginDraft()
exports.setPreviewScope(scope)
rootWrites.length = 0
scopeWrites.length = 0

// 一次拖动内的连续取色：不写根、不落盘、不排第二个帧。
exports.setColor('bash', '#111111')
exports.setColor('bash', '#222222')
exports.setColor('bash', '#333333')
if (rootWrites.length !== 0) throw new Error('拖动取色不应写根变量')
if (scopeWrites.length !== 0) throw new Error('拖动取色不应立即写面板变量')
if (frameCount !== 1) throw new Error('同一帧内的多次取色应只排一次动画帧')
if (storage.has('dsh-accent.colors.v3')) throw new Error('拖动取色不应落盘')

// 执行这一帧：面板作用域只写一次，值是最后一次取色。
const frame = pendingFrame
pendingFrame = null
frame(16)
if (rootWrites.length !== 0) throw new Error('执行帧后仍不应写根变量')
const bashScopeWrites = scopeWrites.filter((write) => write.name === '--dsh-accent-bash')
if (bashScopeWrites.length !== 1) throw new Error('一帧内应只写一次面板变量，实际 ' + bashScopeWrites.length)
if (bashScopeWrites[0].value !== '#333333') throw new Error('面板变量取值不正确: ' + JSON.stringify(bashScopeWrites[0]))
if (storage.has('dsh-accent.colors.v3')) throw new Error('执行帧后仍不应落盘')

// 差异键：只有 bash 未应用。
const pendingBefore = exports.dirtyKeys()
if (pendingBefore.length !== 1 || pendingBefore[0] !== 'bash') {
  throw new Error('未应用键计算不正确: ' + JSON.stringify(pendingBefore))
}
if (!exports.hasPending(exports.getColors())) throw new Error('存在未应用改动时 hasPending 应为 true')

// 点「应用」：只写差异键一次，并落盘 delta-only。
const appliedKeys = exports.applyDraft()
if (appliedKeys.length !== 1 || appliedKeys[0] !== 'bash') {
  throw new Error('应用键计算不正确: ' + JSON.stringify(appliedKeys))
}
const rootBashWrites = rootWrites.filter((write) => write.name === '--dsh-accent-bash')
if (rootBashWrites.length !== 1) throw new Error('应用时差异键应只写一次，实际 ' + rootBashWrites.length)
if (rootBashWrites[0].value !== '#333333') throw new Error('应用时写入的根变量取值不正确')
const stored = JSON.parse(storage.get('dsh-accent.colors.v3'))
if (stored.version !== 3 || stored.colors.bash !== '#333333') throw new Error('应用后未落盘')
if (stored.colors.other !== undefined) throw new Error('默认色不应写入存储')
if (exports.dirtyKeys().length !== 0) throw new Error('应用后不应再有未应用键')
if (exports.hasPending(exports.getColors())) throw new Error('应用后 hasPending 应为 false')

// 关闭面板：丢弃未应用的 draft，回到已应用配色。
exports.setColor('heading', '#123456')
if (exports.dirtyKeys().length !== 1) throw new Error('修改后应产生未应用键')
exports.discardDraft()
if (exports.getColors().heading !== '#c084fc') throw new Error('关闭面板后 draft 应回到已应用配色')
if (exports.dirtyKeys().length !== 0) throw new Error('丢弃后不应再有未应用键')

// 三位十六进制归一化为六位，色块与 draft 都不再见到 #abc。
if (exports.sanitizeColor('#ABC') !== '#aabbcc') throw new Error('三位十六进制未归一化')
exports.setColor('heading', '#ABC')
if (exports.getColors().heading !== '#aabbcc') throw new Error('三位十六进制未写入 draft')

// 多项差异：应用时每个差异键最多写一次，且一次应用动作完成。
exports.beginDraft()
rootWrites.length = 0
exports.setColor('heading', '#123456')
exports.setColor('edit', '#abcdef')
const multiKeys = exports.applyDraft()
if (multiKeys.length !== 2) throw new Error('多项差异应一次应用: ' + JSON.stringify(multiKeys))
const headingWrites = rootWrites.filter((write) => write.name === '--dsh-accent-heading')
const editWrites = rootWrites.filter((write) => write.name === '--dsh-accent-edit')
if (headingWrites.length !== 1 || editWrites.length !== 1) {
  throw new Error('每个差异键应只写一次: ' + JSON.stringify(rootWrites))
}

// 非法颜色被忽略。
const beforeInvalid = exports.getColors().heading
exports.setColor('heading', 'red')
if (exports.getColors().heading !== beforeInvalid) throw new Error('非法颜色未被忽略')

exports.setPreviewScope(null)
console.log('OK: 拖动只写面板作用域、应用一次写入差异键、关闭丢弃 draft')
