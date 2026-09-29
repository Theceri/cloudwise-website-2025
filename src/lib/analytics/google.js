/**
 * Google tag (GA4) constants.
 *
 * Framework-free on purpose: this module is imported from the root layout, a
 * server component, and from a client component, so it must contain neither.
 *
 * The measurement id is public — it ships in the page source of every site that
 * uses it — so it carries a default and the environment variable is only needed
 * if the GA4 property is ever replaced.
 */

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-NR6CG8TH1K';
