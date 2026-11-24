# How to install the vectors extension for Zed

## Option 1: install script (recommended)

```sh
curl -fsSL https://github.com/hieudoanm/vectors/master/scripts/install.sh | bash -- --zed
```

The script downloads `extension-zed-vectors.tar.gz` from the
[latest release](https://github.com/hieudoanm/vectors/releases/latest), extracts
it to `~/.local/share/vectors/zed-extension`, and prints the install command.

## Option 2: manual download

1. Open the [downloads page](https://hieudoanm.github.io/vectors/downloads/) and
   download **Zed** under **Editor Extensions** —
   `extension-zed-vectors.tar.gz`.
2. Extract the archive:

```sh
tar -xzf extension-zed-vectors.tar.gz -C ~/zed-vectors-extension
```

3. In Zed, open the command palette and run **zed: install** (or
   `zed: install ~/zed-vectors-extension`), then select the extracted directory.
   You can also copy the directory into Zed's extensions folder.

## Verifying

Restart Zed if prompted; the extension appears under **Extensions** in the
settings UI.

## Troubleshooting

- Extension does not show up — make sure you selected the directory that
  contains `extension.toml`, not a parent folder.
