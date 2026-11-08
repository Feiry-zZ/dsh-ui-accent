# Design

## Context

见 [proposal.md](./proposal.md)。当前实现的关键约束：

- 客户端插件是无构建器、无运行时依赖的经典 ESM bundle：`src/client.js` 通过 `window.__ModuleLoader__` 注册，CSS 由 `build.mjs` 内联进 `lib/client.js`。
- 配色状态是模块级单例：`current`（读取自 localStorage）、`applyColors`（写 `document.documentElement`）、`setColor`（live 时 rAF 合并、每帧写根）、`flushSettle`（160ms 后落盘 + 通知预览滚动）、`pagehide` 兜底 flush。
- DSH 的设置面板是 `createPortal` 到 `body` 的覆盖层，背后的会话不卸载、只是 `inert`；会话没有 DOM 虚拟化，DOM 规模随已加载历史增长。
- Chromium 152：未注册的自定义属性按继承属性处理，根上一变会重算整棵文档的样式，这是长会话卡顿的根因。
- 面板预览已经是 `position: sticky`，始终可见；预览样式通过 `var(--dsh-accent-*)` 取色，因此把变量限定在面板 section 上即可让预览独立于根变量。
- 测试用 React stub，不能引入 react / react-dom；现有 `render-test` / `schedule-test` 断言了「拖动每帧写一次根变量、落盘延后」，本次要重写这部分契约。

## Goals / Non-Goals

**Goals:**

- 交互期间（拖动、十六进制输入、恢复默认）对 `document.documentElement` 的配色写入次数为 0，对 localStorage 的写入为 0。
- 引入 draft / applied 两态：draft 只驱动预览，applied 才写根并持久化。
- 预览标题行常驻「应用」按钮，干净时禁用、脏时启用；点击时一次任务内写完差异。
- 关闭面板丢弃 draft；重新打开等价于 applied。
- 存储键、delta-only 与 v1/v2 迁移逻辑保持不变。

**Non-Goals:**

- 不改造 DSH 会话的渲染方式（虚拟化、`content-visibility`、卸载会话），不改 DSH 核心。
- 不引入 `@property` 注册；它对 `inherits: true` 的收益未证实，且 `initial-value` 会破坏「null = 跟随主题」语义。
- 不持久化 draft（不做 `sessionStorage`、不做跨标签页同步），不提供「实时应用」开关。
- 不新增撤销/还原动作；「默认」「全部恢复默认」仍然按分类或整表改 draft。

## Decisions

### D1. 模块级 draft + applied 双状态

`applied`：从 localStorage 读取、启动时写入根元素、只由用户点击「应用」更新。
`draft`：打开面板时从 `applied` 复制，所有面板改动写这里，只驱动预览。

```text
面板打开 -> draft = applied
  input -> draft[key] = color -> 面板作用域变量 + emit（预览/色块/输入框）
  dirty  = draft != applied（逐键，包含 null）
  apply  -> applied = draft -> 写根差异键 + localStorage -> dirty = false
面板关闭 -> draft = applied（丢弃作用域随节点卸载）
```

选择模块级而不是组件局部状态，是为了复用现有的 `setColor` / `subscribeColors` / `emitColors` 管线与导出 API（测试直接调用模块函数），避免把状态机拆进 React 组件。面板挂载时调用一次 `beginDraft()`，卸载时调用 `discardDraft()`；两者都只改内存，不碰存储。

替代方案：draft 放 `AccentSection` 的 `useState`。更贴近组件生命周期，但会重写现有订阅管线、测试入口和导出 API，收益不足以抵消改动量。

### D2. 预览用面板作用域的 CSS 变量

`AccentSection` 的根节点作为预览作用域。`applyDraftToScope(keys)` 把 draft 值写到该节的 `style` 上（null 则移除变量），面板卸载时节点消失、变量自然清空。`flushVisual` 只对作用域写、不写根；`emitColors` 仍负责刷新色块与十六进制输入框。

这样预览继续复用 `theme.css` 里的 `var(--dsh-accent-*)` 规则与 fallback，颜色真源不迁移到 JS；交互时样式失效范围限制在面板约百个节点，与整篇会话无关。

替代方案：预览改成内联具体色值。少一层作用域，但要在 JS 里复制 `theme.css` 的 fallback 常量，违背仓库「颜色唯一来源」的约定，故不采用。

注意：预览的「思考」样例用行内 `style.color` + `var()`，不依赖 `html[data-dsh-accent-think]`，所以作用域只需要变量，不需要同步根属性；`data-dsh-accent-think` 仍只在应用时切换。

### D3. 「应用」 = 一次批量差异写入

