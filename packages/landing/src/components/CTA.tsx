import Link from 'next/link';
import type { FC } from 'react';

const GITHUB = 'https://github.com/hieudoanm/vectors';

const CTA: FC = () => (
  <section className="bg-slate-50 py-20">
    <div className="mx-auto w-full max-w-6xl px-5 text-center">
      <h2 className="text-3xl font-bold tracking-tight text-slate-900">
        Your next logo deserves real paths.
      </h2>
      <p className="mt-3 text-[1.0625rem] text-slate-600">
        Trace it in the browser above, or take the binary for your pipeline.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="#try"
          className="rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white no-underline hover:bg-blue-700">
          Convert an image
        </Link>
        <Link
          href={GITHUB}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-900 no-underline hover:border-slate-400">
          Star on GitHub
        </Link>
      </div>
    </div>
  </section>
);

export default CTA;
