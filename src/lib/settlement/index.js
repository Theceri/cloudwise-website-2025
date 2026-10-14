import 'server-only';

import {
  claimOnce,
  listUnsettledPayments,
  patchPayment,
  patchRegistration,
  paymentId,
  releaseClaim,
} from '@/lib/store';

import { darajaB2bAdapter } from './daraja-b2b';
import { sasapayAdapter } from './sasapay';

/**
 * Auto-settlement: sweep a confirmed collection into the Cloudwise bank account.
 *
 * Two adapters, chosen with SETTLEMENT_ADAPTER, because the two collection
 * rails hold the money in different places:
 *
 *   daraja-b2b  Funds are in the Cloudwise M-Pesa paybill. We push them to the
 *               bank's own paybill (Equity is 247247) against our account
 *               number, using Daraja's BusinessPayBill.
 *   sasapay     Funds are in the SasaPay working account. We push them out with
 *               a SasaPay B2C to bank channel 68 (Equity).
 *
 * The important constraint: an adapter can only move money the provider
 * actually holds. Collecting on Daraja and settling on SasaPay is not a valid
 * pairing — SasaPay has no reach into a Safaricom-direct paybill.
 *
 * Design follows the state machine in sasapay-test/docs/AUTO_SETTLEMENT_PLAN.md:
 * a claim makes the sweep exactly-once, the payout's own callback closes the
 * loop, and a failure leaves the money safely where it is.
 *
 * When, chosen with SETTLEMENT_SCHEDULE:
 *
 *   immediate   (default) Each confirmed M-Pesa payment is swept straight away,
 *               and the daily job retries any that failed.
 *   daily       Nothing is swept at payment time. The daily job (9:00am EAT)
 *               sweeps every unsettled M-Pesa payment in ONE transfer, which
 *               pays the B2B charge once a day instead of once a payment.
 */

const ADAPTERS = {
  'daraja-b2b': darajaB2bAdapter,
  sasapay: sasapayAdapter,
};

/**
 * Only mobile-money collections are swept. Card money never touches our
 * paybill — it sits in the Paystack balance and Paystack settles it to the bank
 * on its own schedule, so there is nothing here for us to move.
 */
const SWEEPABLE_PROVIDERS = new Set(['mpesa-stk', 'mpesa-c2b', 'sasapay']);

export function settlementConfig() {
  const adapter = (process.env.SETTLEMENT_ADAPTER || 'none').toLowerCase();
  return {
    enabled: process.env.SETTLEMENT_ENABLED === 'true' && adapter !== 'none',
    adapter,
    // full | percentage | fixed
    mode: (process.env.SETTLEMENT_MODE || 'full').toLowerCase(),
    value: Number(process.env.SETTLEMENT_VALUE || 0),
    minAmount: Number(process.env.SETTLEMENT_MIN_AMOUNT || 0),
    floatBuffer: Number(process.env.SETTLEMENT_FLOAT_BUFFER || 0),
    bankName: process.env.SETTLEMENT_BANK_NAME || 'Equity Bank',
    accountNumber: process.env.SETTLEMENT_ACCOUNT_NUMBER || '',
    schedule: (process.env.SETTLEMENT_SCHEDULE || 'immediate').toLowerCase() === 'daily' ? 'daily' : 'immediate',
  };
}

export function isSettlementConfigured() {
  const cfg = settlementConfig();
  return cfg.enabled && Boolean(ADAPTERS[cfg.adapter]) && Boolean(cfg.accountNumber);
}

/** How much of a collection to sweep, per the configured rule. */
export function sweepAmountFor(collectedAmount, cfg = settlementConfig()) {
  const amount = Number(collectedAmount) || 0;

  let target;
  if (cfg.mode === 'percentage') target = (amount * cfg.value) / 100;
  else if (cfg.mode === 'fixed') target = Math.min(cfg.value, amount);
  else target = amount;

  target -= cfg.floatBuffer;

  // M-Pesa deals in whole shillings; round down so we never try to move more
  // than was actually collected.
  return Math.floor(Math.max(target, 0));
}

/**
 * Sweep one completed collection to the bank.
 *
 * Safe to call more than once for the same payment — the claim makes every
 * call after the first a no-op, which is what keeps a re-delivered M-Pesa
 * callback from paying out twice.
 *
 * Never throws: a settlement failure must not fail the payment confirmation
 * that triggered it. The money stays in the paybill and the payment is marked
 * `failed` for retry.
 */
