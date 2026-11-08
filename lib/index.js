import { appendFileSync, mkdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

/** 插件标识：与 package.json 的 name 保持一致，同时用作日志前缀。 */
const PLUGIN_ID = '@feiry-zz/dsh-ui-accent'

/** DSH 主目录：优先读取环境变量，缺省时退回到 ~/.dsh。 */
const DSH_HOME = process.env.DSH_HOME ?? join(homedir(), '.dsh')

/** 激活日志路径：用于确认 Host 侧插件已装载（客户端 bundle 由 dsh-client-modules 单独提供）。 */
const LOG_FILE = join(DSH_HOME, 'logs', 'ui-accent.log')

/**
 * 客户端 bundle 由 dsh-client-modules 扫描 `dsh.client` 后通过 /plugins 路由提供，
 * Host 侧插件只负责成功激活并记录诊断日志，不承载任何界面逻辑。
 */
export const name = PLUGIN_ID

/**
 * Host 侧插件入口：记录激活日志，并在稍后核对客户端 bundle 是否进入启动图。
 * @param ctx - Cordis Host 上下文。
 */
export function apply(ctx) {
  writeLog('host half activated')

  // 启动图在微任务里增量刷新，延迟一拍再读取才能看到本插件刚注册的行。
  setTimeout(() => checkClientRow(ctx), 300)
}

/**
 * 追加一行激活日志；日志目录或文件不可写时静默忽略，绝不影响插件激活。
 * @param message - 日志正文。
 */
function writeLog(message) {
  try {
    mkdirSync(join(DSH_HOME, 'logs'), { recursive: true })
    appendFileSync(LOG_FILE, `[${new Date().toISOString()}] ${message}\n`, 'utf8')
  } catch {
    // 日志只是诊断辅助，写不进去时保持静默。
  }
}

/**
 * 核对客户端启动图里是否已包含本插件的 bundle 行。
 * clientModules 是可选服务：无界面组合（如 headless）下不存在，直接跳过。
 * @param ctx - Cordis Host 上下文。
 */
function checkClientRow(ctx) {
  // cordis 服务通过 ctx.get 读取；能力缺失时返回 undefined。
  const modules = typeof ctx.get === 'function' ? ctx.get('clientModules') : undefined
  if (modules === undefined || typeof modules.graph !== 'function') {
    writeLog('client module registry absent (headless composition)')
    return
  }
  try {
    // 启动图按模块依赖排序，逐行查找本插件。
    const row = modules.graph().entries.find((entry) => entry.id === PLUGIN_ID)
    writeLog(row === undefined ? 'client bundle row missing' : `client bundle ready rev=${row.rev}`)
  } catch (error) {
    writeLog(`client bundle check failed: ${String(error)}`)
  }
}
