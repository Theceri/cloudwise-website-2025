import { defineType, defineField } from 'sanity';
import { UsersIcon } from '@sanity/icons';

import { TRACKS, TRACK_WBH, formatDay } from '@/lib/training';

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
          { title: 'AI Kickstart', value: 'kickstart' },
          { title: 'AI Essentials', value: 'essentials' },
          { title: 'AI Productivity Programme', value: 'individual' },
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
      description:
        'Cohort id (2026-11) for Essentials and the Programme; session id (ks-2026-10-28) for Kickstart. Empty for the Women Biz360 masterclass.',
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
          { title: 'Online (Google Meet)', value: 'online' },
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
    defineField({
      name: 'buyerType',
      title: 'Describes themselves as',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          { title: 'Runs a business', value: 'owner' },
          { title: 'Works for an organisation', value: 'employee' },
          { title: 'Registering colleagues', value: 'colleagues' },
          { title: 'Student or job seeker', value: 'student' },
        ],
      },
    }),
    defineField({ name: 'headcount', title: 'People registering', type: 'number', readOnly: true }),
    defineField({
      name: 'teamLead',
      title: 'Team lead',
      type: 'boolean',
      readOnly: true,
      description: 'Registering colleagues, or 3 or more people. Follow up the same day.',
    }),
    defineField({
      name: 'attendsDays',
      title: 'Attends',
      type: 'array',
      of: [{ type: 'string' }],
      readOnly: true,
      description: '"day-two" only when an Essentials credit paid for Day One.',
    }),

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
    defineField({ name: 'listPrice', title: 'List price (KES)', type: 'number', readOnly: true }),
    defineField({
      name: 'creditApplied',
      title: 'Credit applied',
      type: 'object',
      readOnly: true,
      fields: [
        defineField({ name: 'code', title: 'Credit code', type: 'string', readOnly: true }),
        defineField({ name: 'amountKes', title: 'Credit (KES)', type: 'number', readOnly: true }),
        defineField({ name: 'sourceReference', title: 'Earned on booking', type: 'string', readOnly: true }),
        defineField({ name: 'sourceReceipt', title: 'Earned with receipt', type: 'string', readOnly: true }),
      ],
    }),
    defineField({ name: 'amount', title: 'Amount due (KES)', type: 'number', readOnly: true }),
    defineField({
      name: 'receipts',
      title: 'All receipts',
      type: 'array',
      readOnly: true,
      description: 'Every confirmed payment on this booking, with its M-Pesa code or card reference.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'receipt', title: 'Receipt', type: 'string' }),
            defineField({ name: 'amount', title: 'Amount (KES)', type: 'number' }),
            defineField({ name: 'method', title: 'Method', type: 'string' }),
            defineField({ name: 'paidAt', title: 'Paid at', type: 'datetime' }),
          ],
          preview: { select: { title: 'receipt', subtitle: 'amount' } },
        },
      ],
    }),
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

    // --- Ad attribution ----------------------------------------------------
    defineField({
      name: 'metaAttribution',
      title: 'Meta ad attribution',
      type: 'object',
      readOnly: true,
      // Nothing here is for a human to read. It is collapsed so it does not
      // push the useful fields off the screen.
      options: { collapsible: true, collapsed: true },
      description:
        'Captured from the browser at registration and replayed with the Conversions API Purchase event, which fires from a webhook long after the browser has gone.',
      fields: [
        defineField({ name: 'fbp', title: 'Browser id (_fbp)', type: 'string', readOnly: true }),
        defineField({ name: 'fbc', title: 'Click id (_fbc)', type: 'string', readOnly: true }),
        defineField({ name: 'clientIp', title: 'Client IP', type: 'string', readOnly: true }),
        defineField({ name: 'userAgent', title: 'User agent', type: 'string', readOnly: true }),
        defineField({ name: 'eventSourceUrl', title: 'Page submitted from', type: 'string', readOnly: true }),
        defineField({ name: 'gaClientId', title: 'GA4 client id', type: 'string', readOnly: true }),
        defineField({ name: 'capturedAt', title: 'Captured at', type: 'datetime', readOnly: true }),
      ],
    }),
    defineField({ name: 'hubspotDealId', title: 'HubSpot deal id', type: 'string', readOnly: true }),
    defineField({
      name: 'certificateRequestedAt',
      title: 'Certificate requested',
      type: 'datetime',
      readOnly: true,
      description: 'Set by the "Issue certificate" button. The certificate itself is under Training → Certificates.',
    }),
    defineField({
      name: 'utm',
      title: 'Ad source (UTM)',
      type: 'object',
      readOnly: true,
      options: { collapsible: true, collapsed: true },
      description:
        'The tags on the link that first brought this person to the site, kept for 30 days in their browser and sent with the registration.',
      fields: [
        defineField({ name: 'utm_source', title: 'Source', type: 'string', readOnly: true }),
        defineField({ name: 'utm_medium', title: 'Medium', type: 'string', readOnly: true }),
        defineField({ name: 'utm_campaign', title: 'Campaign', type: 'string', readOnly: true }),
        defineField({ name: 'utm_content', title: 'Ad (content)', type: 'string', readOnly: true }),
        defineField({ name: 'utm_term', title: 'Term', type: 'string', readOnly: true }),
        defineField({ name: 'fbclid', title: 'Meta click id', type: 'string', readOnly: true }),
        defineField({ name: 'gclid', title: 'Google click id', type: 'string', readOnly: true }),
        defineField({ name: 'landingPage', title: 'Landing page', type: 'string', readOnly: true }),
        defineField({ name: 'capturedAt', title: 'First seen', type: 'datetime', readOnly: true }),
      ],
    }),
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
      const where =
        cohortLabel ||
        (track === TRACK_WBH
          ? `Masterclass · ${formatDay(TRACKS[TRACK_WBH].eventDate)}`
          : '');
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