export async function maybeSettle(payment, { force = false } = {}) {
  const cfg = settlementConfig();

  if (!cfg.enabled) return { settled: false, reason: 'disabled' };

  // On the daily schedule a payment waits, as `pending`, for settleBatch.
  if (cfg.schedule === 'daily' && !force) return { settled: false, reason: 'scheduled for the daily sweep' };

  const adapter = ADAPTERS[cfg.adapter];
  if (!adapter) return { settled: false, reason: `unknown adapter: ${cfg.adapter}` };
  if (!cfg.accountNumber) return { settled: false, reason: 'no destination account configured' };

  // Only a completed, inbound collection may be swept. A settlement is itself
  // an outbound payment, so this guard also makes a sweep loop impossible.
  if (!payment || payment.status !== 'completed') {
    return { settled: false, reason: 'payment is not completed' };
  }
  if (!SWEEPABLE_PROVIDERS.has(payment.provider)) {
    return { settled: false, reason: `${payment.provider} settles on its own rails` };
  }

  // Already handled by an earlier delivery of this callback. `force` is for the
  // retry job reviving a sweep that was claimed but never sent.
  if (!force && ['queued', 'settling', 'settled'].includes(payment.settlementState)) {
    return { settled: false, reason: `already ${payment.settlementState}` };
  }
  if (force && payment.settlementState === 'settled') {
    return { settled: false, reason: 'already settled' };
  }

  const amount = sweepAmountFor(payment.amount, cfg);
  if (Number(payment.amount) < cfg.minAmount) {
    await patchPayment(payment.provider, payment.externalId, {
      settlementState: 'skipped',
      settlementMessage: `Below the Ksh ${cfg.minAmount} settlement minimum.`,
    });
    return { settled: false, reason: 'below minimum' };
  }
  if (amount <= 0) {
    await patchPayment(payment.provider, payment.externalId, {
      settlementState: 'skipped',
      settlementMessage: 'Nothing left to sweep after the float buffer.',
    });
    return { settled: false, reason: 'nothing to sweep' };
  }

  // Claim the sweep. Whoever wins this is the only caller that will pay out.
  const lockKey = `settle.${paymentId(payment.provider, payment.externalId)}`;
  // A forced retry is reviving a stuck claim, so drop the stale one first.
  if (force) await releaseClaim(lockKey);
  if (!(await claimOnce(lockKey))) {
    return { settled: false, reason: 'another worker claimed it' };
  }

  await patchPayment(payment.provider, payment.externalId, {
    settlementState: 'queued',
    settlementAdapter: cfg.adapter,
    settlementAmount: amount,
  });

  try {
    const result = await adapter.settle({
      amount,
      reference: payment.registrationRef,
      sourcePaymentId: paymentId(payment.provider, payment.externalId),
      cfg,
    });

    await patchPayment(payment.provider, payment.externalId, {
      // Both rails are asynchronous: the request is accepted now, and the
      // provider's result callback flips this to `settled`.
      settlementState: 'settling',
      settlementRef: result.reference,
      settlementMessage: result.message || 'Settlement request accepted.',
    });
    await patchRegistration(payment.registrationRef, { settlementState: 'settling' }).catch(() => {});

    return { settled: true, state: 'settling', reference: result.reference, amount };
  } catch (err) {
    console.error('[settlement] sweep failed:', err?.message);

    await patchPayment(payment.provider, payment.externalId, {
      settlementState: 'failed',
      settlementMessage: String(err?.message || err).slice(0, 300),
    }).catch(() => {});
    await patchRegistration(payment.registrationRef, { settlementState: 'failed' }).catch(() => {});

    // Drop the claim so a retry can pick it up.
    await releaseClaim(lockKey);

    return { settled: false, reason: err?.message || 'settlement failed' };
  }
}

/**
 * Sweep every unsettled M-Pesa payment to the bank in one transfer.
 * Called by the daily job when SETTLEMENT_SCHEDULE=daily.
 *
 * Each payment is claimed exactly as a single sweep would claim it, so a
 * payment can never be in two transfers. The batch is recorded as a
 * `settlementBatch` document listing its payments; the provider's result
 * callback settles or fails all of them together.
 */
