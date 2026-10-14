import { defineType, defineField } from 'sanity';
import { UsersIcon } from '@sanity/icons';

/**
 * A request for team or private training, from /ai-training/teams.
 *
 * Read-only apart from the status and notes: it is what the buyer sent, and the
 * Studio is where someone picks it up and records what happened next.
 */
export const teamEnquiry = defineType({
  name: 'teamEnquiry',
  title: 'Team training enquiry',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'new',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Contacted', value: 'contacted' },
          { title: 'Proposal sent', value: 'proposal' },
          { title: 'Won', value: 'won' },
          { title: 'Lost', value: 'lost' },
        ],
      },
    }),
    defineField({ name: 'name', title: 'Name', type: 'string', readOnly: true }),
    defineField({ name: 'organization', title: 'Organisation', type: 'string', readOnly: true }),
    defineField({ name: 'role', title: 'Role', type: 'string', readOnly: true }),
    defineField({ name: 'email', title: 'Email', type: 'string', readOnly: true }),
    defineField({ name: 'phone', title: 'Phone', type: 'string', readOnly: true }),
    defineField({ name: 'teamSize', title: 'Team size', type: 'number', readOnly: true }),
    defineField({
      name: 'format',
      title: 'Format wanted',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          { title: 'Team programme (8 hours)', value: 'team-programme' },
          { title: 'Private one-to-one', value: 'private' },
          { title: 'Executive briefing', value: 'executive' },
          { title: 'Microsoft 365 and Copilot', value: 'copilot' },
          { title: 'Free demonstration', value: 'demo' },
          { title: 'Not sure yet', value: 'unsure' },
        ],
      },
    }),
    defineField({ name: 'preferredMonth', title: 'Preferred month', type: 'string', readOnly: true }),
    defineField({ name: 'message', title: 'Message', type: 'text', rows: 4, readOnly: true }),
    defineField({ name: 'utm', title: 'Ad source', type: 'string', readOnly: true }),
    defineField({ name: 'createdAt', title: 'Received at', type: 'datetime', readOnly: true }),
    defineField({ name: 'notes', title: 'Notes', type: 'text', rows: 4 }),
  ],
  preview: {
    select: { name: 'name', organization: 'organization', teamSize: 'teamSize', status: 'status' },
    prepare({ name, organization, teamSize, status }) {
      return {
        title: `${status === 'new' ? '🟡 ' : ''}${organization || name || 'Enquiry'}`,
        subtitle: [name, teamSize ? `${teamSize} people` : null].filter(Boolean).join(' · '),
      };
    },
  },
  orderings: [{ title: 'Newest', name: 'createdDesc', by: [{ field: 'createdAt', direction: 'desc' }] }],
});
