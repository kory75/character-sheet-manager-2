# Developer Workflow

## Starting the Dev Server

Always use `npm run dev` instead of `ng serve`. It starts both processes together:

```
npm run dev
```

| Process | Name | What it does |
|---|---|---|
| `tw` | Tailwind CLI | Watches `tailwind.source.css`, regenerates `src/tailwind.generated.css` whenever a component is saved |
| `ng` | Angular | Dev server with live reload at http://localhost:4200 |

## Visual Checks / Screenshots

Playwright is wired into the project for automated screenshots — no manual screen captures needed.

```
npm run screenshot
```

Saves a timestamped PNG to `ScreenShots/` (e.g. `ScreenShots/check-2026-03-20T18-53-20.png`).

For a full-page screenshot:

```
node screenshot.js full
```

Playwright must be installed (`npx playwright install chromium`) and the dev server must be running before taking a screenshot.

## One-Off Tailwind Rebuild

If you need to regenerate the Tailwind CSS without starting the watcher:

```
npm run tailwind:build
```

## Why This Setup

Angular 21 uses esbuild (`@angular/build`) for CSS processing. The `@tailwindcss/postcss`
plugin does not fire correctly in this pipeline — `@theme {}` blocks are passed through
verbatim instead of being converted to `:root {}` CSS variables, and utility classes are
never generated.

The fix: run the **Tailwind CLI** as a separate process that reads `tailwind.source.css`
and writes a pre-processed `src/tailwind.generated.css`. Angular then bundles this
generated file as a plain static CSS asset, bypassing the PostCSS issue entirely.

### Key files

| File | Purpose |
|---|---|
| `tailwind.source.css` | Tailwind source — `@import`, `@source`, `@theme` tokens |
| `src/tailwind.generated.css` | CLI output — committed to repo so Angular can build without the watcher running |
| `src/styles.css` | Global base CSS (body reset, Material Symbols override, `bureaucracy-grid` utility) |
| `screenshot.js` | Playwright screenshot script |
