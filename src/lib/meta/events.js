/**
 * Meta pixel constants, shared by the browser pixel and the server-side
 * Conversions API. Framework-free on purpose: this module is imported from a
 * client component and from `server-only` code, so it must contain neither.
 *
 * The funnel, and which half of the stack reports each step:
 *
 *   ViewContent       browser   someone reads /ai-training
 *   InitiateCheckout  browser   someone opens the registration form
 *   Contact           browser   someone clicks through to WhatsApp
 *   Lead              server    the registration is saved, unpaid
 *   Purchase          server    the money is confirmed
 *
 * No event is reported by both halves, so none needs deduplicating. The two
 * that decide the campaign — Lead and Purchase — are server-sent because the
 * customer is frequently not in a browser when they happen.
 */

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || '1040209791698851';

export const META_EVENTS = {
  viewContent: 'ViewContent',
  initiateCheckout: 'InitiateCheckout',
  contact: 'Contact',
  lead: 'Lead',
  purchase: 'Purchase',
};

export const META_CURRENCY = 'KES';

/**
 * A stable event id for one step of one booking.
 *
 * Webhooks get re-delivered. Safaricom will happily post the same C2B
 * confirmation twice, and Paystack retries until it gets a 200. Deriving the id
 * from the booking reference means every copy carries the same id and Meta
 * keeps only the first, so one payment can never be counted as two sales.
 */
export function metaEventId(eventName, reference) {
  return `${String(eventName).toLowerCase()}.${reference}`;
}
