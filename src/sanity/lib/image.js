import createImageUrlBuilder from '@sanity/image-url';

import { dataset, projectId } from '../env';

const builder = createImageUrlBuilder({ projectId, dataset });

// Build a Sanity CDN URL for an image source.
// Usage: urlForImage(post.mainImage).width(1200).height(630).url()
export function urlForImage(source) {
  return builder.image(source).auto('format').fit('max');
}
