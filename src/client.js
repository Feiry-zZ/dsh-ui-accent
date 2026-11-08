window.__ModuleLoader__.load({
  id: 'dsh-ui-accent',
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports
    const React = require('react')
    const h = React.createElement

    /** 构建时注入的样式表正文，占位符由 build.mjs 替换。 */
    const THEME_CSS = __THEME_CSS__

    /** 插件标识：style 标签归属与诊断信息共用。 */
    const PLUGIN_ID = 'dsh-ui-accent'

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
      desc: '为结果标题、加粗文字、行内代码、思考、提问以及各类工具行单独取色；修改即时生效，并保存在本机浏览器。',
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
      'footer.hint': '配色保存在浏览器 localStorage，不写入 settings.yaml。',
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
      desc: 'Pick colors for result titles, bold text, inline code, thinking, questions and every tool row. Changes apply instantly and are saved in this browser.',
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
      'footer.hint': 'Colors are saved in browser localStorage, not settings.yaml.',
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

    /** 当前配色表：启动时从 localStorage 恢复，内存副本保证存储不可用时仍可用。 */
    let current = loadColors()

    /**
     * 规范化颜色值。
     * @param value - 用户输入或存储中的原始值。
     * @returns 合法的小写十六进制颜色，非法值返回 null。
     */
    function sanitizeColor(value) {
      // 只接受十六进制色值，避免把任意字符串写进 CSS 变量。
      return typeof value === 'string' && COLOR_PATTERN.test(value.trim()) ? value.trim().toLowerCase() : null
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
     * 把配色表写入根元素的 CSS 变量，样式表据此实时生效。
     * 值为 null 的分类移除变量并去掉对应开关属性，让页面回到 DSH 原色。
     * @param keys - 只刷新这些分类（取色时只写变化的变量）；省略表示整表刷新。
     */
    function applyColors(keys) {
      // 非浏览器环境（例如渲染测试）没有 document，直接跳过。
      if (typeof document === 'undefined') {
        return
      }
      const root = document.documentElement
      const targets = keys === undefined ? Object.keys(DEFAULTS) : Array.from(keys)
      for (const key of targets) {
        if (current[key] === null) {
          root.style.removeProperty(cssVarName(key))
        } else {
          root.style.setProperty(cssVarName(key), current[key])
        }
      }
      // 思考行的覆盖样式以 html 上的属性为开关，默认保留主题原色。
      if (targets.includes('think')) {
        if (current.think === null) {
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

    /** 待写入的 CSS 变量键：拖动取色时把高频事件攒起来，每帧只重算一次样式。 */
    let dirtyKeys = new Set()

    /** 已排期的视觉刷新句柄（requestAnimationFrame 返回值）。 */
    let visualFrame = null

    /** 落盘与预览定位的延迟句柄：拖动过程中不写存储、不滚动预览。 */
    let settleTimer = null

    /** 本轮拖动最后改动的分类键，落盘时用于定位预览样例。 */
    let settleTargetId = null

    /** 落盘延迟：略大于数帧，取色停顿后才写存储并定位预览。 */
    const SETTLE_DELAY_MS = 160

    /**
     * 排一次视觉刷新：一帧内的多次取色合并为一次变量写入与一次面板重渲染。
     * @param id - 本次改动的分类键。
     */
    function scheduleVisual(id) {
      dirtyKeys.add(id)
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

    /** 立即把攒下的颜色写进 CSS 变量并通知面板重渲染。 */
    function flushVisual() {
      if (visualFrame !== null) {
        if (typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function') {
          window.cancelAnimationFrame(visualFrame)
        }
        visualFrame = null
      }
      const keys = dirtyKeys
      dirtyKeys = new Set()
      // 没有待刷新项时不做任何样式重算。
      if (keys.size === 0) {
        return
      }
      applyColors(keys)
      emitColors()
    }

    /**
     * 延迟落盘与预览定位：拖动取色时只在停顿后执行一次。
     * 拖动过程中逐事件写 localStorage 与滚动预览会强制同步重排，是卡顿的主因。
     * @param id - 本次改动的分类键。
     */
    function scheduleSettle(id) {
      settleTargetId = id
      if (settleTimer !== null) {
        clearTimeout(settleTimer)
      }
      settleTimer = setTimeout(flushSettle, SETTLE_DELAY_MS)
    }

    /** 立即落盘并定位预览：取色停顿、面板卸载或关闭页面时调用。 */
    function flushSettle() {
      if (settleTimer !== null) {
        clearTimeout(settleTimer)
        settleTimer = null
      }
      saveColors(current)
      const id = settleTargetId
      settleTargetId = null
      if (id !== null) {
        notifyPreview(id)
      }
    }

    /** 通知所有订阅者配色已变化。 */
    function emitColors() {
      for (const listener of listeners) {
        listener(current)
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
     * 修改单个分类的颜色并立即生效、持久化。
     * @param id - 分类键名（DEFAULTS 的键）。
     * @param value - 新颜色值；传 null 表示恢复原色（不覆盖）。
     * @param options.live - 取色器拖动中的高频更新：视觉合并到每帧，落盘与预览定位延后到停顿后。
     */
    function setColor(id, value, options) {
      const next = value === null ? null : sanitizeColor(value)
      // 非法值或颜色未变化时不产生任何副作用。
      if (value !== null && next === null) {
        return
      }
      if (current[id] === next) {
        return
      }
      current = { ...current, [id]: next }
      scheduleVisual(id)
      // 拖动中的连续取色只更新内存与 CSS 变量，存储与预览滚动留到停顿后。
      if (options !== undefined && options.live === true) {
        scheduleSettle(id)
        return
      }
      // 点选色块、提交输入框、恢复默认都是一次性操作，立即刷新不延迟。
      flushVisual()
      settleTargetId = id
      flushSettle()
    }

    /** 全部恢复默认色。 */
    function resetColors() {
      current = { ...DEFAULTS }
      // 重置是一次性操作：整表刷新、立即落盘，预览不因重置而滚动。
      dirtyKeys = new Set()
      settleTargetId = null
      applyColors()
      emitColors()
      flushSettle()
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

    /** 读取当前配色表的副本，供面板初始状态使用。 */
    function getColors() {
      return { ...current }
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
      const [draft, setDraft] = React.useState(null)
      const editing = draft !== null

      /** 提交输入：合法则回调，非法则回滚到外部颜色。 */
      const commit = () => {
        if (!editing) {
          return
        }
        const next = sanitizeColor(draft)
        setDraft(null)
        if (next === null) {
          return
        }
        onCommit(next)
      }

      return h('input', {
        className: 'dsh-accent-hex',
        value: editing ? draft : value,
        spellCheck: false,
        'aria-label': t('hex.aria'),
        onChange: (event) => setDraft(event.target.value),
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
            // 取色器拖动会连续触发 onChange，交给 live 通道合并到每帧，保证拖动顺滑。
            onChange: (event) => setColor(item.id, event.target.value, { live: true })
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
     * 取色时自动滚到对应样例，配合粘性定位可边改边看。
     * @param props.t - 翻译函数。
     */
    function AccentPreview({ t }) {
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
        h('div', { className: 'dsh-accent-preview-head' }, t('preview.title')),
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

      // 面板打开期间跟随外部配色变更（例如恢复默认）。
      React.useEffect(() => subscribeColors(setColorsState), [])

      // 面板关闭时补齐拖动中尚未落盘的配色，避免最后一次调整丢失。
      React.useEffect(
        () => () => {
          flushSettle()
        },
        []
      )

      return h(
        'div',
        { className: 'dsh-accent-section' },
        h(
          'div',
          { className: 'dsh-accent-head' },
          h('h2', { className: 'dsh-accent-title' }, t('title')),
          h('p', { className: 'dsh-accent-desc' }, t('desc'))
        ),
        h(AccentPreview, { t }),
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
     * 注册中英文字典并把模块翻译函数绑定到 locale 服务。
     * 语言切换时槽位按 locale 修订重渲染，导航与面板文案随之更新。
     * @param ctx - 客户端 Cordis 上下文。
     */
    function installLocale(ctx) {
      ctx.effect(() => {
        const offZh = ctx.locale.register(SETTINGS_NS, 'zh', zh)
        const offEn = ctx.locale.register(SETTINGS_NS, 'en', en)
        return () => {
          offZh()
          offEn()
        }
      }, 'ui-accent: settings dictionaries')
      translate = ctx.locale.bind(SETTINGS_NS)
    }

    /** 客户端插件入口：应用配色、注入样式、注册字典并把取色面板注册进设置侧边栏。 */
    function apply(ctx) {
      applyColors()
      installStyles(ctx)
      installLocale(ctx)
      ctx.effect(() => {
        /** 页面关闭/切走前补齐未落盘的配色，拖完立刻切页也不会丢最后一次调整。 */
        const flush = () => {
          flushSettle()
        }
        if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') {
          return () => {}
        }
        window.addEventListener('pagehide', flush)
        return () => {
          window.removeEventListener('pagehide', flush)
        }
      }, 'ui-accent: flush pending colors')
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
    exports.DICTS = { zh, en }
    exports.COLOR_DEFAULTS = DEFAULTS
    exports.getColors = getColors
    exports.setColor = setColor
    exports.resetColors = resetColors
    // 立即落盘待提交的配色：供自测与卸载/切页时使用。
    exports.flushPending = flushSettle
    return module.exports
  }
})
