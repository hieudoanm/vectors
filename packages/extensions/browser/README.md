# Browser

Manifest V3 browser extension: right-click any PNG or JPEG and convert it to SVG
with the [`vectors`](../../../crates/vectors-core) tracer — the same Rust
pipeline compiled to WebAssembly, running fully offline in the browser.

TypeScript sources in `src/`, static files in `public/`; `make build` emits the
loadable extension to `dist/`.

## How it works

- `public/manifest.json` — MV3, `contextMenus` + `offscreen` + `downloads` +
  `notifications`, `host_permissions: <all_urls>` so the extension can fetch
  image bytes cross-origin.
- `src/background.ts` — service worker: registers the **Convert to SVG
  (vectors)** context menu, routes clicks to the offscreen document, downloads
  the result.
- `src/offscreen.ts` — fetches the image bytes, runs `WasmRaster` + `trace` from
  `@vectors/core` (rewritten to `./pkg/vectors.js` in `dist/` since the
  extension has no bundler), returns the SVG string.
- `pkg/` — generated wasm-bindgen output (**not committed**; run `make sync`).

## Develop

```sh
cd packages/extensions/browser
pnpm install
make build-wasm   # rebuild wasm in crates/vectors-core, then sync (or `make sync` if pkg/ is current)
make build        # tsc + assemble dist/
pnpm run lint     # eslint
pnpm run format   # prettier
```

Then load it unpacked:

1. `chrome://extensions` → enable **Developer mode**
2. **Load unpacked** → select `packages/extensions/browser/dist`
3. Right-click any PNG/JPEG → **Convert to SVG (vectors)** → the `.svg`
   downloads

## Notes

- PNG and JPEG only (the tracer's raster decoders). `blob:` image URLs can't be
  fetched — save the image first.
- The wasm module is built by `make build-wasm` in `crates/vectors-core`
  (`wasm-bindgen --target web`); `make build-wasm` here does both steps.
