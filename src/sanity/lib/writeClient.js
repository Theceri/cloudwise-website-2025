import 'server-only';

import { createClient } from 'next-sanity';

import { apiVersion, dataset, projectId } from '../env';

// Server-only write client (Editor token). Used to create comment documents.
// NEVER import this from a client component.
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

if (!writeClient.config().token) {
  // Soft warning at import time in dev; comment submission will fail without it.
  console.warn(
    '[sanity] SANITY_API_WRITE_TOKEN is not set — comment submission will not work.'
  );
}
