# My JS Vite Template

A lightweight front-end stack: Vite + vanilla JS (ES modules) + SCSS, with no third-party UI frameworks. Only the functionality actually used on the page is kept.

## Quick start

```bash
npm install
npm run dev       # local dev server
npm run build     # production build into dist/
npm run build:readable   # same, unminified
npm run preview   # preview the production build
```

## Final cleanup before publishing

```bash
npm run finalize            # copy → ../<project-name>-min     (minified build)
npm run finalize:readable   # copy → ../<project-name>-no-min  (readable build)
```

Creates a copy of the project next to it (recreated if it already exists) and prepares it for publishing; the original project is left untouched. Inside the copy, in order, stopping at the first failure:

1. `clean-unused` — delete files nothing references
2. `strip-comments` — remove comments from the remaining files
3. `pin-versions` — replace `"latest"` in `package.json` with the installed versions
4. `prettier --write .` + `stylelint --fix` — format and auto-fix
5. `prettier --check .` + `stylelint` — verify nothing is left unfixed
6. `vite build` (or `vite build --minify false`) — build into the copy's `dist/`

No confirmations are asked — it only works on the copy. To see what would be deleted without making a copy:

```bash
npm run clean-unused:check
```

Walks every reference starting from `index.html` (`<load>`, `src`/`href`/`srcset`, JS imports, SCSS `@use`/`@forward`/`@import`, image and font names) and deletes whatever it can't reach in `src/`, `public/` and root `*.html` — including extra pages no page links to (their entries are also removed from `vite.config.js`). Commented-out code doesn't count as a reference. Works on whole files: unused classes inside a connected SCSS file or unused functions inside a connected JS file stay.

## Linting and formatting

```bash
npm run prettier         # Prettier — format all files
npm run prettier:check   # Prettier — check only
npm run stylelint        # Stylelint — lint and autofix SCSS
npm run stylelint:check
```

Configs: `.prettierrc.json`, `.stylelintrc.json` (based on `stylelint-config-standard-scss`). Tabs, single quotes in JS, semicolons.

## Stripping comments from the project

```bash
npm run strip-comments
```

Removes comments in place from `src/**/*.js`, `src/**/*.scss`, `src/**/*.html`, root `*.html` and `vite.config.js`, then runs Prettier on the changed files. Lists the files and asks for confirmation first (`npm run strip-comments -- --yes` skips the prompt) — there is no undo.

## Project structure

```
index.html               — the only demo page (entry point)
src/
  partials/               — HTML includes (<load>): header.html, footer.html, popups/*.html
  main.js                 — JS entry point; modules are enabled/disabled here
  scss/
    main.scss              — SCSS entry point
    _project-mixins.scss    — functions (rem/em/toPercent, alpha) + generic mixins (font, adaptiveValue)
    _breakpoints.scss       — breakpoints as mixins (@use '@scss/breakpoints' as breakpoint;
                              @include breakpoint.tab {...} / breakpoint.max-tab {...} for max-width)
    _settings.scss          — template settings (min-width, container, $max-padding/$min-padding) — used by reset, adaptiveValue and global
    _global.scss            — shared blocks (wrapper, container with adaptive padding via adaptiveValue)
    _reset.scss, _palette.scss, _variables.scss, _utils.scss (adaptive -ibg background,
                              placeholders %listCounter/%responsiveVideo/%noselect, etc.)
    _index.scss             — bundles breakpoints/project-mixins, imported as `@scss`
    font/                   — local @font-face rules and the icon font
    effects/                — visual effects (ripple, tooltip)
    components/             — standalone UI blocks (button, checkbox, radio, switch, select, input, badge, alert, table, popup)
    layout/                 — header/footer
    pages/                  — page-specific styles
  fonts/                  — font files (woff2/woff)
  js/
    modules/                — the project's active functionality (no third-party libraries)
    site.js                 — project-specific code (the most volatile part)
```

## Modules and aliases

JS and SCSS imports use aliases (configured in `vite.config.js`):

- `@` → `src`
- `@js` → `src/js`
- `@scss` → `src/scss`

```js
import { myModules } from '@js/modules/registry.js';
```

```scss
@use '@scss' as *;
```

