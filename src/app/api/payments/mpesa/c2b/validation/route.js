import { NextResponse } from 'next/server';

import { parseC2bConfirmation } from '@/lib/payments/daraja';
import { getRegistration } from '@/lib/store';
import { isValidReference } from '@/lib/training';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Daraja C2B validation — called *before* a direct paybill payment completes.
 *
 * This is the moment to catch a mistyped account number, while the customer is
 * still standing there with their phone. Rejecting here shows them "invalid
 * account number" immediately; accepting a typo would take the money into a
 * payment we cannot attribute to anyone.
 *
 * Safaricom only calls this if validation is activated on the shortcode. When
 * it is not, every payment goes straight to the confirmation endpoint, which
 * handles unknown references gracefully anyway.
 */
const REJECT = { ResultCode: 'C2B00012', ResultDesc: 'Invalid Account Number' };
const ACCEPT = { ResultCode: '0', ResultDesc: 'Accepted' };

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(ACCEPT);
  }

  const payment = parseC2bConfirmation(body);
  const reference = payment?.reference;

  if (!isValidReference(reference)) {
    console.warn('[mpesa/c2b/validation] rejected malformed reference:', reference);
    return NextResponse.json(REJECT);
  }

  try {
    const registration = await getRegistration(reference);

    if (!registration) {
      console.warn('[mpesa/c2b/validation] rejected unknown reference:', reference);
      return NextResponse.json(REJECT);
    }
    if (registration.status === 'paid') {
      console.warn('[mpesa/c2b/validation] rejected already-paid booking:', reference);
      return NextResponse.json({
        ResultCode: 'C2B00016',
        ResultDesc: 'This booking has already been paid',
      });
    }
  } catch (err) {
    // If our own lookup is broken, take the money and reconcile afterwards —
    // turning a customer away because of our outage is the worse failure.
    console.error('[mpesa/c2b/validation] lookup failed, accepting:', err?.message);
  }

  return NextResponse.json(ACCEPT);
}
