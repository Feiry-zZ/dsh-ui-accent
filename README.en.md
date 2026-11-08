# dsh-ui-accent · accent colors for DSH

English | [简体中文](./README.md)

Colorize the conversation area of DeepSeek Harness (DSH) by meaning, then pick every color in **Settings → Accent colors**. Changes apply instantly and are stored in your browser (`localStorage`) — never in `settings.yaml`.

The panel follows the DSH locale setting (Chinese / English via the `locale` service), and its live preview lists all 15 color categories inside a fixed-height scroll area.

![Effect preview](./preview/preview-en.png)

Settings panel: the preview box is 220px tall and sticks to the top of the content area, so it stays visible while you scroll through the rows below.

![Settings panel](./preview/panel-en.png)

## Features

- **Color by meaning**: result titles (Markdown headings), bold text, inline code, thinking, questions, plus 10 tool categories — run command / edit / write / read / search / code / task / skill / plugin / other tools (15 in total).
- **Smooth dragging**: while you drag the color picker, changes are coalesced into one CSS variable write per frame and only the changed variable is touched; persistence and preview scrolling wait until you pause, so the picker stays responsive.
- **Bilingual UI**: registers the `settings.uiAccent` namespace on the DSH `locale` service, so the panel and the sidebar entry follow language switches immediately.
- **Evolving defaults**: storage keeps only values that differ from the built-in defaults, so untouched categories pick up a new default automatically.
- **Theme aware**: thinking and inline code are not overridden by default — they keep the DSH grey and the link blue, and follow light/dark themes.

## Default palette

| Category | Applies to | Default |
| --- | --- | --- |
| Result title | Markdown headings 1–6 | `#c084fc` purple |
| Bold text | Markdown `strong` / `b` | `#f472b6` pink |
| Inline code | Markdown inline code (including links and file references) | Same as links (`--dsw-alias-state-business-primary`, follows theme) |
| Thinking | `data-variant="think"` rows (title, icon, summary, expanded body) | Not overridden — keeps the DSH grey |
| Question | `data-tool="ask_user_question"` row | `#f87171` red |
| Run command | `bash` / `pwsh` | `#b0cef2` light blue |
| Edit | `edit` | `#fbbf24` amber |
| Write | `write` | `#34d399` green |
| Read | `read` / `web_fetch` | `#a5b4fc` indigo |
| Search | `grep` / `glob` / `web_search` | `#38bdf8` sky blue |
| Code | `run_code` | `#a3e635` lime |
| Task | `todo_write` | `#e879f9` magenta |
| Skill | `skill` | `#fb923c` orange |
| Plugin | `cordis_*` tools | `#818cf8` blue-violet |
| Other tools | Anything not listed above | `#ded7e5` light lavender |

Every category can be changed independently, and **Reset all** restores the defaults. Two categories are special:

- **Inline code** defaults to the *link blue*: it reuses the `--dsw-alias-state-business-primary` token (`#679efe` in dark, `#4176e6` in light), so plain inline code, link-style inline code and file references all render in the same blue that follows the theme. Pick a color to override it; **Default** returns to link blue.
- **Thinking** defaults to the *original* color: nothing is overridden, so it keeps the DSH theme grey. Pick a color to override it; **Default** returns to the original.

## Usage

1. Open **Settings** in DSH — **Accent colors / 界面配色** appears in the left navigation.
2. Click a color swatch or type a hex value; the conversation area updates immediately.
3. Choices are stored in the browser's `localStorage`. Inline code keeps following the theme's link blue by default; other custom colors stay fixed when you switch light/dark themes.
4. The **Preview (all settings)** box at the top of the panel lists all 15 categories, scrolls within 220px, and **sticks to the top** of the settings content area.
5. After you pick a color, the preview scrolls to that category's sample row so you can compare right away.

> If **Accent colors** does not show up in Settings yet, refresh the window once (`Ctrl+R`).

## Install (local plugin)

The plugin plugs into a DSH profile through its patch layer and never modifies the DSH installation. DSH must support client plugins (`dsh.client`).

```powershell
# 1. Clone the repository
git clone <repo-url> dsh-ui-accent
cd dsh-ui-accent

# 2. Link it into the profile and register the patch
powershell -ExecutionPolicy Bypass -File .\install.ps1
```

The script creates a junction at `<DSH_HOME>\profiles\desktop\node_modules\dsh-ui-accent` pointing at the repository (`<DSH_HOME>` defaults to `%USERPROFILE%\.dsh`, override with the `DSH_HOME` environment variable), and appends this entry to the patch file:

```yaml
# <DSH_HOME>/profiles/desktop/cordis.patch.yml
- insert:
    - id: ui-accent
      name: dsh-ui-accent
```

