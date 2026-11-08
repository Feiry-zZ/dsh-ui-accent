# AGENTS.md

面向 AI 编码助手与维护者的工程说明：构建、测试、打包契约、发布流程。
面向用户的功能说明、配色表、安装与卸载步骤在 [README.md](./README.md)（[English](./README.en.md)），本文件不重复。

## 1. 项目性质

- DSH（DeepSeek Harness）的**客户端 UI 插件**，以 **DSH 组合包（bundle）** 形式发布到 npm：`@feiry-zz/dsh-ui-accent`。
- 纯 ESM + Node 标准库，**没有任何运行时依赖**，也**不使用打包器**：`build.mjs` 只把 `src/theme.css` 内联成字符串，输出 `lib/client.js`。
- `lib/` 是**提交进仓库的构建产物**（DSH 直接从仓库/包里加载它），所以改完 `src/` 必须重建并一起提交，否则源码与产物会脱节。
- 客户端 bundle 走 DSH 的经典脚本契约：`window.__ModuleLoader__.load({ id, factory })`，`id` 必须等于包名。

## 2. 仓库结构

```
dsh-ui-accent/
├─ package.json           # dsh.bundle（组合包补丁）+ dsh.client（platform / inject）
├─ cordis.patch.yml       # 组合包补丁：把自己注册成插件条目
├─ locale/                # 插件管理里展示的标题与描述（8 种语言，来自各语言 meta）
├─ icon.svg               # 插件图标（≤ 256 KiB）
├─ build.mjs              # 把 src/theme.css 内联进 lib/client.js
├─ install.mjs            # 本地链接安装/卸载脚本（跨平台，仅用 Node 标准库）
├─ AGENTS.md              # 本文件
├─ LICENSE                # MIT
├─ src/
│  ├─ client.js           # 客户端插件源码（取色面板 + 配色状态 + 本地化字典）
│  └─ theme.css           # 会话区选择器与设置面板样式（颜色唯一来源）
├─ lib/
│  ├─ index.js            # Host 端：激活日志与启动图自检
│  └─ client.js           # 构建产物（DSH 实际加载的 bundle，禁止手改）
├─ test/                  # 5 个自测，npm test 串行执行
└─ preview/               # 文档配图工具与截图
   ├─ preview.html        # 效果预览页（?lang=en 切换英文）
   ├─ build-panel.mjs     # 把真实设置面板组件渲染成静态页（输出 panel*.html，不入库）
   └─ *.png               # README 配图（入库）
```

## 3. 唯一真源与生成物

| 内容 | 位置 | 规则 |
| --- | --- | --- |
| 颜色、选择器、面板样式 | `src/theme.css` | 唯一来源，不要在 `client.js` 里写死颜色或选择器 |
| 出厂默认色 | `src/client.js` 的 `DEFAULTS` | 改动必须同时处理存储迁移（见第 7 节） |
| 构建产物 | `lib/client.js` | 只能由 `node build.mjs` 生成，**禁止手改** |
| 打包契约 | `package.json` + `cordis.patch.yml` | 见第 5 节 |
| 文档配图 | `preview/*.png` | 由脚本 + 无头 Chrome 生成，入库 |

## 4. 构建与自测

```powershell
node build.mjs                 # src/theme.css → lib/client.js
node --check lib\client.js     # 语法检查
npm test                       # 5 个自测，必须全绿
```

| 测试 | 守住什么 |
| --- | --- |
| `render-test.mjs` | 面板结构、样式注入、颜色写入与持久化；8 套字典键集与 `zh` 完全一致、无空文案与零宽字符 |
| `migration-test.mjs` | `v1 → v3` 存储迁移 |
| `stale-default-test.mjs` | 默认色升级：旧默认不算用户选择，自定义色保留 |
| `schedule-test.mjs` | 拖动取色每帧只写一次 CSS 变量、落盘延后 |
| `package-test.mjs` | 组合包打包契约（`dsh.bundle.patch` / `files` / `exports` / `locale` / `icon` / `prepublishOnly`） |

测试用 React stub 渲染组件，**不要为了测试引入 react / react-dom**（版本容易冲突）。

## 5. 不可破坏的打包契约

1. **名字三处一致**：`package.json#name`、bundle 注册 `id`、`lib/index.js` 的 `PLUGIN_ID` 都必须是 `@feiry-zz/dsh-ui-accent`。
2. **必须声明 `dsh.bundle.patch`**：缺少时 DSH 插件管理会直接拒绝安装（提示「这个包没有声明组合包」）。
3. **`cordis.patch.yml` 里的 `name` 要加引号**：YAML 中 `@` 是保留字符，不加引号解析失败。
4. **`files` 必须覆盖** `lib`、`src`、`cordis.patch.yml`、`locale/*.json`、`icon.svg`、两份 README；`exports` 另需 `./client`、`./icon`、`./locale/*.json`、`./cordis.patch.yml`、`./package.json`。
5. **图标上限 256 KiB**，格式限 SVG / PNG / JPEG / WebP。
6. 以上都由 `test/package-test.mjs` 校验——改完跑测试，不要只靠 `npm publish --dry-run`。

## 6. 国际化

