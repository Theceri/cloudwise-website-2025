import 'server-only';

import { payout, SASAPAY_CHANNELS } from '@/lib/payments/sasapay';
import { callbackUrl } from '@/lib/runtime';

/**
 * Settle from the SasaPay working account to a Kenyan bank account.
 *
 * This is the rail from sasapay-test: a B2C payout where the channel is a bank
 * code (68 = Equity) and the receiver is the bank account number. It only works
 * for money SasaPay is actually holding, so pair it with SasaPay collection —
 * see PAYMENT_PROVIDER in the setup guide.
 */
export const sasapayAdapter = {
  id: 'sasapay',
  name: 'SasaPay B2C bank settlement',

  async settle({ amount, reference, cfg }) {
    const channel = process.env.SASAPAY_SETTLEMENT_CHANNEL || SASAPAY_CHANNELS.EQUITY;

    const result = await payout({
      amount,
      channel,
      receiver: cfg.accountNumber,
      reason: `Cloudwise training ${reference}`,
      // Our own idempotency key on SasaPay's side, and what their callback echoes.
      merchantTransactionReference: `SETTLE-${reference}`,
      callbackUrl: callbackUrl('/api/payments/settlement/sasapay/callback'),
    });

    return {
      reference: `SETTLE-${reference}`,
      message: `Sent Ksh ${amount} to ${cfg.bankName} account ${cfg.accountNumber} (channel ${channel}). Request id ${result.requestId || 'n/a'}.`,
      raw: result.response,
    };
  },
};
