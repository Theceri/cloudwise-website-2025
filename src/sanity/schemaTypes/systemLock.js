import { defineType, defineField } from 'sanity';
import { LockIcon } from '@sanity/icons';

/**
 * A one-shot claim marker.
 *
 * Creating a document with an explicit `_id` fails if that id already exists,
 * which gives us an atomic "did I win this race?" primitive without a database.
 * We use it so a re-delivered payment webhook, or two cron runs overlapping,
 * cannot send the same email twice.
 *
 * Not listed in the Studio desk — these are machine records.
 */
export const systemLock = defineType({
  name: 'systemLock',
  title: 'System lock',
  type: 'document',
  icon: LockIcon,
  fields: [
    defineField({ name: 'key', title: 'Key', type: 'string', readOnly: true }),
    defineField({ name: 'createdAt', title: 'Claimed at', type: 'datetime', readOnly: true }),
  ],
  preview: {
    select: { key: 'key', createdAt: 'createdAt' },
    prepare: ({ key, createdAt }) => ({ title: key, subtitle: createdAt }),
  },
});
