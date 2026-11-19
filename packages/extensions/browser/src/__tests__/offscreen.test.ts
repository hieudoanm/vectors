import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { convertImage } from '../convert.js';
import { installChrome, listeners } from './chrome.js';

vi.mock('../convert.js', () => ({
  convertImage: vi.fn(),
}));

installChrome();

const convert = convertImage as ReturnType<typeof vi.fn>;

type Handler = (
  msg: unknown,
  sender: unknown,
  sendResponse: (r: unknown) => void
) => boolean;

const handler = (): Handler => listeners('runtimeMessage')[0] as Handler;

beforeAll(async () => {
  await import('../offscreen.js');
});

beforeEach(() => {
  vi.clearAllMocks();
  convert.mockReset();
});

describe('offscreen message handler', () => {
  it('runs convertImage and returns its result', async () => {
    convert.mockResolvedValue({ ok: true, svg: '<svg/>' });
    const sendResponse = vi.fn();
    const keepAlive = handler()(
      { type: 'vectors:convert', srcUrl: 'https://x.com/a.png' },
      {},
      sendResponse
    );
    await vi.waitFor(() => expect(sendResponse).toHaveBeenCalled());
    expect(keepAlive).toBe(true);
    expect(convert).toHaveBeenCalledWith('https://x.com/a.png');
    expect(sendResponse).toHaveBeenCalledWith({ ok: true, svg: '<svg/>' });
  });

  it('sends an error response when convertImage rejects', async () => {
    convert.mockRejectedValue(new Error('wasm exploded'));
    const sendResponse = vi.fn();
    handler()(
      { type: 'vectors:convert', srcUrl: 'https://x.com/a.png' },
      {},
      sendResponse
    );
    await vi.waitFor(() => expect(sendResponse).toHaveBeenCalled());
    expect(sendResponse).toHaveBeenCalledWith({
      ok: false,
      error: 'wasm exploded',
    });
  });

  it('ignores unrelated messages', () => {
    const sendResponse = vi.fn();
    expect(handler()({ type: 'other' }, {}, sendResponse)).toBe(false);
    expect(handler()({ type: 'vectors:convert' }, {}, sendResponse)).toBe(
      false
    );
    expect(convert).not.toHaveBeenCalled();
    expect(sendResponse).not.toHaveBeenCalled();
  });
});