`cordis.patch.yml` is hot-reloaded: once saved, the loader recomposes the patch layer and activates the plugin — no DSH restart needed. Manual installation works too as long as it is equivalent to the two steps above; on macOS / Linux use a symlink instead of a junction:

```bash
ln -s "$(pwd)" ~/.dsh/profiles/desktop/node_modules/dsh-ui-accent
```

On activation the host half appends a line to `<DSH_HOME>\logs\ui-accent.log`:

```
[2026-11-03T06:03:04.391Z] host half activated
[2026-11-03T06:03:04.697Z] client bundle ready rev=f96bd4d53c1a
```

(Later changes to the client bundle are hot-reloaded by `@deepseek-ai/dsh-client-hmr` and no longer reach the host log.)

## Repository layout

```
dsh-ui-accent/
├─ package.json           # dsh.client declaration (platform: web / inject)
├─ build.mjs              # inlines src/theme.css into lib/client.js
├─ install.ps1            # creates the profile junction and registers the patch
├─ LICENSE                # MIT license
├─ src/
│  ├─ client.js           # client plugin source (settings panel + color state)
│  └─ theme.css           # conversation-area selectors and panel styles
├─ lib/
│  ├─ index.js            # host half: activation log and startup-graph check
│  └─ client.js           # build output (the bundle DSH actually loads)
├─ test/
│  ├─ render-test.mjs        # panel structure / style injection / colors / persistence
│  ├─ migration-test.mjs     # v1 → v3 storage migration
│  ├─ stale-default-test.mjs # default changes vs. user choices
│  └─ schedule-test.mjs      # frame coalescing and deferred persistence
└─ preview/
   ├─ preview.html        # effect preview page (?lang=en for English)
   ├─ build-panel.mjs     # renders the real panel component to a static page
   └─ *.png               # README images
```

## Development

`src/theme.css` is the single source of truth for colors and selectors; `DEFAULTS` in `src/client.js` holds the factory palette. After editing:

```powershell
node build.mjs                   # build lib/client.js
node --check lib\client.js       # syntax check
node test\render-test.mjs        # all four tests should print OK
node test\migration-test.mjs
node test\stale-default-test.mjs
node test\schedule-test.mjs
```

Regenerate the documentation images (Chrome required):

```powershell
# 1. Render the real panel component to static pages (Chinese and English)
node preview\build-panel.mjs

# 2. Take the screenshots in headless mode (replace <repo> with the absolute repo path)
chrome --headless=new --hide-scrollbars --force-device-scale-factor=2 --window-size=790,1620  --screenshot=preview\panel.png    "file:///<repo>/preview/panel.html"
chrome --headless=new --hide-scrollbars --force-device-scale-factor=2 --window-size=790,1620  --screenshot=preview\panel-en.png "file:///<repo>/preview/panel-en.html"
chrome --headless=new --hide-scrollbars --force-device-scale-factor=2 --window-size=1000,560  --screenshot=preview\preview.png    "file:///<repo>/preview/preview.html"
chrome --headless=new --hide-scrollbars --force-device-scale-factor=2 --window-size=1000,560  --screenshot=preview\preview-en.png "file:///<repo>/preview/preview.html?lang=en"
```

Bundle changes are detected by `@deepseek-ai/dsh-client-hmr`, which reloads the plugin automatically; CSS-only edits go through the same path.

## Storage & compatibility

- Storage key `dsh-accent.colors.v3`, shape `{ version: 3, colors: {...} }`, holding only categories that differ from the defaults.
- The older `v2` envelope and the `v1` flat map are migrated on first load; values equal to a historical default (thinking's old orange `#fb923c`, skill's old teal `#2dd4bf`, other tools' old purple `#c084fc`) are treated as "never changed" and follow the current default, while real custom colors are preserved.
- Internal CSS variables keep the `--dsh-accent-*` prefix and the thinking switch stays `html[data-dsh-accent-think]` — the historical naming differs from the package name by design.
- Selectors rely on DSH's stable DOM contract: `data-tool` / `data-variant` on tool rows, `data-variant="think"` on thinking rows, and the `_markdown` prefix on Markdown roots. If a category stops being colored after a major DSH upgrade, check those hooks first and update `src/theme.css`.

## Uninstall

1. Remove the `ui-accent` `insert` block from `cordis.patch.yml` (saved = hot unload; styles and panel disappear).
2. Remove the junction:

```powershell
Remove-Item "$env:USERPROFILE\.dsh\profiles\desktop\node_modules\dsh-ui-accent" -Force
```

3. Optional: delete `<DSH_HOME>\logs\ui-accent.log` and the repository directory.

## License

[MIT](./LICENSE) © 2026 Feiry-zZ

Free to use, modify and redistribute, including commercially — just keep the copyright and license notice.
