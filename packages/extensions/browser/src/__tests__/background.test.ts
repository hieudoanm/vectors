import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { chromeMock, fire, installChrome, resetChrome } from './chrome.js';

installChrome();

const sendMessage = chromeMock.runtime.sendMessage as ReturnType<typeof vi.fn>;
const download = chromeMock.downloads.download as ReturnType<typeof vi.fn>;
const notify = chromeMock.notifications.create as ReturnType<typeof vi.fn>;

beforeAll(async () => {
  await import('../background.js');
});

beforeEach(() => {
  resetChrome();
});

describe('background (MV3)', () => {
  it('registers the context menu on install', async () => {
    await fire('installed');
    expect(chromeMock.contextMenus.create).toHaveBeenCalledWith({
      id: 'vectors-convert-to-svg',
      title: 'Convert to SVG (vectors)',
      contexts: ['image'],
    });
  });

  it('converts and downloads the svg on menu click', async () => {
    sendMessage.mockResolvedValue({ ok: true, svg: '<svg/>' });
    await fire(
      'menuClicked',
      {
        menuItemId: 'vectors-convert-to-svg',
        srcUrl: 'https://x.com/a/pic.png',
      },
      { url: 'https://x.com/page/' }
    );

    expect(sendMessage).toHaveBeenCalledWith({
      type: 'vectors:convert',
      srcUrl: 'https://x.com/a/pic.png',
    });
    expect(download).toHaveBeenCalledOnce();
    const arg = download.mock.calls[0][0] as { url: string; filename: string };
    expect(arg.url).toContain('data:image/svg+xml');
    expect(arg.url).toContain(encodeURIComponent('<svg/>'));
    expect(arg.filename).toBe('pic.svg');
    expect(notify).not.toHaveBeenCalled();
  });

  it('notifies when conversion returns an error', async () => {
    sendMessage.mockResolvedValue({ ok: false, error: 'nope' });
    await fire(
      'menuClicked',
      { menuItemId: 'vectors-convert-to-svg', srcUrl: 'https://x.com/a.png' },
      undefined
    );
    expect(download).not.toHaveBeenCalled();
    expect(notify).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'nope' })
    );
  });

  it('notifies when sendMessage throws', async () => {
    sendMessage.mockRejectedValue(new Error('sw died'));
    await fire(
      'menuClicked',
      { menuItemId: 'vectors-convert-to-svg', srcUrl: 'https://x.com/a.png' },
      undefined
    );
    expect(notify).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Conversion failed: sw died' })
    );
  });

  it('ignores other menu items and missing srcUrl', async () => {
    await fire('menuClicked', {
      menuItemId: 'other',
      srcUrl: 'https://x/a.png',
    });
    await fire('menuClicked', { menuItemId: 'vectors-convert-to-svg' });
    expect(sendMessage).not.toHaveBeenCalled();
    expect(download).not.toHaveBeenCalled();
  });
});
