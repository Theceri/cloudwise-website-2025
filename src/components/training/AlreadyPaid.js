'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

/**
 * "Already paid to the paybill?" Some buyers pay on M-Pesa themselves, often
 * with their name as the account number, because the WhatsApp team asked them
 * to. Their M-Pesa code lets us find the payment: the seat confirms at once if
 * Safaricom has already reported it, and otherwise a person checks it.
 */
export function AlreadyPaid({ reference }) {
  const [code, setCode] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | received | confirmed
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setError('');
    setState('sending');
    try {
      const res = await fetch('/api/payments/paybill/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference, receipt: code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'That did not work. Please try again.');
      if (data.confirmed) {
        setState('confirmed');
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setState('received');
      }
    } catch (err) {
      setError(err.message);
      setState('idle');
    }
  }

  if (state === 'received' || state === 'confirmed') {
    return (
      <div className="flex items-start gap-3 rounded-3xl border border-ice/30 bg-ice/[0.07] p-6 text-sm text-white/80">
        <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-ice" />
        {state === 'confirmed'
          ? 'Payment found. Your seat is confirmed.'
          : 'Thank you. We are checking your payment now, and you get a confirmation by email and WhatsApp as soon as it is matched, usually within the hour between 8am and 9pm. This page also updates by itself.'}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <h3 className="font-display text-lg font-semibold text-white">Already paid to our paybill?</h3>
      <p className="mt-1.5 text-sm text-white/60">
        Enter the M-Pesa code from your confirmation SMS, for example TK4AB7XYZ2. We match it to this booking.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="mpesa-code" className="sr-only">
          M-Pesa code
        </label>
        <input
          id="mpesa-code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          required
          maxLength={14}
          autoCapitalize="characters"
          placeholder="M-Pesa code"
          className="w-full flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 uppercase text-white placeholder-white/30 focus:border-ember/50 focus:outline-none focus:ring-2 focus:ring-ember/50"
        />
        <button type="submit" disabled={state === 'sending'} className="btn-ghost text-base disabled:opacity-60">
          {state === 'sending' ? <Loader2 size={18} className="animate-spin" /> : 'I have paid'}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm text-ember">
          {error}
        </p>
      )}
    </form>
  );
}
