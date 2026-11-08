import { readFileSync, statSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * 打包契约自测：DSH 的「插件管理」只接受声明了组合包（`dsh.bundle.patch`）的包，
 * 且 git 依赖按 `files` 过滤内容——补丁、locale、图标缺一不可。
 * 这里把这几条固定下来，避免以后改 package.json 又把安装路径弄坏。
 */

/** 仓库根目录。 */
const root = dirname(dirname(fileURLToPath(import.meta.url)))

/** 读取 JSON 文件。 */
function readJson(relativePath) {
  return JSON.parse(readFileSync(join(root, relativePath), 'utf8'))
}

/** 断言，失败即退出。 */
function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

const manifest = readJson('package.json')

// 1. 组合包声明：没有它，插件管理会报「这个包没有声明组合包」。
assert(manifest.dsh !== undefined && manifest.dsh.bundle !== undefined, 'package.json 缺少 dsh.bundle 声明')
assert(typeof manifest.dsh.bundle.patch === 'string', 'dsh.bundle.patch 必须是字符串路径')
assert(existsSync(join(root, manifest.dsh.bundle.patch)), `组合包补丁文件不存在：${manifest.dsh.bundle.patch}`)

// 2. 补丁内容：必须插入插件自己，id / name 与包名一致。
const patchText = readFileSync(join(root, manifest.dsh.bundle.patch), 'utf8')
assert(/-\s*insert:/.test(patchText), '组合包补丁缺少 insert 块')
assert(new RegExp(`-\\s*id:\\s*ui-accent`).test(patchText), '组合包补丁缺少 id: ui-accent')
assert(patchText.includes(`name: ${manifest.name}`), `组合包补丁的 name 必须是 ${manifest.name}`)

// 3. 客户端半声明的保留：插件管理安装后仍要能找到客户端 bundle。
assert(manifest.dsh.client !== undefined, 'package.json 缺少 dsh.client 声明')
assert(manifest.dsh.client.platform === 'web', 'dsh.client.platform 应为 web')

// 4. files 覆盖运行期所需文件（git 依赖按 files 过滤）。
const files = manifest.files ?? []
for (const entry of ['lib', 'cordis.patch.yml', 'locale/*.json', 'icon.svg']) {
  assert(files.includes(entry), `files 缺少 ${entry}`)
}
// lib/ 下必须真的有产物，否则安装后没有可执行代码。
assert(existsSync(join(root, 'lib', 'index.js')), 'lib/index.js 不存在，请先执行 node build.mjs')
assert(existsSync(join(root, 'lib', 'client.js')), 'lib/client.js 不存在，请先执行 node build.mjs')

// 5. exports 暴露 locale 与图标，插件管理靠它们展示标题 / 描述 / 图标。
const exportsField = manifest.exports ?? {}
assert(exportsField['./locale/*.json'] !== undefined, 'exports 缺少 ./locale/*.json')
assert(exportsField['./icon'] !== undefined, 'exports 缺少 ./icon')
assert(exportsField['./client'] !== undefined, 'exports 缺少 ./client')

// 6. 两种语言的展示元数据都要有标题与描述。
for (const lang of ['zh', 'en']) {
  const locale = readJson(join('locale', `${lang}.json`))
  assert(typeof locale.meta?.title === 'string' && locale.meta.title.length > 0, `locale/${lang}.json 缺少 meta.title`)
  assert(
    typeof locale.meta?.description === 'string' && locale.meta.description.length > 0,
    `locale/${lang}.json 缺少 meta.description`
  )
}

// 7. 图标必须是合法 SVG 且不超过 256 KiB。
const iconPath = join(root, 'icon.svg')
const iconSize = statSync(iconPath).size
assert(iconSize <= 256 * 1024, `图标超过 256 KiB：${iconSize} 字节`)
assert(readFileSync(iconPath, 'utf8').trimStart().startsWith('<svg'), '图标不是 SVG')

// 8. 基础包信息。
assert(manifest.name === 'dsh-ui-accent', `包名应为 dsh-ui-accent，实际 ${manifest.name}`)
assert(typeof manifest.version === 'string' && manifest.version.length > 0, '缺少 version')
assert(manifest.license === 'MIT', 'license 应为 MIT')

console.log('OK: 组合包打包契约（bundle patch / files / exports / locale / icon）通过')
