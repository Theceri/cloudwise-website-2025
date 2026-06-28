import { createClient } from 'next-sanity';

import { apiVersion, dataset, projectId, studioUrl } from '../env';

// Read client used for all public, published-content fetches on the site.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // fast, cached; on-demand revalidation keeps it fresh
  perspective: 'published',
  stega: {
    studioUrl,
    enabled: false,
  },
});
