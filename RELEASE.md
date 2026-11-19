## vectors — latest build

A Rust CLI and library for raster-to-vector conversion: PNG/JPEG in, clean
editable SVG out — plus an HTTP API, an MCP server for agent integrations,
a browser extension, and a VS Code extension. All offline, all deterministic.

### CLI

| Platform            | Asset                                    |
| ------------------- | ---------------------------------------- |
| Linux x86_64        | `cli-vectors-x86_64-unknown-linux-gnu`   |
| macOS Apple Silicon | `cli-vectors-aarch64-apple-darwin`       |
| Windows x86_64      | `cli-vectors-x86_64-pc-windows-msvc.exe` |

Or install everything at once:

```sh
curl -fsSL https://raw.githubusercontent.com/hieudoanm/vectors/master/scripts/install.sh | bash
```

`install.sh` also takes `--firefox`, `--chrome` and `--vscode` to fetch the
extension packages below.

### Browser extension

| Browser       | Asset                              | Install                                                                          |
| ------------- | ---------------------------------- | -------------------------------------------------------------------------------- |
| Firefox       | `browser-extension-vectors-v2.xpi` | `about:debugging` → Load Temporary Add-on, or `install.sh --firefox`             |
| Chrome / Edge | `browser-extension-vectors-v3.zip` | `chrome://extensions` → Developer mode → Load unpacked, or `install.sh --chrome` |

Unsigned `.crx` packages are also attached where the build runner has Chrome.

Right-click any PNG/JPEG on a page → **Convert to SVG (vectors)**.

### VS Code extension

| Asset                           | Install                                                             |
| ------------------------------- | ------------------------------------------------------------------- |
| `vscode-extension-vectors.vsix` | Extensions view → `…` → Install from VSIX, or `install.sh --vscode` |

Right-click a PNG/JPEG in the Explorer → **Convert Image to SVG**.

### Quick start

```sh
vectors logo.png logo.svg
vectors serve        # HTTP API on :8080
vectors mcp serve    # MCP server on stdio
```

### Documentation

- [README](https://github.com/hieudoanm/vectors#readme)
- [Docs site](https://hieudoanm.github.io/vectors/docs/)
