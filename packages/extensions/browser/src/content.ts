// Content script: on every right-click, locate the nearest image within a
// few DOM levels (sites hide images inside wrapper divs/spans) and tell the
// background page its URL. The background stores it per tab so the context
// menu item can convert it even when the click did not land on the <img>
// itself (where `info.srcUrl` would be empty).

import { findImageSrc } from './dom.js';
import { log } from './log.js';

document.addEventListener('contextmenu', (event) => {
  const srcUrl = findImageSrc(event.target, 4);
  log.debug('contextmenu', srcUrl ?? 'no image nearby');
  try {
    void Promise.resolve(
      chrome.runtime.sendMessage({ type: 'vectors:image-context', srcUrl })
    ).catch(() => {
      /* extension context invalidated */
    });
  } catch {
    /* runtime unavailable */
  }
});
