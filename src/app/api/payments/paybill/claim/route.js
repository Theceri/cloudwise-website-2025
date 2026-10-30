import { NextResponse } from 'next/server';

import { sendToAdmins } from '@/lib/email/send';
import { applyPaybillPayment, approveLink, normaliseReceipt } from '@/lib/payments/paybill-match';
import { claimOnce, getPayment, getRegistration, patchRegistration } from '@/lib/store';
import { formatKes, normaliseReference } from '@/lib/training';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * "I have already paid": a buyer who paid the paybill themselves gives us the
 * M-Pesa code from their SMS.
 *
 * If Safaricom already told us about that code (an "unmatched" C2B payment),
 * the seat is confirmed at once. Otherwise the code is kept on the booking, so
 * the C2B confirmation matches it the moment it arrives, and the admins get an
 * email with a one-click confirm link to use after checking the statement.
 *
 * Nothing here confirms a seat on the buyer's word alone.
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const reference = normaliseReference(body?.reference);
  const receipt = normaliseReceipt(body?.receipt);
  if (!reference) return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
  if (!receipt) {
    return NextResponse.json(
      { error: 'An M-Pesa code is 10 letters and numbers, for example TK4AB7XYZ2. It is at the start of your M-Pesa SMS.' },
      { status: 400 }
    );
  }

  const registration = await getRegistration(reference);
  if (!registration) return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
  if (registration.status === 'paid') return NextResponse.json({ ok: true, confirmed: true });

  // Safaricom may already have told us about this payment.
  const known = await getPayment('mpesa-c2b', receipt);
  if (known?.status === 'unmatched' && Number(known.amount) >= Number(registration.amount)) {
    const result = await applyPaybillPayment({
      registration,
      receipt,
      amount: known.amount,
      note: 'the buyer entered this M-Pesa code at checkout',
    });
    if (result.ok) return NextResponse.json({ ok: true, confirmed: true });
  }

  await patchRegistration(reference, {
    paybillClaim: { receipt, at: new Date().toISOString() },
  });

  // One email per booking and code, however often the button is pressed.
  if (await claimOnce(`paybill-claim.${reference}.${receipt}`)) {
    const link = approveLink({ reference, receipt, amount: registration.amount });
    await sendToAdmins({
      subject: `🧾 Says they paid: ${registration.firstName} ${registration.lastName}, ${formatKes(registration.amount)}, code ${receipt}`,
      html: `
        <p><strong>${esc(registration.firstName)} ${esc(registration.lastName)}</strong> (${esc(reference)},
        ${esc(registration.cohortLabel || registration.track)}) says they paid ${formatKes(registration.amount)}
        to the paybill. M-Pesa code: <strong>${esc(receipt)}</strong>. Phone: ${esc(registration.phone || '')}.</p>
        <p>Find the code on the paybill statement (M-Pesa Business app or the M-Pesa Org portal). If it is there
        and the amount is right, confirm the seat:</p>
        <p><a href="${link}">Open the payment and confirm the seat</a></p>
        <p>If Safaricom's confirmation reaches the website first, the seat confirms by itself and this link
        just shows "Payment confirmed".</p>
      `,
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true, confirmed: false });
}

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
