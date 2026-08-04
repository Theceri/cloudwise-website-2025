import { notFound } from 'next/navigation';

import { PaystackReturn } from '@/components/training/PaystackReturn';
import { normaliseReference } from '@/lib/training';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Confirming your payment',
  robots: { index: false, follow: false },
};

/**
 * Where Paystack sends the customer back to.
 *
 * The redirect itself proves nothing, so the client component immediately asks
 * our server to verify the transaction against Paystack's API before showing
 * anything reassuring.
 */
export default async function CheckoutCompletePage({ params, searchParams }) {
  const { ref: rawRef } = await params;
  const ref = normaliseReference(rawRef);
  const query = await searchParams;

  if (!ref) notFound();

  // Paystack appends its own transaction reference on return.
  const attemptReference = query?.reference || query?.trxref || null;

  return (
    <section className="relative overflow-hidden pt-36 pb-28 md:pt-44">
      <div className="pointer-events-none absolute inset-0 bg-ember-radial" />
      <div className="container-px relative">
        <div className="mx-auto max-w-lg">
          <PaystackReturn bookingReference={ref} attemptReference={attemptReference} />
        </div>
      </div>
    </section>
  );
}
