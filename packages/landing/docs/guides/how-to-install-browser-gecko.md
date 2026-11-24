# How to install the Vectors browser extension (Firefox / Gecko)

The **v2** build is Manifest V2 for Firefox (and legacy Chrome). Firefox ≥109
can also use the v3 build — see the
[Chromium page](./how-to-install-browser-chromium.md).

## Option 1: install script (recommended)

```sh
curl -fsSL https://github.com/hieudoanm/vectors/master/scripts/install.sh | bash -- --firefox
```

The script downloads `extension-browser-vectors-v2.xpi` into the current
directory (or the `DEST` argument) and prints the load steps.

## Option 2: manual download

1. Open the [downloads page](https://hieudoanm.github.io/vectors/downloads/) and
   download **Firefox** under **Browser Extensions** — either:
   - `extension-browser-vectors-v2.xpi` — ready-to-load package, or
   - `extension-browser-vectors-v2.zip` — unpacked source.

## Loading the extension

### From the `.xpi`

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on…** and pick the `.xpi`.

Temporary add-ons are removed when Firefox restarts. For a permanent install,
the `.xpi` must be **signed** — self-hosted unsigned extensions are not accepted
by release Firefox.

### From the `.zip` (development)

Unzip `extension-browser-vectors-v2.zip`, then in `about:debugging` choose
**Load Temporary Add-on…** and pick the `manifest.json` inside the folder — or
load it temporarily from `about:debugging` each session.

## Using it

Right-click any PNG or JPEG and choose the Vectors conversion command to trace
it to SVG — fully offline.

## Troubleshooting

- Add-on disappears after restart — expected for unsigned temporary add-ons;
  re-load it from `about:debugging`.
