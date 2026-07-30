import { defineType, defineField } from 'sanity';
import { UsersIcon } from '@sanity/icons';

/**
 * One person signing up for one training. Created by /api/registrations with
 * status "pending", then advanced to "paid" by the payment callbacks.
 *
 * Everything is read-only in the Studio: this is a transactional record, and
 * editing it by hand would desynchronise it from the payment providers. The
 * Studio is here so admins can *see* the roster, not rewrite it.
 */
export const trainingRegistration = defineType({
  name: 'trainingRegistration',
  title: 'Training registration',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'reference',
      title: 'Reference',
      type: 'string',
      readOnly: true,
      description: 'Also the M-Pesa account number the attendee pays with.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          { title: 'Pending payment', value: 'pending' },
          { title: 'Paid', value: 'paid' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'track',
      title: 'Track',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          { title: 'AI Productivity Training (individual)', value: 'individual' },
          { title: 'Women Biz360 Hub masterclass', value: 'wbh-masterclass' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cohortId',
      title: 'Cohort',
      type: 'string',
      readOnly: true,
      description: 'e.g. 2026-09. Empty for the Women Biz360 masterclass.',
    }),
    defineField({
      name: 'cohortLabel',
      title: 'Cohort dates',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'startDate',
      title: 'Training starts',
      type: 'date',
      readOnly: true,
      description: 'Day one. Drives the automated reminder schedule.',
    }),

    // --- Person -----------------------------------------------------------
    defineField({ name: 'firstName', title: 'First name', type: 'string', readOnly: true }),
    defineField({ name: 'lastName', title: 'Last name', type: 'string', readOnly: true }),
    defineField({ name: 'email', title: 'Email', type: 'string', readOnly: true }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      readOnly: true,
      description: 'Normalised to 2547XXXXXXXX for M-Pesa.',
    }),
    defineField({ name: 'organization', title: 'Organisation', type: 'string', readOnly: true }),
    defineField({ name: 'jobTitle', title: 'Job title', type: 'string', readOnly: true }),
    defineField({ name: 'city', title: 'City', type: 'string', readOnly: true }),
    defineField({ name: 'industry', title: 'Industry', type: 'string', readOnly: true }),

    // --- Attendance -------------------------------------------------------
    defineField({
      name: 'attendance',
      title: 'Attendance',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          { title: 'In person (Nairobi)', value: 'in-person' },
          { title: 'Online (Zoom)', value: 'online' },
        ],
      },
    }),

    // --- Profiling answers ------------------------------------------------
    defineField({ name: 'aiExperience', title: 'AI experience', type: 'string', readOnly: true }),
    defineField({
      name: 'aiTools',
      title: 'AI tools used before',
      type: 'array',
      of: [{ type: 'string' }],
      readOnly: true,
    }),
    defineField({
      name: 'timeConsumingTasks',
      title: 'Tasks that take most time',
      type: 'array',
      of: [{ type: 'string' }],
      readOnly: true,
    }),
    defineField({ name: 'biggestChallenge', title: 'Biggest business challenge', type: 'text', rows: 3, readOnly: true }),
    defineField({ name: 'goal', title: 'What would make this valuable', type: 'text', rows: 3, readOnly: true }),
    defineField({
      name: 'liveChallenge',
      title: 'Real task to solve live',
      type: 'text',
      rows: 3,
      readOnly: true,
      description: 'The one business task they want worked on during the session.',
    }),
    defineField({
      name: 'topicPriorities',
      title: 'Modules they most want',
      type: 'array',
      of: [{ type: 'string' }],
      readOnly: true,
      description: 'Drives which modules get the most floor time on the day.',
    }),
    defineField({ name: 'dietary', title: 'Dietary / accessibility needs', type: 'string', readOnly: true }),
    defineField({
      name: 'deviceReady',
      title: 'Bringing a laptop',
      type: 'boolean',
      readOnly: true,
    }),
    defineField({ name: 'referralSource', title: 'How they heard about us', type: 'string', readOnly: true }),

    // --- Consent ----------------------------------------------------------
    defineField({
      name: 'consent',
      title: 'Data consent given',
      type: 'boolean',
      readOnly: true,
      description: 'Required. Kenya Data Protection Act basis for follow-up.',
    }),
    defineField({
      name: 'whatsappOptIn',
      title: 'WhatsApp updates opt-in',
      type: 'boolean',
      readOnly: true,
    }),

    // --- Money ------------------------------------------------------------
    defineField({ name: 'amount', title: 'Amount (KES)', type: 'number', readOnly: true }),
    defineField({
      name: 'paymentMethod',
      title: 'Paid with',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          { title: 'M-Pesa (STK push)', value: 'mpesa-stk' },
          { title: 'M-Pesa (paybill / C2B)', value: 'mpesa-c2b' },
          { title: 'Card (Paystack)', value: 'card' },
          { title: 'Recorded manually', value: 'manual' },
        ],
      },
    }),
    defineField({ name: 'paymentReceipt', title: 'Receipt / transaction id', type: 'string', readOnly: true }),
    defineField({ name: 'paidAt', title: 'Paid at', type: 'datetime', readOnly: true }),

    // --- Settlement to the Cloudwise bank account -------------------------
    defineField({
      name: 'settlementState',
      title: 'Settlement to bank',
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
    defineField({ name: 'settlementRef', title: 'Settlement reference', type: 'string', readOnly: true }),

    // --- Lifecycle bookkeeping -------------------------------------------
    defineField({
      name: 'emailsSent',
      title: 'Emails sent',
      type: 'array',
      of: [{ type: 'string' }],
      readOnly: true,
      description:
        'Keys of lifecycle emails already delivered. Guards against duplicates when a webhook is re-delivered.',
    }),
    defineField({ name: 'createdAt', title: 'Registered at', type: 'datetime', readOnly: true }),
    defineField({
      name: 'notes',
      title: 'Admin notes',
      type: 'text',
      rows: 3,
      description: 'The one field you may edit — for anything the system does not capture.',
    }),
  ],

  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      status: 'status',
      cohortLabel: 'cohortLabel',
      track: 'track',
      reference: 'reference',
    },
    prepare({ firstName, lastName, status, cohortLabel, track, reference }) {
      const badge = { paid: '✅', pending: '🟡', cancelled: '⛔' }[status] || '·';
      const where = cohortLabel || (track === 'wbh-masterclass' ? 'Masterclass · 27 Aug 2026' : '');
      return {
        title: `${badge} ${[firstName, lastName].filter(Boolean).join(' ') || reference}`,
        subtitle: [reference, where].filter(Boolean).join(' · '),
      };
    },
  },

  orderings: [
    { title: 'Newest', name: 'createdDesc', by: [{ field: 'createdAt', direction: 'desc' }] },
    { title: 'Name', name: 'nameAsc', by: [{ field: 'firstName', direction: 'asc' }] },
  ],
});
