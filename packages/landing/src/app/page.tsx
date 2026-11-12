import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';
import { LuCpu, LuPuzzle } from 'react-icons/lu';
import { Converter } from '@/components/Converter';
import Footer from '@/components/Footer';
import Features, { type Feature } from '@/components/Features';
import CTA from '@/components/CTA';
import {
  LuFileImage,
  LuGitBranch,
  LuLayers,
  LuPalette,
  LuRepeat,
  LuServer,
  LuShieldCheck,
  LuSpline,
} from 'react-icons/lu';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

const GITHUB = 'https://github.com/hieudoanm/vectors';
const RELEASES = `${GITHUB}/releases`;
// next/image with unoptimized does not apply basePath — mirror next.config.ts.
const LOGO =
  process.env.NODE_ENV === 'production' ? '/vectors/logo.svg' : '/logo.svg';

const PIPELINE = [
  'raster',
  'preprocess',
  'segment',
  'contour',
  'simplify',
  'bézier',
  'vector',
  'SVG',
];

type TokKind =
  'prompt' | 'cmd' | 'flag' | 'str' | 'key' | 'url' | 'dim' | 'ok' | 'err';
interface Tok {
  t: string;
  c?: TokKind;
}

const TK: Record<TokKind, string> = {
  prompt: 'text-accent',
  cmd: 'font-semibold text-sky-300',
  flag: 'text-amber-300',
  str: 'text-green-300',
  key: 'text-violet-300',
  url: 'text-cyan-300',
  dim: 'text-slate-500',
  ok: 'text-slate-200',
  err: 'text-red-400',
};

interface TermProps {
  caption: string;
  lines: Tok[][];
}

const Term: FC<TermProps> = ({ caption, lines }) => (
  <figure className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl shadow-slate-900/10">
    <figcaption className="border-b border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-slate-500">
      {caption}
    </figcaption>
    <pre className="overflow-x-auto px-5 py-4 font-mono text-xs leading-relaxed whitespace-pre text-slate-200 tabular-nums">
      {lines.map((line, i) => (
        <span key={i} className="block min-h-[1.7em]">
          {line.map((tok, j) => (
            <span key={j} className={TK[tok.c ?? 'ok']}>
              {tok.t}
            </span>
          ))}
        </span>
      ))}
    </pre>
  </figure>
);

const FEATURES: Feature[] = [
  {
    title: 'Palette & binary modes',
    body: 'Median-cut colour quantization (default 8 colours) or a single luminance threshold for black-and-white output.',
    icon: LuPalette,
  },
  {
    title: 'Real holes, not hacks',
    body: '8-connected segmentation walks each region’s boundary and emits outer contours plus holes with fill-rule="evenodd".',
    icon: LuGitBranch,
  },
  {
    title: 'Bézier-fitted curves',
    body: 'Douglas–Peucker simplification followed by least-squares curve fitting — editable paths, not a bitmap in a trench coat.',
    icon: LuSpline,
  },
  {
    title: 'Deterministic output',
    body: 'No RNG, no hash-order dependence. Identical input produces byte-identical SVG, so baselines and diffs stay meaningful.',
    icon: LuRepeat,
  },
  {
    title: 'CLI, API, MCP & library',
    body: 'One pipeline, many surfaces: vectors trace, vectors serve, vectors mcp serve, or the Rust crate compiled to WebAssembly.',
    icon: LuServer,
  },
  {
    title: 'SVG → PNG too',
    body: 'The inverse direction renders SVG back to a sized PNG — exact grid or proportional — with resvg behind the raster feature.',
    icon: LuFileImage,
  },
  {
    title: 'Measured, not vibes',
    body: 'An optional eval harness rasterizes the emitted SVG and scores MAE, PSNR, SSIM and edge agreement against committed baselines.',
    icon: LuLayers,
  },
  {
    title: 'Offline & private',
    body: 'A static binary with no network calls. The web converter runs the same tracer in your browser — files never leave the machine.',
    icon: LuShieldCheck,
  },
];

