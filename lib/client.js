window.__ModuleLoader__.load({
  id: '@feiry-zz/dsh-ui-accent',
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports
    const React = require('react')
    const h = React.createElement

    /** 构建时注入的样式表正文，占位符由 build.mjs 替换。 */
    const THEME_CSS = "/* ============================================================\n * DSH 界面配色插件 —— 会话区取色规则\n * 所有颜色来自 --dsh-accent-* 变量，由客户端插件在启动/取色时写入根元素。\n * ============================================================ */\n\n/* ---------- 结果与强调文字 ---------- */\n\n/* 结果标题：Markdown 一至六级标题 */\n[class*='_markdown'] :is(h1, h2, h3, h4, h5, h6) {\n  color: var(--dsh-accent-heading, #c084fc) !important;\n}\n\n/* 加粗文字：Markdown strong / b */\n[class*='_markdown'] :is(strong, b) {\n  color: var(--dsh-accent-strong, #f472b6) !important;\n}\n\n/* 行内代码：默认与超链接同色（跟随主题的 business-primary），可单独覆盖 */\n[class*='_markdown'] :not(pre) > code,\n[class*='_markdown'] :not(pre) > code :is(a, button) {\n  color: var(--dsh-accent-inline-code, var(--dsw-alias-state-business-primary)) !important;\n}\n\n/* ---------- 会话行 ---------- */\n\n/* 思考行：默认不覆盖，沿用 DSH 主题原色；仅在用户显式取色后（html 带开关属性）生效 */\nhtml[data-dsh-accent-think] [data-variant='think'] :is([class*='_title'], [class*='_leading'], [class*='_chevron'], [class*='_summary'], [class*='_thinkBody']) {\n  color: var(--dsh-accent-think, #adb2b8) !important;\n}\n\n/* ---------- 工具行 ---------- */\n\n/* 兜底：未单独列出的工具使用“其他工具”颜色 */\n[data-tool] :is([class*='_title'], [class*='_leading']) {\n  color: var(--dsh-accent-other, #ded7e5) !important;\n}\n\n/* 运行命令：bash / pwsh */\n[data-tool='bash'] :is([class*='_title'], [class*='_leading']),\n[data-tool='pwsh'] :is([class*='_title'], [class*='_leading']),\n[data-variant='bash'] :is([class*='_title'], [class*='_leading']) {\n  color: var(--dsh-accent-bash, #b0cef2) !important;\n}\n\n/* 编辑：edit */\n[data-tool='edit'] :is([class*='_title'], [class*='_leading']),\n[data-variant='edit'] :is([class*='_title'], [class*='_leading']) {\n  color: var(--dsh-accent-edit, #fbbf24) !important;\n}\n\n/* 写入：write */\n[data-tool='write'] :is([class*='_title'], [class*='_leading']),\n[data-variant='write'] :is([class*='_title'], [class*='_leading']) {\n  color: var(--dsh-accent-write, #34d399) !important;\n}\n\n/* 读取：read / web_fetch */\n[data-tool='read'] :is([class*='_title'], [class*='_leading']),\n[data-tool='web_fetch'] :is([class*='_title'], [class*='_leading']),\n[data-variant='read'] :is([class*='_title'], [class*='_leading']) {\n  color: var(--dsh-accent-read, #a5b4fc) !important;\n}\n\n/* 搜索：grep / glob / web_search */\n[data-tool='grep'] :is([class*='_title'], [class*='_leading']),\n[data-tool='glob'] :is([class*='_title'], [class*='_leading']),\n[data-tool='web_search'] :is([class*='_title'], [class*='_leading']),\n[data-variant='search'] :is([class*='_title'], [class*='_leading']) {\n  color: var(--dsh-accent-search, #38bdf8) !important;\n}\n\n/* 代码：run_code */\n[data-tool='run_code'] :is([class*='_title'], [class*='_leading']),\n[data-variant='code'] :is([class*='_title'], [class*='_leading']) {\n  color: var(--dsh-accent-code, #a3e635) !important;\n}\n\n/* 任务：todo_write */\n[data-tool='todo_write'] :is([class*='_title'], [class*='_leading']) {\n  color: var(--dsh-accent-todo, #e879f9) !important;\n}\n\n/* 技能：skill */\n[data-tool='skill'] :is([class*='_title'], [class*='_leading']) {\n  color: var(--dsh-accent-skill, #2dd4bf) !important;\n}\n\n/* 插件：cordis_* 系列 */\n[data-tool^='cordis_'] :is([class*='_title'], [class*='_leading']) {\n  color: var(--dsh-accent-plugin, #818cf8) !important;\n}\n\n/* 提问：ask_user_question（放在工具行规则最后，确保优先级） */\n[data-tool='ask_user_question'] :is([class*='_title'], [class*='_leading']) {\n  color: var(--dsh-accent-question, #f87171) !important;\n}\n\n/* ============================================================\n * 设置侧边栏：界面配色面板\n * 视觉尽量复用 DSH 设计令牌，深浅色主题自动适配。\n * ============================================================ */\n\n.dsh-accent-section {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n  padding: 4px 2px 28px;\n  color: var(--dsw-alias-label-primary, #0f1115);\n  font-size: 14px;\n  line-height: 22px;\n}\n\n.dsh-accent-head {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n\n.dsh-accent-title {\n  margin: 0;\n  font-size: 16px;\n  font-weight: 600;\n  line-height: 24px;\n}\n\n.dsh-accent-desc {\n  margin: 0;\n  color: var(--dsw-alias-label-tertiary, #81858c);\n  font-size: 12px;\n  line-height: 18px;\n}\n\n.dsh-accent-group {\n  display: flex;\n  flex-direction: column;\n  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));\n  border-radius: 12px;\n  padding: 12px 16px 4px;\n}\n\n.dsh-accent-group-head {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  padding-bottom: 6px;\n}\n\n.dsh-accent-group-title {\n  margin: 0;\n  font-size: 13px;\n  font-weight: 600;\n  line-height: 20px;\n}\n\n.dsh-accent-group-desc {\n  margin: 0;\n  color: var(--dsw-alias-label-tertiary, #81858c);\n  font-size: 12px;\n  line-height: 18px;\n}\n\n.dsh-accent-row {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  padding: 9px 0;\n  border-top: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));\n}\n\n.dsh-accent-row-text {\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n}\n\n.dsh-accent-row-label {\n  font-size: 13px;\n  line-height: 20px;\n}\n\n.dsh-accent-row-hint {\n  color: var(--dsw-alias-label-tertiary, #81858c);\n  font-size: 11px;\n  line-height: 16px;\n}\n\n/* “原色”标记：表示该分类当前不覆盖、跟随主题 */\n.dsh-accent-badge {\n  display: inline-block;\n  margin-left: 6px;\n  padding: 0 6px;\n  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));\n  border-radius: 999px;\n  color: var(--dsw-alias-label-tertiary, #81858c);\n  font-size: 10px;\n  font-weight: 400;\n  line-height: 16px;\n  vertical-align: 1px;\n}\n\n.dsh-accent-row-controls {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex: none;\n}\n\n.dsh-accent-swatch {\n  width: 30px;\n  height: 30px;\n  padding: 0;\n  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));\n  border-radius: 8px;\n  background: transparent;\n  cursor: pointer;\n}\n\n.dsh-accent-swatch::-webkit-color-swatch-wrapper {\n  padding: 3px;\n}\n\n.dsh-accent-swatch::-webkit-color-swatch {\n  border: none;\n  border-radius: 5px;\n}\n\n.dsh-accent-hex {\n  width: 84px;\n  height: 28px;\n  box-sizing: border-box;\n  padding: 0 8px;\n  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));\n  border-radius: 8px;\n  background: var(--dsw-alias-bg-base, #fff);\n  color: var(--dsw-alias-label-primary, #0f1115);\n  font-family: var(--ds-font-family-code, Consolas, monospace);\n  font-size: 12px;\n  line-height: 26px;\n  outline: none;\n}\n\n.dsh-accent-hex:focus {\n  border-color: var(--dsw-alias-state-business-primary, #4176e6);\n}\n\n.dsh-accent-reset,\n.dsh-accent-button {\n  height: 28px;\n  padding: 0 10px;\n  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));\n  border-radius: 8px;\n  background: transparent;\n  color: var(--dsw-alias-label-secondary, #61666b);\n  font-size: 12px;\n  line-height: 26px;\n  white-space: nowrap;\n  flex: none;\n  cursor: pointer;\n}\n\n.dsh-accent-reset:hover,\n.dsh-accent-button:hover {\n  background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.04));\n  color: var(--dsw-alias-label-primary, #0f1115);\n}\n\n.dsh-accent-preview {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  /* 粘在设置内容区顶部：向下滚动配置项时预览始终可见，改色即时对照 */\n  position: sticky;\n  top: 0;\n  z-index: 8;\n  padding: 12px 14px;\n  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));\n  border-radius: 12px;\n  background: var(--dsw-alias-markdown-code-block, #f5f6f7);\n  box-shadow: 0 10px 24px -16px rgba(0, 0, 0, 0.55);\n}\n\n.dsh-accent-preview-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  color: var(--dsw-alias-label-tertiary, #81858c);\n  font-size: 11px;\n  line-height: 16px;\n}\n\n.dsh-accent-preview-title {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n/* 应用按钮固定占位：禁用时只降不透明度，不隐藏，避免标题行左右抖动。 */\n.dsh-accent-preview-actions {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 8px;\n  flex: none;\n  min-width: 64px;\n}\n\n.dsh-accent-apply {\n  height: 26px;\n  padding: 0 12px;\n  border: 1px solid transparent;\n  border-radius: 8px;\n  background: var(--dsw-alias-state-business-primary, #4176e6);\n  color: #fff;\n  font: inherit;\n  font-size: 12px;\n  font-weight: 500;\n  line-height: 24px;\n  white-space: nowrap;\n  cursor: pointer;\n}\n\n.dsh-accent-apply:disabled {\n  opacity: 0.45;\n  cursor: default;\n}\n\n.dsh-accent-apply:not(:disabled):hover {\n  filter: brightness(1.08);\n}\n\n.dsh-accent-apply:focus-visible {\n  outline: 2px solid var(--dsw-alias-state-business-primary, #4176e6);\n  outline-offset: 2px;\n}\n\n/* 仅供辅助技术读取的状态文本：视觉上隐藏，仍参与 aria-live 播报。 */\n.dsh-accent-sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0 0 0 0);\n  white-space: nowrap;\n  border: 0;\n}\n\n.dsh-accent-preview-body {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  /* 预览列举全部 15 项设置，固定高度内独立滚动，避免把设置页撑得过长 */\n  position: relative;\n  max-height: 220px;\n  padding-right: 6px;\n  overflow-y: auto;\n  overscroll-behavior: contain;\n  scrollbar-width: thin;\n  scrollbar-color: var(--dsw-alias-label-quaternary, rgba(128, 128, 128, 0.5)) transparent;\n  font-size: 13px;\n  line-height: 20px;\n}\n\n.dsh-accent-preview-body::-webkit-scrollbar {\n  width: 6px;\n}\n\n.dsh-accent-preview-body::-webkit-scrollbar-thumb {\n  border-radius: 3px;\n  background: var(--dsw-alias-label-quaternary, rgba(128, 128, 128, 0.5));\n}\n\n.dsh-accent-pv-heading {\n  margin: 0;\n  color: var(--dsh-accent-heading, #c084fc);\n  font-size: 14px;\n  font-weight: 600;\n  line-height: 22px;\n}\n\n.dsh-accent-pv-text {\n  margin: 0;\n  color: var(--dsw-alias-label-primary, #0f1115);\n}\n\n.dsh-accent-pv-strong {\n  color: var(--dsh-accent-strong, #f472b6);\n  font-weight: 600;\n}\n\n/* 行内代码样例：与正文中的行内代码同色，带浅色底 */\n.dsh-accent-pv-code {\n  padding: 0 5px;\n  border-radius: 6px;\n  background: var(--dsw-alias-markdown-inline-code, rgba(127, 127, 127, 0.16));\n  color: var(--dsh-accent-inline-code, var(--dsw-alias-state-business-primary, #4176e6));\n  font-family: var(--ds-font-family-code, Consolas, monospace);\n  font-size: 12px;\n}\n\n.dsh-accent-pv-row {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  min-width: 0;\n  white-space: nowrap;\n}\n\n.dsh-accent-pv-dot {\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  background: currentColor;\n  flex: none;\n}\n\n.dsh-accent-pv-label {\n  flex: none;\n  font-weight: 500;\n}\n\n.dsh-accent-pv-sep {\n  color: var(--dsw-alias-label-caption, #b7bac0);\n  flex: none;\n}\n\n.dsh-accent-pv-summary {\n  overflow: hidden;\n  color: var(--dsw-alias-label-tertiary, #81858c);\n  text-overflow: ellipsis;\n}\n\n.dsh-accent-footer {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n\n.dsh-accent-footer-hint {\n  color: var(--dsw-alias-label-tertiary, #81858c);\n  font-size: 11px;\n  line-height: 16px;\n}\n"

    /** 插件标识：style 标签归属与诊断信息共用。 */
    const PLUGIN_ID = '@feiry-zz/dsh-ui-accent'

    /** 本地化命名空间：设置页文案随 DSH 通用设置的中英文切换。 */
    const SETTINGS_NS = 'settings.uiAccent'

    /** 浏览器本地存储键：配色表按版本号隔离，后续结构变更可平滑升级。 */
    const STORAGE_KEY = 'dsh-accent.colors.v3'

    /** 旧版配色表键（新→旧）：仅在迁移时读取，迁移完成后由新键接管。 */
    const LEGACY_STORAGE_KEYS = ['dsh-accent.colors.v2', 'dsh-accent.colors.v1']

    /** 当前存储信封版本：v3 只保存与出厂默认不同的项。 */
    const STORAGE_VERSION = 3

    /**
     * 历史出厂默认：旧版存储会把整张默认表一起写进去，迁移时把“恰好等于旧默认”
     * 的项视为没改过，交给当前默认处理（思考旧橙、技能旧青、其他工具旧紫）。
     */
    const STALE_DEFAULTS = {
      think: ['#fb923c'],
      skill: ['#2dd4bf'],
      other: ['#c084fc']
    }

    /** CSS 变量前缀：样式表与取色面板共用同一套变量名。 */
    const VAR_PREFIX = '--dsh-accent-'

    /** 合法颜色格式：三位或六位十六进制。 */
    const COLOR_PATTERN = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i

    /**
     * 默认配色：结果标题紫色、加粗粉色、提问红色、其他工具浅烟紫；思考与行内代码
     * 默认不覆盖（分别沿用 DSH 原色灰与超链接蓝），技能沿用原先思考的橙色。
     * 值为 null 表示“不覆盖，保留 DSH 原本的颜色”。
     */
    const DEFAULTS = {
      heading: '#c084fc',
      strong: '#f472b6',
      inlineCode: null,
      think: null,
      question: '#f87171',
      bash: '#b0cef2',
      edit: '#fbbf24',
      write: '#34d399',
      read: '#a5b4fc',
      search: '#38bdf8',
      code: '#a3e635',
      todo: '#e879f9',
      skill: '#fb923c',
      plugin: '#818cf8',
      other: '#ded7e5'
    }

    /** 未覆盖时给取色控件展示的占位色（仅视觉用途，不会写入页面）。 */
    const FALLBACK_SWATCH = { think: '#adb2b8', inlineCode: '#679efe' }

    /** 设置面板的分组与条目定义，顺序即渲染顺序；文案键在字典里。 */
    const GROUPS = [
      {
        id: 'text',
        titleKey: 'group.text.title',
        descKey: 'group.text.desc',
        items: [
          { id: 'heading', labelKey: 'item.heading.label', hintKey: 'item.heading.hint' },
          { id: 'strong', labelKey: 'item.strong.label', hintKey: 'item.strong.hint' },
          {
            id: 'inlineCode',
            labelKey: 'item.inlineCode.label',
            hintKey: 'item.inlineCode.hint',
            badgeKey: 'item.inlineCode.badge'
          }
        ]
      },
      {
        id: 'rows',
        titleKey: 'group.rows.title',
        descKey: 'group.rows.desc',
        items: [
          { id: 'think', labelKey: 'item.think.label', hintKey: 'item.think.hint', badgeKey: 'item.think.badge' },
          { id: 'question', labelKey: 'item.question.label', hintKey: 'item.question.hint' }
        ]
      },
      {
        id: 'tools',
        titleKey: 'group.tools.title',
        descKey: 'group.tools.desc',
        items: [
          { id: 'bash', labelKey: 'item.bash.label', hintKey: 'item.bash.hint' },
          { id: 'edit', labelKey: 'item.edit.label', hintKey: 'item.edit.hint' },
          { id: 'write', labelKey: 'item.write.label', hintKey: 'item.write.hint' },
          { id: 'read', labelKey: 'item.read.label', hintKey: 'item.read.hint' },
          { id: 'search', labelKey: 'item.search.label', hintKey: 'item.search.hint' },
          { id: 'code', labelKey: 'item.code.label', hintKey: 'item.code.hint' },
          { id: 'todo', labelKey: 'item.todo.label', hintKey: 'item.todo.hint' },
          { id: 'skill', labelKey: 'item.skill.label', hintKey: 'item.skill.hint' },
          { id: 'plugin', labelKey: 'item.plugin.label', hintKey: 'item.plugin.hint' },
          { id: 'other', labelKey: 'item.other.label', hintKey: 'item.other.hint' }
        ]
      }
    ]

    /** 预览滚动定位时给样例行留出的上边距（px）。 */
    const PREVIEW_SCROLL_MARGIN_PX = 6

    /** 预览行：覆盖除文字类（标题/加粗/行内代码）以外的全部工具与会话行。 */
    const PREVIEW_ROWS = [
      { id: 'think', summaryKey: 'preview.think.summary' },
      { id: 'question', summaryKey: 'preview.question.summary' },
      { id: 'bash', summaryKey: 'preview.bash.summary' },
      { id: 'edit', summaryKey: 'preview.edit.summary' },
      { id: 'write', summaryKey: 'preview.write.summary' },
      { id: 'read', summaryKey: 'preview.read.summary' },
      { id: 'search', summaryKey: 'preview.search.summary' },
      { id: 'code', summaryKey: 'preview.code.summary' },
      { id: 'todo', summaryKey: 'preview.todo.summary' },
      { id: 'skill', summaryKey: 'preview.skill.summary' },
      { id: 'plugin', summaryKey: 'preview.plugin.summary' },
      { id: 'other', summaryKey: 'preview.other.summary' }
    ]

    /** 简体中文字典（键集的事实来源）。 */
    const zh = {
      nav: '界面配色',
      title: '界面配色',
      desc: '为结果标题、加粗文字、行内代码、思考、提问以及各类工具行单独取色；面板内实时预览，点「应用」后写入会话并保存在本机浏览器。',
      'group.text.title': '结果与强调文字',
      'group.text.desc': '助手回复中的 Markdown 标题、加粗与行内代码。',
      'group.rows.title': '会话行',
      'group.rows.desc': '思考过程与提问交互行。',
      'group.tools.title': '工具行',
      'group.tools.desc': '按工具类型着色行的图标与标题；未列出的工具使用「其他工具」。',
      'item.heading.label': '结果标题',
      'item.heading.hint': 'Markdown 一至六级标题',
      'item.strong.label': '加粗文字',
      'item.strong.hint': 'Markdown 粗体（strong / b）',
      'item.inlineCode.label': '行内代码',
      'item.inlineCode.hint': 'Markdown 行内代码（默认与超链接同色，跟随主题）',
      'item.inlineCode.badge': '链接蓝',
      'item.think.label': '思考',
      'item.think.hint': 'Think 推理行与展开内容（默认跟随主题原色）',
      'item.think.badge': '原色',
      'item.question.label': '提问',
      'item.question.hint': 'ask_user_question 提问行',
      'item.bash.label': '运行命令',
      'item.bash.hint': 'bash / pwsh',
      'item.edit.label': '编辑',
      'item.edit.hint': 'edit',
      'item.write.label': '写入',
      'item.write.hint': 'write',
      'item.read.label': '读取',
      'item.read.hint': 'read / web_fetch',
      'item.search.label': '搜索',
      'item.search.hint': 'grep / glob / web_search',
      'item.code.label': '代码',
      'item.code.hint': 'run_code',
      'item.todo.label': '任务',
      'item.todo.hint': 'todo_write',
      'item.skill.label': '技能',
      'item.skill.hint': 'skill',
      'item.plugin.label': '插件',
      'item.plugin.hint': 'cordis_* 系列',
      'item.other.label': '其他工具',
      'item.other.hint': '未单独列出的工具',
      'button.default': '默认',
      'button.resetAll': '全部恢复默认',
      'button.apply': '应用',
      'apply.aria': '应用配色',
      'apply.pending': '有未应用的配色更改',
      'footer.hint': '配色在点「应用」后写入会话并保存在浏览器 localStorage，不写入 settings.yaml。',
      'hex.aria': '十六进制颜色',
      'swatch.ariaSuffix': '颜色',
      'preview.title': '效果预览（全部设置）',
      'preview.plainBefore': '普通正文，',
      'preview.bold': '加粗强调',
      'preview.plainAfter': '，其余保持原色。',
      'preview.codeBefore': '行内代码',
      'preview.codeAfter': '与链接同色。',
      'preview.think.summary': '整理最终的校验步骤',
      'preview.question.summary': '确认归档范围',
      'preview.bash.summary': 'Verify archive and release layout',
      'preview.edit.summary': 'docs/release/2026-11-13/README.md',
      'preview.write.summary': 'docs/release/2026-11-13/README.md',
      'preview.read.summary': 'docs/release/2026-11-13/README.md',
      'preview.search.summary': 'TODO in docs',
      'preview.code.summary': "print('hello')",
      'preview.todo.summary': '整理发版清单',
      'preview.skill.summary': 'openspec-apply-change',
      'preview.plugin.summary': 'cordis_run',
      'preview.other.summary': 'mcp__dbx__list_tables'
    }

    /** English dictionary; mirrors the zh key set. */
    const en = {
      nav: 'Accent colors',
      title: 'Accent colors',
      desc: 'Pick colors for result titles, bold text, inline code, thinking, questions and every tool row. Preview inside the panel, then press Apply to update the conversation and save in this browser.',
      'group.text.title': 'Results & emphasis',
      'group.text.desc': 'Markdown headings, bold text and inline code in replies.',
      'group.rows.title': 'Conversation rows',
      'group.rows.desc': 'Thinking and question rows.',
      'group.tools.title': 'Tool rows',
      'group.tools.desc': "Colors each tool row's icon and title; unlisted tools use “Other tools”.",
      'item.heading.label': 'Result title',
      'item.heading.hint': 'Markdown headings 1–6',
      'item.strong.label': 'Bold text',
      'item.strong.hint': 'Markdown bold (strong / b)',
      'item.inlineCode.label': 'Inline code',
      'item.inlineCode.hint': 'Inline code (defaults to the link blue, follows theme)',
      'item.inlineCode.badge': 'Link blue',
      'item.think.label': 'Thinking',
      'item.think.hint': 'Think row and expanded content (follows theme by default)',
      'item.think.badge': 'Original',
      'item.question.label': 'Question',
      'item.question.hint': 'ask_user_question row',
      'item.bash.label': 'Run command',
      'item.bash.hint': 'bash / pwsh',
      'item.edit.label': 'Edit',
      'item.edit.hint': 'edit',
      'item.write.label': 'Write',
      'item.write.hint': 'write',
      'item.read.label': 'Read',
      'item.read.hint': 'read / web_fetch',
      'item.search.label': 'Search',
      'item.search.hint': 'grep / glob / web_search',
      'item.code.label': 'Code',
      'item.code.hint': 'run_code',
      'item.todo.label': 'Task',
      'item.todo.hint': 'todo_write',
      'item.skill.label': 'Skill',
      'item.skill.hint': 'skill',
      'item.plugin.label': 'Plugin',
      'item.plugin.hint': 'cordis_* tools',
      'item.other.label': 'Other tools',
      'item.other.hint': 'Tools not listed above',
      'button.default': 'Default',
      'button.resetAll': 'Reset all',
      'button.apply': 'Apply',
      'apply.aria': 'Apply colors',
      'apply.pending': 'Unapplied color changes',
      'footer.hint': 'Colors are written to the conversation and saved in browser localStorage after you press Apply; settings.yaml is not written.',
      'hex.aria': 'Hex color',
      'swatch.ariaSuffix': 'color',
      'preview.title': 'Preview (all settings)',
      'preview.plainBefore': 'Plain text, ',
      'preview.bold': 'bold emphasis',
      'preview.plainAfter': '; the rest keeps its color.',
      'preview.codeBefore': 'Inline code',
      'preview.codeAfter': 'matches links.',
      'preview.think.summary': 'Preparing the final verification steps',
      'preview.question.summary': 'Confirm the archive scope',
      'preview.bash.summary': 'Verify archive and release layout',
      'preview.edit.summary': 'docs/release/2026-11-13/README.md',
      'preview.write.summary': 'docs/release/2026-11-13/README.md',
      'preview.read.summary': 'docs/release/2026-11-13/README.md',
      'preview.search.summary': 'TODO in docs',
      'preview.code.summary': "print('hello')",
      'preview.todo.summary': 'Prepare the release checklist',
      'preview.skill.summary': 'openspec-apply-change',
      'preview.plugin.summary': 'cordis_run',
      'preview.other.summary': 'mcp__dbx__list_tables'
    }

    /** Japanese dictionary; mirrors the zh key set. */
    const ja = {
      nav: 'アクセントカラー',
      title: 'アクセントカラー',
      desc: '見出し・太字・インラインコード・思考・質問・各ツール行の色を個別に設定できます。パネル内でプレビューし、「適用」で会話に反映してこのブラウザに保存します。',
      'group.text.title': '見出しと強調',
      'group.text.desc': 'アシスタント応答内の Markdown 見出し・太字・インラインコード。',
      'group.rows.title': '会話の行',
      'group.rows.desc': '思考プロセスと質問の行。',
      'group.tools.title': 'ツール行',
      'group.tools.desc': 'ツール種別ごとに行のアイコンとタイトルを着色します。未登録のツールは「その他のツール」を使います。',
      'item.heading.label': '見出し',
      'item.heading.hint': 'Markdown 見出し 1〜6',
      'item.strong.label': '太字',
      'item.strong.hint': 'Markdown の太字（strong / b）',
      'item.inlineCode.label': 'インラインコード',
      'item.inlineCode.hint': 'Markdown のインラインコード（既定はリンク色、テーマに追従）',
      'item.inlineCode.badge': 'リンク色',
      'item.think.label': '思考',
      'item.think.hint': 'Think 行と展開内容（既定はテーマ色）',
      'item.think.badge': '既定色',
      'item.question.label': '質問',
      'item.question.hint': 'ask_user_question の行',
      'item.bash.label': 'コマンド実行',
      'item.bash.hint': 'bash / pwsh',
      'item.edit.label': '編集',
      'item.edit.hint': 'edit',
      'item.write.label': '書き込み',
      'item.write.hint': 'write',
      'item.read.label': '読み取り',
      'item.read.hint': 'read / web_fetch',
      'item.search.label': '検索',
      'item.search.hint': 'grep / glob / web_search',
      'item.code.label': 'コード',
      'item.code.hint': 'run_code',
      'item.todo.label': 'タスク',
      'item.todo.hint': 'todo_write',
      'item.skill.label': 'スキル',
      'item.skill.hint': 'skill',
      'item.plugin.label': 'プラグイン',
      'item.plugin.hint': 'cordis_* ツール',
      'item.other.label': 'その他のツール',
      'item.other.hint': '上記以外のツール',
      'button.default': '既定',
      'button.resetAll': 'すべて既定に戻す',
      'button.apply': '適用',
      'apply.aria': '配色を適用',
      'apply.pending': '未適用の配色変更があります',
      'footer.hint': '「適用」で配色を会話に反映し、ブラウザの localStorage に保存します（settings.yaml には書き込みません）。',
      'hex.aria': '16 進カラー',
      'swatch.ariaSuffix': 'の色',
      'preview.title': 'プレビュー（すべての設定）',
      'preview.plainBefore': '通常のテキスト、',
      'preview.bold': '太字の強調',
      'preview.plainAfter': '、その他は元の色のまま。',
      'preview.codeBefore': 'インラインコード',
      'preview.codeAfter': 'はリンクと同じ色。',
      'preview.think.summary': '最終的な検証手順を整理',
      'preview.question.summary': 'アーカイブ範囲を確認',
      'preview.bash.summary': 'Verify archive and release layout',
      'preview.edit.summary': 'docs/release/2026-11-13/README.md',
      'preview.write.summary': 'docs/release/2026-11-13/README.md',
      'preview.read.summary': 'docs/release/2026-11-13/README.md',
      'preview.search.summary': 'TODO in docs',
      'preview.code.summary': "print('hello')",
      'preview.todo.summary': 'リリース手順を作成',
      'preview.skill.summary': 'openspec-apply-change',
      'preview.plugin.summary': 'cordis_run',
      'preview.other.summary': 'mcp__dbx__list_tables'
    }

    /** Spanish dictionary; mirrors the zh key set. */
    const es = {
      nav: 'Colores de acento',
      title: 'Colores de acento',
      desc: 'Elige colores para títulos, negritas, código en línea, pensamiento, preguntas y cada fila de herramienta. Previsualiza en el panel y pulsa «Aplicar» para actualizar la conversación y guardar en este navegador.',
      'group.text.title': 'Resultados y énfasis',
      'group.text.desc': 'Títulos de Markdown, negritas y código en línea en las respuestas.',
      'group.rows.title': 'Filas de conversación',
      'group.rows.desc': 'Filas de pensamiento y de preguntas.',
      'group.tools.title': 'Filas de herramientas',
      'group.tools.desc': 'Colorea el icono y el título de cada fila según la herramienta; las no listadas usan «Otras herramientas».',
      'item.heading.label': 'Título',
      'item.heading.hint': 'Títulos de Markdown 1–6',
      'item.strong.label': 'Negrita',
      'item.strong.hint': 'Negrita de Markdown (strong / b)',
      'item.inlineCode.label': 'Código en línea',
      'item.inlineCode.hint': 'Código en línea (por defecto el azul de enlaces, sigue el tema)',
      'item.inlineCode.badge': 'Azul de enlace',
      'item.think.label': 'Pensamiento',
      'item.think.hint': 'Fila Think y contenido expandido (sigue el tema por defecto)',
      'item.think.badge': 'Original',
      'item.question.label': 'Pregunta',
      'item.question.hint': 'Fila de ask_user_question',
      'item.bash.label': 'Ejecutar comando',
      'item.bash.hint': 'bash / pwsh',
      'item.edit.label': 'Editar',
      'item.edit.hint': 'edit',
      'item.write.label': 'Escribir',
      'item.write.hint': 'write',
      'item.read.label': 'Leer',
      'item.read.hint': 'read / web_fetch',
      'item.search.label': 'Buscar',
      'item.search.hint': 'grep / glob / web_search',
      'item.code.label': 'Código',
      'item.code.hint': 'run_code',
      'item.todo.label': 'Tarea',
      'item.todo.hint': 'todo_write',
      'item.skill.label': 'Habilidad',
      'item.skill.hint': 'skill',
      'item.plugin.label': 'Complemento',
      'item.plugin.hint': 'herramientas cordis_*',
      'item.other.label': 'Otras herramientas',
      'item.other.hint': 'Herramientas no listadas arriba',
      'button.default': 'Predeterminado',
      'button.resetAll': 'Restablecer todo',
      'button.apply': 'Aplicar',
      'apply.aria': 'Aplicar colores',
      'apply.pending': 'Hay cambios de color sin aplicar',
      'footer.hint': 'Los colores se aplican a la conversación y se guardan en localStorage del navegador al pulsar «Aplicar»; settings.yaml no se modifica.',
      'hex.aria': 'Color hexadecimal',
      'swatch.ariaSuffix': 'color',
      'preview.title': 'Vista previa (todos los ajustes)',
      'preview.plainBefore': 'Texto normal, ',
      'preview.bold': 'énfasis en negrita',
      'preview.plainAfter': '; el resto mantiene su color.',
      'preview.codeBefore': 'Código en línea',
      'preview.codeAfter': 'coincide con los enlaces.',
      'preview.think.summary': 'Preparando los pasos finales de verificación',
      'preview.question.summary': 'Confirmar el alcance del archivo',
      'preview.bash.summary': 'Verify archive and release layout',
      'preview.edit.summary': 'docs/release/2026-11-13/README.md',
      'preview.write.summary': 'docs/release/2026-11-13/README.md',
      'preview.read.summary': 'docs/release/2026-11-13/README.md',
      'preview.search.summary': 'TODO in docs',
      'preview.code.summary': "print('hello')",
      'preview.todo.summary': 'Preparar la lista de publicación',
      'preview.skill.summary': 'openspec-apply-change',
      'preview.plugin.summary': 'cordis_run',
      'preview.other.summary': 'mcp__dbx__list_tables'
    }

    /** French dictionary; mirrors the zh key set. */
    const fr = {
      nav: 'Couleurs d’accent',
      title: 'Couleurs d’accent',
      desc: 'Choisissez les couleurs des titres, du gras, du code en ligne, de la réflexion, des questions et de chaque ligne d’outil. Prévisualisez dans le panneau, puis cliquez sur « Appliquer » pour mettre à jour la conversation et enregistrer dans ce navigateur.',
      'group.text.title': 'Résultats et emphase',
      'group.text.desc': 'Titres Markdown, gras et code en ligne dans les réponses.',
      'group.rows.title': 'Lignes de conversation',
      'group.rows.desc': 'Lignes de réflexion et de question.',
      'group.tools.title': 'Lignes d’outils',
      'group.tools.desc': 'Colore l’icône et le titre de chaque ligne selon l’outil ; les outils non listés utilisent « Autres outils ».',
      'item.heading.label': 'Titre',
      'item.heading.hint': 'Titres Markdown 1 à 6',
      'item.strong.label': 'Gras',
      'item.strong.hint': 'Gras Markdown (strong / b)',
      'item.inlineCode.label': 'Code en ligne',
      'item.inlineCode.hint': 'Code en ligne (par défaut le bleu des liens, suit le thème)',
      'item.inlineCode.badge': 'Bleu des liens',
      'item.think.label': 'Réflexion',
      'item.think.hint': 'Ligne Think et contenu déplié (suit le thème par défaut)',
      'item.think.badge': 'Original',
      'item.question.label': 'Question',
      'item.question.hint': 'Ligne ask_user_question',
      'item.bash.label': 'Exécuter une commande',
      'item.bash.hint': 'bash / pwsh',
      'item.edit.label': 'Édition',
      'item.edit.hint': 'edit',
      'item.write.label': 'Écriture',
      'item.write.hint': 'write',
      'item.read.label': 'Lecture',
      'item.read.hint': 'read / web_fetch',
      'item.search.label': 'Recherche',
      'item.search.hint': 'grep / glob / web_search',
      'item.code.label': 'Code',
      'item.code.hint': 'run_code',
      'item.todo.label': 'Tâche',
      'item.todo.hint': 'todo_write',
      'item.skill.label': 'Compétence',
      'item.skill.hint': 'skill',
      'item.plugin.label': 'Extension',
      'item.plugin.hint': 'outils cordis_*',
      'item.other.label': 'Autres outils',
      'item.other.hint': 'Outils non listés ci-dessus',
      'button.default': 'Par défaut',
      'button.resetAll': 'Tout réinitialiser',
      'button.apply': 'Appliquer',
      'apply.aria': 'Appliquer les couleurs',
      'apply.pending': 'Des changements de couleur ne sont pas appliqués',
      'footer.hint': 'Les couleurs sont appliquées à la conversation et enregistrées dans le localStorage du navigateur après un clic sur « Appliquer » ; settings.yaml n’est pas modifié.',
      'hex.aria': 'Couleur hexadécimale',
      'swatch.ariaSuffix': 'couleur',
      'preview.title': 'Aperçu (tous les réglages)',
      'preview.plainBefore': 'Texte normal, ',
      'preview.bold': 'emphase en gras',
      'preview.plainAfter': ' ; le reste garde sa couleur.',
      'preview.codeBefore': 'Le code en ligne',
      'preview.codeAfter': 'correspond aux liens.',
      'preview.think.summary': 'Préparation des étapes de vérification finales',
      'preview.question.summary': 'Confirmer la portée de l’archivage',
      'preview.bash.summary': 'Verify archive and release layout',
      'preview.edit.summary': 'docs/release/2026-11-13/README.md',
      'preview.write.summary': 'docs/release/2026-11-13/README.md',
      'preview.read.summary': 'docs/release/2026-11-13/README.md',
      'preview.search.summary': 'TODO in docs',
      'preview.code.summary': "print('hello')",
      'preview.todo.summary': 'Préparer la liste de publication',
      'preview.skill.summary': 'openspec-apply-change',
      'preview.plugin.summary': 'cordis_run',
      'preview.other.summary': 'mcp__dbx__list_tables'
    }

    /** German dictionary; mirrors the zh key set. */
    const de = {
      nav: 'Akzentfarben',
      title: 'Akzentfarben',
      desc: 'Lege Farben für Überschriften, Fettdruck, Inline-Code, Denken, Fragen und jede Werkzeugzeile fest. Prüfe sie in der Vorschau und klicke auf „Anwenden“, um sie auf die Unterhaltung zu übertragen und in diesem Browser zu speichern.',
      'group.text.title': 'Ergebnisse & Hervorhebung',
      'group.text.desc': 'Markdown-Überschriften, Fettdruck und Inline-Code in Antworten.',
      'group.rows.title': 'Konversationszeilen',
      'group.rows.desc': 'Denk- und Fragezeilen.',
      'group.tools.title': 'Werkzeugzeilen',
      'group.tools.desc': 'Färbt Symbol und Titel jeder Zeile nach Werkzeug; nicht gelistete Werkzeuge nutzen „Andere Werkzeuge“.',
      'item.heading.label': 'Überschrift',
      'item.heading.hint': 'Markdown-Überschriften 1–6',
      'item.strong.label': 'Fettdruck',
      'item.strong.hint': 'Markdown-Fettdruck (strong / b)',
      'item.inlineCode.label': 'Inline-Code',
      'item.inlineCode.hint': 'Inline-Code (standardmäßig Link-Blau, folgt dem Theme)',
      'item.inlineCode.badge': 'Link-Blau',
      'item.think.label': 'Denken',
      'item.think.hint': 'Think-Zeile und aufgeklappter Inhalt (folgt standardmäßig dem Theme)',
      'item.think.badge': 'Original',
      'item.question.label': 'Frage',
      'item.question.hint': 'ask_user_question-Zeile',
      'item.bash.label': 'Befehl ausführen',
      'item.bash.hint': 'bash / pwsh',
      'item.edit.label': 'Bearbeiten',
      'item.edit.hint': 'edit',
      'item.write.label': 'Schreiben',
      'item.write.hint': 'write',
      'item.read.label': 'Lesen',
      'item.read.hint': 'read / web_fetch',
      'item.search.label': 'Suchen',
      'item.search.hint': 'grep / glob / web_search',
      'item.code.label': 'Code',
      'item.code.hint': 'run_code',
      'item.todo.label': 'Aufgabe',
      'item.todo.hint': 'todo_write',
      'item.skill.label': 'Fähigkeit',
      'item.skill.hint': 'skill',
      'item.plugin.label': 'Plugin',
      'item.plugin.hint': 'cordis_*-Werkzeuge',
      'item.other.label': 'Andere Werkzeuge',
      'item.other.hint': 'Nicht oben gelistete Werkzeuge',
      'button.default': 'Standard',
      'button.resetAll': 'Alles zurücksetzen',
      'button.apply': 'Anwenden',
      'apply.aria': 'Farben anwenden',
      'apply.pending': 'Nicht angewendete Farbänderungen',
      'footer.hint': '„Anwenden“ überträgt die Farben auf die Unterhaltung und speichert sie im localStorage des Browsers; settings.yaml wird nicht geschrieben.',
      'hex.aria': 'Hex-Farbe',
      'swatch.ariaSuffix': 'Farbe',
      'preview.title': 'Vorschau (alle Einstellungen)',
      'preview.plainBefore': 'Normaler Text, ',
      'preview.bold': 'fette Hervorhebung',
      'preview.plainAfter': ', der Rest behält seine Farbe.',
      'preview.codeBefore': 'Inline-Code',
      'preview.codeAfter': 'entspricht Links.',
      'preview.think.summary': 'Letzte Prüfschritte zusammenstellen',
      'preview.question.summary': 'Archivumfang bestätigen',
      'preview.bash.summary': 'Verify archive and release layout',
      'preview.edit.summary': 'docs/release/2026-11-13/README.md',
      'preview.write.summary': 'docs/release/2026-11-13/README.md',
      'preview.read.summary': 'docs/release/2026-11-13/README.md',
      'preview.search.summary': 'TODO in docs',
      'preview.code.summary': "print('hello')",
      'preview.todo.summary': 'Release-Checkliste vorbereiten',
      'preview.skill.summary': 'openspec-apply-change',
      'preview.plugin.summary': 'cordis_run',
      'preview.other.summary': 'mcp__dbx__list_tables'
    }

    /** Russian dictionary; mirrors the zh key set. */
    const ru = {
      nav: 'Акцентные цвета',
      title: 'Акцентные цвета',
      desc: 'Выберите цвета для заголовков, жирного текста, встроенного кода, размышлений, вопросов и строк инструментов. Проверьте их в панели и нажмите «Применить», чтобы обновить беседу и сохранить в этом браузере.',
      'group.text.title': 'Заголовки и выделение',
      'group.text.desc': 'Заголовки Markdown, жирный текст и встроенный код в ответах.',
      'group.rows.title': 'Строки диалога',
      'group.rows.desc': 'Строки размышлений и вопросов.',
      'group.tools.title': 'Строки инструментов',
      'group.tools.desc': 'Окрашивает значок и заголовок строки по типу инструмента; для остальных используется «Другие инструменты».',
      'item.heading.label': 'Заголовок',
      'item.heading.hint': 'Заголовки Markdown 1–6',
      'item.strong.label': 'Жирный текст',
      'item.strong.hint': 'Жирный текст Markdown (strong / b)',
      'item.inlineCode.label': 'Встроенный код',
      'item.inlineCode.hint': 'Встроенный код (по умолчанию синий как ссылки, следует теме)',
      'item.inlineCode.badge': 'Синий ссылок',
      'item.think.label': 'Размышление',
      'item.think.hint': 'Строка Think и раскрытое содержимое (по умолчанию как в теме)',
      'item.think.badge': 'Исходный',
      'item.question.label': 'Вопрос',
      'item.question.hint': 'Строка ask_user_question',
      'item.bash.label': 'Выполнение команды',
      'item.bash.hint': 'bash / pwsh',
      'item.edit.label': 'Правка',
      'item.edit.hint': 'edit',
      'item.write.label': 'Запись',
      'item.write.hint': 'write',
      'item.read.label': 'Чтение',
      'item.read.hint': 'read / web_fetch',
      'item.search.label': 'Поиск',
      'item.search.hint': 'grep / glob / web_search',
      'item.code.label': 'Код',
      'item.code.hint': 'run_code',
      'item.todo.label': 'Задача',
      'item.todo.hint': 'todo_write',
      'item.skill.label': 'Навык',
      'item.skill.hint': 'skill',
      'item.plugin.label': 'Плагин',
      'item.plugin.hint': 'инструменты cordis_*',
      'item.other.label': 'Другие инструменты',
      'item.other.hint': 'Инструменты, не перечисленные выше',
      'button.default': 'По умолчанию',
      'button.resetAll': 'Сбросить всё',
      'button.apply': 'Применить',
      'apply.aria': 'Применить цвета',
      'apply.pending': 'Есть неприменённые изменения цветов',
      'footer.hint': '«Применить» переносит цвета в беседу и сохраняет их в localStorage браузера; settings.yaml не изменяется.',
      'hex.aria': 'Шестнадцатеричный цвет',
      'swatch.ariaSuffix': 'цвет',
      'preview.title': 'Предпросмотр (все настройки)',
      'preview.plainBefore': 'Обычный текст, ',
      'preview.bold': 'жирное выделение',
      'preview.plainAfter': ', остальное сохраняет свой цвет.',
      'preview.codeBefore': 'Встроенный код',
      'preview.codeAfter': 'совпадает со ссылками.',
      'preview.think.summary': 'Подготовка финальных шагов проверки',
      'preview.question.summary': 'Подтвердить область архивации',
      'preview.bash.summary': 'Verify archive and release layout',
      'preview.edit.summary': 'docs/release/2026-11-13/README.md',
      'preview.write.summary': 'docs/release/2026-11-13/README.md',
      'preview.read.summary': 'docs/release/2026-11-13/README.md',
      'preview.search.summary': 'TODO in docs',
      'preview.code.summary': "print('hello')",
      'preview.todo.summary': 'Подготовить список выпуска',
      'preview.skill.summary': 'openspec-apply-change',
      'preview.plugin.summary': 'cordis_run',
      'preview.other.summary': 'mcp__dbx__list_tables'
    }

    /** Portuguese dictionary; mirrors the zh key set. */
    const pt = {
      nav: 'Cores de destaque',
      title: 'Cores de destaque',
      desc: 'Escolha as cores de títulos, negrito, código embutido, raciocínio, perguntas e cada linha de ferramenta. Visualize no painel e clique em «Aplicar» para atualizar a conversa e salvar neste navegador.',
      'group.text.title': 'Resultados e ênfase',
      'group.text.desc': 'Títulos Markdown, negrito e código embutido nas respostas.',
      'group.rows.title': 'Linhas da conversa',
      'group.rows.desc': 'Linhas de raciocínio e de pergunta.',
      'group.tools.title': 'Linhas de ferramentas',
      'group.tools.desc': 'Colore o ícone e o título de cada linha por ferramenta; as não listadas usam «Outras ferramentas».',
      'item.heading.label': 'Título',
      'item.heading.hint': 'Títulos Markdown 1–6',
      'item.strong.label': 'Negrito',
      'item.strong.hint': 'Negrito do Markdown (strong / b)',
      'item.inlineCode.label': 'Código embutido',
      'item.inlineCode.hint': 'Código embutido (por padrão o azul dos links, segue o tema)',
      'item.inlineCode.badge': 'Azul de link',
      'item.think.label': 'Raciocínio',
      'item.think.hint': 'Linha Think e conteúdo expandido (segue o tema por padrão)',
      'item.think.badge': 'Original',
      'item.question.label': 'Pergunta',
      'item.question.hint': 'Linha ask_user_question',
      'item.bash.label': 'Executar comando',
      'item.bash.hint': 'bash / pwsh',
      'item.edit.label': 'Editar',
      'item.edit.hint': 'edit',
      'item.write.label': 'Escrever',
      'item.write.hint': 'write',
      'item.read.label': 'Ler',
      'item.read.hint': 'read / web_fetch',
      'item.search.label': 'Pesquisar',
      'item.search.hint': 'grep / glob / web_search',
      'item.code.label': 'Código',
      'item.code.hint': 'run_code',
      'item.todo.label': 'Tarefa',
      'item.todo.hint': 'todo_write',
      'item.skill.label': 'Habilidade',
      'item.skill.hint': 'skill',
      'item.plugin.label': 'Plugin',
      'item.plugin.hint': 'ferramentas cordis_*',
      'item.other.label': 'Outras ferramentas',
      'item.other.hint': 'Ferramentas não listadas acima',
      'button.default': 'Padrão',
      'button.resetAll': 'Restaurar tudo',
      'button.apply': 'Aplicar',
      'apply.aria': 'Aplicar cores',
      'apply.pending': 'Há alterações de cor não aplicadas',
      'footer.hint': 'As cores são aplicadas à conversa e salvas no localStorage do navegador ao clicar em «Aplicar»; o settings.yaml não é alterado.',
      'hex.aria': 'Cor hexadecimal',
      'swatch.ariaSuffix': 'cor',
      'preview.title': 'Prévia (todas as configurações)',
      'preview.plainBefore': 'Texto normal, ',
      'preview.bold': 'ênfase em negrito',
      'preview.plainAfter': '; o restante mantém a cor.',
      'preview.codeBefore': 'Código embutido',
      'preview.codeAfter': 'combina com os links.',
      'preview.think.summary': 'Preparando as etapas finais de verificação',
      'preview.question.summary': 'Confirmar o escopo do arquivamento',
      'preview.bash.summary': 'Verify archive and release layout',
      'preview.edit.summary': 'docs/release/2026-11-13/README.md',
      'preview.write.summary': 'docs/release/2026-11-13/README.md',
      'preview.read.summary': 'docs/release/2026-11-13/README.md',
      'preview.search.summary': 'TODO in docs',
      'preview.code.summary': "print('hello')",
      'preview.todo.summary': 'Preparar a lista de lançamento',
      'preview.skill.summary': 'openspec-apply-change',
      'preview.plugin.summary': 'cordis_run',
      'preview.other.summary': 'mcp__dbx__list_tables'
    }

    /**
     * 全部语言字典：键集一致，与 DSH 支持的语言 id 一一对应。
     * DSH 的语言定义（ja/es/fr/de/ru/pt，回退 en）由 locale 插件注册，
     * 插件只需把同一命名空间的字典注册上去。
     */
    const DICTS = { zh, en, ja, es, fr, de, ru, pt }

    /** 当前翻译函数：apply 后绑定到 locale 服务，测试时用中文字典兜底。 */
    let translate = (key) => zh[key] ?? key

    /** 订阅者集合：设置面板打开期间接收配色变更。 */
    const listeners = new Set()

    /** 预览滚动订阅者：取色后把对应样例行滚入可视区，保证即时可见。 */
    const previewListeners = new Set()

    /**
     * 分类键转 CSS 变量名：驼峰键（如 inlineCode）映射为连字符变量（--dsh-accent-inline-code）。
     * @param key - DEFAULTS 的键。
     * @returns 对应的 CSS 变量名。
     */
    function cssVarName(key) {
      return VAR_PREFIX + key.replace(/[A-Z]/g, (letter) => '-' + letter.toLowerCase())
    }

    /** 已应用配色：写入页面根元素并持久化，只有用户点击「应用」才会变化。 */
    let applied = loadColors()

    /** 待应用配色：面板里正在编辑的副本，只驱动预览；关闭面板时丢弃。 */
    let draft = { ...applied }

    /** 预览作用域元素：面板挂载时绑定，draft 变量写在这里而不是根元素。 */
    let previewScope = null

    /**
     * 规范化颜色值：统一小写并把三位十六进制展开成六位。
     * @param value - 用户输入或存储中的原始值。
     * @returns 合法的小写六位十六进制颜色，非法值返回 null。
     */
    function sanitizeColor(value) {
      // 只接受十六进制色值，避免把任意字符串写进 CSS 变量。
      if (typeof value !== 'string') {
        return null
      }
      const trimmed = value.trim().toLowerCase()
      if (!COLOR_PATTERN.test(trimmed)) {
        return null
      }
      // #abc → #aabbcc：色块只认六位，dirty 比较也不该被三种写法干扰。
      if (trimmed.length === 4) {
        return '#' + trimmed[1] + trimmed[1] + trimmed[2] + trimmed[2] + trimmed[3] + trimmed[3]
      }
      return trimmed
    }

    /**
     * 读取存储中的配色表：优先当前信封，其次迁移旧信封（v2）与旧扁平对象（v1）。
     * @returns {{ colors: object, migrated: boolean } | null} null 表示没有任何存储。
     */
    function readStoredColors() {
      try {
        const rawCurrent = window.localStorage.getItem(STORAGE_KEY)
        if (rawCurrent !== null) {
          const parsed = JSON.parse(rawCurrent)
          if (parsed !== null && typeof parsed === 'object' && parsed.version === STORAGE_VERSION && typeof parsed.colors === 'object' && parsed.colors !== null) {
            return { colors: parsed.colors, migrated: false }
          }
        }
        for (const key of LEGACY_STORAGE_KEYS) {
          const rawLegacy = window.localStorage.getItem(key)
          if (rawLegacy === null) {
            continue
          }
          const legacy = JSON.parse(rawLegacy)
          if (legacy === null || typeof legacy !== 'object') {
            continue
          }
          // v2 是 {version, colors} 信封，v1 本身就是扁平色表，两种都归一成色表使用。
          const colors = typeof legacy.colors === 'object' && legacy.colors !== null ? legacy.colors : legacy
          return { colors, migrated: true }
        }
        return null
      } catch {
        // 存储被禁用或内容损坏时按“无自定义”处理。
        return null
      }
    }

    /**
     * 把配色表写入本地存储（带版本信封），只落盘与出厂默认不同的项。
     * 这样以后调整默认色时，没动过的分类会自动跟随新默认，不会被旧默认挡住。
     * @param colors - 待写入的配色对象。
     */
    function writeStoredColors(colors) {
      const custom = {}
      // 单次遍历筛出用户真正改过的分类，避免把整张默认表写进存储。
      for (const key of Object.keys(DEFAULTS)) {
        const value = colors[key]
        if (value !== DEFAULTS[key]) {
          custom[key] = value
        }
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, colors: custom }))
      for (const key of LEGACY_STORAGE_KEYS) {
        window.localStorage.removeItem(key)
      }
    }

    /**
     * 读取配色表：默认值打底，再叠加本地存储中的合法项。
     * @returns 全新配色对象。
     */
    function loadColors() {
      const merged = { ...DEFAULTS }
      const stored = readStoredColors()
      if (stored !== null) {
        // 逐项校验，缺失或损坏的字段自动回落到默认色。
        for (const key of Object.keys(DEFAULTS)) {
          const storedValue = stored.colors[key]
          // 显式保存的 null 表示“沿用原色”，需要原样保留。
          if (storedValue === null) {
            merged[key] = null
            continue
          }
          const value = sanitizeColor(storedValue)
          if (value !== null) {
            merged[key] = value
          }
        }
        if (stored.migrated) {
          // 旧存储把整张默认表也写了进去：与历史默认相同的项视为没改过，交给新默认。
          for (const key of Object.keys(STALE_DEFAULTS)) {
            if (STALE_DEFAULTS[key].includes(merged[key])) {
              merged[key] = DEFAULTS[key]
            }
          }
          saveColors(merged)
        }
      }
      return merged
    }

    /**
     * 持久化配色表；存储不可用时仅保留内存状态。
     * @param colors - 待写入的配色对象。
     */
    function saveColors(colors) {
      try {
        writeStoredColors(colors)
      } catch {
        // 存储写入失败不影响本次会话内的即时效果。
      }
    }

    /**
     * 把已应用配色写入根元素的 CSS 变量，样式表据此实时生效。
     * 值为 null 的分类移除变量并去掉对应开关属性，让页面回到 DSH 原色。
     * @param keys - 只刷新这些分类（应用时只写变化的变量）；省略表示整表刷新。
     */
    function applyColors(keys) {
      // 非浏览器环境（例如渲染测试）没有 document，直接跳过。
      if (typeof document === 'undefined') {
        return
      }
      const root = document.documentElement
      const targets = keys === undefined ? Object.keys(DEFAULTS) : Array.from(keys)
      for (const key of targets) {
        if (applied[key] === null) {
          root.style.removeProperty(cssVarName(key))
        } else {
          root.style.setProperty(cssVarName(key), applied[key])
        }
      }
      // 思考行的覆盖样式以 html 上的属性为开关，默认保留主题原色。
      if (targets.includes('think')) {
        if (applied.think === null) {
          root.removeAttribute('data-dsh-accent-think')
        } else {
          root.setAttribute('data-dsh-accent-think', '')
        }
      }
      // 整表刷新时补一次总开关属性，让页面知道插件已经接管配色。
      if (keys === undefined) {
        root.setAttribute('data-dsh-accent', 'on')
      }
    }

    /**
     * 把待应用配色写到面板作用域元素上，只影响预览区域。
     * @param keys - 待刷新的分类键；面板未挂载时不做任何事。
     */
    function applyDraftToScope(keys) {
      if (previewScope === null) {
        return
      }
      for (const key of keys) {
        if (draft[key] === null) {
          previewScope.style.removeProperty(cssVarName(key))
        } else {
          previewScope.style.setProperty(cssVarName(key), draft[key])
        }
      }
    }

    /**
     * 绑定或解绑预览作用域：挂载时把整份 draft 刷到面板节点上，卸载时解绑。
     * @param element - 面板根节点，null 表示面板已卸载。
     */
    function setPreviewScope(element) {
      previewScope = element
      if (element !== null) {
        applyDraftToScope(Object.keys(DEFAULTS))
      }
    }

    /** 待写入的变量键：拖动取色时把高频事件攒起来，每帧只刷一次面板作用域。 */
    let visualKeys = new Set()

    /** 已排期的视觉刷新句柄（requestAnimationFrame 返回值）。 */
    let visualFrame = null

    /**
     * 排一次视觉刷新：一帧内的多次取色合并为一次作用域变量写入与一次面板重渲染。
     * 这里只写面板作用域，绝不写根元素；根元素只由 applyDraft 写入。
     * @param id - 本次改动的分类键。
     */
    function scheduleVisual(id) {
      visualKeys.add(id)
      // 已经排过帧就只累积变化，等这一帧统一写入。
      if (visualFrame !== null) {
        return
      }
      if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
        visualFrame = window.requestAnimationFrame(flushVisual)
        return
      }
      // 没有 requestAnimationFrame 的环境（例如自测）直接同步刷新。
      flushVisual()
    }

    /** 取消已排期的视觉刷新，避免卸载后还写样式。 */
    function cancelVisual() {
      if (visualFrame !== null) {
        if (typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function') {
          window.cancelAnimationFrame(visualFrame)
        }
        visualFrame = null
      }
    }

    /** 立即把攒下的颜色写进面板作用域并通知面板重渲染。 */
    function flushVisual() {
      cancelVisual()
      const keys = visualKeys
      visualKeys = new Set()
      // 没有待刷新项时不做任何样式重算。
      if (keys.size === 0) {
        return
      }
      applyDraftToScope(keys)
      emitColors()
    }

    /** 预览自动滚动的延迟句柄：取色停顿后才滚动，拖动过程中不做布局查询。 */
    let revealTimer = null

    /** 本轮最后改动的分类键，停顿后用于定位预览样例。 */
    let revealTargetId = null

    /** 预览定位延迟：略大于数帧，取色停顿后才滚动预览。 */
    const REVEAL_DELAY_MS = 160

    /**
     * 延迟定位预览：拖动取色时只在停顿后滚动一次。
     * 拖动过程中逐事件滚动预览会强制同步重排，是卡顿的主因。
     * @param id - 本次改动的分类键。
     */
    function schedulePreviewReveal(id) {
      revealTargetId = id
      if (revealTimer !== null) {
        clearTimeout(revealTimer)
      }
      revealTimer = setTimeout(flushPreviewReveal, REVEAL_DELAY_MS)
    }

    /** 取消待执行的预览定位，面板卸载时调用。 */
    function cancelPreviewReveal() {
      if (revealTimer !== null) {
        clearTimeout(revealTimer)
        revealTimer = null
      }
      revealTargetId = null
    }

    /** 立即定位预览：取色停顿或面板卸载时调用。 */
    function flushPreviewReveal() {
      if (revealTimer !== null) {
        clearTimeout(revealTimer)
        revealTimer = null
      }
      const id = revealTargetId
      revealTargetId = null
      if (id !== null) {
        notifyPreview(id)
      }
    }

    /** 通知所有订阅者待应用配色已变化；每次都发新对象，应用后按钮状态才能立刻复位。 */
    function emitColors() {
      for (const listener of listeners) {
        listener({ ...draft })
      }
    }

    /** 通知所有预览滚动订阅者：某分类刚被取色。 */
    function notifyPreview(id) {
      for (const listener of previewListeners) {
        listener(id)
      }
    }

    /**
     * 订阅预览滚动事件。
     * @param listener - 取色后的回调，参数为分类键。
     * @returns 取消订阅函数。
     */
    function subscribePreview(listener) {
      previewListeners.add(listener)
      return () => {
        previewListeners.delete(listener)
      }
    }

    /**
     * 修改单个分类的待应用颜色：只更新 draft 与预览，不写根元素、不落盘。
     * @param id - 分类键名（DEFAULTS 的键）。
     * @param value - 新颜色值；传 null 表示恢复原色（不覆盖）。
     */
    function setColor(id, value) {
      const next = value === null ? null : sanitizeColor(value)
      // 非法值或颜色未变化时不产生任何副作用。
      if (value !== null && next === null) {
        return
      }
      if (draft[id] === next) {
        return
      }
      draft = { ...draft, [id]: next }
      scheduleVisual(id)
      schedulePreviewReveal(id)
    }

    /** 待应用配色与已应用配色的差异键。 */
    function dirtyKeys() {
      return Object.keys(DEFAULTS).filter((key) => draft[key] !== applied[key])
    }

    /**
     * 判断一份配色相对已应用配色是否有差异（供面板派生按钮状态）。
     * @param colors - 待比较的配色表。
     * @returns 存在任意差异时为 true。
     */
    function hasPending(colors) {
      return Object.keys(DEFAULTS).some((key) => colors[key] !== applied[key])
    }

    /** 面板挂载：从已应用配色开始编辑。 */
    function beginDraft() {
      draft = { ...applied }
    }

    /** 面板卸载：丢弃未应用的修改。 */
    function discardDraft() {
      cancelVisual()
      visualKeys = new Set()
      draft = { ...applied }
    }

    /**
     * 应用待应用配色：一次写入全部差异键、落盘并通知面板刷新。
     * 这是根元素唯一的业务写入路径。
     * @returns 本次写入的分类键；没有差异时为空数组。
     */
    function applyDraft() {
      const keys = dirtyKeys()
      if (keys.length === 0) {
        return []
      }
      applied = { ...draft }
      applyColors(keys)
      saveColors(applied)
      emitColors()
      return keys
    }

    /** 全部恢复默认：只修改待应用配色，仍需点「应用」才生效。 */
    function resetColors() {
      draft = { ...DEFAULTS }
      // 重置是一次性操作：整表刷新面板作用域，预览不因重置而滚动。
      cancelVisual()
      visualKeys = new Set()
      applyDraftToScope(Object.keys(DEFAULTS))
      emitColors()
    }

    /**
     * 订阅配色变更。
     * @param listener - 配色变化后的回调。
     * @returns 取消订阅函数。
     */
    function subscribeColors(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    }

    /** 读取待应用配色表的副本，供面板初始状态使用。 */
    function getColors() {
      return { ...draft }
    }

    /** 读取已应用配色表的副本，用于判断未应用状态。 */
    function getAppliedColors() {
      return { ...applied }
    }

    /**
     * 预览行颜色：已取色用变量，未覆盖时回落到占位色（不再写死具体颜色）。
     * @param id - 分类键名。
     * @returns 可直接放进内联 style 的 CSS 颜色表达式。
     */
    function previewColor(id) {
      const fallback = DEFAULTS[id] === null ? FALLBACK_SWATCH[id] : DEFAULTS[id]
      return 'var(' + cssVarName(id) + ', ' + fallback + ')'
    }

    /**
     * 十六进制输入框：允许手动输入，失焦或回车时提交，非法输入回滚到当前值。
     * 未编辑时直接展示外部颜色，省掉“同步草稿”的额外渲染，拖动取色时不额外重渲染。
     * @param props.value - 当前颜色。
     * @param props.onCommit - 合法颜色提交回调。
     * @param props.t - 翻译函数。
     */
    function HexField({ value, onCommit, t }) {
      // null 表示当前没有在编辑，输入框显示外部颜色并跟随取色器实时变化。
      const [typed, setTyped] = React.useState(null)
      const editing = typed !== null

      /** 提交输入：合法则回调，非法则回滚到外部颜色。 */
      const commit = () => {
        if (!editing) {
          return
        }
        const next = sanitizeColor(typed)
        setTyped(null)
        if (next === null) {
          return
        }
        onCommit(next)
      }

      return h('input', {
        className: 'dsh-accent-hex',
        value: editing ? typed : value,
        spellCheck: false,
        'aria-label': t('hex.aria'),
        onChange: (event) => setTyped(event.target.value),
        onBlur: commit,
        onKeyDown: (event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            commit()
            event.currentTarget.blur()
          }
        }
      })
    }

    /**
     * 单个分类的取色行：色块、十六进制输入与恢复默认按钮。
     * 值为 null 表示该分类不覆盖、跟随 DSH 默认（用占位色展示并标注徽标）。
     * @param props.item - 分类定义（labelKey / hintKey / badgeKey）。
     * @param props.value - 当前颜色，null 表示不覆盖。
     * @param props.t - 翻译函数。
     */
    function ColorRow({ item, value, t }) {
      const isOriginal = value === null
      // 控件需要一个具体色值：未覆盖时用占位色展示，但不写入页面。
      const swatch = isOriginal ? FALLBACK_SWATCH[item.id] ?? DEFAULTS[item.id] : value
      const label = t(item.labelKey)
      return h(
        'div',
        { className: 'dsh-accent-row' },
        h(
          'div',
          { className: 'dsh-accent-row-text' },
          h(
            'span',
            { className: 'dsh-accent-row-label' },
            label,
            isOriginal && item.badgeKey ? h('span', { className: 'dsh-accent-badge' }, t(item.badgeKey)) : null
          ),
          h('span', { className: 'dsh-accent-row-hint' }, t(item.hintKey))
        ),
        h(
          'div',
          { className: 'dsh-accent-row-controls' },
          h('input', {
            className: 'dsh-accent-swatch',
            type: 'color',
            value: swatch,
            'aria-label': label + ' ' + t('swatch.ariaSuffix'),
            // 取色器拖动会连续触发 onChange，只更新待应用配色与预览，不碰会话与存储。
            onChange: (event) => setColor(item.id, event.target.value)
          }),
          h(HexField, { value: swatch, onCommit: (next) => setColor(item.id, next), t }),
          h(
            'button',
            {
              className: 'dsh-accent-reset',
              type: 'button',
              onClick: () => setColor(item.id, DEFAULTS[item.id])
            },
            t('button.default')
          )
        )
      )
    }

    /**
     * 效果预览：列举全部 15 项设置，正文区域可独立滚动。
     * 标题行右侧常驻「应用」按钮；预览使用待应用配色，只影响面板作用域。
     * @param props.t - 翻译函数。
     * @param props.dirty - 是否存在未应用的配色差异。
     */
    function AccentPreview({ t, dirty }) {
      const bodyRef = React.useRef(null)

      // 订阅取色事件：取色停顿后把刚改动的分类样例滚入预览可视区。
      React.useEffect(() => {
        /** 已定位过的样例行：缓存下来，避免每次取色都 querySelector 触发样式重算。 */
        const nodes = new Map()
        return subscribePreview((id) => {
          const body = bodyRef.current
          if (body === null) {
            return
          }
          let target = nodes.get(id)
          if (target === undefined || target.isConnected === false) {
            target = body.querySelector('[data-accent-preview="' + id + '"]')
            if (target === null) {
              return
            }
            nodes.set(id, target)
          }
          // 样例已经完整可见时不滚动，避免无意义的滚动与重绘。
          const bodyRect = body.getBoundingClientRect()
          const rowRect = target.getBoundingClientRect()
          if (rowRect.top >= bodyRect.top && rowRect.bottom <= bodyRect.bottom) {
            return
          }
          body.scrollTop += rowRect.top - bodyRect.top - PREVIEW_SCROLL_MARGIN_PX
        })
      }, [])

      return h(
        'div',
        { className: 'dsh-accent-preview' },
        h(
          'div',
          { className: 'dsh-accent-preview-head' },
          h('span', { className: 'dsh-accent-preview-title' }, t('preview.title')),
          h(
            'span',
            { className: 'dsh-accent-preview-actions' },
            // 未应用状态播报：只在 dirty 翻转时更新文本，避免重复叨扰。
            h('span', { className: 'dsh-accent-sr-only', 'aria-live': 'polite' }, dirty ? t('apply.pending') : ''),
            h(
              'button',
              {
                className: 'dsh-accent-apply',
                type: 'button',
                disabled: !dirty,
                'aria-label': t('apply.aria'),
                onClick: () => {
                  applyDraft()
                }
              },
              t('button.apply')
            )
          )
        ),
        h(
          'div',
          { className: 'dsh-accent-preview-body', ref: bodyRef },
          h('h4', { className: 'dsh-accent-pv-heading', 'data-accent-preview': 'heading' }, t('item.heading.label')),
          h(
            'p',
            { className: 'dsh-accent-pv-text', 'data-accent-preview': 'strong' },
            t('preview.plainBefore'),
            h('strong', { className: 'dsh-accent-pv-strong' }, t('preview.bold')),
            t('preview.plainAfter')
          ),
          h(
            'p',
            { className: 'dsh-accent-pv-text', 'data-accent-preview': 'inlineCode' },
            t('preview.codeBefore') + ' ',
            h('code', { className: 'dsh-accent-pv-code' }, 'docs/release/2026-11-13/README.md'),
            ' ' + t('preview.codeAfter')
          ),
          PREVIEW_ROWS.map((row) =>
            h(
              'div',
              {
                className: 'dsh-accent-pv-row',
                key: row.id,
                'data-accent-preview': row.id,
                style: { color: previewColor(row.id) }
              },
              h('span', { className: 'dsh-accent-pv-dot' }),
              h('span', { className: 'dsh-accent-pv-label' }, t('item.' + row.id + '.label')),
              h('span', { className: 'dsh-accent-pv-sep' }, '·'),
              h('span', { className: 'dsh-accent-pv-summary' }, t(row.summaryKey))
            )
          )
        )
      )
    }

    /**
     * 设置面板正文：标题、全部设置的预览、分组取色与恢复默认。
     * 组件通过槽位拿到框架注入的 `t`，语言切换时随 locale 修订自动重渲染。
     * @param props.t - 翻译函数（settings.section 的 locale 席位）。
     */
    function AccentSection(props) {
      const t = props && typeof props.t === 'function' ? props.t : translate
      const [colors, setColorsState] = React.useState(() => getColors())
      const sectionRef = React.useRef(null)
      // 未应用状态由「当前渲染的配色」与模块里的已应用配色比较得出。
      const dirty = hasPending(colors)

      // 面板打开期间跟随待应用配色变更（取色、恢复默认、应用后的复位）。
      React.useEffect(() => subscribeColors(setColorsState), [])

      // 面板挂载：从已应用配色开始编辑，并把待应用变量限定在面板作用域内；
      // 关闭面板时丢弃未应用的修改，下一次打开重新从已应用配色开始。
      React.useEffect(() => {
        beginDraft()
        setColorsState(getColors())
        setPreviewScope(sectionRef.current)
        return () => {
          cancelPreviewReveal()
          setPreviewScope(null)
          discardDraft()
        }
      }, [])

      return h(
        'div',
        { className: 'dsh-accent-section', ref: sectionRef },
        h(
          'div',
          { className: 'dsh-accent-head' },
          h('h2', { className: 'dsh-accent-title' }, t('title')),
          h('p', { className: 'dsh-accent-desc' }, t('desc'))
        ),
        h(AccentPreview, { t, dirty }),
        GROUPS.map((group) =>
          h(
            'section',
            { className: 'dsh-accent-group', key: group.id },
            h(
              'div',
              { className: 'dsh-accent-group-head' },
              h('h3', { className: 'dsh-accent-group-title' }, t(group.titleKey)),
              h('p', { className: 'dsh-accent-group-desc' }, t(group.descKey))
            ),
            group.items.map((item) => h(ColorRow, { key: item.id, item, value: colors[item.id], t }))
          )
        ),
        h(
          'div',
          { className: 'dsh-accent-footer' },
          h('button', { className: 'dsh-accent-button', type: 'button', onClick: resetColors }, t('button.resetAll')),
          h('span', { className: 'dsh-accent-footer-hint' }, t('footer.hint'))
        )
      )
    }

    /**
     * 注入插件自有的样式表；卸载时随 fiber 一起移除。
     * @param ctx - 客户端 Cordis 上下文。
     */
    function installStyles(ctx) {
      ctx.effect(() => {
        const tag = document.createElement('style')
        tag.dataset.plugin = PLUGIN_ID
        tag.dataset.pluginCss = PLUGIN_ID + '/theme.css'
        tag.textContent = THEME_CSS
        document.head.appendChild(tag)
        return () => {
          tag.remove()
        }
      }, 'ui-accent: theme stylesheet')
    }

    /**
     * 注册全部语言字典并把模块翻译函数绑定到 locale 服务。
     * 语言切换时槽位按 locale 修订重渲染，导航与面板文案随之更新。
     * @param ctx - 客户端 Cordis 上下文。
     */
    function installLocale(ctx) {
      ctx.effect(() => {
        // 官方签名是 register(ns, { zh, en, ... })，zh 与 en 为必填基础语言。
        const offDictionaries = ctx.locale.register(SETTINGS_NS, DICTS)
        return () => {
          offDictionaries()
        }
      }, 'ui-accent: settings dictionaries')
      translate = ctx.locale.bind(SETTINGS_NS)
    }

    /** 客户端插件入口：应用配色、注入样式、注册字典并把取色面板注册进设置侧边栏。 */
    function apply(ctx) {
      // 启动时只恢复已应用配色；此后根元素只由用户点击「应用」写入。
      applyColors()
      installStyles(ctx)
      installLocale(ctx)
      ctx.slots.inject('settings.section', () =>
        ctx.slots.register(
          {
            name: 'settings.section',
            id: 'accent',
            order: 60,
            label: () => translate('nav'),
            locale: SETTINGS_NS
          },
          AccentSection
        )
      )
    }

    exports.apply = apply
    exports.inject = ['slots', 'locale']
    // 暴露组件与纯函数，便于本地渲染测试与二次开发。
    exports.AccentSection = AccentSection
    exports.AccentPreview = AccentPreview
    exports.SETTINGS_NS = SETTINGS_NS
    exports.DICTS = DICTS
    exports.SUPPORTED_LOCALES = Object.keys(DICTS)
    exports.COLOR_DEFAULTS = DEFAULTS
    exports.getColors = getColors
    exports.getAppliedColors = getAppliedColors
    exports.setColor = setColor
    exports.applyDraft = applyDraft
    exports.resetColors = resetColors
    exports.subscribeColors = subscribeColors
    exports.dirtyKeys = dirtyKeys
    exports.hasPending = hasPending
    exports.beginDraft = beginDraft
    exports.discardDraft = discardDraft
    exports.setPreviewScope = setPreviewScope
    exports.sanitizeColor = sanitizeColor
    return module.exports
  }
})
