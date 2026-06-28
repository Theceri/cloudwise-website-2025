import 'server-only';

import { draftMode } from 'next/headers';

import { client } from './client';

const token = process.env.SANITY_API_READ_TOKEN;

/**
 * Central fetch helper for the site.
 * - In normal mode: cached + tag-based on-demand revalidation (ISR).
 * - In draft mode (editors previewing): uncached, reads drafts via the viewer token.
 */
export async function sanityFetch({
  query,
  params = {},
  tags = [],
  revalidate = 60,
  fallback = null,
}) {
  const isDraft = (await draftMode()).isEnabled;

  if (isDraft && !token) {
    throw new Error(
      'The `SANITY_API_READ_TOKEN` environment variable is required for draft mode.'
    );
  }

  try {
    return await client.fetch(query, params, {
      ...(isDraft
        ? {
            token,
            perspective: 'previewDrafts',
            useCdn: false,
          }
        : {}),
      cache: isDraft ? 'no-store' : undefined,
      next: isDraft ? undefined : { revalidate, tags },
    });
  } catch (err) {
    // Sanity unreachable or unconfigured — degrade gracefully rather than
    // crashing the page/build. Returns the caller-provided fallback shape.
    console.warn('[sanity] fetch failed, using fallback:', err?.message);
    return fallback;
  }
}
