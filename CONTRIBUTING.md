# Contributing to vectors

Thanks for contributing to vectors, a classical raster-to-vector tracer in
Rust — PNG/JPEG to clean SVG paths and back — shipped as a CLI, HTTP API, MCP
server, library, and web app.

## Repository layout

- `crates/vectors-core` — core Rust library (pipeline, SVG serializer,
  SVG → PNG renderer; builds for `wasm32-unknown-unknown`).
- `crates/vectors-cli` — the `vectors` binary and its surfaces.
- `packages/landing` — Next.js landing page with an in-browser converter.
- `docs/` — architecture, roadmap, packaging notes.

## Setup

```bash
git clone https://github.com/hieudoanm/vectors.git
cd vectors

# CLI
cd crates && cargo build --release

# Everything (workspace)
pnpm install && pnpm build
```

Requires Rust 1.88+; Node.js 26.12.1 and pnpm 12.15.0 for the landing page.

## Checks

```bash
cd crates
cargo fmt --all -- --check
cargo clippy --all-targets -- -D warnings
cargo test --locked

cd ../packages/landing
pnpm typecheck && pnpm lint && pnpm build
```

In `crates/vectors-core`, both the default and `--features raster` builds
must stay green, and `cargo build --target wasm32-unknown-unknown` must keep
working. In `crates/vectors-cli`, both the default and `--features eval`
test suites must stay green.

## Conventions

- The pipeline is one-way and deterministic — no RNG, no hash-order
  dependence. Preserve byte-identical output for identical input.
- Quality claims are measured by rasterizing the emitted SVG, not by
  eyeballing paths; keep the eval harness honest.
- Each crate/package has its own README and AGENTS.md — update them when
  behaviour changes.

## License

By contributing, you agree that your contributions will be licensed under the
repository license in [`LICENSE`](LICENSE).
