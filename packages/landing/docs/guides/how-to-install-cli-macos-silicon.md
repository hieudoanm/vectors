# How to install the vectors CLI on macOS (Apple Silicon)

For Macs with an M-series chip (arm64). The image-to-SVG tracing CLI.

## Option 1: install script (recommended)

```sh
curl -fsSL https://github.com/hieudoanm/vectors/master/scripts/install.sh | bash
```

The script detects `macos/arm64` and downloads
`cli-vectors-aarch64-apple-darwin` from the
[latest release](https://github.com/hieudoanm/vectors/releases/latest). It
installs to `~/.local/bin/vectors` — override with `INSTALL_DIR=/path`.

## Option 2: manual download

1. Open the [downloads page](https://hieudoanm.github.io/vectors/downloads/) and
   download **macOS (Silicon)** under **CLI** —
   `cli-vectors-aarch64-apple-darwin`.
2. Make it executable and move it onto your `PATH`:

```sh
chmod +x cli-vectors-aarch64-apple-darwin
mv cli-vectors-aarch64-apple-darwin ~/.local/bin/vectors
```

3. Verify:

```sh
vectors --version
```

## Troubleshooting

- `vectors: command not found` — the install directory is not on your `PATH`.
  Add `export PATH="$HOME/.local/bin:$PATH"` to your shell profile.
- Gatekeeper warning — the binary is unsigned. Right-click → Open, or run
  `xattr -d com.apple.quarantine` on the installed binary.
