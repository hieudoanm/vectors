#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CRATES_DIR="$REPO_ROOT/crates"
BROWSER_DIR="$REPO_ROOT/packages/extensions/browser"
VSCODE_DIR="$REPO_ROOT/packages/extensions/vscode"

ts() { date '+%Y-%m-%dT%H:%M:%S%z'; }

log()   { printf '[%s] [INFO ] %s\n' "$(ts)" "$*"; }
warn()  { printf '[%s] [WARN ] %s\n' "$(ts)" "$*" >&2; }
error() { printf '[%s] [ERROR] %s\n' "$(ts)" "$*" >&2; }
die()   { error "$*"; exit 1; }

usage() {
  cat <<'EOF'
Usage: install-local.sh [--cli|--firefox|--chrome|--vscode] [DEST]

  --cli       Build the vectors CLI from source and install it (default)
  --firefox   Build the MV2 extension and install vectors-v2.xpi for Firefox
  --chrome    Build the MV3 extension and unpack vectors-v3.zip for Chrome/Edge
  --vscode    Build the VS Code extension and install vectors-vscode.vsix

DEST is the install path for --cli, the download directory for --firefox
and --vscode, or the extension directory for --chrome.
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
log "Detected OS: $OS, mode: $MODE"

# --- CLI -------------------------------------------------------------------
install_cli() {
  command -v cargo >/dev/null 2>&1 || die "cargo not found; install Rust from https://rustup.rs"
  log "cargo $(cargo --version | awk '{print $2}')"

  # Pick a writable install destination.
  local dest="$DEST"
  if [ -z "$dest" ]; then
    dest="$(command -v vectors 2>/dev/null || true)"
    if [ -n "$dest" ]; then
      log "Found existing install at $dest; will overwrite"
    elif [ "$OS" = "macos" ] && [ -d "/opt/homebrew/bin" ] && [ -w "/opt/homebrew/bin" ]; then
      dest="/opt/homebrew/bin/vectors"
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

  log "Building release binary from $CRATES_DIR"
  (cd "$CRATES_DIR" && cargo build --release -p vectors-cli)

  local bin="$CRATES_DIR/target/release/vectors"
  [ "$OS" = "windows" ] && bin="$bin.exe"
  [ -x "$bin" ] || die "Build finished but $bin not found"
  log "Built $(wc -c < "$bin" | tr -d ' ') bytes at $bin"

  log "Installing to $dest"
  cp "$bin" "$dest"
  chmod +x "$dest"
  log "Installed vectors to $dest"

  if command -v "$dest" >/dev/null 2>&1; then
    log "Verifying install: $dest --version"
    "$dest" --version || true
  else
    log "Note: $dest is not on PATH yet. Add $dest_dir to your shell's PATH."
  fi
}

# --- Build the extension package -------------------------------------------
build_extension() {
  command -v pnpm >/dev/null 2>&1 || die "pnpm not found; install pnpm 12+"
  command -v make >/dev/null 2>&1 || die "make not found"
  log "Building extension package (wasm + dist + artifacts)"
  (cd "$BROWSER_DIR" && make package)
  local xpi="$BROWSER_DIR/download/vectors-v2.xpi"
  local zip="$BROWSER_DIR/download/vectors-v3.zip"
  [ -f "$xpi" ] || die "Expected $xpi after make package"
  [ -f "$zip" ] || die "Expected $zip after make package"
}

install_firefox() {
  build_extension
  local dir="$DEST"
  [ -z "$dir" ] && dir="$HOME/Downloads"
  mkdir -p "$dir"
  cp "$BROWSER_DIR/download/vectors-v2.xpi" "$dir/vectors-v2.xpi"
  log "Installed $dir/vectors-v2.xpi"
  cat <<EOF

Next steps (Firefox):
  1. Open about:debugging#/runtime/this-firefox
  2. Click "Load Temporary Add-on…" and pick:
       $dir/vectors-v2.xpi
EOF
}

install_chrome() {
  build_extension
  local dir="$DEST"
  [ -z "$dir" ] && dir="$HOME/.local/share/vectors/chrome-extension"
  mkdir -p "$dir"
  unzip -q -o "$BROWSER_DIR/download/vectors-v3.zip" -d "$dir"
  log "Unpacked extension to $dir"
  cat <<EOF

Next steps (Chrome/Edge):
  1. Open chrome://extensions (or edge://extensions)
  2. Enable "Developer mode"
  3. Click "Load unpacked" and pick:
       $dir
EOF
}

install_vscode() {
  command -v pnpm >/dev/null 2>&1 || die "pnpm not found; install pnpm 12+"
  log "Building VS Code extension (wasm + vsix)"
  (cd "$VSCODE_DIR" && pnpm build:wasm && pnpm package)
  local vsix="$VSCODE_DIR/build/vectors-vscode.vsix"
  [ -f "$vsix" ] || die "Expected $vsix after pnpm package"

  local dir="$DEST"
  [ -z "$dir" ] && dir="$HOME/Downloads"
  mkdir -p "$dir"

  if command -v code >/dev/null 2>&1; then
    log "Installing extension: code --install-extension $vsix"
    if code --install-extension "$vsix"; then
      log "Installed vectors-vscode"
    else
      warn "code --install-extension failed; install $vsix manually"
      cp "$vsix" "$dir/vectors-vscode.vsix"
      log "Copied $dir/vectors-vscode.vsix"
    fi
  else
    cp "$vsix" "$dir/vectors-vscode.vsix"
    log "Copied $dir/vectors-vscode.vsix"
    cat <<EOF

Next steps (VS Code):
  The 'code' CLI was not found. Install the extension manually:
  1. Open VS Code → Extensions view (Cmd+Shift+X)
  2. Click "…" → "Install from VSIX…"
  3. Pick: $dir/vectors-vscode.vsix
EOF
  fi
}

case "$MODE" in
  cli)     install_cli ;;
  firefox) install_firefox ;;
  chrome)  install_chrome ;;
  vscode)  install_vscode ;;
esac
