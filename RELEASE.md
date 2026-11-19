## vectors — latest build

A Rust CLI and library for raster-to-vector conversion: PNG/JPEG in, clean
editable SVG out — plus an HTTP API, an MCP server for agent integrations,
a browser extension, and editor extensions for VS Code and Zed. All offline,
all deterministic.

Downloads: <https://github.com/hieudoanm/vectors/releases/tag/latest>

### CLI

| Platform            | Asset                                                                                                                                          |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Linux x86_64        | [cli-vectors-x86_64-unknown-linux-gnu](https://github.com/hieudoanm/vectors/releases/download/latest/cli-vectors-x86_64-unknown-linux-gnu)     |
| macOS Apple Silicon | [cli-vectors-aarch64-apple-darwin](https://github.com/hieudoanm/vectors/releases/download/latest/cli-vectors-aarch64-apple-darwin)             |
| Windows x86_64      | [cli-vectors-x86_64-pc-windows-msvc.exe](https://github.com/hieudoanm/vectors/releases/download/latest/cli-vectors-x86_64-pc-windows-msvc.exe) |

Or install everything at once:

```sh
curl -fsSL https://raw.githubusercontent.com/hieudoanm/vectors/master/scripts/install.sh | bash
```

`install.sh` also takes `--firefox`, `--chrome`, `--vscode` and `--zed` to
fetch the extension packages below.

### Browser extension

| Browser       | Asset                                                                                                                              | Install                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Firefox       | [extension-browser-vectors-v2.xpi](https://github.com/hieudoanm/vectors/releases/download/latest/extension-browser-vectors-v2.xpi) | `about:debugging` → Load Temporary Add-on, or `install.sh --firefox`             |
| Chrome / Edge | [extension-browser-vectors-v3.zip](https://github.com/hieudoanm/vectors/releases/download/latest/extension-browser-vectors-v3.zip) | `chrome://extensions` → Developer mode → Load unpacked, or `install.sh --chrome` |

Unsigned `.crx` packages are also attached where the build runner has Chrome.

Right-click any PNG/JPEG on a page → **Convert to SVG (vectors)**.

### VS Code extension

| Asset                                                                                                                        | Install                                                             |
| ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| [extension-vscode-vectors.vsix](https://github.com/hieudoanm/vectors/releases/download/latest/extension-vscode-vectors.vsix) | Extensions view → `…` → Install from VSIX, or `install.sh --vscode` |

Right-click a PNG/JPEG in the Explorer → **Convert Image to SVG**.

### Zed extension

| Asset                                                                                                                      | Install                                                                 |
| -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [extension-zed-vectors.tar.gz](https://github.com/hieudoanm/vectors/releases/download/latest/extension-zed-vectors.tar.gz) | `zed: install extension` → Install Dev Extension, or `install.sh --zed` |

In the assistant panel: `/vectors <image.png|jpg|jpeg>` converts a
worktree-relative image to SVG next to it. The extension uses the `vectors`
CLI on `PATH`, or downloads the matching release binary automatically.

### Quick start

```sh
vectors logo.png logo.svg
vectors serve        # HTTP API on :8080
vectors mcp serve    # MCP server on stdio
```

### Documentation

- [README](https://github.com/hieudoanm/vectors#readme)
- [Docs site](https://hieudoanm.github.io/vectors/docs/)
