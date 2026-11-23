#!/usr/bin/env bash
set -euo pipefail

BASE_URL="https://github.com/hieudoanm/vectors/releases/download/latest"

ts() { date '+%Y-%m-%dT%H:%M:%S%z'; }

log()   { printf '[%s] [INFO ] %s\n' "$(ts)" "$*"; }
warn()  { printf '[%s] [WARN ] %s\n' "$(ts)" "$*" >&2; }
error() { printf '[%s] [ERROR] %s\n' "$(ts)" "$*" >&2; }
die()   { error "$*"; exit 1; }

usage() {
  cat <<'EOF'
Usage: install.sh [--cli|--firefox|--chrome|--vscode|--zed|--jetbrains] [DEST]

  --cli        Install the vectors CLI binary (default)
  --firefox    Download the MV2 extension (extension-browser-vectors-v2.xpi) for Firefox
  --chrome     Download and unpack the MV3 extension (extension-browser-vectors-v3.zip) for Chrome/Edge
  --vscode     Download the VS Code extension (extension-vscode-vectors.vsix) and install it
  --zed        Download the Zed extension (extension-zed-vectors.tar.gz) and unpack it
  --jetbrains  Download the JetBrains plugin (extension-jetbrains-vectors.zip)

DEST is the install path for --cli, the download directory for --firefox,
--vscode, --zed and --jetbrains, or the extension directory for --chrome.
EOF
  exit "${1:-0}"
}

# --- Parse arguments -------------------------------------------------------
MODE=cli
DEST=""
for arg in "$@"; do
  case "$arg" in
    --cli)     MODE=cli ;;
    --firefox) MODE=firefox ;;
    --chrome)  MODE=chrome ;;
    --vscode)  MODE=vscode ;;
    --zed)     MODE=zed ;;
    --jetbrains) MODE=jetbrains ;;
    -h|--help) usage 0 ;;
    --*)       die "Unknown flag: $arg" ;;
    *)         [ -z "$DEST" ] && DEST="$arg" || die "Unexpected argument: $arg" ;;
  esac
done

# --- Detect the OS ---------------------------------------------------------
case "$(uname -s)" in
  Linux*)   OS=linux ;;
  Darwin*)  OS=macos ;;
  MINGW*|MSYS*|CYGWIN*) OS=windows ;;
  *)        die "Unsupported OS: $(uname -s)" ;;
esac
ARCH="$(uname -m)"
log "Detected OS: $OS ($ARCH), mode: $MODE"

download() { # url dest
  log "Downloading $1"
  curl -fsSL --retry 3 --retry-delay 2 "$1" -o "$2"
  log "Downloaded $(wc -c < "$2" | tr -d ' ') bytes"
}

