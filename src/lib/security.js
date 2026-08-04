import 'server-only';

import crypto from 'node:crypto';

/**
 * Constant-time comparison for the shared secrets that protect our cron and
 * callback routes, so a timing side-channel cannot be used to guess one a
 * character at a time.
 */
export function secretMatches(provided, expected) {
  if (!expected) return false;
  const a = Buffer.from(String(provided || ''), 'utf8');
  const b = Buffer.from(String(expected), 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * Authorise an internal job route.
 *
 * Vercel Cron sends `Authorization: Bearer $CRON_SECRET`; we also accept
 * `?secret=` so you can trigger a run by hand from a browser while testing.
 */
export function isAuthorisedJob(request) {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;

  const header = request.headers.get('authorization') || '';
  if (header.startsWith('Bearer ') && secretMatches(header.slice(7), expected)) return true;

  const url = new URL(request.url);
  return secretMatches(url.searchParams.get('secret'), expected);
}
