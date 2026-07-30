import { NextResponse } from 'next/server';

import { sendToAdmins } from '@/lib/email/send';
import { adminSettlementFailed } from '@/lib/email/templates';
import { recordSettlementResult } from '@/lib/settlement';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * SasaPay B2C callback — the bank settlement leg finished.
 *
 * Matched by MerchantTransactionReference, which we set to `SETTLE-<booking>`
 * when the payout was requested.
 */
export async function POST(request) {
  const accepted = NextResponse.json({ status: true, detail: 'Accepted' });

  let body;
  try {
    body = await request.json();
  } catch {
    return accepted;
  }

  const settlementRef =
    body?.MerchantTransactionReference || body?.merchant_transaction_reference || null;

  if (!settlementRef) {
    console.warn('[settlement/sasapay] no reference in body:', JSON.stringify(body).slice(0, 400));
    return accepted;
  }

  // SasaPay reports success as ResultCode "0", mirroring Daraja.
  const resultCode = String(body?.ResultCode ?? body?.result_code ?? '');
  const succeeded = resultCode === '0' || body?.status === true;
  const message = body?.ResultDesc || body?.detail || '';

  try {
    const outcome = await recordSettlementResult({ settlementRef, succeeded, message });

    if (outcome.matched && !succeeded) {
      await sendToAdmins(adminSettlementFailed({ payment: outcome.payment, message }));
    }
  } catch (err) {
    console.error('[settlement/sasapay] processing failed:', err?.message);
  }

  return accepted;
}
