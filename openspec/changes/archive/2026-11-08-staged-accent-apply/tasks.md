# Tasks

## 1. 配色状态机（src/client.js）

- [x] 1.1 把模块级 `current` 拆成 `applied` 与 `draft`：`applied` 从存储恢复、启动时写根；面板挂载时 `beginDraft()` 从 `applied` 复制，卸载时 `discardDraft()` 复位。验证：`render-test` 初始颜色等于存储恢复值，且未打开面板时 draft 不产生任何样式写入。
- [x] 1.2 重写 `setColor`：删除 `{ live }` 分支与 `scheduleVisual` 的根写入，改为只更新 `draft`、写面板作用域样式并 `emitColors`。验证：`schedule-test` 断言拖动多次后根变量写入为 0、localStorage 未写入。
- [x] 1.3 新增 `dirtyKeys()` 与 `applyDraft()`：按 draft 与 applied 的差异键计算未应用状态，应用时先更新 applied、再对每个差异键写一次根变量、最后落盘。验证：新增用例断言多项差异各自最多写一次、存储只含 delta-only 的已应用颜色。
- [x] 1.4 归一化颜色：`sanitizeColor` 把三位十六进制展开为六位小写，非法值行为不变。验证：用例覆盖 `#ABC` → `#aabbcc`、非法字符串不改状态、色块拿到六位值。
- [x] 1.5 重写 `test/schedule-test.mjs` 与 `test/render-test.mjs` 中依赖「拖动每帧写根」的断言，并补「应用一次写入」「关闭丢弃 draft」用例。验证：`npm test` 全绿且没有用例再断言拖动写根。

## 2. 预览作用域与常驻应用按钮

- [x] 2.1 抽出 `applyDraftToScope(keys)`：把 draft 值写到 `AccentSection` 根节点（null 移除变量），`flushVisual` 只对作用域写。验证：`render-test` 断言预览样式写在面板节点、根节点 `style` 无 `--dsh-accent-*`。
- [x] 2.2 新增 `theme.css` 的预览标题行布局与 `.dsh-accent-apply` 启用/禁用样式，按钮使用固定宽度槽位避免标题抖动。验证：`node preview/build-panel.mjs` 生成面板页后无头截图，确认按钮在预览标题右侧且禁用态可读。
- [x] 2.3 「应用」按钮常驻预览标题行：干净时 `disabled`、有任意差异时启用；未应用状态用 `aria-live="polite"` 播报。验证：`render-test` 覆盖「打开禁用 → 改动启用 → 应用后禁用」与 `aria-live` 文本变化。
- [x] 2.4 补 8 套字典的 `button.apply`、`apply.aria`、`apply.pending` 键，保持 zh 为键集真源。验证：`render-test` 的键集一致性与空文案检查通过。
- [x] 2.5 更新 `README.md` 与 `README.en.md` 的交互说明：修改只进预览，点「应用」才生效并保存，关闭面板丢弃未应用改动；同步更新配图说明。验证：两份 README 逐节对齐、命令与令牌一致，人工按文档走一遍流程。

## 3. 移除旧路径与工程契约

- [x] 3.1 删除 `pagehide` 兜底 flush、`flushPending` 导出与 `scheduleSettle` 中的 `saveColors`；`scheduleSettle` 只保留预览自动滚动并改名。验证：仓库内不再有 `pagehide` / `flushPending` / `live: true` 引用，`node --check lib/client.js` 通过。
- [x] 3.2 更新 `AGENTS.md`：第 4 节测试表、第 9 节性能红线改为「交互期间根写入为 0，根变量只由启动恢复或应用写入」，并说明面板作用域变量与 draft/applied 语义。验证：红线描述与 `schedule-test` / `render-test` 的实际断言一一对应。
- [x] 3.3 运行 `node build.mjs` 重建 `lib/client.js`，与 `src/` 改动同一次提交。验证：`node --check lib/client.js` 通过、`npm test` 全绿、提交内容同时包含 `src/` 与 `lib/`。

## 4. 集成验证

- [x] 4.1 长会话手动验证：用 DevTools Performance 录制拖动，确认 `Recalculate Style` 不在拖动帧出现、根变量零写入；点击「应用」后确认只出现一次全文档重算，并记录耗时基线。验证：录制结果与记录数据留档在变更说明或提交信息中。
- [x] 4.2 回归八种语言切换、null 原色、三位十六进制、关闭丢弃、刷新恢复、全部恢复默认后应用。验证：`npm test` 全绿，手动逐项走查无异常。
- [x] 4.3 发布前打包检查：`npm test`、`node --check lib/client.js`、`npm pack --dry-run` 均通过，包内容包含 `lib`、`src`、`cordis.patch.yml`、`locale/*.json`、`icon.svg` 与两份 README。验证：打包清单与 `test/package-test.mjs` 断言一致。

## Workflow follow-up

- 项目评审通过后归档本变更。
- 按 `AGENTS.md` 第 11 节发版：确认版本号、`npm publish`、在 GitHub 建同名 tag 的 Release。
