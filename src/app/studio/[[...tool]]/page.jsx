/**
 * Embedded Sanity Studio, served at /studio.
 *
 * The `[[...tool]]` catch-all lets the Studio handle its own client-side
 * routing. The route is excluded from the site chrome (navbar / footer /
 * smooth-scroll) by SiteChrome.
 */
import { NextStudio } from 'next-sanity/studio';

import config from '../../../../sanity.config';

export const dynamic = 'force-static';

export { metadata, viewport } from 'next-sanity/studio';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