- 8 套字典 `zh / en / ja / es / fr / de / ru / pt` 都在 `src/client.js`，**`zh` 是键集真源**，其余 7 套必须逐键对齐。
- 注册方式：`ctx.locale.register(SETTINGS_NS, DICTS)`，一次传整套；`zh` 与 `en` 必填，其余语言 DSH 侧回落到 `en`。
- 新增文案键时，同一次提交里补齐 8 种语言 + `locale/<lang>.json` 的 `meta`（插件管理的标题与描述）。
- 技术名词保留原文、不翻译：`bash`、`pwsh`、`run_code`、`ask_user_question`、`cordis_*`、`strong` / `b` 等。
- 语言切换靠 slot 的 `t` 随 locale 修订重渲染，不要在组件里缓存翻译结果。

## 7. 存储与迁移

- 存储键 `dsh-accent.colors.v3`，结构 `{ version: 3, colors: {...} }`，**只保存与出厂默认不同的项**（delta-only）。
- 旧信封 `v2` 与扁平 `v1` 在首次加载时迁移；与历史默认相同的值视为「没改过」。
- **改默认色时**：把旧默认登记进 `STALE_DEFAULTS`，否则老用户存下的旧默认会盖住新默认（历史上「其他工具」就这么踩过一次）。
- 迁移链与 stale 逻辑由 `migration-test` / `stale-default-test` 守着，改了行为就补用例。

## 8. 历史命名（不要改）

`--dsh-accent-*` 变量前缀、`html[data-dsh-accent-think]` 开关、`dsh-accent.colors.v3` 存储键都是包名改成 `@feiry-zz/...` 之前的遗留命名，与包名不同属正常。改动会同时影响主题变量和用户已存配置，除非有迁移方案，否则保持原样。

## 9. 性能红线

- 取色器的 `input` 事件里**禁止**同步布局查询（`offsetTop`、`getBoundingClientRect`、`scrollTo`）或写 `localStorage`。
- 颜色变化走 `scheduleVisual`：`requestAnimationFrame` 合并，每帧只写**变化的那一个** CSS 变量。
- 落盘与预览自动滚动走 `scheduleSettle`：取色停顿约 160ms 后才执行。
- `schedule-test.mjs` 断言「每帧一次写 + 落盘延后」，不要绕过它直接调 `applyColors` / `localStorage.setItem`。

## 10. 文档约定

- `README.md` 默认中文，`README.en.md` 英文；两份**逐节对齐**（标题层级、代码块、表格行数、代码令牌一致）。
- 单语版本里**不写「中文 / English」双语对照**：菜单名、按钮名只写本语言的那一个。
- README 只放用户向内容（功能、配色、使用、安装、卸载、许可）；工程流程一律放本文件。
- 占位符统一用 `<repo>` / `<DSH_HOME>`，示例版本号随发版更新。

### 重新生成配图

```powershell
node preview\build-panel.mjs

# 无头截图（把 <repo> 换成本仓库绝对路径）
chrome --headless=new --hide-scrollbars --force-device-scale-factor=2 --window-size=790,1620  --screenshot=preview\panel.png    "file:///<repo>/preview/panel.html"
chrome --headless=new --hide-scrollbars --force-device-scale-factor=2 --window-size=790,1620  --screenshot=preview\panel-en.png "file:///<repo>/preview/panel-en.html"
chrome --headless=new --hide-scrollbars --force-device-scale-factor=2 --window-size=1000,560  --screenshot=preview\preview.png    "file:///<repo>/preview/preview.html"
chrome --headless=new --hide-scrollbars --force-device-scale-factor=2 --window-size=1000,560  --screenshot=preview\preview-en.png "file:///<repo>/preview/preview.html?lang=en"
```

`preview/panel.html`、`panel-en.html` 是生成物，已在 `.gitignore` 里，不入库。

## 11. 提交与发布

- 提交信息用 `<类型>: <说明>`，类型取 `feat` / `fix` / `docs` / `chore`；本仓库为个人项目，不加 Jira 前缀。
- 提交前必须 `npm test` 全绿；`lib/client.js` 与 `src/` 的改动要在同一次提交里。
- 发版步骤：

```powershell
npm pkg get name version      # 确认包名与版本
npm pack --dry-run            # 看打包内容
npm publish                   # prepublishOnly 会自动 build + check + 5 个测试
```

- 发布后到 GitHub 建与版本同名的 tag 的 Release（`v<version>`），Release notes 用中文。
- npm 规则：发布后 **72 小时**内可 `npm unpublish`，之后只能 `npm deprecate`；**被删掉的版本号永久作废**，修正只能发新版本。
- 大陆镜像 `registry.npmmirror.com` 通常几分钟内同步；装不到时用固定版本号 `@x.y.z` 安装。

## 12. 本机环境（Windows）

- PowerShell 5.1 控制台把 UTF-8 中文显示成乱码不影响文件内容；需要校验时用 `[System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)`。
- **不要用 PowerShell 字符串替换改源码**，会改坏标识符；要么整文件重写，要么用 `edit` 工具精确替换。
- `.ps1` 脚本一律存为 UTF-8 with BOM。
