import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  free: vi.fn(),
  fromBytes: vi.fn(),
  trace: vi.fn(() => ({ svg: '<svg xmlns="http://www.w3.org/2000/svg"/>' })),
}));

vi.mock('@vectors/core', () => ({
  default: vi.fn(() => Promise.resolve()),
  WasmRaster: { from_bytes: mocks.fromBytes },
  WasmTraceConfig: vi.fn(function WasmTraceConfig() {
    return {};
  }),
  trace: mocks.trace,
}));

const { free, fromBytes, trace } = mocks;

import { convertImage } from '../convert.js';

const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 1, 2, 3, 4, 5]);
const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 1, 2]);

const stubFetch = (body: Uint8Array | string, ok = true, status = 200) => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({
      ok,
      status,
      arrayBuffer: async () =>
        typeof body === 'string' ? new TextEncoder().encode(body) : body,
    }))
  );
};

describe('convertImage', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
    fromBytes.mockReturnValue({ free });
  });

  it('rejects blob: urls without fetching', async () => {
    const f = vi.fn();
    vi.stubGlobal('fetch', f);
    const res = await convertImage('blob:https://x.com/abc');
    expect(res.ok).toBe(false);
    expect(res.error).toMatch(/blob:/);
    expect(f).not.toHaveBeenCalled();
  });

  it('reports fetch failures', async () => {
    stubFetch('', false, 404);
    const res = await convertImage('https://x.com/missing.png');
    expect(res).toEqual({ ok: false, error: 'Fetch failed: HTTP 404' });
  });

  it('rejects non PNG/JPEG payloads', async () => {
    stubFetch('plain text');
    const res = await convertImage('https://x.com/file.txt');
    expect(res).toEqual({ ok: false, error: 'Unsupported image format.' });
    expect(fromBytes).not.toHaveBeenCalled();
  });

  it('falls back to canvas decode for other image formats', async () => {
    stubFetch('fake-heic-bytes');
    const close = vi.fn();
    vi.stubGlobal(
      'createImageBitmap',
      vi.fn(async () => ({ width: 8, height: 8, close }))
    );
    vi.stubGlobal('document', {
      createElement: () => ({
        width: 0,
        height: 0,
        getContext: () => ({ drawImage: vi.fn() }),
        toBlob: (cb: (b: Blob | null) => void) => cb(new Blob([PNG])),
      }),
    });

    const res = await convertImage('https://x.com/pic.heic');
    expect(res.ok).toBe(true);
    expect(res.svg).toContain('<svg');
    expect(close).toHaveBeenCalledOnce();
    // Traced bytes are the canvas-produced PNG, not the original payload.
    expect(fromBytes).toHaveBeenCalledWith(PNG);
  });

  it('traces a PNG into svg and frees the raster', async () => {
    stubFetch(PNG);
    const res = await convertImage('https://x.com/pic.png');
    expect(res.ok).toBe(true);
    expect(res.svg).toContain('<svg');
    expect(fromBytes).toHaveBeenCalledWith(PNG);
    expect(trace).toHaveBeenCalledOnce();
    expect(free).toHaveBeenCalledOnce();
  });

  it('traces a JPEG the same way', async () => {
    stubFetch(JPEG);
    const res = await convertImage('https://x.com/pic.jpg');
    expect(res.ok).toBe(true);
    expect(res.svg).toContain('<svg');
  });

  it('frees the raster even when trace throws', async () => {
    stubFetch(PNG);
    trace.mockImplementationOnce(() => {
      throw new Error('boom');
    });
    await expect(convertImage('https://x.com/pic.png')).rejects.toThrow('boom');
    expect(free).toHaveBeenCalledOnce();
  });
});
