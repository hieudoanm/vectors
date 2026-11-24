# How to install the vectors extension for VS Code

## Option 1: install script (recommended)

```sh
curl -fsSL https://github.com/hieudoanm/vectors/master/scripts/install.sh | bash -- --vscode
```

The script downloads `extension-vscode-vectors.vsix` from the
[latest release](https://github.com/hieudoanm/vectors/releases/latest) and runs
`code --install-extension` when the `code` CLI is available.

## Option 2: manual install from the downloads page

1. Open the [downloads page](https://hieudoanm.github.io/vectors/downloads/) and
   download **VS Code** under **Editor Extensions** —
   `extension-vscode-vectors.vsix`.
2. In VS Code, open the Extensions view (`Cmd+Shift+X` / `Ctrl+Shift+X`).
3. Click **… → Install from VSIX…** and pick the downloaded file.

## Verifying

Open the Command Palette (`Cmd+Shift+P`) and run an `vectors:` command, or look
for the extension in the Extensions view.

## Troubleshooting

- To update, re-run the install script or install the newer `.vsix` the same
  way; VS Code replaces the existing version.
