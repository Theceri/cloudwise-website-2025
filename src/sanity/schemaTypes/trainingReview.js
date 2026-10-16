import { defineType, defineField } from 'sanity';
import { StarIcon } from '@sanity/icons';

/**
 * A named review of the training, shown at /ai-training/reviews.
 *
 * The page appears only once three or more reviews are published with
 * permission. Add a review only with the person's written consent to use their
 * name, role and words (tiered plan rev5, §3). No star ratings are published,
 * here or in search data.
 */
export const trainingReview = defineType({
  name: 'trainingReview',
  title: 'Training review',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'role', title: 'Role', type: 'string', description: 'For example "Founder, salon owner".', validation: (Rule) => Rule.required() }),
    defineField({ name: 'organization', title: 'Organisation (optional)', type: 'string' }),
    defineField({
      name: 'track',
      title: 'Course taken',
      type: 'string',
      options: {
        list: [
          { title: 'AI Kickstart', value: 'kickstart' },
          { title: 'AI Essentials', value: 'essentials' },
          { title: 'AI Productivity Programme', value: 'individual' },
          { title: 'Private one-to-one', value: 'private' },
          { title: 'Team training', value: 'team' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'month', title: 'When they took it', type: 'date', options: { dateFormat: 'MMMM YYYY' }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'quote', title: 'Their words', type: 'text', rows: 4, validation: (Rule) => Rule.required().max(600) }),
    defineField({
      name: 'permission',
      title: 'They agreed in writing to be named',
      type: 'boolean',
      initialValue: false,
      validation: (Rule) => Rule.required().custom((v) => (v === true ? true : 'Only publish a review with written permission.')),
    }),
    defineField({ name: 'published', title: 'Show on the website', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { name: 'name', role: 'role', published: 'published' },
    prepare({ name, role, published }) {
      return { title: `${published ? '⭐ ' : ''}${name || 'Review'}`, subtitle: role };
    },
  },
});
