// Sanity environment configuration.
// Values come from .env.local — see README for setup.

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-01';

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

// `placeholder` is a valid-format project id so the Sanity client can be
// constructed even before real credentials are set. Fetches will simply fail
// and the blog degrades gracefully to empty (see sanityFetch). This keeps the
// rest of the site building and running without Sanity configured.
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder';

export const isSanityConfigured = projectId !== 'placeholder';

// Studio is embedded at this path within the Next.js app.
export const studioUrl = '/studio';

if (!isSanityConfigured && typeof window === 'undefined') {
  console.warn(
    '[sanity] NEXT_PUBLIC_SANITY_PROJECT_ID is not set — the blog will render empty until it is configured (see README).'
  );
}
