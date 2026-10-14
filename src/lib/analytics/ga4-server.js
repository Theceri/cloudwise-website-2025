import 'server-only';

import { GA_MEASUREMENT_ID } from '@/lib/analytics/google';
import { TRACKS } from '@/lib/training';

/**
 * GA4 Measurement Protocol — the server-side half of the Google tag.
 *
 * The same problem the Conversions API solves for Meta: a paybill payment is
 * confirmed by Safaricom's webhook, often with no browser open, so the browser
 * `purchase` event never fires for it. This sends the sale from the server.
 *
 * GA4 keeps one `purchase` per `transaction_id`, so the browser copy (when
 * there is one) and this copy count once.
 *
 * Needs GA4_API_SECRET (GA4 → Admin → Data streams → web stream → Measurement
 * Protocol API secrets). Without it, nothing is sent. Never throws.
 */

const ENDPOINT = 'https://www.google-analytics.com/mp/collect';
const TIMEOUT_MS = 4000;

export function isGa4ServerConfigured() {
  return Boolean(process.env.GA4_API_SECRET && GA_MEASUREMENT_ID);
}

/**
 * The client id ties the sale to the visitor's session and its source. When it
 * is missing (cookies blocked), a stable id per booking still records the sale,
 * just without a source.
 */
function clientIdFor(registration) {
  return registration?.metaAttribution?.gaClientId || `${registration.reference}.1`;
}

export async function sendGa4Purchase({ registration }) {
  if (!isGa4ServerConfigured()) return { sent: false, reason: 'not configured' };

  const track = TRACKS[registration.track];
  // The list price, as the Meta Purchase reports: in test mode the charged
  // amount is a token shilling.
  const value = track?.priceKes ?? registration.amount ?? 0;

  const body = {
    client_id: clientIdFor(registration),
    events: [
      {
        name: 'purchase',
        params: {
          transaction_id: registration.reference,
          currency: 'KES',
          value,
          items: [
            { item_id: registration.track, item_name: track?.name || 'Training', price: value, quantity: 1 },
          ],
        },
      },
    ],
  };

  const url = `${ENDPOINT}?measurement_id=${encodeURIComponent(GA_MEASUREMENT_ID)}&api_secret=${encodeURIComponent(process.env.GA4_API_SECRET)}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    // The collect endpoint answers 204 and never reports validation errors.
    return { sent: res.ok, status: res.status };
  } catch (err) {
    console.error('[ga4] purchase not sent:', err?.message);
    return { sent: false, reason: err?.message };
  } finally {
    clearTimeout(timer);
  }
}