export async function settleBatch({ now = new Date() } = {}) {
  const cfg = settlementConfig();
  if (!cfg.enabled) return { settled: false, reason: 'disabled' };
  const adapter = ADAPTERS[cfg.adapter];
  if (!adapter) return { settled: false, reason: `unknown adapter: ${cfg.adapter}` };
  if (!cfg.accountNumber) return { settled: false, reason: 'no destination account configured' };

  const candidates = (await listUnsettledPayments({ limit: 200 })).filter(
    (p) => p.status === 'completed' && SWEEPABLE_PROVIDERS.has(p.provider)
  );

  // Claim each payment. A failed or stale one is revived, as a forced retry would.
  const claimed = [];
  for (const payment of candidates) {
    const lockKey = `settle.${paymentId(payment.provider, payment.externalId)}`;
    if (payment.settlementState !== 'pending') await releaseClaim(lockKey);
    if (await claimOnce(lockKey)) claimed.push(payment);
  }
  if (!claimed.length) return { settled: false, reason: 'nothing to sweep' };

  const collected = claimed.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const amount = sweepAmountFor(collected, cfg);

  const releaseAll = async (state, message) => {
    for (const payment of claimed) {
      await patchPayment(payment.provider, payment.externalId, {
        settlementState: state,
        settlementMessage: message,
      }).catch(() => {});
      await releaseClaim(`settle.${paymentId(payment.provider, payment.externalId)}`);
    }
  };

  if (collected < cfg.minAmount || amount <= 0) {
    // Leave them pending for tomorrow's run rather than skipping them for good.
    await releaseAll('pending', `Waiting: Ksh ${collected} is below the daily sweep minimum.`);
    return { settled: false, reason: 'below minimum', collected };
  }

  const day = now.toISOString().slice(0, 10).replace(/-/g, '');
  const batchId = `settlement-batch.${day}-${Date.now().toString(36)}`;
  const { writeClient } = await import('@/sanity/lib/writeClient');
  await writeClient.create({
    _id: batchId,
    _type: 'settlementBatch',
    state: 'queued',
    adapter: cfg.adapter,
    paymentIds: claimed.map((p) => paymentId(p.provider, p.externalId)),
    collected,
    amount,
    createdAt: now.toISOString(),
  });

  for (const payment of claimed) {
    await patchPayment(payment.provider, payment.externalId, {
      settlementState: 'queued',
      settlementAdapter: cfg.adapter,
      settlementAmount: Number(payment.amount) || 0,
    });
  }

  try {
    const result = await adapter.settle({ amount, reference: `BATCH-${day}`, cfg });

    for (const payment of claimed) {
      await patchPayment(payment.provider, payment.externalId, {
        settlementState: 'settling',
        settlementRef: result.reference,
        settlementMessage: `Part of the daily sweep ${batchId}.`,
      });
      await patchRegistration(payment.registrationRef, { settlementState: 'settling' }).catch(() => {});
    }
    await writeClient
      .patch(batchId)
      .set({ state: 'settling', settlementRef: result.reference, message: result.message || '' })
      .commit();

    return { settled: true, state: 'settling', reference: result.reference, amount, payments: claimed.length };
  } catch (err) {
    console.error('[settlement] daily sweep failed:', err?.message);
    const message = String(err?.message || err).slice(0, 300);
    await releaseAll('failed', message);
    await writeClient.patch(batchId).set({ state: 'failed', message }).commit().catch(() => {});
    return { settled: false, reason: err?.message || 'settlement failed' };
  }
}

/**
 * Close the loop when the provider reports the payout's outcome.
 * Called from the settlement result callbacks.
 *
 * A single sweep matches one payment; a daily sweep matches every payment in
 * the batch, because they share the provider's reference.
 */
export async function recordSettlementResult({ settlementRef, succeeded, message }) {
  const { writeClient } = await import('@/sanity/lib/writeClient');

  const payments = await writeClient.fetch(
    '*[_type == "trainingPayment" && settlementRef == $ref]',
    { ref: settlementRef },
    { cache: 'no-store' }
  );
  if (!payments.length) return { matched: false };

  const state = succeeded ? 'settled' : 'failed';
  for (const payment of payments) {
    await patchPayment(payment.provider, payment.externalId, {
      settlementState: state,
      settlementMessage: String(message || '').slice(0, 300),
      ...(succeeded ? { settledAt: new Date().toISOString() } : {}),
    });
    await patchRegistration(payment.registrationRef, { settlementState: state }).catch(() => {});

    // A failed sweep must be retryable, so give the claim back.
    if (!succeeded) {
      await releaseClaim(`settle.${paymentId(payment.provider, payment.externalId)}`);
    }
  }

  // The batch record, if this was a daily sweep.
  const batchId = await writeClient.fetch(
    '*[_type == "settlementBatch" && settlementRef == $ref][0]._id',
    { ref: settlementRef },
    { cache: 'no-store' }
  );
  if (batchId) {
    await writeClient
      .patch(batchId)
      .set({ state, message: String(message || '').slice(0, 300), ...(succeeded ? { settledAt: new Date().toISOString() } : {}) })
      .commit()
      .catch(() => {});
  }

  return {
    matched: true,
    state,
    registrationRef: payments[0].registrationRef,
    payment: payments[0],
    payments: payments.length,
  };
}
