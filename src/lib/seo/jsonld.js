/**
 * JSON-LD builders, shared by the pages so the markup matches what each page
 * shows. Schema audit, 14 October 2026 (docs/audits/2026-10-14/schema.md).
 *
 * Prices and dates come from src/lib/training.js; the address from
 * src/lib/constants.js. A page only emits offers for the tiers it shows.
 */

import { COMPANY_INFO, SITE_URL } from '@/lib/constants';
import { KICKSTART_END, KICKSTART_START, TRACKS, TRACK_KICKSTART } from '@/lib/training';

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

const postalAddress = () => ({
  '@type': 'PostalAddress',
  streetAddress: COMPANY_INFO.address.line1,
  addressLocality: `${COMPANY_INFO.address.area}, ${COMPANY_INFO.address.city}`,
  addressRegion: COMPANY_INFO.address.region,
  addressCountry: COMPANY_INFO.address.countryCode,
});

function offerFor(trackId) {
  const track = TRACKS[trackId];
  return {
    '@type': 'Offer',
    name: track.name,
    price: String(track.priceKes),
    priceCurrency: 'KES',
    category: 'Paid',
    url: `${SITE_URL}${track.registerPath}`,
    availability: 'https://schema.org/InStock',
  };
}

/**
 * One CourseInstance per open date. Kickstart runs online only, 7–9pm on a
 * Wednesday; the Saturday classes run in person and online, 9am–1pm.
 */
function instanceFor(trackId, date) {
  const track = TRACKS[trackId];
  const isKickstart = trackId === TRACK_KICKSTART;
  const days = date.days;
  return {
    '@type': 'CourseInstance',
    name: `${track.name}, ${date.label}`,
    courseMode: isKickstart ? ['Online'] : ['Online', 'Onsite'],
    courseWorkload: isKickstart ? 'PT2H' : `PT${4 * days.length}H`,
    startDate: days[0],
    endDate: days[days.length - 1],
    inLanguage: 'en',
    courseSchedule: {
      '@type': 'Schedule',
      repeatCount: days.length,
      repeatFrequency: 'P1W',
      byDay: isKickstart ? 'https://schema.org/Wednesday' : 'https://schema.org/Saturday',
      startTime: isKickstart ? KICKSTART_START : '09:00',
      endTime: isKickstart ? KICKSTART_END : '13:00',
      duration: isKickstart ? 'PT2H' : 'PT4H',
      scheduleTimezone: 'Africa/Nairobi',
      startDate: days[0],
      endDate: days[days.length - 1],
    },
    location: isKickstart
      ? { '@type': 'VirtualLocation', url: `${SITE_URL}${track.landingPath}` }
      : [
          { '@type': 'Place', name: 'Cloudwise, Delta Annex, Delta Corner', address: postalAddress() },
          { '@type': 'VirtualLocation', url: `${SITE_URL}${track.landingPath}` },
        ],
    offers: offerFor(trackId),
  };
}

/**
 * The Course block. `tiers` is the list of track ids the page shows; `dates`
 * maps a track id to its open dates ({ label, days: [isoDay, ...] }).
 */
export function courseJsonLd({ path, name, description, tiers, dates = {} }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${SITE_URL}${path}#course`,
    name,
    description,
    url: `${SITE_URL}${path}`,
    inLanguage: 'en',
    educationalLevel: 'Beginner',
    provider: { '@type': 'Organization', '@id': ORGANIZATION_ID, name: COMPANY_INFO.legalName, url: SITE_URL },
    offers: tiers.map(offerFor),
    hasCourseInstance: tiers.flatMap((id) => (dates[id] || []).map((d) => instanceFor(id, d))),
  };
}

/** Home › … › current page. `items` is [[name, path], ...] after Home. */
export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [['Home', '/'], ...items].map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: `${SITE_URL}${path === '/' ? '' : path}`,
    })),
  };
}

/** Render one or more JSON-LD blocks. */
export function JsonLd({ data }) {
  const blocks = Array.isArray(data) ? data : [data];
  return blocks.map((block, i) => (
    // eslint-disable-next-line react/no-danger
    <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }} />
  ));
}
