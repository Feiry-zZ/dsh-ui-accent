# dsh-ui-accent · accent colors for DSH

English | [简体中文](./README.md)

Colorize the conversation area of DeepSeek Harness (DSH) by meaning, then pick every color in **Settings → Accent colors**. Changes preview live inside the panel; press **Apply** to write them to the conversation and store them in your browser (`localStorage`) — never in `settings.yaml`.

The plugin ships as a **DSH bundle** on npm: `@feiry-zz/dsh-ui-accent`. Install it by package name from the DSH plugin manager — on Windows, macOS and Linux alike.

The panel follows the DSH locale setting (all 8 languages DSH ships, via the `locale` service); its live preview lists all 15 categories inside a fixed-height scroll area, with a permanent **Apply** button in the header row.

![Effect preview](./preview/preview-en.png)

Settings panel: the preview box is 220px tall and sticks to the top of the content area, so it stays visible while you scroll through the rows below; a new color is immediately comparable, and the conversation updates only after you press **Apply**.

![Settings panel](./preview/panel-en.png)

## Features

- **Color by meaning**: result titles (Markdown headings), bold text, inline code, thinking, questions, plus 10 tool categories — run command, edit, write, read, search, code, task, skill, plugin and other tools (15 in total).
- **Preview first, apply explicitly**: dragging the picker only updates the live preview inside the panel — no root style writes, no persistence. An **Apply** button stays in the preview header, becomes enabled as soon as anything differs, and writes only the changed categories to the conversation and storage when clicked. Dragging triggers zero full-document restyles, so long conversations stay smooth.
- **Follows the DSH locale**: registers the `settings.uiAccent` namespace on the DSH `locale` service for all 8 languages DSH ships — Chinese, English, 日本語, Español, Français, Deutsch, Русский, Português; the panel and the sidebar entry update as soon as you switch.
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

Every category can be changed independently, and **Reset all** restores the defaults. Both only change the panel preview; press **Apply** to write them to the conversation and storage. Two categories are special:

- **Inline code** defaults to the *link blue*: it reuses the `--dsw-alias-state-business-primary` token (`#679efe` in dark, `#4176e6` in light), so plain inline code, link-style inline code and file references all render in the same blue that follows the theme. Pick a color to override it; **Default** returns to link blue.
- **Thinking** defaults to the *original* color: nothing is overridden, so it keeps the DSH theme grey. Pick a color to override it; **Default** returns to the original.

## Usage

1. Open **Settings** in DSH — **Accent colors** appears in the left navigation.
2. Click a color swatch or type a hex value; the change only updates the **Preview** inside the panel, while the conversation stays as it is.
3. The **Apply** button in the preview header becomes available as soon as anything changes; clicking it writes the changed categories to the conversation and stores them in the browser's `localStorage`.
4. Inline code keeps following the theme's link blue by default; other custom colors stay fixed when you switch light/dark themes.
5. The **Preview (all settings)** box at the top of the panel lists all 15 categories, scrolls within 220px, and **sticks to the top** of the settings content area, so the preview and the **Apply** button stay visible while you scroll.
6. After you pick a color, the preview scrolls to that category's sample row so you can compare right away.
7. Closing the settings panel discards changes you have not applied; the next time you open it, editing starts from the currently applied colors.

> If **Accent colors** does not show up in Settings yet, refresh the window once (`Ctrl+R`).

## Install

The plugin ships as a **DSH bundle** on npm — `@feiry-zz/dsh-ui-accent`. Pick either method below.

### Option 1: plugin manager (recommended, works everywhere)

In DSH open **Settings → Plugins → Add plugin** and enter the package name or address:

```
@feiry-zz/dsh-ui-accent
```

You can also append `@latest` to install the newest release (`@feiry-zz/dsh-ui-accent@latest`), or paste the Git repository URL (`https://github.com/Feiry-zZ/dsh-ui-accent.git`) to install from source. DSH layers the bundle patch (`cordis.patch.yml`) onto the profile, which activates the plugin. Refresh the window once (`Ctrl+R` / `Cmd+R`) if the settings entry is not there yet. No Node, no manual links.

### Option 2: local link (for hacking on the code)

Best when you want to edit the checkout and rely on HMR:

```bash
git clone git@github.com:Feiry-zZ/dsh-ui-accent.git
cd dsh-ui-accent
node install.mjs
```

The script only uses the Node standard library (so **Windows, macOS and Linux** behave the same) and does two things under `<DSH_HOME>/profiles/desktop` (`<DSH_HOME>` defaults to `~/.dsh`, override with the `DSH_HOME` environment variable):

1. creates `node_modules/@feiry-zz/dsh-ui-accent` as a directory link to this repository — a junction on Windows, a symlink on macOS and Linux;
2. appends this entry to the profile's `cordis.patch.yml`:

```yaml
- insert:
    - id: ui-accent
      name: '@feiry-zz/dsh-ui-accent'
```

No script needed if you prefer the manual route — it is equivalent to the two steps above:

```bash
# Windows (CMD or PowerShell; create the scope directory first)
mkdir "%USERPROFILE%\.dsh\profiles\desktop\node_modules\@feiry-zz"
mklink /J "%USERPROFILE%\.dsh\profiles\desktop\node_modules\@feiry-zz\dsh-ui-accent" "D:\path\to\dsh-ui-accent"

# macOS / Linux
mkdir -p ~/.dsh/profiles/desktop/node_modules/@feiry-zz
ln -s "$(pwd)" ~/.dsh/profiles/desktop/node_modules/@feiry-zz/dsh-ui-accent
```

Then append the YAML block above to the end of the profile's `cordis.patch.yml`.

> ⚠️ The two methods are mutually exclusive: once installed through the plugin manager, do not run `install.mjs` — it would register a second `ui-accent` entry. Uninstall first if you want to switch.

On activation the host half appends a line to `<DSH_HOME>/logs/ui-accent.log`:

```
[2026-11-03T06:03:04.391Z] host half activated
[2026-11-03T06:03:04.697Z] client bundle ready rev=f96bd4d53c1a
```

(Later changes to the client bundle are hot-reloaded by `@deepseek-ai/dsh-client-hmr` and no longer reach the host log.)

## Development

Build, tests, bundle contract and release steps live in [AGENTS.md](./AGENTS.md).

## Uninstall

- **Plugin manager install**: uninstall the bundle in **Settings → Plugins** — it removes the plugin entry it registered.
- **Local link install**: `node install.mjs --uninstall` (removes the link and strips the entry from the profile's `cordis.patch.yml`, backing it up as `.bak` first).

Both need a window refresh (`Ctrl+R` / `Cmd+R`) before the settings page disappears: the host half unloads immediately, but the settings page and the color styles are registered by the client bundle.

To do the local-link variant by hand:

1. remove the `ui-accent` `insert` block (plus the two comment lines above it) from `cordis.patch.yml`;
2. remove the directory link:

```bash
# macOS / Linux
rm ~/.dsh/profiles/desktop/node_modules/@feiry-zz/dsh-ui-accent

# Windows (CMD)
rmdir "%USERPROFILE%\.dsh\profiles\desktop\node_modules\@feiry-zz\dsh-ui-accent"
```

Applied colors live in the browser's `localStorage` and survive uninstall; they come back on reinstall.

## License

[MIT](./LICENSE) © 2026 Feiry-zZ

Free to use, modify and redistribute, including commercially — just keep the copyright and license notice.
