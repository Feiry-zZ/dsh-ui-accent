# dsh-ui-accent · DSH 界面配色插件

[English](./README.en.md) | 简体中文

给 DeepSeek Harness（DSH）的会话区按语义着色，并在「设置 → 界面配色」里逐项取色。颜色修改即时生效，保存在本机浏览器（`localStorage`），不写入 `settings.yaml`。

插件以 **DSH 组合包（bundle）** 形式发布到 npm：`@feiry-zz/dsh-ui-accent`。在 DSH 的插件管理里填包名即可安装，Windows / macOS / Linux 通用。

界面文案跟随 DSH 通用设置的语言（`locale` 服务，覆盖 DSH 支持的全部 8 种语言），效果预览列举全部 15 项设置，并在固定高度内独立滚动。

![效果预览](./preview/preview.png)

设置面板：预览区高 220px、粘在内容区顶部；下方配置项滚动时预览始终可见，改色即时对照。

![设置面板](./preview/panel.png)

## 特性

- **按语义着色**：结果标题（Markdown 标题）、加粗文字、行内代码、思考、提问，以及运行命令 / 编辑 / 写入 / 读取 / 搜索 / 代码 / 任务 / 技能 / 插件 / 其他工具共 15 类。
- **拖动即时预览**：取色器拖动时颜色变化合并到每帧一次写 CSS 变量，只写变化的那一个变量；落盘与预览滚动延后到取色停顿后，拖动跟手不卡顿。
- **跟随 DSH 语言**：向 `locale` 服务注册 `settings.uiAccent` 命名空间，覆盖 DSH 支持的全部 8 种语言——中文 / English / 日本語 / Español / Français / Deutsch / Русский / Português，切换语言后面板与侧边栏标题即时更新。
- **默认值可演进**：存储只保存「与出厂默认不同」的项，插件调整默认色时，没动过的分类自动跟随新默认。
- **主题友好**：思考与行内代码默认不覆盖，分别沿用 DSH 原色灰和超链接蓝，跟随深浅色主题。

## 默认配色

| 分类 | 作用对象 | 默认色 |
| --- | --- | --- |
| 结果标题 | Markdown 一至六级标题 | `#c084fc` 紫 |
| 加粗文字 | Markdown `strong` / `b` | `#f472b6` 粉 |
| 行内代码 | Markdown 行内代码（含链接、文件引用） | 与超链接同色（`--dsw-alias-state-business-primary`，跟随主题） |
| 思考 | `data-variant="think"` 推理行（标题、图标、摘要、展开正文） | 不覆盖，跟随 DSH 主题原色（灰） |
| 提问 | `data-tool="ask_user_question"` 行 | `#f87171` 红 |
| 运行命令 | `bash` / `pwsh` | `#b0cef2` 浅蓝 |
| 编辑 | `edit` | `#fbbf24` 琥珀 |
| 写入 | `write` | `#34d399` 绿 |
| 读取 | `read` / `web_fetch` | `#a5b4fc` 靛 |
| 搜索 | `grep` / `glob` / `web_search` | `#38bdf8` 天蓝 |
| 代码 | `run_code` | `#a3e635` 黄绿 |
| 任务 | `todo_write` | `#e879f9` 品红 |
| 技能 | `skill` | `#fb923c` 橙 |
| 插件 | `cordis_*` 系列 | `#818cf8` 蓝紫 |
| 其他工具 | 未单独列出的工具 | `#ded7e5` 浅烟紫 |

所有分类都可以单独修改，也可以一键「全部恢复默认」。其中：

- **行内代码**默认标注「链接蓝」：与 DSH 超链接共用同一个 `--dsw-alias-state-business-primary` 令牌（深色 `#679efe`、浅色 `#4176e6`），普通行内代码、链接形式的行内代码、文件引用统一显示为蓝色，并随主题自动适配；取色后改为所选颜色，点「默认」回到链接蓝。
- **思考**默认标注「原色」：不覆盖，跟随 DSH 主题灰阶；取色后按所选颜色显示，点「默认」回到原色。

## 使用

1. 打开 DSH 的 **设置**，左侧导航出现 **界面配色 / Accent colors**。
2. 点击任意分类的色块或直接输入十六进制色值，会话区立即变色。
3. 选择保存在浏览器 `localStorage`；行内代码默认跟随主题的链接蓝，其余自定义色在切换深浅色主题时保持不变。
4. 面板顶部的「效果预览（全部设置）」列举全部 15 项设置，高 220px、内部可滚动，并**粘在设置内容区顶部**；向下滚动配置项时预览始终可见。
5. 给某个分类取色后，预览会自动滚到该分类的样例行，改色效果立即可见。

