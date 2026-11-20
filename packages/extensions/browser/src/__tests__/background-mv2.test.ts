// @vitest-environment jsdom
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { convertImage } from '../convert.js';
import { chromeMock, fire, installChrome, resetChrome } from './chrome.js';

vi.mock('../convert.js', () => ({
  convertImage: vi.fn(),
}));

installChrome();

const convert = convertImage as ReturnType<typeof vi.fn>;
const notify = chromeMock.notifications.create as ReturnType<typeof vi.fn>;

beforeAll(async () => {
  URL.createObjectURL = vi.fn(() => 'blob:mock-url');
  URL.revokeObjectURL = vi.fn();
  await import('../background-mv2.js');
});

beforeEach(() => {
  resetChrome();
  convert.mockReset();
});

describe('background-mv2', () => {
  it('registers the context menu on install', async () => {
    await fire('installed');
    expect(chromeMock.contextMenus.create).toHaveBeenCalledWith({
      id: 'vectors-convert-to-svg',
      title: 'Convert to SVG (vectors)',
      contexts: ['image', 'page'],
    });
  });

  it('uses the image reported by the content script when srcUrl is absent', async () => {
    convert.mockResolvedValue({ ok: true, svg: '<svg/>' });
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    await fire(
      'runtimeMessage',
      { type: 'vectors:image-context', srcUrl: 'https://x.com/wrapped.png' },
      { tab: { id: 5 } },
      vi.fn()
    );

    await fire(
      'menuClicked',
      { menuItemId: 'vectors-convert-to-svg' },
      { id: 5, url: 'https://x.com/' }
    );

    expect(convert).toHaveBeenCalledWith('https://x.com/wrapped.png');
  });

  it('converts and downloads via an anchor click', async () => {
    convert.mockResolvedValue({ ok: true, svg: '<svg/>' });
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});

    await fire(
      'menuClicked',
      { menuItemId: 'vectors-convert-to-svg', srcUrl: 'https://x.com/p.png' },
      { url: 'https://x.com/' }
    );

    expect(convert).toHaveBeenCalledWith('https://x.com/p.png');
    expect(click).toHaveBeenCalledOnce();
    const a = click.mock.contexts[0] as HTMLAnchorElement;
    expect(a.download).toBe('p.svg');
    expect(a.href).toBe('blob:mock-url');
    expect(URL.createObjectURL).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'image/svg+xml' })
    );
    expect(notify).not.toHaveBeenCalled();
    click.mockRestore();
  });

  it('notifies on conversion failure', async () => {
    convert.mockResolvedValue({ ok: false, error: 'bad image' });
    await fire(
      'menuClicked',
      { menuItemId: 'vectors-convert-to-svg', srcUrl: 'https://x.com/p.png' },
      undefined
    );
    expect(notify).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'bad image' })
    );
  });

  it('notifies when convertImage throws', async () => {
    convert.mockRejectedValue(new Error('crash'));
    await fire(
      'menuClicked',
      { menuItemId: 'vectors-convert-to-svg', srcUrl: 'https://x.com/p.png' },
      undefined
    );
    expect(notify).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Conversion failed: crash' })
    );
  });

  it('ignores other menu items', async () => {
    await fire('menuClicked', {
      menuItemId: 'other',
      srcUrl: 'https://x/a.png',
    });
    expect(convert).not.toHaveBeenCalled();
  });
});
