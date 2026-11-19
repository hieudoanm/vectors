# AGENTS.md — `packages/extensions/zed`

Zed extension for vectors: a Rust crate compiled to `wasm32-wasip2` that
exposes a `/vectors <image>` assistant slash command. Unlike the browser and
VS Code packages it contains **no** tracing code — it shells out to the
`vectors` CLI (`Worktree::which`, else auto-downloads the matching
`cli-vectors-*` release asset via `zed::download_file`).

## Layout

| Path             | Holds                                             |
| ---------------- | ------------------------------------------------- |
| `extension.toml` | Zed manifest: id, metadata, `[slash_commands.*]`  |
| `Cargo.toml`     | cdylib crate; only dep is `zed_extension_api`     |
| `src/lib.rs`     | `Extension` impl: `run_slash_command` → CLI spawn |
| `Makefile`       | `build` / `package` / `lint` / `format` / `clean` |
| `download/`      | `extension-zed-vectors.tar.gz` release artifact   |

## Rules

- Build target is **`wasm32-wasip2`** (not `wasip1`, not
  `wasm32-unknown-unknown`). `make build`/`make package` handle it.
- Keep `Cargo.lock` committed — Zed builds from source and the lockfile keeps
  the `zed_extension_api` version reproducible.
- Platform mapping uses `zed::Os::{Mac,Linux,Windows}` and
  `zed::Architecture::{Aarch64,X86,X8664}` — check the wit definitions in the
  crate before renaming.
- The API has no file context-menu surface; do not invent one. If upstream
  removes `run_slash_command`, migrate to an MCP/context-server surface.
- Release asset name is fixed: `extension-zed-vectors.tar.gz` (CI uploads
  `download/*` as the `vectors-zed` artifact).
