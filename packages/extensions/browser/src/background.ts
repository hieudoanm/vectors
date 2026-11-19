// MV3 service worker: owns the context menu, routes conversion work to the
// offscreen document (which has DOM + WebAssembly), and saves the result.

import { log } from './log.js';
import { fileNameFor } from './util.js';
import type { ConvertResponse } from './util.js';

const MENU_ID = 'vectors-convert-to-svg';
const OFFSCREEN_URL = 'offscreen.html';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ID,
    title: 'Convert to SVG (vectors)',
    contexts: ['image'],
  });
  log.info('context menu registered');
});

const ensureOffscreen = async (): Promise<void> => {
  const existing = await chrome.offscreen.hasDocument();
  if (existing) return;
  await chrome.offscreen.createDocument({
    url: OFFSCREEN_URL,
    reasons: ['BLOBS'],
    justification: 'Run the vectors WebAssembly tracer and create SVG blobs.',
  });
};

const notify = (message: string): void => {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon.png',
    title: 'Vectors',
    message,
  });
};

chrome.contextMenus.onClicked.addListener(
  async (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
    if (info.menuItemId !== MENU_ID || !info.srcUrl) return;
    log.info('menu click', info.srcUrl);

    try {
      await ensureOffscreen();
      log.debug('offscreen ready, sending convert request');
      const response = (await chrome.runtime.sendMessage({
        type: 'vectors:convert',
        srcUrl: info.srcUrl,
      })) as ConvertResponse | undefined;
      if (!response?.ok || !response.svg) {
        log.warn('conversion failed', response?.error ?? 'no response');
        notify(response?.error ?? 'Conversion failed.');
        return;
      }
      const filename = fileNameFor(info.srcUrl, tab?.url);
      const dataUrl =
        'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(response.svg);
      log.info('downloading', filename);
      await chrome.downloads.download({
        url: dataUrl,
        filename,
        saveAs: false,
      });
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
