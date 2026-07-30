'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Copy,
  CreditCard,
  Loader2,
  Smartphone,
} from 'lucide-react';

import { formatKes } from '@/lib/training';
import { whatsappLink } from '@/lib/constants';
import { cn } from '@/lib/utils';

/**
 * Checkout for both tracks.
 *
 * The M-Pesa flow is deliberately belt-and-braces. An STK push is the happy
 * path, but prompts get missed, phones are off, and Safaricom has bad
 * afternoons — so the paybill and account number are on screen the whole time,
 * never hidden behind a "having trouble?" link. Either route reconciles to the
 * same booking because the account number *is* the booking reference.
 */

const POLL_INTERVAL_MS = 4000;
const POLL_TIMEOUT_MS = 3 * 60 * 1000;

export function Checkout({ booking, fallback, cardEnabled }) {
  const [method, setMethod] = useState('mpesa');
  const [phone, setPhone] = useState(booking.phone || '');
  const [state, setState] = useState(booking.status === 'paid' ? 'paid' : 'idle');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState(booking.receipt || null);

  const pollTimer = useRef(null);
  const pollDeadline = useRef(0);

  const stopPolling = useCallback(() => {
    if (pollTimer.current) {
      clearTimeout(pollTimer.current);
      pollTimer.current = null;
    }
  }, []);

  useEffect(() => stopPolling, [stopPolling]);

  const poll = useCallback(async () => {
    try {
      const res = await fetch(`/api/registrations/${booking.reference}/status`, {
        cache: 'no-store',
      });
      const data = await res.json();

      if (data.status === 'paid') {
        stopPolling();
        setReceipt(data.receipt || null);
        setState('paid');
        return;
      }

      if (data.status === 'failed') {
        stopPolling();
        setState('failed');
        setError(data.message || 'The payment was not completed.');
        return;
      }
    } catch {
      // A dropped poll is not a failed payment — keep waiting.
    }

    if (Date.now() > pollDeadline.current) {
      stopPolling();
      setState('timeout');
      return;
    }
    pollTimer.current = setTimeout(poll, POLL_INTERVAL_MS);
  }, [booking.reference, stopPolling]);

  const startPolling = useCallback(() => {
    stopPolling();
    pollDeadline.current = Date.now() + POLL_TIMEOUT_MS;
    pollTimer.current = setTimeout(poll, POLL_INTERVAL_MS);
  }, [poll, stopPolling]);

  async function sendStkPush(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    setState('sending');

    try {
      const res = await fetch('/api/payments/mpesa/stk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: booking.reference, phone }),
      });
      const data = await res.json();

      if (!res.ok) {
        setState('failed');
        setError(data.error || 'We could not send the prompt. Use the paybill steps below.');
        return;
      }

      setMessage(data.message || 'Check your phone and enter your M-Pesa PIN.');
      setState('waiting');
      startPolling();
    } catch {
      setState('failed');
      setError('We could not reach the server. Use the paybill steps below to pay.');
    }
  }

  async function payByCard() {
    setError('');
    setState('sending');
    try {
      const res = await fetch('/api/payments/paystack/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: booking.reference }),
      });
      const data = await res.json();

      if (!res.ok) {
        setState('idle');
        setError(data.error || 'We could not start the card payment.');
        return;
      }
      window.location.href = data.authorizationUrl;
    } catch {
      setState('idle');
      setError('We could not reach the server. Please try M-Pesa.');
    }
  }

  if (state === 'paid') {
    return <PaidPanel booking={booking} receipt={receipt} />;
  }

  const busy = state === 'sending' || state === 'waiting';

  return (
    <div className="space-y-6">
      <div className="flex gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5">
        <MethodTab
          active={method === 'mpesa'}
          onClick={() => setMethod('mpesa')}
          icon={Smartphone}
          label="M-Pesa"
        />
        <MethodTab
          active={method === 'card'}
          onClick={() => setMethod('card')}
          icon={CreditCard}
          label="Card"
        />
      </div>

      {method === 'mpesa' ? (
        <div className="space-y-6">
          <form onSubmit={sendStkPush} className="card-dark space-y-4 p-6">
            <div>
              <h3 className="font-display text-lg font-semibold text-white">
                Pay with an M-Pesa prompt
              </h3>
              <p className="mt-1 text-sm text-white/55">
                We send a request to your phone. Enter your PIN and you are done.
              </p>
            </div>

            <label htmlFor="mpesa-phone" className="block text-sm font-medium text-white/85">
              M-Pesa number
            </label>
            <input
              id="mpesa-phone"
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={busy}
              placeholder="0712 345 678"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-[15px] text-white placeholder-white/30 focus:border-ember/50 focus:outline-none focus:ring-2 focus:ring-ember/50 disabled:opacity-60"
            />

            <button type="submit" disabled={busy} className="btn-ember w-full text-base disabled:opacity-60">
              {state === 'sending' && (
                <>
                  <Loader2 size={18} className="animate-spin" /> Sending prompt…
                </>
              )}
              {state === 'waiting' && (
                <>
                  <Loader2 size={18} className="animate-spin" /> Waiting for your PIN…
                </>
              )}
              {!busy && <>Send M-Pesa prompt · {formatKes(booking.amount)}</>}
            </button>

            {message && state === 'waiting' && (
              <p className="flex items-start gap-2 text-sm text-white/70">
                <Loader2 size={15} className="mt-0.5 shrink-0 animate-spin text-ember" />
                {message} This page updates by itself — no need to refresh.
              </p>
            )}

            {state === 'timeout' && (
              <Notice tone="warn">
                We have not seen the payment yet. If you completed it, give it a moment and refresh —
                otherwise use the paybill steps below.
              </Notice>
            )}

            {error && <Notice tone="error">{error}</Notice>}
          </form>

          <PaybillPanel fallback={fallback} amount={booking.amount} reference={booking.reference} />
        </div>
      ) : (
        <div className="card-dark space-y-4 p-6">
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Pay by card</h3>
            <p className="mt-1 text-sm text-white/55">
              Visa and Mastercard, processed securely by Paystack. You will come straight back here.
            </p>
          </div>

          {cardEnabled ? (
            <button onClick={payByCard} disabled={busy} className="btn-ember w-full text-base disabled:opacity-60">
              {state === 'sending' ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Opening secure checkout…
                </>
              ) : (
                <>
                  Pay {formatKes(booking.amount)} by card <ArrowUpRight size={18} />
                </>
              )}
            </button>
          ) : (
            <Notice tone="warn">
              Card payments are not switched on yet. Please pay with M-Pesa, or message us and we
              will sort you out.
            </Notice>
          )}

          {error && <Notice tone="error">{error}</Notice>}
        </div>
      )}

      <p className="text-center text-sm text-white/45">
        Stuck?{' '}
        <a
          href={whatsappLink(
            `Hi Cloudwise, I'm trying to pay for the AI training. My reference is ${booking.reference}.`
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ember hover:underline"
        >
          Message us on WhatsApp
        </a>{' '}
        and we will help you through it.
      </p>
    </div>
  );
}