const Home: FC = () => (
  <>
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-5">
        <Link
          href="#top"
          className="flex items-center gap-2 text-lg font-bold text-slate-900 no-underline">
          <Image src={LOGO} alt="" width={28} height={28} />
          <span>vectors</span>
        </Link>
        <nav className="ml-auto hidden items-center gap-5 lg:flex">
          <Link
            href="#try"
            className="text-sm text-slate-600 no-underline hover:text-slate-900">
            Try it
          </Link>
          <Link
            href="#features"
            className="text-sm text-slate-600 no-underline hover:text-slate-900">
            Features
          </Link>
          <Link
            href="#how"
            className="text-sm text-slate-600 no-underline hover:text-slate-900">
            How it works
          </Link>
          <Link
            href="#install"
            className="text-sm text-slate-600 no-underline hover:text-slate-900">
            Install
          </Link>
        </nav>
        <a
          href={GITHUB}
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary btn-sm">
          GitHub
        </a>
      </div>
    </header>

    <main id="top">
      {/* hero */}
      <section className="pt-20 pb-16">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 text-left lg:grid-cols-[1.05fr_1fr]">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Raster in, vectors out. Offline, deterministic, one binary.
            </h1>
            <p className="mt-6 max-w-xl text-xl text-slate-600">
              vectors is a classical raster-to-vector tracer written in Rust: it
              quantizes an image into a palette, segments pixels into regions,
              walks their boundaries, fits Bézier curves, and emits clean SVG —
              then goes the other way and rasterizes SVG back to a sized PNG. No
              models, no uploads, no surprises.
            </p>
            <div className="mt-8 flex flex-wrap justify-start gap-3">
              <a href="#try" className="btn btn-primary btn-lg">
                Try the converter
              </a>
              <a
                href={GITHUB}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-lg">
                Source on GitHub
              </a>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-6">
              <div>
                <dt className="text-2xl font-bold tabular-nums">1</dt>
                <dd className="m-0 text-sm text-slate-500">pipeline</dd>
              </div>
              <div>
                <dt className="text-2xl font-bold tabular-nums">0</dt>
                <dd className="m-0 text-sm text-slate-500">network calls</dd>
              </div>
              <div>
                <dt className="text-2xl font-bold tabular-nums">byte</dt>
                <dd className="m-0 text-sm text-slate-500">
                  -identical output
                </dd>
              </div>
            </dl>
          </div>
          <Term
            caption="vectors — first trace"
            lines={[
              [
                { t: '$ ', c: 'prompt' },
                { t: 'vectors', c: 'cmd' },
                { t: ' logo.png logo.svg', c: 'dim' },
              ],
              [{ t: 'wrote logo.svg — 12 paths, 8 colours', c: 'dim' }],
              [
                { t: '$ ', c: 'prompt' },
                { t: 'vectors', c: 'cmd' },
                { t: ' logo.svg icon.png', c: 'dim' },
                { t: ' --width', c: 'flag' },
                { t: ' 512', c: 'str' },
              ],
              [{ t: 'wrote icon.png — 512×512', c: 'dim' }],
              [
                { t: '$ ', c: 'prompt' },
                { t: 'vectors', c: 'cmd' },
                { t: ' serve', c: 'dim' },
              ],
              [
                { t: 'listening on ', c: 'dim' },
                { t: 'http://localhost:8080', c: 'url' },
              ],
              [
                { t: '$ ', c: 'prompt' },
                { t: 'curl', c: 'cmd' },
                { t: ' -X ', c: 'flag' },
                { t: 'POST', c: 'flag' },
                { t: ' localhost:8080/vectors ', c: 'url' },
                { t: '\\', c: 'dim' },
              ],
              [
                { t: '    -F ', c: 'flag' },
                { t: '"file=@logo.png"', c: 'str' },
              ],
              [{ t: '{"svg": "<svg …>"}', c: 'dim' }],
            ]}
          />
        </div>
      </section>

      {/* try it */}
      <section id="try" className="bg-slate-50 py-20">
        <div className="mx-auto w-full max-w-6xl px-5">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Try it right here.
            </h2>
            <p className="mt-3 text-lg text-slate-600">
              The same Rust tracer, compiled to WebAssembly and running entirely
              in your browser. Drop a PNG and get editable SVG paths back.
            </p>
          </div>
          <Converter />
          <p className="mt-6 text-center text-xs text-slate-400">
            The conversion runs entirely in your browser; no files are uploaded.
          </p>
        </div>
      </section>

      {/* features */}
      <Features
        title="A real tracer, not a wrapper."
        description="Every stage — quantize, segment, contour, simplify, fit — is implemented in Rust and shared by the CLI, the server, the MCP tools and this page."
        features={FEATURES}
      />

      {/* how it works */}
      <section id="how" className="bg-slate-50 py-20">
        <div className="mx-auto w-full max-w-6xl px-5">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              One linear pipeline.
            </h2>
            <p className="mt-3 text-lg text-slate-600">
              Each stage consumes the previous stage&apos;s type and knows
              nothing about how the next one renders. Deterministic by
              construction — no RNG, no hash-order dependence.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {PIPELINE.map((stage, i) => (
              <span key={stage} className="flex items-center gap-2">
                <code
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                    stage === 'SVG'
                      ? 'bg-primary text-primary-content'
                      : 'border border-slate-200 bg-white text-slate-700'
                  }`}>
                  {stage}
                </code>
                {i < PIPELINE.length - 1 && (
                  <span className="text-slate-300" aria-hidden>
                    →
                  </span>
                )}
              </span>
            ))}
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="bg-primary/10 text-primary mb-3 flex h-11 w-11 items-center justify-center rounded-lg">
                <LuPuzzle className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Debug artefacts
              </h3>
              <p className="text-sm text-slate-600">
                <code>--debug-dir</code> writes the quantized image, region map,
                fitted curves and intermediate SVG so you can see exactly which
                stage went wrong.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="bg-primary/10 text-primary mb-3 flex h-11 w-11 items-center justify-center rounded-lg">
                <LuCpu className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Measured accuracy
              </h3>
              <p className="text-sm text-slate-600">
                The optional eval harness rasterizes the emitted SVG and scores
                it against the source — MAE, PSNR, SSIM, edge agreement — so
                quality claims are numbers, not vibes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* install */}
      <section id="install" className="py-20">
        <div className="mx-auto w-full max-w-6xl px-5">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Up and running in under a minute.
            </h2>
            <p className="mt-3 text-lg text-slate-600">
              Prebuilt binaries on the{' '}
              <a
                href={RELEASES}
                target="_blank"
                rel="noreferrer"
                className="text-primary">
                releases page
              </a>
              , or build from source with Cargo.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Term
              caption="install script"
              lines={[
                [
                  { t: '$ ', c: 'prompt' },
                  { t: 'curl', c: 'cmd' },
                  { t: ' -fsSL ', c: 'flag' },
                  {
                    t: `${RELEASES}/download/latest/vectors`,
                    c: 'url',
                  },
                  { t: ' | sh', c: 'dim' },
                ],
                [
                  { t: 'installed vectors to ', c: 'dim' },
                  { t: '~/.local/bin/vectors', c: 'url' },
                ],
                [
                  { t: '$ ', c: 'prompt' },
                  { t: 'vectors', c: 'cmd' },
                  { t: ' logo.png logo.svg', c: 'dim' },
                ],
                [{ t: 'wrote logo.svg', c: 'dim' }],
              ]}
            />
            <Term
              caption="build from source"
              lines={[
                [
                  { t: '$ ', c: 'prompt' },
                  { t: 'git', c: 'cmd' },
                  {
                    t: ' clone https://github.com/hieudoanm/vectors',
                    c: 'url',
                  },
                ],
                [
                  { t: '$ ', c: 'prompt' },
                  { t: 'cd', c: 'cmd' },
                  { t: ' vectors/crates', c: 'dim' },
                ],
                [
                  { t: '$ ', c: 'prompt' },
                  { t: 'cargo', c: 'cmd' },
                  { t: ' build ', c: 'dim' },
                  { t: '--release', c: 'flag' },
                  { t: ' -p ', c: 'dim' },
                  { t: 'vectors-cli', c: 'flag' },
                ],
                [
                  { t: '$ ', c: 'prompt' },
                  { t: './target/release/vectors', c: 'cmd' },
                  { t: ' --help', c: 'flag' },
                ],
                [
                  {
                    t: 'Convert raster images (PNG, JPG) into SVG vector paths',
                    c: 'dim',
                  },
                ],
              ]}
            />
          </div>
          <p className="mt-8 text-center text-sm text-slate-600">
            Also available as an HTTP API (<code>vectors serve</code>), an MCP
            server (<code>vectors mcp serve</code>), and a Rust library —{' '}
            <a
              href={`${GITHUB}#cli`}
              target="_blank"
              rel="noreferrer"
              className="text-primary">
              full CLI reference in the README
            </a>
            .
          </p>
        </div>
      </section>

      <CTA
        title="Your next logo deserves real paths."
        description="Trace it in the browser above, or take the binary for your pipeline."
        primary={{ label: 'Convert an image', href: '#try' }}
        secondary={{ label: 'Star on GitHub', href: GITHUB, external: true }}
      />
    </main>

    <Footer />
  </>
);

export default Home;