`applyDraft()` 计算 `dirtyKeys`（draft 与 applied 的差异键），先更新 `applied`，再对差异键各写一次根变量（`applyColors(keys)`，null 键移除变量并同步 `data-dsh-accent-think`），随后 `saveColors(applied)`。全部在同一同步任务内完成，浏览器只做一次全文档样式重算。按钮状态由 `dirty` 派生，应用后自动回到禁用。

替代方案：写入整张 15 项色表。重算代价相同但多写无用变量；差异写入同时满足「每个差异变量最多写一次」的验收场景。

替代方案：在 `requestAnimationFrame` 里写根。可以让按钮的按下态先绘制一帧，但会让「应用」的可见反馈延后一帧，且现有测试需要等待帧；作为可选的体验微调，不作为默认。

### D4. 常驻应用按钮与状态播报

按钮固定渲染在预览标题行右侧的固定宽度槽位里：干净时 `disabled`、脏时可用。不使用「消失/出现」的显隐切换，避免标题行左右抖动，也避免焦点丢失。按钮使用 `dsw-alias-state-business-primary` 作为主色，禁用态降低不透明度。

新增本地化键：`button.apply`（按钮文字）、`apply.aria`（可访问名称，可含状态）、`apply.pending`（`aria-live` 播报的未应用提示）。`aria-live="polite"` 的状态节点只在 dirty 从无到有时更新文本。

### D5. 移除 live 写根、落定落盘与 pagehide 兜底

`setColor` 删除 `{ live: true }` 分支：所有修改都只写 draft、作用域样式与 emit。`scheduleSettle` 不再保存配色，只保留「取色停顿后把预览滚到对应样例行」的职责，重命名为 `schedulePreviewReveal`。`apply()` 里的 `pagehide` flush 监听删除，面板卸载时的 `flushSettle` 只清理预览滚动定时器。`exports.flushPending` 移除或改为无副作用。

这样插件里不再存在「用户没有显式操作却写根」的路径，性能红线可以用「根写入次数」直接断言。

### D6. 颜色归一化

`sanitizeColor` 在原有校验后把三位十六进制展开为六位小写（`#abc` → `#aabbcc`）。好处：

- dirty 比较不受 `#fff` 与 `#ffffff` 的表示差异影响；
- 修复现有 `<input type="color">` 只接受 `#rrggbb`、输入三位色后色块显示为黑色的问题；
- 已存的旧值在 `loadColors` 时归一化到内存，无需改存储版本；下次应用时按六位写入。

### D7. 存储与迁移不变

存储键仍是 `dsh-accent.colors.v3`，只写 applied，delta-only 逻辑不变；v1/v2 迁移与 `STALE_DEFAULTS` 逻辑保持原样。区别只是写入时机从「停顿后」变成「点击应用后」。

## Risks / Trade-offs

- [用户习惯「改完即生效」，关闭面板时未应用会丢改动] → 按钮禁用/启用状态 + `aria-live` 提示 + README 文案明确「预览后点应用」；丢弃是用户确认过的产品选择。
- [应用那一下仍可能触发一次几十毫秒的全文档重算] → 用户主动触发、可预期；如需更顺手，可改为 rAF 写入，让按钮反馈先绘制一帧；实现后用 DevTools 的 `Recalculate Style` 记录 Apply 时长作为基线。
- [面板作用域变量与根变量同名，排查时容易混淆] → 在代码注释与 design 中固定语义：根 = applied，section = draft；面板卸载即清空，不需要手动 removeProperty。
- [draft 在卸载时忘记复位，会污染下一次打开] → `beginDraft()` 在挂载时无条件从 applied 复制，`discardDraft()` 在卸载时复位；测试覆盖「改完关闭再打开」场景。
- [三位色归一化改变已存值的外观等价但字符串不同] → 归一化后颜色等价，不涉及迁移；存储只会在下一次应用时重写。
- [现有测试断言了旧契约，改源码忘改测试会红] → 本次把 `schedule-test` 重写为「交互零根写入 + 应用一次写入」，并新增按钮状态、丢弃草稿、归一化用例；AGENTS.md 同步更新红线。

## Migration Plan

1. 发布新版本；存储格式与键不变，旧配置直接作为 applied 加载，无需迁移。
2. 旧版残留行为（拖动即时生效）被移除；README 的「修改即时生效」改为「预览后点应用生效」。
3. 回滚策略：回退到上一版本即可；新版本写入的存储仍是 v3 delta-only，旧版本能正常读取，不丢配色。
4. 归一化只在内存与下次应用时发生，不主动重写存储，回滚安全。
