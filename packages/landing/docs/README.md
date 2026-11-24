# vectors documentation

**vectors** turns PNG and JPEG images into clean SVG paths — and rasterizes SVG
back to PNG at any size — entirely offline. It is a classical raster-to-vector
tracer written from scratch in Rust: no machine-learning models, no network
calls, and byte-identical output for identical input.

## Sections

- **Getting started** — build the CLI and convert your first image.
- **Concepts** — the tracing pipeline and quality controls.
- **Guides** — CLI usage, the HTTP API, and the MCP server.
- **API reference** — HTTP endpoints.

## Interfaces

| Interface  | What it is                                    |
| ---------- | --------------------------------------------- |
| CLI        | `vectors` binary (`crates/vectors-cli`)       |
| HTTP API   | `vectors serve`                               |
| MCP server | `vectors mcp serve` (stdio JSON-RPC)          |
| Library    | Rust crates, compiled to WASM for the web app |
| Web app    | In-browser converter on the landing page      |

## Installation guides

- [CLI on macOS (Apple Silicon)](guides/how-to-install-cli-macos-silicon.md)
- [CLI on macOS (Intel)](guides/how-to-install-cli-macos-intel.md)
- [CLI on Linux](guides/how-to-install-cli-linux.md)
- [CLI on Windows](guides/how-to-install-cli-windows.md)
- [VS Code extension](guides/how-to-install-vscode.md)
- [Zed extension](guides/how-to-install-zed.md)
- [JetBrains plugin](guides/how-to-install-jetbrains.md)
- [Browser extension (Chromium)](guides/how-to-install-browser-chromium.md)
- [Browser extension (Firefox)](guides/how-to-install-browser-gecko.md)
