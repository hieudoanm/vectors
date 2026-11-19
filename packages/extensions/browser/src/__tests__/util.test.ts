import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fileNameFor } from '../util.js';

describe('fileNameFor', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('uses the last path segment of srcUrl and swaps the extension for .svg', () => {
    expect(fileNameFor('https://example.com/imgs/photo.PNG')).toBe('photo.svg');
    expect(fileNameFor('https://example.com/a/b/icon.jpeg?x=1')).toBe(
      'icon.svg'
    );
  });

  it('keeps the name when there is no extension', () => {
    expect(fileNameFor('https://example.com/images/logo')).toBe('logo.svg');
  });

  it('falls back to pageUrl when srcUrl has no usable path', () => {
    expect(
      fileNameFor('data:image/png;base64,AAA', 'https://ex.com/p/banner.webp')
    ).toBe('banner.svg');
  });

  it('returns a timestamped fallback for unusable urls', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1234);
    expect(fileNameFor('not a url', '')).toBe('vectors-1234.svg');
    expect(fileNameFor('', undefined)).toBe('vectors-1234.svg');
  });
});