function MethodTab({ active, onClick, icon: Icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
        active ? 'bg-ember text-white' : 'text-white/60 hover:bg-white/[0.05] hover:text-white'
      )}
    >
      <Icon size={17} />
      {label}
    </button>
  );
}

function PaybillPanel({ fallback, amount, reference }) {
  const [copied, setCopied] = useState('');

  const copy = async (value, key) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(''), 1800);
    } catch {
      // Clipboard is blocked in some in-app browsers; the numbers are visible anyway.
    }
  };

  return (
    <div className="rounded-3xl border border-ember/25 bg-ember/[0.06] p-6">
      <p className="eyebrow mb-3">If the prompt does not arrive</p>
      <h3 className="font-display text-lg font-semibold text-white">Pay directly from M-Pesa</h3>
      <p className="mt-1.5 text-sm text-white/60">
        Works exactly the same. Use this account number and your booking updates automatically.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <CopyRow
          label="Paybill"
          value={fallback.paybill}
          onCopy={() => copy(fallback.paybill, 'paybill')}
          copied={copied === 'paybill'}
        />
        <CopyRow
          label="Account number"
          value={reference}
          onCopy={() => copy(reference, 'account')}
          copied={copied === 'account'}
        />
        <CopyRow
          label="Amount"
          value={String(amount)}
          display={formatKes(amount)}
          onCopy={() => copy(String(amount), 'amount')}
          copied={copied === 'amount'}
        />
      </div>

      <ol className="mt-5 space-y-2 text-sm text-white/70">
        {fallback.steps.map((step, i) => (
          <li key={step} className="flex gap-3">
            <span className="font-mono text-xs text-ember">{i + 1}.</span>
            {step}
          </li>
        ))}
      </ol>

      <p className="mt-4 text-[13px] text-white/45">
        Once M-Pesa confirms, your seat is confirmed automatically and your welcome email follows.
      </p>
    </div>
  );
}

function CopyRow({ label, value, display, onCopy, copied }) {
  return (
    <button
      type="button"
      onClick={onCopy}
      className="group rounded-xl border border-white/10 bg-ink/40 p-4 text-left transition-colors hover:border-white/25"
    >
      <span className="block font-mono text-[0.6rem] uppercase tracking-eyebrow text-white/40">
        {label}
      </span>
      <span className="mt-1 flex items-center justify-between gap-2">
        <span className="font-display text-lg font-bold text-white">{display || value}</span>
        {copied ? (
          <CheckCircle2 size={15} className="text-ember" />
        ) : (
          <Copy size={14} className="text-white/30 transition-colors group-hover:text-white/60" />
        )}
      </span>
    </button>
  );
}

function PaidPanel({ booking, receipt }) {
  return (
    <div className="card-dark p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ember/15 text-ember">
        <CheckCircle2 size={28} />
      </div>
      <h2 className="mt-5 font-display text-2xl font-bold text-white">You’re in 🎉</h2>
      <p className="mx-auto mt-3 max-w-md text-white/60">
        Your seat on the {booking.trackName} is confirmed. Your receipt and preparation pack are on
        their way to <span className="text-white">{booking.emailMasked}</span>.
      </p>

      <dl className="mx-auto mt-7 max-w-sm space-y-2 text-sm">
        <Row label="Dates" value={booking.scheduleHeadline} />
        <Row label="Paid" value={formatKes(booking.amount)} />
        <Row label="Reference" value={booking.reference} mono />
        {receipt && <Row label="M-Pesa receipt" value={receipt} mono />}
      </dl>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/resources" className="btn-ember text-base">
          Open your resources <ArrowUpRight size={18} />
        </Link>
        <Link href="/ai-training" className="btn-ghost text-base">
          Back to the training
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value, mono }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/[0.07] pb-2">
      <dt className="text-white/45">{label}</dt>
      <dd className={cn('font-medium text-white', mono && 'font-mono text-[13px]')}>{value}</dd>
    </div>
  );
}

function Notice({ tone, children }) {
  const isError = tone === 'error';
  return (
    <p
      role="alert"
      className={cn(
        'flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm',
        isError ? 'border-ember/40 bg-ember/10 text-white' : 'border-white/15 bg-white/[0.04] text-white/75'
      )}
    >
      <AlertCircle size={16} className={cn('mt-0.5 shrink-0', isError ? 'text-ember' : 'text-white/50')} />
      <span>{children}</span>
    </p>
  );
}