> 若设置里暂时看不到「界面配色」，刷新一次界面（`Ctrl+R`）即可。

## 安装

插件以 **DSH 组合包（bundle）** 形式发布到 npm：**`@feiry-zz/dsh-ui-accent`**。两种安装方式任选其一。

### 方式一：插件管理安装（推荐，任何平台）

在 DSH 的 **设置 → 插件 → 安装** 里填入 npm 包名：

```
@feiry-zz/dsh-ui-accent
```

也可以填 `@feiry-zz/dsh-ui-accent@0.3.0` 固定版本，或填 Git 仓库地址（`https://github.com/Feiry-zZ/dsh-ui-accent.git`）从源码安装。DSH 会把组合包补丁（`cordis.patch.yml`）叠加到 profile，插件随之激活；装完刷新界面（`Ctrl+R` / `Cmd+R`）即可在设置里看到「界面配色」。整个过程不需要 Node，也不需要手动建链接。

### 方式二：本地链接安装（改代码时用）

适合在仓库里直接改代码、靠 HMR 看效果：

```bash
git clone git@github.com:Feiry-zZ/dsh-ui-accent.git
cd dsh-ui-accent
node install.mjs
```

脚本只用 Node 标准库，**Windows / macOS / Linux 通用**，在 `<DSH_HOME>/profiles/desktop` 下做两件事（`<DSH_HOME>` 默认 `~/.dsh`，可用环境变量覆盖）：

1. 在 `node_modules/@feiry-zz/dsh-ui-accent` 建一个指向本仓库的目录链接——Windows 用 junction，macOS / Linux 用符号链接；
2. 在 profile 的 `cordis.patch.yml` 追加插件登记：

```yaml
- insert:
    - id: ui-accent
      name: '@feiry-zz/dsh-ui-accent'
```

不想用脚本也可以手动做等价的两步：

```bash
# Windows（CMD / PowerShell 均可；带 scope 的包要先建好父目录）
mkdir "%USERPROFILE%\.dsh\profiles\desktop\node_modules\@feiry-zz"
mklink /J "%USERPROFILE%\.dsh\profiles\desktop\node_modules\@feiry-zz\dsh-ui-accent" "D:\path\to\dsh-ui-accent"

# macOS / Linux
mkdir -p ~/.dsh/profiles/desktop/node_modules/@feiry-zz
ln -s "$(pwd)" ~/.dsh/profiles/desktop/node_modules/@feiry-zz/dsh-ui-accent
```

然后把上面那段 YAML 追加到 profile 的 `cordis.patch.yml` 末尾。

> ⚠️ 两种方式互斥：通过插件管理装过之后不要再运行 `install.mjs`，否则会重复注册 `ui-accent` 条目；切换方式前先卸载。

Host 端激活后会写一行日志到 `<DSH_HOME>/logs/ui-accent.log`，可用于确认加载状态：

```
[2026-11-03T06:03:04.391Z] host half activated
[2026-11-03T06:03:04.697Z] client bundle ready rev=f96bd4d53c1a
```

（上述为首次装载时的示例；之后客户端 bundle 的改动由 `@deepseek-ai/dsh-client-hmr` 直接热重载，不再写 Host 日志。）

## 目录结构

```
dsh-ui-accent/
├─ package.json           # dsh.bundle（组合包补丁）+ dsh.client（platform: web / inject）
├─ cordis.patch.yml       # 组合包补丁：把自己注册成插件条目
├─ locale/                # 插件管理里展示的标题与描述（8 种语言）
├─ icon.svg               # 插件图标
├─ build.mjs              # 把 src/theme.css 内联进 lib/client.js
├─ install.mjs            # 本地链接安装/卸载脚本（跨平台，仅用 Node 标准库）
├─ LICENSE                # MIT 许可
├─ src/
│  ├─ client.js           # 客户端插件源码（取色面板 + 配色状态）
│  └─ theme.css           # 会话区选择器与设置面板样式（颜色唯一来源）
├─ lib/
│  ├─ index.js            # Host 端：激活日志与启动图自检
│  └─ client.js           # 构建产物（DSH 实际加载的 bundle）
├─ test/
│  ├─ render-test.mjs        # 面板结构 / 样式注入 / 颜色写入与持久化
│  ├─ migration-test.mjs     # v1 → v3 配色存储迁移
│  ├─ stale-default-test.mjs # 默认色升级：旧默认不算用户选择
│  ├─ schedule-test.mjs      # 拖动取色的帧合并与延后落盘
│  └─ package-test.mjs       # 组合包打包契约（bundle / files / exports / icon）
└─ preview/
   ├─ preview.html        # 效果预览页（?lang=en 切换英文）
   ├─ build-panel.mjs     # 把真实设置面板组件渲染成静态页，供截图使用
   └─ *.png               # README 配图
```

