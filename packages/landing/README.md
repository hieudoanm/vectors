# Landing

Next.js 16 (App Router) static-export site + Tailwind CSS v4 — landing page and
in-browser converter, deployed to GitHub Pages at `https://vectors.hieudoan.dev`
(project site — `basePath: "/vectors"` in production).

## Layout

- `src/app/page.tsx` — landing page (hero, try-it converter, features, pipeline,
  install terminals, CTA, footer)
- `src/components/Converter.tsx` — client component wrapping the tracer UI
  (`Dropzone`, `FilePreview`, `ResultView`)
- `src/lib/core.ts` — `@vectors/core` WebAssembly bindings; conversion runs
  fully client-side
- `src/app/globals.css` — Tailwind v4 entry plus the `.checker` preview backdrop
- `public/` — static assets served under `/vectors/`

## Commands

```sh
cd packages/landing
pnpm install
pnpm run dev     # dev server (no basePath)
pnpm run build   # static export → out/ (uploaded to Pages by CI)
pnpm run lint    # eslint
```

## Conventions

- **Keep `output: "export"`** — the site must build to static HTML; no server
  features, no API routes.
- **`basePath` is `/vectors` in production** (see `next.config.ts`);
  `next/link`, `next/image` and metadata get it automatically, but raw
  `<a href>` and `next/image` with `unoptimized` do not — prefix manually where
  needed (see `LOGO` in `src/app/page.tsx`).
- The wasm package `@vectors/core` is built from `crates/vectors-core`
  (`make build-wasm`); CI builds it before `pnpm run build`.
