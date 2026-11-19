# AGENTS.md — packages/extensions/vscode

VS Code extension: **Vectors: Convert Image to SVG**. Traces PNG/JPEG to SVG
with the same `@vectors/core` wasm build used by the CLI, landing converter, and
browser extension.

## Commands

```bash
pnpm build:wasm   # first time: builds crates/vectors-core wasm (wasm-pack)
pnpm build        # esbuild bundle → dist/extension.js + vectors_bg.wasm
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint
pnpm package      # → build/vectors-0.0.1.vsix
```

## Layout

- `src/extension.ts` — the whole extension: command registration, image pick
  (active editor or open dialog), wasm trace, save next to source (save dialog
  if target exists)
- `scripts/build.mjs` — esbuild CJS bundle; `vscode` stays external,
  `@vectors/core` is bundled, `vectors_bg.wasm` is copied to `dist/`
- `dist/` — build output (gitignored); `main` points here

## Gotchas

- Wasm init uses `initSync(bytes)` — never the default `init()`, which would try
  `fetch(new URL('vectors_bg.wasm', import.meta.url))` and fail in the CJS
  bundle.
- `package.json` `name` must be unscoped (`vectors`) — vsce rejects `@scope/*`.
- `vsce package` needs `--no-dependencies` (workspace `@vectors/core` is
  bundled, and npm can't resolve `workspace:*`), and the `--out` dir must exist
  first (`mkdir -p build`).
- `@types/vscode` must not exceed `engines.vscode` or vsce fails.
