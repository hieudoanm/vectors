import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { FC, ReactNode } from 'react';
import Footer from '@/components/molecules/Footer';
import Navbar from '@/components/molecules/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const GITHUB = 'https://github.com/hieudoanm/vectors';
const LOGO =
  process.env.NODE_ENV === 'production' ? '/vectors/logo.svg' : '/logo.svg';
const NAV_LINKS = [
  { label: 'Try it', href: '#try' },
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how' },
  { label: 'Install', href: '#install' },
];

const SITE_URL = 'https://hieudoanm.github.io/vectors';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Vectors — raster to SVG, offline',
    template: '%s — Vectors',
  },
  description:
    'Turn PNG and JPEG images into clean SVG paths — and rasterize SVG back to PNG at any size — entirely offline. A deterministic Rust tracer with a CLI, HTTP API, MCP server, and this in-browser converter.',
  manifest: '/manifest.json',
  icons: { icon: '/icon.svg' },
  openGraph: {
    title: 'Vectors — raster to SVG, offline',
    description:
      'A deterministic raster-to-vector tracer in Rust. Try the converter right here — no upload, no account.',
    images: ['/og.png'],
  },
};

const RootLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <html
      lang="en"
      data-theme="vectors"
      className={`h-full scroll-smooth antialiased motion-reduce:scroll-auto ${inter.className}`}>
      <body className="flex min-h-full flex-col">
        <Navbar
          name="vectors"
          logoSrc={LOGO}
          links={NAV_LINKS}
          githubUrl={GITHUB}
        />
        {children}
        <Footer
          name="vectors"
          tagline="Raster to vector, offline · Rust · WebAssembly · MIT"
          githubUrl={GITHUB}
        />
        
      </body>
    </html>
  );
};

export default RootLayout;