**Ctrl+click on aliases in VS Code:** works out of the box for JS via `jsconfig.json`; for SCSS — via the [Some Sass](https://marketplace.visualstudio.com/items?itemName=SomewhatStationery.some-sass) extension (see `.vscode/extensions.json` and `.vscode/settings.json`).

## HTML includes (`<load>`)

Markup is split into files and assembled with the `<load src="./path/to/file.html" />` tag — the [vite-plugin-html-inject](https://github.com/donnikitos/vite-plugin-html-inject) plugin, registered in `vite.config.js`. Works the same in `npm run dev` and `npm run build`.

```html
<load src="./src/partials/header.html" />
```

The header, footer and popups live in partials — `src/partials/header.html`, `src/partials/footer.html`, `src/partials/popups/*.html` (one file per popup; `index.html` only includes `example.html` — add new popups the same way).

## WebStorm

No extra plugins are needed — everything required is built into WebStorm (JavaScript, Vite, Sass, Prettier, Stylelint). You only need to enable Prettier and Stylelint once.

**Ctrl/Cmd+click on paths:**

- JS imports with aliases (`@js/...`, `@scss/...`, `@assets/...`) — out of the box via `jsconfig.json`.
- SCSS (`@use '@scss'`, `@use '@scss/breakpoints'`) — out of the box.
- `<load src="...">` — WebStorm doesn't know this tag and by default doesn't treat `src` as a file path. This is solved by a "File Reference" Language Injection for `<load src>`, stored in the repo: `.idea/IntelliLang.xml`. Also, `.idea/inspectionProfiles/Project_Default.xml` registers `load` as a custom HTML tag to avoid the "Unknown tag" warning. Nothing to do, but if the path isn't clickable after opening the project — restart WebStorm or set it up manually (below).

**Manual `<load src>` setup** (if the `.idea/` files weren't picked up):

1. `Settings → Editor → Language Injections → + → XML Tag Injection`.
2. `Language: File Reference`, `Local name: load`.
3. `XML Attributes` tab → add `src` → `Apply`.
4. For the "Unknown tag" warning: `Settings → Editor → Inspections → HTML → Unknown tag → Custom HTML tags` → add `load`.

**Formatting (Prettier):** already enabled by a setting in the repo — `.idea/prettier.xml`: the `prettier` package is taken from `node_modules`, rules from `.prettierrc.json`, formatting runs on save (`Run on save`) and on `Reformat Code` (Cmd+Alt+L) for `js, mjs, cjs, json, html, css, scss, md`. Indentation, encoding and line endings are additionally taken from `.editorconfig`.

If it doesn't work: `Settings → Languages & Frameworks → JavaScript → Prettier` → `Automatic Prettier configuration`, check `Run on reformat` and `Run on save`, and set `Run for files` to `**/*.{js,mjs,cjs,json,html,css,scss,md}`.

**SCSS linting (Stylelint):** `Settings → Languages & Frameworks → Style Sheets → Stylelint` → `Enable`, `stylelint` package from `node_modules`, make sure `Run for files` includes `scss` (e.g. `**/*.{css,scss}`), and enable `Run stylelint --fix on save` — the equivalent of `source.fixAll.stylelint` in VS Code. Property order and other rules come from `.stylelintrc.json`. This setting is stored locally in the IDE and isn't committed.

**Node.js:** `Settings → Languages & Frameworks → Node.js` → any installed interpreter (required for Prettier, Stylelint and `npm run dev`).

Checks from the terminal work regardless of the IDE: `npm run prettier:check` and `npm run stylelint:check`.

## Active functionality (`src/js/modules`)

- **Ripple** — ripple effect on click for `[data-ripple]` (`functions.js` → `rippleEffect()`, styles in `effects/_ripple.scss`).
- **Popup** — popups with a focus trap, scroll lock and an optional hash in the address bar (`popup.js`, markup in `src/partials/popups/*.html`).
- **Burger menu** — toggles the mobile menu via the `burger-open` class on `<html>` (`functions.js` → `menuInit()/menuOpen()/menuClose()`, markup and styles in `layout/_header.scss`).
- **Smooth navigation** — scrolls to a block via `data-goto`, accounting for header height (`scroll/scroll.js`, `scroll/go-to-block.js`).
- **API** — a minimal `fetch` wrapper (`modules/api/FetchWrapper.js`) for requests from `site.js`.

## Enabling/disabling a module

Everything is off by default — enable what you need: in `src/main.js`, uncomment/add the import or call; in `src/scss/main.scss`, uncomment/add the matching `@use` if the module has styles.
