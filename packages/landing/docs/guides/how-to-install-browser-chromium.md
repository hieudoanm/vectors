# How to install the Vectors browser extension (Chromium)

The **v3** build is Manifest V3 and works in Chrome, Edge, Brave, Arc and other
Chromium browsers — and in Firefox 109+.

## Option 1: install script (recommended)

```sh
curl -fsSL https://github.com/hieudoanm/vectors/master/scripts/install.sh | bash -- --chrome
```

The script downloads `extension-browser-vectors-v3.zip`, extracts it to
`~/.local/share/vectors/chrome-extension`, and prints the load steps.

## Option 2: manual download

1. Open the [downloads page](https://hieudoanm.github.io/vectors/downloads/) and
   download **Chrome** under **Browser Extensions** — either:
   - `extension-browser-vectors-v3.crx` — packed extension, or
   - `extension-browser-vectors-v3.zip` — unpacked source.

## Loading the extension

### From the `.zip` (unpacked — recommended for development)

1. Unzip `extension-browser-vectors-v3.zip` to a permanent folder.
2. Open `chrome://extensions` (or `edge://extensions`).
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select the unzipped folder.

### From the `.crx`

Drag `extension-browser-vectors-v3.crx` onto `chrome://extensions`, or use
**Pack extension**-style sideloading. Chromium may warn about unsigned
extensions — choose **Keep** if prompted.

## Using it

Right-click any PNG or JPEG on a page and choose the Vectors conversion command
to trace it to SVG — fully offline.

## Troubleshooting

- Extension missing after reload — unpacked extensions live where you extracted
  them; do not delete that folder.
- Right-click menu absent — reload the tab after installing.
