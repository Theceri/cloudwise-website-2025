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

  const confirmationUrl = callbackUrl('/api/payments/mpesa/c2b');
  const validationUrl = callbackUrl('/api/payments/mpesa/c2b/validation');

  try {
    const response = await registerC2bUrls({ confirmationUrl, validationUrl });
    return NextResponse.json({ ok: true, confirmationUrl, validationUrl, response });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message, confirmationUrl, validationUrl },
      { status: 502 }
    );
  }
}
