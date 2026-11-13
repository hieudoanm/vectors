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
