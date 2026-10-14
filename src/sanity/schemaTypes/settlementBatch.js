import { defineType, defineField } from 'sanity';
import { CreditCardIcon } from '@sanity/icons';

/**
 * One daily sweep from the M-Pesa paybill to the bank, covering many payments.
 * Created by `settleBatch` (src/lib/settlement/index.js) when
 * SETTLEMENT_SCHEDULE=daily. Read-only: it is a record of what was sent.
 */
export const settlementBatch = defineType({
  name: 'settlementBatch',
  title: 'Bank sweep (daily batch)',
  type: 'document',
  icon: CreditCardIcon,
  readOnly: true,
  fields: [
    defineField({
      name: 'state',
      title: 'State',
      type: 'string',
      options: {
        list: [
          { title: 'Queued', value: 'queued' },
          { title: 'Settling', value: 'settling' },
          { title: 'Settled', value: 'settled' },
          { title: 'Failed', value: 'failed' },
        ],
      },
    }),
    defineField({ name: 'adapter', title: 'Settlement adapter', type: 'string' }),
    defineField({ name: 'collected', title: 'Collected (KES)', type: 'number' }),
    defineField({ name: 'amount', title: 'Sent to the bank (KES)', type: 'number' }),
    defineField({ name: 'paymentIds', title: 'Payments in this sweep', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'settlementRef', title: 'Provider reference', type: 'string' }),
    defineField({ name: 'message', title: 'Message', type: 'string' }),
    defineField({ name: 'createdAt', title: 'Created at', type: 'datetime' }),
    defineField({ name: 'settledAt', title: 'Settled at', type: 'datetime' }),
  ],
  preview: {
    select: { state: 'state', amount: 'amount', createdAt: 'createdAt', paymentIds: 'paymentIds' },
    prepare({ state, amount, createdAt, paymentIds }) {
      const badge = { settled: '🏦', settling: '⏳', failed: '⛔', queued: '🟡' }[state] || '·';
      return {
        title: `${badge} Ksh ${Number(amount || 0).toLocaleString('en-KE')} · ${paymentIds?.length || 0} payments`,
        subtitle: createdAt ? new Date(createdAt).toLocaleString('en-GB', { timeZone: 'Africa/Nairobi' }) : '',
      };
    },
  },
  orderings: [{ title: 'Newest', name: 'createdDesc', by: [{ field: 'createdAt', direction: 'desc' }] }],
});
