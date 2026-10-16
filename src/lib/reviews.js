/**
 * Named training reviews (Sanity type trainingReview). The reviews page and
 * its sitemap entry exist only once at least MIN_REVIEWS are published with
 * written permission.
 */
export const MIN_REVIEWS = 3;

export const REVIEWS_QUERY = `*[_type == "trainingReview" && published == true && permission == true]
  | order(month desc){ _id, name, role, organization, track, month, quote }`;
