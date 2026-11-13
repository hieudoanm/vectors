# Installation

## Prerequisites

- [Rust](https://rustup.rs/) 1.88+ (CLI and library)
- Node.js 26.12.1 and pnpm 12.15.0 (landing page and workspace scripts only)

## Build the CLI

```sh
git clone https://github.com/hieudoanm/vectors.git
cd vectors/crates/vectors-cli
cargo build --release
../target/release/vectors --help
```

The binary lands at `crates/target/release/vectors`.

## Prebuilt binary

A prebuilt `vectors` binary is attached to the rolling
[`vectors-latest`](https://github.com/hieudoanm/vectors/releases/tag/vectors-latest)
release; `crates/vectors-cli/scripts/install.sh` downloads it.
