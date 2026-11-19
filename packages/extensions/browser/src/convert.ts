// Shared conversion path: fetch the image bytes (extension origin bypasses
// page CORS via host permissions) and run the vectors wasm tracer.

import init, { WasmRaster, WasmTraceConfig, trace } from '@vectors/core';
import { log } from './log.js';
import type { ConvertResponse } from './util.js';

let ready: Promise<unknown> | null = null;
const ensureWasm = () => {
  if (!ready) ready = init();
  return ready;
};

const isJpeg = (b: Uint8Array): boolean =>
  b.length > 3 && b[0] === 0xff && b[1] === 0xd8;
const isPng = (b: Uint8Array): boolean =>
  b.length > 8 &&
  b[0] === 0x89 &&
  b[1] === 0x50 &&
  b[2] === 0x4e &&
  b[3] === 0x47;

export const convertImage = async (
  srcUrl: string
): Promise<ConvertResponse> => {
  log.info('convert start', srcUrl);
  if (srcUrl.startsWith('blob:')) {
    return {
      ok: false,
      error: 'blob: images cannot be fetched — save the image first.',
    };
  }

  log.debug('fetching image…');
  const res = await fetch(srcUrl);
  if (!res.ok) {
    log.warn('fetch failed', res.status, srcUrl);
    return { ok: false, error: `Fetch failed: HTTP ${res.status}` };
  }
  const bytes = new Uint8Array(await res.arrayBuffer());
  log.info(`fetched ${(bytes.length / 1024).toFixed(1)} KB`);

  const kind = isPng(bytes) ? 'png' : isJpeg(bytes) ? 'jpeg' : null;
  if (!kind) {
    log.warn('unsupported image type', srcUrl);
    return { ok: false, error: 'Not a PNG or JPEG image.' };
  }
  log.debug(`format: ${kind}`);

  log.debug('loading wasm…');
  await ensureWasm();
  log.debug('wasm ready, decoding raster…');

  const raster = WasmRaster.from_bytes(bytes);
  try {
    log.debug('tracing…');
    const svg = trace(raster, new WasmTraceConfig()).svg;
    log.info(`traced → ${(svg.length / 1024).toFixed(1)} KB SVG`);
    return { ok: true, svg };
  } finally {
    raster.free();
  }
};
