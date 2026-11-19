// MV2 background page (Firefox / legacy Chrome): no service worker or
// offscreen API exists, so the page itself fetches the image, runs the wasm
// tracer, and downloads the SVG through an anchor click.

import { convertImage } from './convert.js';
import { log } from './log.js';
import { fileNameFor } from './util.js';

const MENU_ID = 'vectors-convert-to-svg';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ID,
    title: 'Convert to SVG (vectors)',
    contexts: ['image'],
  });
  log.info('context menu registered');
});

const notify = (message: string): void => {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon.png',
    title: 'Vectors',
    message,
  });
};

const downloadSvg = (svg: string, filename: string): void => {
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
};

chrome.contextMenus.onClicked.addListener(
  async (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
    if (info.menuItemId !== MENU_ID || !info.srcUrl) return;
    log.info('menu click', info.srcUrl);
    try {
      const response = await convertImage(info.srcUrl);
      if (!response.ok || !response.svg) {
        log.warn('conversion failed', response.error ?? 'no svg');
        notify(response.error ?? 'Conversion failed.');
        return;
      }
      const filename = fileNameFor(info.srcUrl, tab?.url);
      log.info('downloading', filename);
      downloadSvg(response.svg, filename);
      log.info('download started', filename);
    } catch (err) {
      log.error(
        'conversion failed',
        err instanceof Error ? err.message : String(err)
      );
      notify(
        `Conversion failed: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }
);
