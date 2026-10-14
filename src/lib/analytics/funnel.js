'use client';

import { trackPixel } from '@/components/MetaPixelClient';
import { trackGoogle } from '@/components/GoogleTagRouteViews';
import { META_CURRENCY, META_EVENTS, metaEventId } from '@/lib/meta/events';

/**
 * The booking funnel, reported to Meta and GA4 from one place.
 *
 * Lead and Purchase are also sent by the server (Conversions API), because a
 * paybill payment is often confirmed with no browser open. The browser copy
 * carries the same `eventID` as the server copy, so Meta keeps one of the two.
 * GA4 keeps one `purchase` per `transaction_id` for the same reason.
 *
 * `value` is the list price of the track, never the amount charged: in test
 * mode the charge is a token shilling, and the server reports the list price
 * too (see `metaCustomData` in src/lib/lifecycle.js).
 */

function item({ track, name, value }) {
  return { item_id: track, item_name: name || track, price: value, quantity: 1 };
}

/** The registration was saved. Fires once, after the API answers 201. */
export function trackLead({ reference, track, name, value }) {
  trackPixel(
    META_EVENTS.lead,
    { content_ids: [track], content_name: name, content_category: 'Training', value, currency: META_CURRENCY },
    { eventID: metaEventId(META_EVENTS.lead, reference) }
  );
  trackGoogle('generate_lead', { currency: META_CURRENCY, value, tier: track });
}

/**
 * The buyer pressed a pay button for the first time. This is the real start of
 * checkout; opening the registration form is not.
 */
export function trackCheckoutStart({ reference, track, name, value, method }) {
  trackPixel(
    META_EVENTS.initiateCheckout,
    {
      content_ids: [track],
      content_name: name,
      content_type: 'product',
      num_items: 1,
      value,
      currency: META_CURRENCY,
    },
    { eventID: metaEventId(META_EVENTS.initiateCheckout, reference) }
  );
  trackGoogle('begin_checkout', {
    currency: META_CURRENCY,
    value,
    payment_type: method,
    items: [item({ track, name, value })],
  });
}

/**
 * The payment was confirmed while this browser watched. Guarded per booking in
 * sessionStorage, so a reload of the paid page does not report a second sale.
 */
export function trackPurchase({ reference, track, name, value }) {
  const key = `cw_purchase_${reference}`;
  try {
    if (window.sessionStorage.getItem(key)) return;
    window.sessionStorage.setItem(key, '1');
  } catch {
    // Storage blocked: report anyway. Meta and GA4 both deduplicate by id.
  }

  trackPixel(
    META_EVENTS.purchase,
    {
      content_ids: [track],
      content_name: name,
      content_type: 'product',
      num_items: 1,
      value,
      currency: META_CURRENCY,
      order_id: reference,
    },
    { eventID: metaEventId(META_EVENTS.purchase, reference) }
  );
  trackGoogle('purchase', {
    transaction_id: reference,
    currency: META_CURRENCY,
    value,
    items: [item({ track, name, value })],
  });
}
