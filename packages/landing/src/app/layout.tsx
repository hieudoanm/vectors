import type { Metadata } from 'next';
import './globals.css';

const SITE_URL = 'https://vectors.hieudoan.dev';

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

const RootLayout = ({ children }: LayoutProps<'/'>) => {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
};

export default RootLayout;
