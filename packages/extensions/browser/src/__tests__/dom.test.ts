// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { findImageSrc } from '../dom.js';

const img = (src: string): HTMLImageElement => {
  const el = document.createElement('img');
  el.src = src;
  return el;
};

describe('findImageSrc', () => {
  it('returns null for non-element targets and empty trees', () => {
    expect(findImageSrc(null)).toBeNull();
    expect(findImageSrc(document.createTextNode('x'))).toBeNull();
    expect(findImageSrc(document.createElement('div'))).toBeNull();
  });

  it('finds an image that is the click target itself', () => {
    const el = img('https://x.com/a.png');
    document.body.appendChild(el);
    expect(findImageSrc(el)).toBe('https://x.com/a.png');
    el.remove();
  });

  it('finds an image inside the clicked wrapper (child)', () => {
    const wrap = document.createElement('div');
    const inner = document.createElement('span');
    inner.appendChild(img('https://x.com/inner.png'));
    wrap.appendChild(inner);
    document.body.appendChild(wrap);

    expect(findImageSrc(wrap)).toBe('https://x.com/inner.png');
    wrap.remove();
  });

  it('finds an image in a sibling subtree', () => {
    const parent = document.createElement('div');
    const clicked = document.createElement('span');
    const sib = document.createElement('div');
    sib.appendChild(img('https://x.com/sib.png'));
    parent.append(clicked, sib);
    document.body.appendChild(parent);

    expect(findImageSrc(clicked)).toBe('https://x.com/sib.png');
    parent.remove();
  });

  it('finds an image up to `depth` levels away', () => {
    // Linear chain a > b > c > img — the img is exactly 3 hops from `a`.
    const a = document.createElement('div');
    const b = document.createElement('div');
    const c = document.createElement('div');
    a.appendChild(b);
    b.appendChild(c);
    c.appendChild(img('https://x.com/deep.png'));
    document.body.appendChild(a);

    expect(findImageSrc(a, 2)).toBeNull();
    expect(findImageSrc(a, 3)).toBe('https://x.com/deep.png');
    a.remove();
  });

  it('prefers the closest candidate over a farther one', () => {
    const parent = document.createElement('div');
    const near = img('https://x.com/near.png');
    const wrap = document.createElement('div');
    wrap.appendChild(img('https://x.com/far.png'));
    parent.append(near, wrap);
    document.body.appendChild(parent);

    // Click the wrapper's text-ish child; both images are within depth.
    const probe = document.createElement('span');
    wrap.firstElementChild?.before(probe);
    expect(findImageSrc(probe)).toBe('https://x.com/far.png');
    parent.remove();
  });
});
