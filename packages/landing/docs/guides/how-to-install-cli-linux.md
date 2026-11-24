# How to install the vectors CLI on Linux

For x86_64 Linux distributions. The image-to-SVG tracing CLI.

## Option 1: install script (recommended)

```sh
curl -fsSL https://github.com/hieudoanm/vectors/master/scripts/install.sh | bash
```

The script detects `linux/x86_64` and downloads
`cli-vectors-x86_64-unknown-linux-gnu` from the
[latest release](https://github.com/hieudoanm/vectors/releases/latest). It
installs to `~/.local/bin/vectors` — override with `INSTALL_DIR=/path`.

## Option 2: manual download

1. Open the [downloads page](https://hieudoanm.github.io/vectors/downloads/) and
   download **Linux** under **CLI** — `cli-vectors-x86_64-unknown-linux-gnu`.
2. Make it executable and move it onto your `PATH`:

```sh
chmod +x cli-vectors-x86_64-unknown-linux-gnu
mv cli-vectors-x86_64-unknown-linux-gnu ~/.local/bin/vectors
```

3. Verify:

```sh
vectors --version
```

## Troubleshooting

- `vectors: command not found` — ensure `~/.local/bin` is on your `PATH` (most
  distributions already include it).
- `No such file or directory` on a glibc system — the binary is built against
  glibc; on musl-based distros (Alpine) build from source instead.
