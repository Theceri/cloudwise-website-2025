import 'server-only';

import { SITE_URL } from '@/lib/constants';

/**
 * IndexNow: tell Bing (and the other engines that share it) that a URL changed,
 * instead of waiting for the next crawl. ChatGPT search leans on Bing's index,
 * so this also helps the answers that already send us visitors.
 *
 * The key is public by design: it is the file name of public/<key>.txt, which
 * proves the site owns the pings. Never throws.
 */
export const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'ff72f301a6c43d6de3f3a67313ad2640';

export async function pingIndexNow(paths = []) {
  const urlList = [...new Set(paths)].map((p) => (p.startsWith('http') ? p : `${SITE_URL}${p}`));
  if (!urlList.length) return { sent: false, reason: 'no urls' };
  // Local and preview builds must not ping for the live site.
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') return { sent: false, reason: 'not production' };
  if (!process.env.VERCEL_ENV) return { sent: false, reason: 'not on Vercel' };

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: new URL(SITE_URL).host,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
      signal: AbortSignal.timeout(4000),
    });
    return { sent: res.ok, status: res.status, count: urlList.length };
  } catch (err) {
    console.error('[indexnow] ping failed:', err?.message);
    return { sent: false, reason: err?.message };
  }
}
