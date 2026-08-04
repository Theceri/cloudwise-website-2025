import { NextResponse } from 'next/server';

import { recordSettlementResult } from '@/lib/settlement';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Daraja's queue timeout URL.
 *
 * Reached when the B2B request sat in Safaricom's queue too long. The money has
 * not moved, so we mark the sweep failed and let the retry job pick it up.
 */
export async function POST(request) {
  let body = {};
  try {
    body = await request.json();
  } catch {
    // Safaricom sometimes posts an empty body here.
  }

  const settlementRef =
    body?.Result?.ConversationID || body?.Result?.OriginatorConversationID || null;

  if (settlementRef) {
    await recordSettlementResult({
      settlementRef,
      succeeded: false,
      message: 'Timed out in the M-Pesa queue. Will be retried.',
    }).catch((err) => console.error('[settlement/daraja timeout]', err?.message));
  } else {
    console.warn('[settlement/daraja timeout] no conversation id in body');
  }

  return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
}
