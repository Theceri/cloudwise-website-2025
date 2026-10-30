import { redirect } from 'next/navigation';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

import { applyPaybillPayment, readApproveToken } from '@/lib/payments/paybill-match';
import { getPayment, getRegistration } from '@/lib/store';
import { formatKes } from '@/lib/training';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Confirm a paybill payment',
  robots: { index: false, follow: false },
};

/**
 * Where an admin lands from a "confirm their seat" link in a payment email.
 *
 * Opening the link changes nothing: email scanners open links on their own,
 * so the page shows the booking and the M-Pesa code and waits for a button.
 * The link is signed with CRON_SECRET and expires after 14 days, so nobody
 * can make one up for a booking of their choice.
 */
async function confirm(formData) {
  'use server';
  const token = String(formData.get('t') || '');
  const link = readApproveToken(token);
  if (!link) redirect('/payments/approve?state=invalid');

  const registration = await getRegistration(link.reference);
  if (!registration) redirect('/payments/approve?state=invalid');

  const result = await applyPaybillPayment({
    registration,
    receipt: link.receipt,
    amount: link.amount ?? registration.amount,
    note: 'confirmed by an admin from the payment email',
  });

  redirect(`/payments/approve?t=${encodeURIComponent(token)}&state=${result.ok ? 'done' : 'failed'}&why=${encodeURIComponent(result.reason || '')}`);
}

export default async function ApprovePage({ searchParams }) {
  const { t, state, why } = await searchParams;
  const link = readApproveToken(t);

  if (!link || state === 'invalid') {
    return <Box icon={<ShieldAlert size={28} />} title="This link is not valid" text="It may have expired after 14 days, or been copied incompletely. Use the reconcile steps in docs/PAYMENTS_SETUP.md instead." />;
  }

  const registration = await getRegistration(link.reference);
  const payment = await getPayment('mpesa-c2b', link.receipt);
  const amount = link.amount ?? registration?.amount;

  if (state === 'done' || registration?.status === 'paid') {
    return (
      <Box
        icon={<CheckCircle2 size={28} />}
        title="Payment confirmed"
        text={`${registration?.firstName || ''} ${registration?.lastName || ''} (${link.reference}) is paid with M-Pesa code ${link.receipt}. Their receipt and joining emails are sent.`}
      />
    );
  }

  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-44">
      <div className="pointer-events-none absolute inset-0 bg-ember-radial" />
      <div className="container-px relative">
        <form action={confirm} className="card-dark mx-auto max-w-lg p-8">
          <p className="eyebrow">Confirm a paybill payment</p>
          <h1 className="mt-3 font-display text-2xl font-bold text-white">
            Is this payment from {registration ? `${registration.firstName} ${registration.lastName}` : link.reference}?
          </h1>
          <dl className="mt-6 space-y-2 text-sm">
            <Row label="Booking" value={`${link.reference} · ${registration?.cohortLabel || ''}`} />
            <Row label="Phone" value={registration?.phone || '—'} />
            <Row label="M-Pesa code" value={link.receipt} />
            <Row label="Amount" value={amount ? formatKes(amount) : '—'} />
            <Row label="Booking price" value={registration ? formatKes(registration.amount) : '—'} />
            <Row
              label="Seen by Safaricom's webhook"
              value={payment ? `Yes, ${payment.status}` : 'No. Check the M-Pesa statement or app first.'}
            />
          </dl>
          {state === 'failed' && (
            <p role="alert" className="mt-5 rounded-xl border border-ember/40 bg-ember/10 px-4 py-3 text-sm text-white">
              Not confirmed. {why || 'Something went wrong.'}
            </p>
          )}
          <p className="mt-6 text-sm text-white/70">
            <strong className="text-white">Check first:</strong> find code {link.receipt} on the paybill statement (M-Pesa
            Business app or the M-Pesa Org portal) and make sure the amount is right. Confirming sends the buyer their
            receipt and joining details.
          </p>
          <input type="hidden" name="t" value={t} />
          <button type="submit" className="btn-ember mt-6 w-full text-base">
            Yes, I checked it: confirm the seat
          </button>
        </form>
      </div>
    </section>
  );
}

function Box({ icon, title, text }) {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-44">
      <div className="container-px relative">
        <div className="card-dark mx-auto max-w-lg p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-ember">{icon}</div>
          <h1 className="mt-5 font-display text-2xl font-bold text-white">{title}</h1>
          <p className="mt-3 text-white/70">{text}</p>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/[0.07] pb-2">
      <dt className="text-white/65">{label}</dt>
      <dd className="text-right font-medium text-white">{value}</dd>
    </div>
  );
}
