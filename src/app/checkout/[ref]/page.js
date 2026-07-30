import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CalendarDays, Laptop, MapPin } from 'lucide-react';

import { Checkout } from '@/components/training/Checkout';
import { Reveal } from '@/components/anim/Reveal';
import { paybillInstructions } from '@/lib/payments/daraja';
import { isPaystackConfigured } from '@/lib/payments/paystack';
import { getRegistration } from '@/lib/store';
import {
  describeSchedule,
  formatKes,
  getTrack,
  isValidReference,
} from '@/lib/training';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Complete your booking',
  robots: { index: false, follow: false },
};

/** Show enough to prove it is their booking, without exposing the address. */
function maskEmail(email = '') {
  const [name, domain] = email.split('@');
  if (!name || !domain) return email;
  const visible = name.slice(0, Math.min(2, name.length));
  return `${visible}${'•'.repeat(Math.max(name.length - visible.length, 1))}@${domain}`;
}

export default async function CheckoutPage({ params }) {
  const { ref } = await params;
  if (!isValidReference(ref)) notFound();

  const registration = await getRegistration(ref);
  if (!registration) notFound();

  const track = getTrack(registration.track);
  const schedule = describeSchedule({
    track: registration.track,
    cohortId: registration.cohortId,
  });
  const isOnline = registration.attendance === 'online';

  const booking = {
    reference: registration.reference,
    amount: registration.amount,
    status: registration.status,
    phone: registration.phone || '',
    receipt: registration.paymentReceipt || null,
    trackName: track?.name || 'AI training',
    scheduleHeadline: schedule.headline,
    emailMasked: maskEmail(registration.email || ''),
  };

  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="pointer-events-none absolute inset-0 bg-ember-radial" />
      <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-grid-lg opacity-20" />

      <div className="container-px relative">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14">
          {/* Payment */}
          <div className="order-2 lg:order-1">
            <Reveal as="p" className="eyebrow mb-4">
              {registration.status === 'paid' ? 'All done' : 'Step 2 of 2 · Payment'}
            </Reveal>
            <Reveal
              as="h1"
              delay={0.05}
              className="mb-8 text-balance font-display text-4xl font-bold text-white md:text-5xl"
            >
              {registration.status === 'paid'
                ? 'Your seat is confirmed.'
                : `Secure your seat, ${registration.firstName || 'there'}.`}
            </Reveal>

            <Reveal delay={0.1}>
              <Checkout
                booking={booking}
                fallback={paybillInstructions(registration.reference)}
                cardEnabled={isPaystackConfigured()}
              />
            </Reveal>
          </div>

          {/* Order summary */}
          <Reveal delay={0.08} className="order-1 lg:order-2">
            <div className="card-dark sticky top-28 p-7">
              <p className="eyebrow mb-4">Your booking</p>
              <h2 className="font-display text-xl font-semibold text-white">{track?.name}</h2>
              {track?.partner && (
                <p className="mt-1 text-sm text-white/50">with {track.partner}</p>
              )}

              <div className="mt-6 space-y-3.5 border-y border-white/10 py-6 text-sm">
                <p className="flex items-start gap-3 text-white/75">
                  <CalendarDays size={16} className="mt-0.5 shrink-0 text-ember" />
                  <span>
                    {schedule.headline}
                    <span className="mt-0.5 block text-white/45">{schedule.detail}</span>
                  </span>
                </p>
                <p className="flex items-start gap-3 text-white/75">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-ember" />
                  {isOnline ? 'Online via Zoom' : track?.venue}
                </p>
                <p className="flex items-start gap-3 text-white/75">
                  <Laptop size={16} className="mt-0.5 shrink-0 text-ember" />
                  100% hands-on — bring your laptop
                </p>
              </div>

              <div className="mt-6 flex items-end justify-between">
                <div>
                  <p className="text-sm text-white/45">Total</p>
                  <p className="font-display text-3xl font-bold text-white">
                    {formatKes(registration.amount)}
                  </p>
                </div>
                {track?.strikePriceKes && (
                  <p className="pb-1 text-sm text-white/35 line-through">
                    {formatKes(track.strikePriceKes)}
                  </p>
                )}
              </div>

              <p className="mt-5 font-mono text-[0.65rem] uppercase tracking-eyebrow text-white/35">
                Reference {registration.reference}
              </p>

              <p className="mt-5 text-[13px] leading-relaxed text-white/45">
                Something wrong?{' '}
                <Link href={track?.registerPath || '/ai-training'} className="text-ember hover:underline">
                  Start again
                </Link>{' '}
                — nothing is charged until you pay.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
