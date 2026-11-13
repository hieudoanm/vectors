# HTTP API and MCP server

## HTTP API

```sh
vectors serve --bind 0.0.0.0:8080
```

Serves the tracer over HTTP for batch or service use; see
[API reference](../api-reference/api.md).

## MCP server

```sh
vectors mcp serve
```

Exposes the tracer as tools over stdio JSON-RPC 2.0, so MCP-compatible clients
can rasterize and trace images programmatically.

## WebAssembly

The same Rust crates compile to WASM for the in-browser converter on the landing
page — tracing runs client-side with no server round-trip.
