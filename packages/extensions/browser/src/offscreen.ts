// Offscreen document (MV3): answers conversion requests from the service
// worker. All real work lives in convert.ts.

import { convertImage } from './convert.js';
import { log } from './log.js';
import type { ConvertResponse } from './util.js';

chrome.runtime.onMessage.addListener(
  (
    msg: { type?: string; srcUrl?: string },
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: ConvertResponse) => void
  ) => {
    if (msg?.type !== 'vectors:convert' || !msg.srcUrl) return false;
    log.info('convert request', msg.srcUrl);
    convertImage(msg.srcUrl)
      .then((res) => {
        if (res.ok) log.info('convert response ok');
        else log.warn('convert response failed', res.error);
        sendResponse(res);
      })
      .catch((err: unknown) =>
        sendResponse({
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        })
      );
    return true; // async response
  }
);
