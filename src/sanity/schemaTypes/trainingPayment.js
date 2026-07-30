import { defineType, defineField } from 'sanity';
import { CreditCardIcon } from '@sanity/icons';

/**
 * One payment attempt against one registration.
 *
 * The document `_id` is derived from the provider's own identifier
 * (`payment.mpesa.ws_CO_123…`, `payment.paystack.CWI-7F3K2M-1234`), which is
 * what makes webhook re-delivery safe: a repeated callback patches the same
 * document instead of creating a second one.
 */
export const trainingPayment = defineType({
  name: 'trainingPayment',
  title: 'Training payment',
  type: 'document',
  icon: CreditCardIcon,
  fields: [
    defineField({
      name: 'registrationRef',
      title: 'Registration reference',
      type: 'string',
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'registration',
      title: 'Registration',
      type: 'reference',
      to: [{ type: 'trainingRegistration' }],
      readOnly: true,
      weak: true,
    }),
    defineField({
      name: 'provider',
      title: 'Provider',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          { title: 'M-Pesa STK push (Daraja)', value: 'mpesa-stk' },
          { title: 'M-Pesa paybill (C2B)', value: 'mpesa-c2b' },
          { title: 'Paystack card', value: 'paystack' },
        ],
      },
    }),
    defineField({
      name: 'externalId',
      title: 'Provider id',
      type: 'string',
      readOnly: true,
      description: 'CheckoutRequestID for STK, transaction reference for Paystack.',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Completed', value: 'completed' },
          { title: 'Failed', value: 'failed' },
        ],
      },
      initialValue: 'pending',
    }),
    defineField({ name: 'amount', title: 'Amount (KES)', type: 'number', readOnly: true }),
    defineField({ name: 'phone', title: 'Phone charged', type: 'string', readOnly: true }),
    defineField({ name: 'receipt', title: 'M-Pesa receipt / card ref', type: 'string', readOnly: true }),
    defineField({ name: 'resultDescription', title: 'Provider message', type: 'string', readOnly: true }),

    // --- Settlement leg ---------------------------------------------------
    defineField({
      name: 'settlementState',
      title: 'Settlement state',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          { title: 'Not applicable', value: 'na' },
          { title: 'Owed', value: 'pending' },
          { title: 'Queued', value: 'queued' },
          { title: 'Settling', value: 'settling' },
          { title: 'Settled', value: 'settled' },
          { title: 'Failed', value: 'failed' },
          { title: 'Skipped', value: 'skipped' },
        ],
      },
    }),
    defineField({ name: 'settlementAdapter', title: 'Settlement adapter', type: 'string', readOnly: true }),
    defineField({ name: 'settlementRef', title: 'Settlement reference', type: 'string', readOnly: true }),
    defineField({ name: 'settlementAmount', title: 'Amount swept (KES)', type: 'number', readOnly: true }),
    defineField({ name: 'settlementMessage', title: 'Settlement message', type: 'string', readOnly: true }),
    defineField({ name: 'settledAt', title: 'Settled at', type: 'datetime', readOnly: true }),

    // --- Audit trail ------------------------------------------------------
    defineField({
      name: 'rawRequest',
      title: 'Request sent',
      type: 'text',
      rows: 6,
      readOnly: true,
      description: 'Secrets redacted.',
    }),
    defineField({ name: 'rawResponse', title: 'Response received', type: 'text', rows: 6, readOnly: true }),
    defineField({ name: 'rawCallback', title: 'Callback received', type: 'text', rows: 8, readOnly: true }),

    defineField({ name: 'createdAt', title: 'Created at', type: 'datetime', readOnly: true }),
    defineField({ name: 'completedAt', title: 'Completed at', type: 'datetime', readOnly: true }),
  ],

  preview: {
    select: {
      ref: 'registrationRef',
      status: 'status',
      amount: 'amount',
      provider: 'provider',
      settlementState: 'settlementState',
    },
    prepare({ ref, status, amount, provider, settlementState }) {
      const badge = { completed: '✅', pending: '🟡', failed: '⛔' }[status] || '·';
      const settled = settlementState === 'settled' ? ' → 🏦 settled' : '';
      return {
        title: `${badge} ${ref} · Ksh ${Number(amount || 0).toLocaleString('en-KE')}`,
        subtitle: `${provider || 'unknown'}${settled}`,
      };
    },
  },

  orderings: [
    { title: 'Newest', name: 'createdDesc', by: [{ field: 'createdAt', direction: 'desc' }] },
  ],
});
