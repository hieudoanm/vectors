import type { FC } from 'react';
import type { IconType } from 'react-icons';
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

const FEATURES: { title: string; body: string; icon: IconType }[] = [
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

const Features: FC = () => (
  <section id="features" className="py-20">
    <div className="mx-auto w-full max-w-6xl px-5">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          A real tracer, not a wrapper.
        </h2>
        <p className="mt-3 text-[1.0625rem] text-slate-600">
          Every stage — quantize, segment, contour, simplify, fit — is
          implemented in Rust and shared by the CLI, the server, the MCP tools
          and this page.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <article
            key={f.title}
            className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-3.5 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <f.icon className="h-[1.375rem] w-[1.375rem]" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              {f.title}
            </h3>
            <p className="text-[0.9375rem] text-slate-600">{f.body}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
