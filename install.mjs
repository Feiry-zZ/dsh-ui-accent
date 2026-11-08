#!/usr/bin/env node
import { copyFileSync, existsSync, lstatSync, mkdirSync, readFileSync, readlinkSync, realpathSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * 跨平台安装/卸载脚本（Windows / macOS / Linux 通用）。
 *
 * 只做两件事：
 *   1. 在 DSH profile 的 node_modules 下建一个指向本仓库的目录链接
 *      （Windows 用 junction，macOS / Linux 用符号链接）；
 *   2. 把插件登记到 profile 的 cordis.patch.yml，由 Loader 热加载。
 *
 * 用法：
 *   node install.mjs              安装
 *   node install.mjs --uninstall  卸载（删除 patch 条目与目录链接）
 */

/** 插件包名：与 package.json 的 name 一致。 */
const PACKAGE_NAME = 'dsh-ui-accent'

/** 重命名前的旧包名：仅用于提示残留。 */
const LEGACY_PACKAGE_NAME = 'dsh-client-ui-accent'

/** patch 条目 id：与 cordis.patch.yml 里的 `- id:` 对应。 */
const ENTRY_ID = 'ui-accent'

/** 本仓库根目录：脚本所在目录。 */
const PLUGIN_ROOT = dirname(fileURLToPath(import.meta.url))

/** DSH 主目录：可用 DSH_HOME 环境变量覆盖。 */
const DSH_HOME = process.env.DSH_HOME ?? join(homedir(), '.dsh')

/** desktop profile 目录。 */
const PROFILE_DIR = join(DSH_HOME, 'profiles', 'desktop')

/** profile 的 node_modules。 */
const NODE_MODULES_DIR = join(PROFILE_DIR, 'node_modules')

/** 目录链接路径。 */
const LINK_PATH = join(NODE_MODULES_DIR, PACKAGE_NAME)

/** 旧版目录链接路径。 */
const LEGACY_LINK_PATH = join(NODE_MODULES_DIR, LEGACY_PACKAGE_NAME)

/** profile 补丁文件。 */
const PATCH_FILE = join(PROFILE_DIR, 'cordis.patch.yml')

/** 修改补丁前的备份后缀。 */
const BACKUP_SUFFIX = '.bak'

/** 是否为卸载模式。 */
const UNINSTALL = process.argv.includes('--uninstall')

/** 打印一行进度。 */
function log(message) {
  console.log(message)
}

/**
 * 检查路径当前的状态：缺失、真实目录、还是目录链接。
 * 悬空链接（目标已被移动或删除）也能识别出来，避免误判为“不存在”。
 * @param path - 待检查的路径。
 * @returns {{ kind: 'missing' | 'directory' | 'link', resolved?: string, raw?: string }} 状态描述。
 */
function inspectPath(path) {
  try {
    const stat = lstatSync(path)
    if (!stat.isSymbolicLink()) {
      return { kind: 'directory' }
    }
    const raw = readlinkSync(path)
    // 链接目标存在时拿到规范路径；悬空链接退回原始目标字符串。
    let resolved = raw
    try {
      resolved = realpathSync(path)
    } catch {
      resolved = raw
    }
    return { kind: 'link', resolved, raw }
  } catch {
    return { kind: 'missing' }
  }
}

/** 创建指向本仓库的目录链接：Windows 用 junction，其余平台用符号链接。 */
function createLink() {
  mkdirSync(NODE_MODULES_DIR, { recursive: true })
  // junction 只在 Windows 生效，其他平台会忽略该类型并创建普通符号链接。
  symlinkSync(PLUGIN_ROOT, LINK_PATH, 'junction')
  log(`已创建目录链接：${LINK_PATH} -> ${PLUGIN_ROOT}`)
}

/** 删除目录链接；拒绝删除真实目录，避免误删用户文件。 */
function removeLink() {
  const state = inspectPath(LINK_PATH)
  if (state.kind !== 'link') {
    throw new Error(`${LINK_PATH} 不是目录链接，已跳过删除；请手动确认`)
  }
  unlinkSync(LINK_PATH)
  log(`已删除目录链接：${LINK_PATH}`)
}

/**
 * 判断补丁文件里是否已登记本插件。
 * @param text - 补丁文件全文。
 * @returns 已登记返回 true。
 */
function hasEntry(text) {
  return new RegExp(`^\\s*-\\s*id:\\s*${ENTRY_ID}\\s*$`, 'm').test(text)
}

/** 生成要追加的补丁片段。 */
function entrySnippet() {
  return [
    '',
    '# 界面配色插件：结果标题/加粗/行内代码/思考/提问与各类工具行取色，设置侧边栏提供取色面板。',
    `# 本地包经 profile 的 node_modules 链接解析（目标：${PLUGIN_ROOT}）。`,
    '- insert:',
    `    - id: ${ENTRY_ID}`,
    `      name: ${PACKAGE_NAME}`,
    ''
  ].join('\n')
}

/**
 * 从补丁全文里删除本插件的 insert 块（含上方的说明注释）。
 * @param text - 补丁文件全文。
 * @returns {{ text: string, removed: boolean }} 处理后的全文与是否删除。
 */
function stripEntry(text) {
  const lines = text.split(/\r?\n/)
  const idIndex = lines.findIndex((line) => new RegExp(`^\\s*-\\s*id:\\s*${ENTRY_ID}\\s*$`).test(line))
  if (idIndex === -1) {
    return { text, removed: false }
  }
  // 向上找到承载该条目的 `- insert:`，最多回溯几行说明注释。
  let start = idIndex
  for (let i = idIndex - 1; i >= 0 && i >= idIndex - 4; i -= 1) {
    if (/^- insert:\s*$/.test(lines[i])) {
      start = i
      break
    }
  }
  // 连同紧邻上方的说明注释一起删除。
  while (start > 0 && /^#/.test(lines[start - 1])) {
    start -= 1
  }
  // 向下吞掉该块的所有缩进行（条目 name / config 等）。
  let end = idIndex + 1
  while (end < lines.length && /^\s+\S/.test(lines[end])) {
    end += 1
  }
  const rest = [...lines.slice(0, start), ...lines.slice(end)]
  // 收掉删除后可能出现的连续空行。
  const cleaned = rest.join('\n').replace(/\n{3,}/g, '\n\n')
  return { text: cleaned, removed: true }
}

/** 安装：建链接 + 登记补丁，可重复执行。 */
function install() {
  const state = inspectPath(LINK_PATH)
  if (state.kind === 'directory') {
    throw new Error(`${LINK_PATH} 已存在且是真实目录，请先确认并手动删除`)
  }
  if (state.kind === 'link') {
    const pointsToRepo = state.resolved === realpathSync(PLUGIN_ROOT) || state.raw === PLUGIN_ROOT
    if (!pointsToRepo) {
      throw new Error(`${LINK_PATH} 已存在且指向别处（${state.raw}），请先确认并手动删除`)
    }
    log(`目录链接已存在：${LINK_PATH}`)
  } else {
    createLink()
  }
  if (existsSync(LEGACY_LINK_PATH)) {
    log(`提示：检测到旧版目录链接，可手动删除：${LEGACY_LINK_PATH}`)
  }
  const patchText = existsSync(PATCH_FILE) ? readFileSync(PATCH_FILE, 'utf8') : ''
  if (hasEntry(patchText)) {
    log(`cordis.patch.yml 已登记 ${PACKAGE_NAME}`)
  } else {
    writeFileSync(PATCH_FILE, patchText + entrySnippet(), 'utf8')
    log(`已向 ${PATCH_FILE} 追加插件补丁`)
  }
  const verify = readFileSync(PATCH_FILE, 'utf8')
  if (!hasEntry(verify)) {
    throw new Error('补丁写入后未找到插件条目，请检查 cordis.patch.yml')
  }
  log('')
  log('安装完成。打开 设置 → 界面配色 / Accent colors 即可取色。')
  log('若设置里还没有这一项，刷新一次界面（Ctrl+R / Cmd+R）。')
  log(`激活日志：${join(DSH_HOME, 'logs', 'ui-accent.log')}`)
}

/** 卸载：删除链接 + 移除补丁条目，可重复执行。 */
function uninstall() {
  if (inspectPath(LINK_PATH).kind === 'link') {
    removeLink()
  } else {
    log(`目录链接不存在，跳过：${LINK_PATH}`)
  }
  if (!existsSync(PATCH_FILE)) {
    log(`补丁文件不存在，跳过：${PATCH_FILE}`)
    return
  }
  const patchText = readFileSync(PATCH_FILE, 'utf8')
  const result = stripEntry(patchText)
  if (!result.removed) {
    log(`cordis.patch.yml 未登记 ${PACKAGE_NAME}，无需移除`)
  } else {
    copyFileSync(PATCH_FILE, PATCH_FILE + BACKUP_SUFFIX)
    writeFileSync(PATCH_FILE, result.text, 'utf8')
    log(`已从 cordis.patch.yml 移除插件条目（备份：${PATCH_FILE}${BACKUP_SUFFIX}）`)
  }
  log('')
  log('卸载完成。设置面板需刷新界面（Ctrl+R / Cmd+R）后才会消失。')
}

// profile 不存在说明没装过 DSH，直接报错而不是凭空建目录。
if (!existsSync(PROFILE_DIR)) {
  console.error(`找不到 desktop profile：${PROFILE_DIR}`)
  console.error('请先启动一次 DSH，或用 DSH_HOME 指定正确的 DSH 主目录。')
  process.exit(1)
}

log(`插件目录：${PLUGIN_ROOT}`)
log(`DSH 主目录：${DSH_HOME}`)
try {
  if (UNINSTALL) {
    uninstall()
  } else {
    install()
  }
} catch (error) {
  // 只输出可读的失败原因，不抛整段堆栈。
  console.error(`\n错误：${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
}
