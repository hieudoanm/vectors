# Vectors — VS Code extension

Image → SVG conversion inside VS Code, powered by the same
[`vectors`](../../../crates/vectors-core) wasm tracer as the CLI, landing page
converter, and browser extension.

## Usage

- **Explorer** — right-click a PNG/JPEG → **Convert Image to SVG**
- **Editor** — right-click inside an open image preview, or use the "…" menu on
  its tab → **Convert Image to SVG**
- **Command Palette** — `Vectors: Convert Image to SVG` converts the active
  image, or opens a file picker when nothing image-like is focused

The SVG is written next to the source as `<name>.svg` — if that file already
exists you're asked where to save instead.

## Development

```bash
pnpm install
pnpm build:wasm   # first time only: builds crates/vectors-core wasm
pnpm build        # esbuild bundle → dist/extension.js + vectors_bg.wasm
pnpm typecheck
pnpm lint
```

Press <kbd>F5</kbd> in VS Code to launch an Extension Development Host with the
extension loaded from `dist/`.

## Package

```bash
pnpm package   # → build/vectors-vscode.vsix
```

## Layout

- `src/extension.ts` — command registration, file pick, wasm trace, save
- `scripts/build.mjs` — esbuild bundle (CJS) + wasm copy
- `dist/` — build output (gitignored)
