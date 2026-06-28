import { defineType, defineField } from 'sanity';
import { TagIcon } from '@sanity/icons';

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Shown on the category page and used for SEO.',
    }),
    defineField({
      name: 'color',
      title: 'Accent color',
      type: 'string',
      description: 'Optional HEX (e.g. #FF3F1A) used as the category accent.',
      validation: (Rule) =>
        Rule.regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
          name: 'hex color',
          invert: false,
        }).warning('Use a HEX color like #FF3F1A'),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'description' },
  },
});
