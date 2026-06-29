import { defineType, defineField } from 'sanity';
import { UserIcon } from '@sanity/icons';

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / title',
      type: 'string',
      description: 'e.g. "Founder & AI Lead"',
    }),
    defineField({
      name: 'image',
      title: 'Profile image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Alt text' },
      ],
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'social',
      title: 'Social links',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: 'linkedin', title: 'LinkedIn URL', type: 'url' },
        { name: 'x', title: 'X / Twitter URL', type: 'url' },
        { name: 'website', title: 'Website URL', type: 'url' },
      ],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'image' },
  },
});