## 修改与调试

`src/theme.css` 是颜色与选择器的唯一来源，`src/client.js` 里的 `DEFAULTS` 是出厂默认色。修改后：

```powershell
node build.mjs                   # 生成 lib/client.js
node --check lib\client.js       # 语法检查
node test\render-test.mjs        # 以下五个自测都应当输出 OK
node test\migration-test.mjs
node test\stale-default-test.mjs
node test\schedule-test.mjs
node test\package-test.mjs
```

重新生成文档配图（需要 Chrome）：

```powershell
# 1. 用真实的面板组件渲染静态页（中英文各一份）
node preview\build-panel.mjs

# 2. 无头模式截图（把 <repo> 换成本仓库的绝对路径）
chrome --headless=new --hide-scrollbars --force-device-scale-factor=2 --window-size=790,1620  --screenshot=preview\panel.png    "file:///<repo>/preview/panel.html"
chrome --headless=new --hide-scrollbars --force-device-scale-factor=2 --window-size=790,1620  --screenshot=preview\panel-en.png "file:///<repo>/preview/panel-en.html"
chrome --headless=new --hide-scrollbars --force-device-scale-factor=2 --window-size=1000,560  --screenshot=preview\preview.png    "file:///<repo>/preview/preview.html"
chrome --headless=new --hide-scrollbars --force-device-scale-factor=2 --window-size=1000,560  --screenshot=preview\preview-en.png "file:///<repo>/preview/preview.html?lang=en"
```

bundle 内容变化会被 `@deepseek-ai/dsh-client-hmr` 检测到并自动重载该插件；只改 CSS 也会走同一条链路。

## 发布（维护者）

包名 `@feiry-zz/dsh-ui-accent` 带 scope，**发布前需要先有 npm 组织 `feiry-zz`**（npmjs.com → Organizations → 新建），且发布账号是组织成员；否则 `npm publish` 会返回 403。

```powershell
npm pkg get name version        # 确认包名与版本
npm pack --dry-run             # 看打包内容（lib / locale / icon / cordis.patch.yml）
npm publish --dry-run          # 干跑
npm publish --access public    # 正式发布（prepublishOnly 会自动构建 + 跑 5 个自测）
```

版本号只影响「插件管理 → 检查更新」的比较，与 DSH 版本无关。注意 npm 发布 24 小时内才可以 `npm unpublish`，之后只能 `npm deprecate`。

## 存储与兼容性

- 存储键 `dsh-accent.colors.v3`，结构为 `{ version: 3, colors: {...} }`，只保存与出厂默认不同的分类。
- 旧版 `v2` 信封与 `v1` 扁平配色会在首次加载时自动迁移；其中与历史默认相同的项（思考旧橙 `#fb923c`、技能旧青 `#2dd4bf`、其他工具旧紫 `#c084fc`）视为「没改过」，交给当前默认处理，其余自定义色原样保留。
- 内部 CSS 变量前缀 `--dsh-accent-*`、思考覆盖开关 `html[data-dsh-accent-think]` 保留历史命名，与包名不同属正常。
- 选择器依赖 DSH 稳定的 DOM 契约：工具行的 `data-tool` / `data-variant`、思考行的 `data-variant="think"`、Markdown 根类的 `_markdown` 前缀。DSH 大版本升级后若某类行不再变色，优先核对这些钩子并更新 `src/theme.css`。

## 卸载

- **插件管理安装**：在 **设置 → 插件** 里卸载本组合包（会连同它注册的插件条目一起移除）。
- **本地链接安装**：`node install.mjs --uninstall`（删链接并从 profile 的 `cordis.patch.yml` 移除条目，改动前备份为 `.bak`）。

两种方式都需要刷新界面（`Ctrl+R` / `Cmd+R`）才能让设置面板消失：Host 侧立即卸载，但设置页与配色样式由客户端 bundle 注册。

不想用脚本就手动做等价的两步：

1. 从 `cordis.patch.yml` 删除 `ui-accent` 的 `insert` 块（连同上方两行注释）；
2. 删除目录链接：

```bash
# macOS / Linux
rm ~/.dsh/profiles/desktop/node_modules/@feiry-zz/dsh-ui-accent

# Windows（CMD）
rmdir "%USERPROFILE%\.dsh\profiles\desktop\node_modules\@feiry-zz\dsh-ui-accent"
```

已取色的配色保存在浏览器 `localStorage`，卸载不会清除，重装后自动恢复。

## 许可

[MIT](./LICENSE) © 2026 Feiry-zZ

可以自由使用、修改、分发（含商用），保留版权声明与许可声明即可。