# --- CLI binary ------------------------------------------------------------
install_cli() {
  local asset
  case "$OS/$ARCH" in
    macos/arm64)  asset=cli-vectors-aarch64-apple-darwin ;;
    macos/x86_64) asset=cli-vectors-x86_64-apple-darwin ;;
    macos/*)      die "No macOS/$ARCH release asset; build from source with scripts/install-local.sh" ;;
    linux/x86_64) asset=cli-vectors-x86_64-unknown-linux-gnu ;;
    linux/*)      die "No linux/$ARCH release asset; build from source with scripts/install-local.sh" ;;
    windows/*)    asset=cli-vectors-x86_64-pc-windows-msvc.exe ;;
    *)            die "Unsupported platform: $OS/$ARCH" ;;
  esac
  local url="$BASE_URL/$asset"

  # Pick a writable install destination.
  local dest="$DEST"
  if [ -z "$dest" ]; then
    dest="$(command -v vectors 2>/dev/null || true)"
    if [ -n "$dest" ]; then
      log "Found existing install at $dest; will overwrite"
    elif [ "$OS" = "macos" ] && [ -d "/usr/local/bin" ] && [ -w "/usr/local/bin" ]; then
      dest="/usr/local/bin/vectors"
    elif [ -d "$HOME/.local/bin" ]; then
      mkdir -p "$HOME/.local/bin"
      dest="$HOME/.local/bin/vectors"
    elif [ "$OS" = "windows" ]; then
      dest="$HOME/bin/vectors.exe"
      mkdir -p "$HOME/bin"
    else
      die "Could not find a writable install directory; pass one explicitly."
    fi
  fi

  local dest_dir
  dest_dir="$(dirname "$dest")"
  mkdir -p "$dest_dir"
  [ -w "$dest_dir" ] || die "$dest_dir is not writable"

  local tmp
  tmp="$(mktemp)"
  trap 'rm -f "$tmp"' EXIT
  download "$url" "$tmp"

  log "Installing to $dest"
  mv "$tmp" "$dest"
  chmod +x "$dest" 2>/dev/null || true
  log "Installed vectors to $dest"

  if command -v "$dest" >/dev/null 2>&1; then
    log "Verifying install: $dest --version"
    "$dest" --version || true
  else
    log "Note: $dest is not on PATH yet. Add $dest_dir to your shell's PATH."
  fi
}

# --- Firefox (MV2 .xpi) ----------------------------------------------------
install_firefox() {
  local dir="$DEST"
  [ -z "$dir" ] && dir="$HOME/Downloads"
  mkdir -p "$dir"
  download "$BASE_URL/extension-browser-vectors-v2.xpi" "$dir/extension-browser-vectors-v2.xpi"
  cat <<EOF

Next steps (Firefox):
  1. Open about:debugging#/runtime/this-firefox
  2. Click "Load Temporary Add-on…" and pick:
       $dir/extension-browser-vectors-v2.xpi
  For a permanent install, use web-ext or about:addons → gear → Install
  Add-on From File (requires a signed xpi for release Firefox).
EOF
}

# --- Chrome/Edge (MV3 .zip, unpacked) --------------------------------------
install_chrome() {
  local dir="$DEST"
  [ -z "$dir" ] && dir="$HOME/.local/share/vectors/chrome-extension"
  mkdir -p "$dir"
  local tmp
  tmp="$(mktemp -d)"
  trap 'rm -rf "$tmp"' EXIT
  download "$BASE_URL/extension-browser-vectors-v3.zip" "$tmp/extension-browser-vectors-v3.zip"
  unzip -q -o "$tmp/extension-browser-vectors-v3.zip" -d "$dir"
  log "Unpacked extension to $dir"
  cat <<EOF

Next steps (Chrome/Edge):
  1. Open chrome://extensions (or edge://extensions)
  2. Enable "Developer mode"
  3. Click "Load unpacked" and pick:
       $dir
EOF
}

# --- VS Code (.vsix) --------------------------------------------------------
install_vscode() {
  local dir="$DEST"
  [ -z "$dir" ] && dir="$HOME/Downloads"
  mkdir -p "$dir"
  local vsix="$dir/extension-vscode-vectors.vsix"
  download "$BASE_URL/extension-vscode-vectors.vsix" "$vsix"

  if command -v code >/dev/null 2>&1; then
    log "Installing extension: code --install-extension $vsix"
    if code --install-extension "$vsix"; then
      log "Installed vectors-vscode"
    else
      warn "code --install-extension failed; install $vsix manually"
    fi
  else
    cat <<EOF

Next steps (VS Code):
  The 'code' CLI was not found. Install the extension manually:
  1. Open VS Code → Extensions view (Cmd+Shift+X)
  2. Click "…" → "Install from VSIX…"
  3. Pick: $vsix
EOF
  fi
}

# --- Zed (source tarball, dev extension) ------------------------------------
install_zed() {
  local dir="$DEST"
  [ -z "$dir" ] && dir="$HOME/Downloads"
  mkdir -p "$dir"
  local tmp
  tmp="$(mktemp -d)"
  trap 'rm -rf "$tmp"' EXIT
  download "$BASE_URL/extension-zed-vectors.tar.gz" "$tmp/extension-zed-vectors.tar.gz"
  mkdir -p "$dir/vectors-zed"
  tar -xzf "$tmp/extension-zed-vectors.tar.gz" -C "$dir/vectors-zed"
  log "Unpacked Zed extension to $dir/vectors-zed"
  cat <<EOF

Next steps (Zed):
  1. Open the command palette → "zed: install extension"
  2. Choose "Install Dev Extension"
  3. Select: $dir/vectors-zed
  Then use /vectors <image.png|jpg|jpeg> in the assistant panel.
EOF
}

# --- JetBrains (.zip plugin) ------------------------------------------------
install_jetbrains() {
  local dir="$DEST"
  [ -z "$dir" ] && dir="$HOME/Downloads"
  mkdir -p "$dir"
  local zip="$dir/extension-jetbrains-vectors.zip"
  download "$BASE_URL/extension-jetbrains-vectors.zip" "$zip"
  cat <<EOF

Next steps (JetBrains IDEs):
  1. Open Settings → Plugins → ⚙ → "Install Plugin from Disk…"
  2. Pick: $zip
  3. Restart the IDE if prompted, then set the vectors CLI path in
     Settings → Tools → vectors if `vectors` is not on PATH.
  Use: right-click a PNG/JPEG in the Project view → Vectors →
  Convert Image to SVG.
EOF
}

case "$MODE" in
  cli)        install_cli ;;
  firefox)    install_firefox ;;
  chrome)     install_chrome ;;
  vscode)     install_vscode ;;
  zed)        install_zed ;;
  jetbrains)  install_jetbrains ;;
esac
