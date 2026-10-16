import { defineType, defineField } from 'sanity';
import { DocumentTextIcon } from '@sanity/icons';

/**
 * A certificate, checkable by anyone at cloudwise.co.ke/verify/<code>.
 *
 * Issued by POST /api/certificates/issue after a class (src/lib/certificates.js):
 * a certificate of completion for the Programme, and of attendance for
 * Essentials. Kickstart has no certificate. The PDF itself is made outside the
 * site; its footer carries the code and the verification address.
 *
 * Read-only apart from revocation: a certificate given to someone who did not
 * attend is revoked here, and the verification page then says so.
 */
export const trainingCertificate = defineType({
  name: 'trainingCertificate',
  title: 'Training certificate',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({ name: 'code', title: 'Certificate code', type: 'string', readOnly: true }),
    defineField({ name: 'name', title: 'Awarded to', type: 'string', readOnly: true }),
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          { title: 'Certificate of completion', value: 'completion' },
          { title: 'Certificate of attendance', value: 'attendance' },
        ],
      },
    }),
    defineField({ name: 'track', title: 'Course id', type: 'string', readOnly: true }),
    defineField({ name: 'courseName', title: 'Course', type: 'string', readOnly: true }),
    defineField({ name: 'classDate', title: 'Completed on', type: 'date', readOnly: true }),
    defineField({ name: 'registrationRef', title: 'Booking reference', type: 'string', readOnly: true }),
    defineField({ name: 'issuedAt', title: 'Issued at', type: 'datetime', readOnly: true }),
    defineField({
      name: 'revoked',
      title: 'Revoked',
      type: 'boolean',
      initialValue: false,
      description: 'Tick to cancel a certificate issued in error. The verification page then shows it as revoked.',
    }),
    defineField({ name: 'revokedReason', title: 'Reason for revoking', type: 'string' }),
  ],
  preview: {
    select: { code: 'code', name: 'name', courseName: 'courseName', revoked: 'revoked' },
    prepare({ code, name, courseName, revoked }) {
      return { title: `${revoked ? '⛔ ' : '🎓 '}${name || 'Certificate'}`, subtitle: [code, courseName].filter(Boolean).join(' · ') };
    },
  },
  orderings: [{ title: 'Newest', name: 'issuedDesc', by: [{ field: 'issuedAt', direction: 'desc' }] }],
});
