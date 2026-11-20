// Finds the nearest usable <img> around a right-click target. Sites often
// wrap images in divs/spans, so the context menu needs a DOM search: breadth-
// first over parent / child / sibling links, up to `depth` hops from the
// clicked element. Kept DOM-only and pure so it is unit-testable.

const MAX_NODES = 400;

const imgSrc = (img: HTMLImageElement): string | null => {
  const src = img.currentSrc || img.src;
  return src && src !== 'about:blank' ? src : null;
};

/**
 * Returns the src of the closest plausible image near `target`, or null.
 * Candidates are visited in BFS order (closest first); images with a non-zero
 * layout box are preferred so hidden pixels don't win over the real picture.
 */
export const findImageSrc = (
  target: EventTarget | null,
  depth = 3
): string | null => {
  if (!(target instanceof Element)) return null;

  const candidates: { src: string; area: number; order: number }[] = [];
  const visited = new Set<Element>([target]);
  let queue: { el: Element; d: number }[] = [{ el: target, d: 0 }];
  let order = 0;
  let nodes = 0;

  while (queue.length > 0 && nodes < MAX_NODES) {
    const next: { el: Element; d: number }[] = [];
    for (const { el, d } of queue) {
      if (++nodes > MAX_NODES) break;
      if (el instanceof HTMLImageElement) {
        const src = imgSrc(el);
        if (src) {
          const rect = el.getBoundingClientRect();
          candidates.push({
            src,
            area: rect.width * rect.height,
            order: order++,
          });
        }
      }
      if (d >= depth) continue;
      const neighbors: Element[] = [];
      if (el.parentElement) neighbors.push(el.parentElement);
      if (el.previousElementSibling) neighbors.push(el.previousElementSibling);
      if (el.nextElementSibling) neighbors.push(el.nextElementSibling);
      neighbors.push(...el.children);
      for (const n of neighbors) {
        if (!visited.has(n)) {
          visited.add(n);
          next.push({ el: n, d: d + 1 });
        }
      }
    }
    queue = next;
  }

  if (candidates.length === 0) return null;
  const laidOut = candidates.filter((c) => c.area > 0);
  const pool = laidOut.length > 0 ? laidOut : candidates;
  pool.sort((a, b) => a.order - b.order);
  return pool[0].src;
};
