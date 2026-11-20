# AGENTS.md — packages/extensions/browser

Scope: the `@vectors/browser` extension. Right-click a PNG/JPEG, trace it to SVG
with the `vectors` wasm build, download the result. Ships as **two variants**:
MV3 (`dist/v3`, Chrome/Edge/Firefox≥109) and MV2 (`dist/v2`, Firefox/legacy
Chrome).

## Layout

| Path                         | Holds                                                         |
| ---------------------------- | ------------------------------------------------------------- |
| `src/background.ts`          | MV3 service worker: context menu, offscreen routing, download |
| `src/background-mv2.ts`      | MV2 background page: same flow, downloads via anchor click    |
| `src/offscreen.ts`           | MV3 offscreen document message listener                       |
| `src/content.ts`             | Content script: reports nearest image on `contextmenu`        |
| `src/dom.ts`                 | `findImageSrc` — BFS parent/child/sibling image search (≤3)   |
| `src/convert.ts`             | Shared fetch + `WasmRaster` + `trace` path                    |
| `src/util.ts`                | `ConvertResponse`, `fileNameFor`                              |
| `public/manifest/v2          | v3/`                                                          | Per-variant manifests |
| `public/offscreen.html`      | MV3 offscreen document shell                                  |
| `public/background-mv2.html` | MV2 background page shell                                     |
| `public/icons/`              | 16–128 px PNGs (generated from the brand mark)                |
| `pkg/`                       | Generated wasm-bindgen output (gitignored, `make sync`)       |
| `.build/`                    | `tsc` output before variant assembly (gitignored)             |
| `dist/v2`, `dist/v3`         | Loadable extensions (gitignored)                              |
| `download/`                  | Packaged `vectors-v{2,3}.{zip,xpi,crx}` (gitignored)          |

## Commands

```bash
make sync        # crates/vectors-core/pkg → pkg/
make build-wasm  # rebuild wasm, then sync
make build       # sync + tsc + assemble dist/v2 + dist/v3
make package     # build + zip + xpi + crx → download/
make typecheck   # tsc --noEmit
pnpm run lint    # eslint
pnpm run format  # prettier
```

## Conventions

- TypeScript only; `tsc` emits ES modules into `.build/` (`rootDir: src`).
- `convert.ts` imports `@vectors/core` (workspace) for types; `make build`
  rewrites the specifier to `./pkg/vectors.js` in every emitted file because the
  extension has no bundler — keep that perl line in the Makefile if the import
  path changes.
- The menu shows on `image` + `page` contexts. When the click misses the `<img>`
  itself, `content.ts` finds the nearest image within 4 DOM hops
  (parent/child/sibling BFS in `dom.ts`) and the background maps it per tab;
  `info.srcUrl` still wins when present.
- MV2 has no service worker/offscreen API: `background-mv2.ts` runs inside a
  persistent background _page_ and downloads via `URL.createObjectURL` +
  `<a download>`; MV3 keeps the service-worker → offscreen-document split.
- `public/` files are copied per-variant — only put files in a variant's
  manifest-referenced set; `manifest/v2` and `manifest/v3` stay in sync on
  name/version/description/icons.
- Packaging mirrors `omni/packages/extensions/browser`: `zip -r`,
  `web-ext build` for `.xpi`, `chrome --pack-extension` for `.crx` (skipped with
  a warning when Chrome is absent). Artifacts land flat in `download/` as
  `vectors-v{2,3}.<ext>`.
- `web-ext lint --source-dir dist/v2` should stay at 0 errors/warnings; v3 will
  always warn about Firefox-incompatible APIs (offscreen, service worker) — that
  is expected, v2 is the Firefox build.
