import 'server-only';

import crypto from 'node:crypto';

import { META_PIXEL_ID } from '@/lib/meta/events';
import { publicBaseUrl } from '@/lib/runtime';

/**
 * Meta Conversions API — the server-side half of the pixel.
 *
 * The browser pixel cannot see the conversions that matter most here. A paybill
 * payment is confirmed by Safaricom posting to our webhook, often minutes after
 * the customer closed the tab and sometimes from a phone that never loaded the
 * site at all. A card payment is confirmed by Paystack's webhook. Neither has a
 * browser attached, so a browser-only Purchase event would simply miss them.
 *
 * So the split is: the browser reports intent (ViewContent, InitiateCheckout,
 * Contact) and the server reports money (Lead, Purchase). No event is sent by
 * both, so there is nothing to deduplicate.
 *
 * Attribution still needs the two Meta cookies, `_fbp` and `_fbc`, which only
 * exist in the browser. They are captured when the registration is created and
 * replayed here whenever the payment lands, however much later that is.
 *
 * Every function fails soft. A payment we have already taken must never be
 * rolled back because Meta's API had a bad minute.
 */

const GRAPH_VERSION = 'v21.0';
const TIMEOUT_MS = 4000;

export function isCapiConfigured() {
  return Boolean(process.env.META_CAPI_ACCESS_TOKEN && META_PIXEL_ID);
}

/** Meta wants every personal field lowercased, trimmed and SHA-256 hashed. */
function hash(value) {
  if (value === null || value === undefined) return null;
  const normalised = String(value).trim().toLowerCase();
  if (!normalised) return null;
  return crypto.createHash('sha256').update(normalised).digest('hex');
}

/**
 * Phone numbers hash to nothing useful unless both sides agree on the format.
 * Meta wants digits only, including the country code and no leading plus.
 * `normalisePhone` has already given us the 2547XXXXXXXX form.
 */
function hashPhone(value) {
  if (!value) return null;
  const digits = String(value).replace(/\D/g, '');
  return digits ? hash(digits) : null;
}

/**
 * Build the `user_data` block. More matched keys means a higher Event Match
 * Quality score in Events Manager, which is what decides whether Meta can tie
 * the sale back to the ad that caused it.
 */
function userData({ registration, attribution }) {
  const meta = attribution || registration?.metaAttribution || {};

  const data = {
    em: hash(registration?.email),
    ph: hashPhone(registration?.phone),
    fn: hash(registration?.firstName),
    ln: hash(registration?.lastName),
    ct: hash(registration?.city),
    country: hash('ke'),
  };

  // The click id and browser id are sent raw, never hashed.
  if (meta.fbp) data.fbp = meta.fbp;
  if (meta.fbc) data.fbc = meta.fbc;
  if (meta.clientIp) data.client_ip_address = meta.clientIp;
  if (meta.userAgent) data.client_user_agent = meta.userAgent;

  return Object.fromEntries(Object.entries(data).filter(([, v]) => v));
}

/**
 * Send one event.
 *
 * `eventId` is derived from the booking reference, so a re-delivered Safaricom
 * confirmation or a retried webhook produces the same id and Meta discards the
 * duplicate rather than counting the sale twice.
 */
export async function sendEvent({
  eventName,
  eventId,
  registration,
  attribution,
  customData,
  eventSourceUrl,
  eventTime,
}) {
  if (!isCapiConfigured()) return { sent: false, reason: 'not-configured' };

  const meta = attribution || registration?.metaAttribution || {};

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor((eventTime ? new Date(eventTime).getTime() : Date.now()) / 1000),
        event_id: eventId,
        action_source: 'website',
        event_source_url: eventSourceUrl || meta.eventSourceUrl || publicBaseUrl(),
        user_data: userData({ registration, attribution }),
        ...(customData ? { custom_data: customData } : {}),
      },
    ],
  };

  // A test event code routes the event to the Test Events tab in Events Manager
  // instead of into live reporting. Never set this in production.
  if (process.env.META_TEST_EVENT_CODE) {
    payload.test_event_code = process.env.META_TEST_EVENT_CODE;
  }

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(
    process.env.META_CAPI_ACCESS_TOKEN
  )}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error(`[meta-capi] ${eventName} rejected:`, body?.error?.message || res.status);
      return { sent: false, reason: body?.error?.message || `http-${res.status}` };
    }

    return { sent: true, received: body?.events_received ?? 0 };
  } catch (err) {
    // A timeout or a network blip must not surface to the caller.
    console.error(`[meta-capi] ${eventName} failed:`, err?.message);
    return { sent: false, reason: err?.message };
  }
}

/**
 * Read the attribution a browser carries, at the moment we still have a request.
 *
 * `_fbp` and `_fbc` are set by the pixel script on our own domain, so they
 * arrive as ordinary cookies on the registration POST. `_fbc` exists only when
 * the visitor arrived on an `fbclid` link, and it is the strongest signal we
 * get — so when the cookie is missing and the browser told us which page it
 * submitted from, we rebuild the value from that URL in Meta's documented
 * `fb.1.<timestamp>.<fbclid>` form. That covers the visitor whose pixel script
 * was blocked or had not run yet when they submitted.
 */
export function readAttribution(request, { eventSourceUrl } = {}) {
  const cookie = (name) => request.cookies?.get?.(name)?.value || null;

  let fbc = cookie('_fbc');
  if (!fbc && eventSourceUrl) {
    try {
      const fbclid = new URL(eventSourceUrl).searchParams.get('fbclid');
      if (fbclid) fbc = `fb.1.${Date.now()}.${fbclid}`;
    } catch {
      // A malformed URL from the browser is not worth failing a booking over.
    }
  }

  const forwarded = request.headers.get('x-forwarded-for') || '';

  return {
    fbp: cookie('_fbp'),
    fbc,
    // The first entry is the visitor; the rest are proxies.
    clientIp: forwarded.split(',')[0].trim() || null,
    userAgent: request.headers.get('user-agent') || null,
    eventSourceUrl: eventSourceUrl || null,
    capturedAt: new Date().toISOString(),
  };
}
