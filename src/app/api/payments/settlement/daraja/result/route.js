import { NextResponse } from 'next/server';

import { sendToAdmins } from '@/lib/email/send';
import { adminSettlementFailed } from '@/lib/email/templates';
import { recordSettlementResult } from '@/lib/settlement';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Daraja B2B result callback — the bank sweep either landed or it did not.
 *
 * Matched back to the payment by ConversationID, which is what we stored as the
 * settlement reference when the request was accepted.
 */
export async function POST(request) {
  const accepted = NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });

  let body;
  try {
    body = await request.json();
  } catch {
    return accepted;
  }

  const result = body?.Result;
  if (!result) {
    console.warn('[settlement/daraja] unrecognised body:', JSON.stringify(body).slice(0, 400));
    return accepted;
  }

  const settlementRef = result.ConversationID || result.OriginatorConversationID;
  const succeeded = String(result.ResultCode ?? '') === '0';

  try {
    const outcome = await recordSettlementResult({
      settlementRef,
      succeeded,
      message: result.ResultDesc,
    });

    if (outcome.matched && !succeeded) {
      // Money is safe in the paybill, but somebody needs to know it did not move.
      await sendToAdmins(
        adminSettlementFailed({ payment: outcome.payment, message: result.ResultDesc })
      );
    }
  } catch (err) {
    console.error('[settlement/daraja] processing failed:', err?.message);
  }

  return accepted;
}
