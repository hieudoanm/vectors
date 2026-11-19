export interface ConvertResponse {
  ok: boolean;
  svg?: string;
  error?: string;
}

export const fileNameFor = (srcUrl: string, pageUrl?: string): string => {
  for (const url of [srcUrl, pageUrl ?? '']) {
    try {
      const u = new URL(url);
      if (u.protocol !== 'http:' && u.protocol !== 'https:') continue;
      const base = u.pathname.split('/').filter(Boolean).pop();
      if (base) return base.replace(/\.[a-z0-9]+$/i, '') + '.svg';
    } catch {
      /* try the next candidate */
    }
  }
  return `vectors-${Date.now()}.svg`;
};
