'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowUpRight, CheckCircle2, Loader2 } from 'lucide-react';

/**
 * Verifies a card payment when the customer returns from Paystack.
 *
 * Runs once on mount and, if the answer is still inconclusive, retries a few
 * times: Paystack occasionally redirects a beat before the charge is finalised
 * on their side, and telling someone their payment failed when it is merely
 * slow is the worst possible outcome here.
 */

const MAX_ATTEMPTS = 6;
const RETRY_MS = 3000;

export function PaystackReturn({ bookingReference, attemptReference }) {
  const [state, setState] = useState(attemptReference ? 'checking' : 'missing');
  const [message, setMessage] = useState('');
  const attempts = useRef(0);

  useEffect(() => {
    if (!attemptReference) return undefined;

    let cancelled = false;
    let timer;

    async function check() {
      attempts.current += 1;
      try {
        const res = await fetch('/api/payments/paystack/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference: attemptReference }),
        });
        const data = await res.json();
        if (cancelled) return;

        if (data.status === 'paid') {
          setState('paid');
          return;
        }
        if (data.status === 'failed') {
          setState('failed');
          setMessage(data.message || 'Your card was declined.');
          return;
        }
      } catch {
        // Fall through to the retry below.
      }

      if (cancelled) return;
      if (attempts.current >= MAX_ATTEMPTS) {
        setState('unresolved');
        return;
      }
      timer = setTimeout(check, RETRY_MS);
    }

    check();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [attemptReference]);

  if (state === 'paid') {
    return (
      <Panel
        icon={<CheckCircle2 size={28} />}
        title="Payment received 🎉"
        body="Your seat is confirmed. Your receipt and preparation pack are on their way to your inbox — check spam if you do not see them in a few minutes."
      >
        <Link href="/resources" className="btn-ember text-base">
          Open your resources <ArrowUpRight size={18} />
        </Link>
      </Panel>
    );
  }

  if (state === 'failed' || state === 'missing') {
    return (
      <Panel
        tone="warn"
        icon={<AlertCircle size={28} />}
        title={state === 'missing' ? 'We could not find that payment' : 'That card did not go through'}
        body={
          state === 'missing'
            ? 'No payment reference came back from the checkout. Nothing was charged.'
            : `${message} Nothing was charged, and your place is still held.`
        }
      >
        <Link href={`/checkout/${bookingReference}`} className="btn-ember text-base">
          Try again
        </Link>
      </Panel>
    );
  }

  if (state === 'unresolved') {
    return (
      <Panel
        tone="warn"
        icon={<AlertCircle size={28} />}
        title="Still confirming"
        body="Your bank is taking longer than usual. If money left your account, your seat will be confirmed automatically and you will get an email — there is no need to pay again."
      >
        <Link href={`/checkout/${bookingReference}`} className="btn-ghost text-base">
          Back to checkout
        </Link>
      </Panel>
    );
  }

  return (
    <Panel
      icon={<Loader2 size={28} className="animate-spin" />}
      title="Confirming your payment"
      body="One moment — we are checking with your bank. Please do not close this page."
    />
  );
}

function Panel({ icon, title, body, tone, children }) {
  return (
    <div className="card-dark p-8 text-center">
      <div
        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
          tone === 'warn' ? 'bg-white/[0.06] text-white/70' : 'bg-ember/15 text-ember'
        }`}
      >
        {icon}
      </div>
      <h1 className="mt-5 font-display text-2xl font-bold text-white">{title}</h1>
      <p className="mx-auto mt-3 max-w-sm text-white/60">{body}</p>
      {children && <div className="mt-7 flex justify-center">{children}</div>}
    </div>
  );
}
