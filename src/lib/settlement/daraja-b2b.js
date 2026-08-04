import 'server-only';

import { b2bPayBill } from '@/lib/payments/daraja';
import { callbackUrl } from '@/lib/runtime';

/**
 * Settle from the Cloudwise M-Pesa paybill straight to the bank.
 *
 * Kenyan banks each expose a paybill for deposits (Equity's is 247247), with
 * the customer's account number as the account reference. A Daraja B2B
 * `BusinessPayBill` from our shortcode to theirs is therefore a bank deposit —
 * which is how collections reach Equity without anyone touching a phone.
 *
 * Needs the B2B API enabled on the Daraja app, an API initiator, and a security
 * credential. See docs/PAYMENTS_SETUP.md.
 */
export const darajaB2bAdapter = {
  id: 'daraja-b2b',
  name: 'M-Pesa B2B to bank paybill',

  async settle({ amount, reference, cfg }) {
    const bankPaybill = process.env.SETTLEMENT_BANK_PAYBILL;
    if (!bankPaybill) {
      throw new Error('SETTLEMENT_BANK_PAYBILL is not set (Equity deposits use 247247).');
    }

    const result = await b2bPayBill({
      amount,
      receiverShortcode: bankPaybill,
      // For a bank paybill the account reference is the bank account number.
      accountReference: cfg.accountNumber,
      remarks: `Cloudwise training ${reference}`,
      resultUrl: callbackUrl('/api/payments/settlement/daraja/result'),
      timeoutUrl: callbackUrl('/api/payments/settlement/daraja/timeout'),
    });

    return {
      // Daraja identifies the payout by conversation id; the result callback
      // echoes it back so we can match it to this payment.
      reference: result.conversationId || result.originatorConversationId,
      message: `Sent Ksh ${amount} to ${cfg.bankName} paybill ${bankPaybill}, account ${cfg.accountNumber}.`,
      raw: result.response,
    };
  },
};
