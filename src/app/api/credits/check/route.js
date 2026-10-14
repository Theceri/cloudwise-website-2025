import { NextResponse } from 'next/server';

import { findCredit, priceAfterCredit } from '@/lib/credits';
import { normalisePhone } from '@/lib/payments/daraja';
import { CREDIT_CODE_RE } from '@/lib/registration-form';
import { isStoreConfigured } from '@/lib/store';
import { TRACK_ESSENTIALS, TRACK_PROGRAMME, formatKes, tierFromParam } from '@/lib/training';
import { writeClient } from '@/sanity/lib/writeClient';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WINDOW_MINUTES = 10;
const MAX_PER_WINDOW = 10;

/**
 * Ten checks per IP address per ten minutes. Credit codes are six random
 * characters and must also match the person's phone or email, so guessing is
 * already hopeless; this keeps it that way. Counted in a small Sanity document,
 * because serverless instances share no memory.
 */
async function overLimit(request) {
  const ip = (request.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
  const window = Math.floor(Date.now() / (WINDOW_MINUTES * 60 * 1000));
  const id = `ratelimit.credits.${ip.replace(/[^A-Za-z0-9]/g, '_')}.${window}`;
  try {
    await writeClient.createIfNotExists({ _id: id, _type: 'systemLock', key: id, count: 0, createdAt: new Date().toISOString() });
    const doc = await writeClient.patch(id).inc({ count: 1 }).commit();
    return doc.count > MAX_PER_WINDOW;
  } catch {
    // If the counter fails, allow the check: it reveals nothing without the code.
    return false;
  }
}

/**
 * Preview a credit on the registration form before submitting.
 *
 * It needs the code. It never confirms a credit from a phone number alone, so
 * nobody can learn what another person bought. The answer is only a preview:
 * the registration API looks the credit up again and applies it there.
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  if (!isStoreConfigured()) return NextResponse.json({ ok: false }, { status: 503 });
  if (await overLimit(request)) {
    return NextResponse.json({ ok: false, error: 'Too many tries. Please wait a few minutes.' }, { status: 429 });
  }

  const code = String(body?.code || '').trim().toUpperCase().replace(/\s+/g, '');
  const track = tierFromParam(body?.tier);
  if (!CREDIT_CODE_RE.test(code) || ![TRACK_ESSENTIALS, TRACK_PROGRAMME].includes(track)) {
    return NextResponse.json({ ok: false });
  }
  if (!normalisePhone(body?.phone) && !body?.email) {
    return NextResponse.json({ ok: false, error: 'Enter your phone number or email first.' });
  }

  const credit = await findCredit({ code, phone: body?.phone, email: body?.email, track });
  if (!credit) return NextResponse.json({ ok: false });

  const pay = priceAfterCredit({ track, credit });
  return NextResponse.json({
    ok: true,
    amountKes: credit.amountKes,
    expiresAt: credit.expiresAt,
    payKes: pay,
    message: `${formatKes(credit.amountKes)} credit applied. You pay ${formatKes(pay)}.`,
  });
}
