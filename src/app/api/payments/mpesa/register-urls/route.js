import { NextResponse } from 'next/server';

import { isDarajaConfigured, registerC2bUrls } from '@/lib/payments/daraja';
import { callbackUrl } from '@/lib/runtime';
import { isAuthorisedJob } from '@/lib/security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * One-off setup: tell Safaricom where to send direct-paybill notifications.
 *
 * Run once per environment by opening this URL with the cron secret:
 *   /api/payments/mpesa/register-urls?secret=YOUR_CRON_SECRET
 *
 * It is a GET so it can be triggered from a browser — the whole point is that
 * whoever sets the site up should not need a terminal.
 */
export async function GET(request) {
  if (!isAuthorisedJob(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  if (!isDarajaConfigured()) {
    return NextResponse.json(
      { error: 'M-Pesa is not configured. Set the MPESA_* values first.' },
      { status: 503 }
    );
  }

  // These paths must not contain the word "mpesa" — Safaricom rejects any
  // confirmation/validation URL containing it with
  // "Bad Request - Invalid ValidationURL - URL has the word MPESA".
  const confirmationUrl = callbackUrl('/api/payments/paybill/c2b');
  const validationUrl = callbackUrl('/api/payments/paybill/c2b/validation');

  try {
    const response = await registerC2bUrls({ confirmationUrl, validationUrl });
    return NextResponse.json({ ok: true, confirmationUrl, validationUrl, response });
  } catch (err) {
    const message = err?.message || '';

    // Safaricom error 500.003.1001. On a *live* shortcode C2B registration is
    // one-shot: whatever was registered first is permanent as far as the API is
    // concerned, and every later call is refused. Sandbox lets you re-register
    // freely, so this only ever surfaces once you are on the real paybill —
    // usually while pointing callbacks at a tunnel that has since died.
    //
    // The only way to change them is to ask Safaricom, so say that plainly
    // rather than leaving a bare "already registered" to be puzzled over.
    if (/already registered/i.test(message)) {
      return NextResponse.json(
        {
          error: message,
          meaning:
            'Live shortcodes accept C2B URL registration once only. The URLs registered on ' +
            'this paybill cannot be changed through the API, so direct-paybill payments are ' +
            'still being sent wherever they were first pointed.',
          fix:
            'Email apisupport@safaricom.co.ke from the account that owns the shortcode, quote ' +
            'the shortcode, and ask them to update the registered C2B confirmation and ' +
            'validation URLs to the ones below. Register the production domain, not a tunnel.',
          note:
            'STK push is unaffected — it carries its callback URL on every request, so it ' +
            'always follows PUBLIC_BASE_URL. Paybill payments that miss their confirmation ' +
            'can be recovered with /api/payments/paybill/reconcile.',
          confirmationUrl,
          validationUrl,
        },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: message, confirmationUrl, validationUrl }, { status: 502 });
  }
}
