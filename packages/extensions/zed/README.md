# vectors — Zed extension

Convert PNG/JPEG images to SVG from inside [Zed](https://zed.dev) using the
shared `vectors` tracer.

Zed's extension API currently has no file context-menu or command-palette
surface for extensions, so this package exposes an assistant **slash
command** instead:

```
/vectors <image.png|jpg|jpeg>
```

The argument is a worktree-relative path; the SVG is written next to the
source image (e.g. `assets/logo.png` → `assets/logo.svg`).

## How it works

The extension shells out to the `vectors` CLI:

1. `Worktree::which("vectors")` — uses the `vectors` binary if it is already
   on `PATH` (e.g. installed via `scripts/install.sh --cli`).
2. Otherwise it downloads the matching `cli-vectors-*` release asset into the
   extension's working directory (once per session) and runs it.

Only `wasm32-wasip2` release binaries are downloaded; other platforms report
a clear error.

## Build

Requires the `wasm32-wasip2` Rust target:

```bash
rustup target add wasm32-wasip2
make build      # cargo build --release --target wasm32-wasip2
make package    # → download/extension-zed-vectors.tar.gz
```

`make lint` runs `cargo clippy -D warnings`; `make format` runs `cargo fmt`.

## Install in Zed

Zed builds extensions from source. Point **Install Dev Extension** at this
directory (or the extracted `extension-zed-vectors.tar.gz`):

1. `zed: install extension` in the command palette
2. Choose **Install Dev Extension**
3. Select this folder (must contain `extension.toml`, `Cargo.toml`, `src/`)

Or copy the directory into `~/.config/zed/extensions/installed/vectors/`.

For registry distribution the extension would be added as a git submodule of
[zed-industries/extensions](https://github.com/zed-industries/extensions).

## Notes

- The CLI binary is resolved per invocation; no wasm tracing code is bundled
  into the extension itself.
- Upstream Zed has discussed replacing extension slash commands with MCP
  servers; if `run_slash_command` is removed in a future `zed_extension_api`,
  this package will need to move to an MCP/context-server surface.
