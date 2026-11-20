// @vitest-environment jsdom
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { chromeMock, installChrome, resetChrome } from './chrome.js';

installChrome();

const sendMessage = chromeMock.runtime.sendMessage as ReturnType<typeof vi.fn>;

beforeAll(async () => {
  sendMessage.mockResolvedValue({ ok: true });
  await import('../content.js');
});

beforeEach(() => {
  resetChrome();
  sendMessage.mockResolvedValue({ ok: true });
  document.body.innerHTML = '';
});

const rightClick = (el: Element): void => {
  el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
};

describe('content script', () => {
  it('reports the clicked image src', () => {
    const el = document.createElement('img');
    el.src = 'https://x.com/pic.png';
    document.body.appendChild(el);

    rightClick(el);
    expect(sendMessage).toHaveBeenCalledWith({
      type: 'vectors:image-context',
      srcUrl: 'https://x.com/pic.png',
    });
  });

  it('reports a nearby image when clicking a wrapper', () => {
    const wrap = document.createElement('div');
    wrap.innerHTML = '<span><img src="https://x.com/w.png"></span>';
    document.body.appendChild(wrap);

    rightClick(wrap);
    expect(sendMessage).toHaveBeenCalledWith({
      type: 'vectors:image-context',
      srcUrl: 'https://x.com/w.png',
    });
  });

  it('reports null when no image is nearby', () => {
    const el = document.createElement('p');
    el.textContent = 'just text';
    document.body.appendChild(el);

    rightClick(el);
    expect(sendMessage).toHaveBeenCalledWith({
      type: 'vectors:image-context',
      srcUrl: null,
    });
  });
});
