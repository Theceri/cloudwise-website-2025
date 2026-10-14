import { defineType, defineField } from 'sanity';
import { CreditCardIcon } from '@sanity/icons';

/**
 * A credit earned by paying for a smaller class, spent on a bigger one.
 *
 *   Kickstart (Ksh 500)    → Ksh 500 off Essentials or the Programme, 14 days.
 *   Essentials (Ksh 5,500) → Ksh 5,500 off the Programme, 60 days.
 *
 * Credits from website bookings are created automatically when the payment is
 * confirmed (src/lib/credits.js) and are read-only here. An admin may also
 * create one by hand for a payment taken outside the website — on WhatsApp, or
 * straight to the paybill before the site took bookings — with the M-Pesa code
 * as evidence and a note saying why.
 *
 * The document id is `credit.<code>`, so a code can only ever exist once.
 */
export const trainingCredit = defineType({
  name: 'trainingCredit',
  title: 'Training credit',
  type: 'document',
  icon: CreditCardIcon,
  fields: [
    defineField({
      name: 'code',
      title: 'Credit code',
      type: 'string',
      description: 'CR- followed by six letters or digits, e.g. CR-7F3K2M. The buyer types this, or their M-Pesa code.',
      validation: (Rule) =>
        Rule.required().regex(/^CR-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/, { name: 'credit code' }),
      readOnly: ({ document }) => document?.sourceMethod && document.sourceMethod !== 'manual',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'available',
      options: {
        list: [
          { title: 'Available', value: 'available' },
          { title: 'Held by an unpaid booking', value: 'reserved' },
          { title: 'Used', value: 'redeemed' },
          { title: 'Expired', value: 'expired' },
          { title: 'Cancelled', value: 'void' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'amountKes',
      title: 'Credit (KES)',
      type: 'number',
      validation: (Rule) =>
        Rule.required().custom((v) => (v === 500 || v === 5500 ? true : 'A credit is Ksh 500 or Ksh 5,500.')),
    }),
    defineField({
      name: 'appliesTo',
      title: 'Can be used on',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'AI Essentials', value: 'essentials' },
          { title: 'AI Productivity Programme', value: 'individual' },
        ],
      },
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'phone',
      title: 'Phone (2547XXXXXXXX)',
      type: 'string',
      validation: (Rule) => Rule.required().regex(/^254[17]\d{8}$/, { name: 'Kenyan mobile number' }),
    }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    defineField({
      name: 'sourceMethod',
      title: 'Earned through',
      type: 'string',
      initialValue: 'manual',
      options: {
        list: [
          { title: 'M-Pesa prompt', value: 'mpesa-stk' },
          { title: 'M-Pesa paybill', value: 'mpesa-c2b' },
          { title: 'Card', value: 'card' },
          { title: 'Added by hand', value: 'manual' },
        ],
      },
    }),
    defineField({
      name: 'sourceReceipt',
      title: 'Payment evidence (M-Pesa code or card reference)',
      type: 'string',
      validation: (Rule) => Rule.required().uppercase(),
    }),
    defineField({ name: 'sourceReference', title: 'Earned on booking', type: 'string' }),
    defineField({ name: 'classDate', title: 'Class date', type: 'date' }),
    defineField({
      name: 'expiresAt',
      title: 'Valid until',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'reservedBy', title: 'Held by booking', type: 'string', readOnly: true }),
    defineField({ name: 'reservedAt', title: 'Held since', type: 'datetime', readOnly: true }),
    defineField({ name: 'redeemedBy', title: 'Used on booking', type: 'string', readOnly: true }),
    defineField({ name: 'redeemedAt', title: 'Used at', type: 'datetime', readOnly: true }),
    defineField({ name: 'createdAt', title: 'Created at', type: 'datetime', readOnly: true }),
    defineField({
      name: 'note',
      title: 'Note',
      type: 'text',
      rows: 3,
      description: 'Required for a credit added by hand: who paid, how, and why the credit is owed.',
      validation: (Rule) =>
        Rule.custom((note, ctx) =>
          ctx.document?.sourceMethod === 'manual' && !String(note || '').trim()
            ? 'Say why this credit was added by hand.'
            : true
        ),
    }),
  ],

  preview: {
    select: { code: 'code', status: 'status', amount: 'amountKes', name: 'name', phone: 'phone' },
    prepare({ code, status, amount, name, phone }) {
      const badge = { available: '🟢', reserved: '🟡', redeemed: '✅', expired: '⌛', void: '⛔' }[status] || '·';
      return {
        title: `${badge} ${code || 'New credit'} · Ksh ${Number(amount || 0).toLocaleString('en-KE')}`,
        subtitle: [name, phone].filter(Boolean).join(' · '),
      };
    },
  },

  orderings: [{ title: 'Newest', name: 'createdDesc', by: [{ field: 'createdAt', direction: 'desc' }] }],
});
