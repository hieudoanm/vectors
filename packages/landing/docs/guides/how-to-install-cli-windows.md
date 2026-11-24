# How to install the vectors CLI on Windows

For 64-bit Windows. The image-to-SVG tracing CLI.

The release binary is a native `.exe`. The install script is bash, so on Windows
run it from **Git Bash** or **WSL** — or download the binary manually.

## Option 1: install script (recommended)

```sh
curl -fsSL https://github.com/hieudoanm/vectors/master/scripts/install.sh | bash
```

The script detects Windows and downloads
`cli-vectors-x86_64-pc-windows-msvc.exe`, installing it to
`~/.local/bin/vectors` (or the path you pass as `INSTALL_DIR`).

## Option 2: manual download

1. Open the [downloads page](https://hieudoanm.github.io/vectors/downloads/) and
   download **Windows** under **CLI** —
   `cli-vectors-x86_64-pc-windows-msvc.exe`.
2. Rename it to `vectors.exe` and place it in a directory on your `PATH` (for
   example `%LOCALAPPDATA%\Programs\vectors\` or `C:\tools\`).
3. Open a new terminal and verify:

```powershell
vectors --version
```

## Troubleshooting

- `vectors is not recognized` — the directory is not on `PATH`. Add it via
  Settings → Environment Variables, or call the binary by full path.
- SmartScreen warning — the binary is unsigned. Choose **More info → Run
  anyway**.
