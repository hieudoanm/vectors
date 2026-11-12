import Link from 'next/link';
import type { FC } from 'react';

const GITHUB = 'https://github.com/hieudoanm/vectors';

const Footer: FC = () => (
  <footer className="border-t border-slate-200 py-10 text-sm text-slate-500">
    <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-8 gap-y-4 px-5">
      <span>© {new Date().getFullYear()} vectors</span>
      <span>Raster to vector, offline · Rust · WebAssembly · MIT</span>
      <nav aria-label="Footer" className="ml-auto flex items-center gap-5">
        <Link
          href={GITHUB}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 no-underline hover:underline">
          GitHub
        </Link>
        <Link
          href={`${GITHUB}#readme`}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 no-underline hover:underline">
          README
        </Link>
      </nav>
    </div>
  </footer>
);

export default Footer;
