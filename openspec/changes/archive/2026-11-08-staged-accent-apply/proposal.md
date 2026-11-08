# Proposal

## Why

拖动取色器时，插件每帧把 `--dsh-accent-*` 写到 `<html>` 上。自定义属性是继承属性，根上一变，Chromium 就要重算整棵文档的样式；会话越长、DOM 越大，每帧重算越慢，拖动就越卡。现有的「每帧只写一个变量」只降低了写的次数，没有降低单次写的代价，所以长会话下仍然掉帧。

设置面板本身已经有置顶的「效果预览」，用户改色时并不需要背景里的会话同步变化。把「预览」和「应用」拆成两态，就能让交互期间完全不碰根元素，把唯一一次全文档重算变成用户主动点击的显式动作。

## What Changes

- 引入 **draft / applied 两态**：draft 是面板里正在编辑的配色，只驱动预览；applied 是当前生效并已持久化的配色。
- 预览标题行右侧常驻「应用」按钮：无改动时禁用，有任意改动时启用；点击后把差异项一次性写入根变量并落盘。
- 「默认」「全部恢复默认」只修改 draft，同样需要点「应用」才生效。
- 关闭设置面板时**丢弃** draft；下次打开时从 applied 重新开始。
- 拖动与输入期间**不再写根变量、不再写 localStorage**；预览通过限定在面板 section 上的 CSS 变量实时更新。
- 移除拖动实时写根的 `live` 通道、160ms 落定写根/落盘、`pagehide` 兜底 flush；`flushSettle` 只保留预览自动滚动。
- 颜色统一归一化为六位小写十六进制，顺带修复输入 `#fff` 时 `<input type="color">` 色块变黑的问题。
- **BREAKING（行为变更）**：配色修改不再「修改即时生效并保存」，必须点「应用」；README 与面板文案同步更新。
- 补齐 8 种语言文案（应用、未应用提示、按钮无障碍标签），并用 `aria-live` 播报未应用状态。
- 更新 AGENTS.md 的性能红线与自测契约，使「根变量只能由用户应用触发」成为可断言的不变量。

## Capabilities

### New Capabilities

- `accent-colors`: 界面配色的选择、预览、暂存/应用、持久化与本地化行为，以及「交互期间不触发全文档重算」的性能约束。

### Modified Capabilities

（无。仓库当前 `openspec/specs/` 为空，本次首次建立该能力。）

## Impact

- `src/client.js`：配色状态机（draft / applied）、`setColor` / `applyDraft` / `resetColors` / `flushSettle` 职责调整、预览作用域变量、8 语言字典与导出 API。
- `src/theme.css`：预览标题行布局、常驻应用按钮的启用/禁用样式、必要的面板 token 复用。
- `lib/client.js`：由 `node build.mjs` 重建，随源码一起提交。
- `test/`：`schedule-test.mjs` 与 `render-test.mjs` 的断言改写；新增 draft/applied 与按钮状态用例。
- `AGENTS.md`、`README.md`、`README.en.md`：性能红线、交互说明与配图可能更新。
- 存储格式不变（`dsh-accent.colors.v3`，delta-only），只保存 applied；无需数据迁移。
