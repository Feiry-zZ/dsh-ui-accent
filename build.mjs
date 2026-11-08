import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * 构建脚本：把 src/theme.css 内联进 src/client.js，产出 lib/client.js。
 * client bundle 必须是“经典脚本”（window.__ModuleLoader__.load），
 * 因此不做模块打包，只做一次占位符替换。
 */

/** 工程根目录。 */
const root = dirname(fileURLToPath(import.meta.url))
/** 样式源文件。 */
const cssPath = join(root, 'src', 'theme.css')
/** client bundle 模板。 */
const templatePath = join(root, 'src', 'client.js')
/** 输出文件。 */
const outputPath = join(root, 'lib', 'client.js')
/** 样式占位符。 */
const marker = '__THEME_CSS__'

const css = readFileSync(cssPath, 'utf8')
const template = readFileSync(templatePath, 'utf8')

// 模板缺少占位符说明构建输入被改坏了，直接失败避免产出错误 bundle。
if (!template.includes(marker)) {
  throw new Error(`build: ${templatePath} 中找不到占位符 ${marker}`)
}

mkdirSync(dirname(outputPath), { recursive: true })
// 用函数形式替换，避免 CSS 里的 $& 等字符被当作替换模式。
const output = template.replace(marker, () => JSON.stringify(css))
writeFileSync(outputPath, output, 'utf8')

console.log(`build: 已生成 ${outputPath}（CSS ${css.length} 字符）`)
