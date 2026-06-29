import { defineType, defineField } from 'sanity';
import { CommentIcon } from '@sanity/icons';

/**
 * Reader comments. Created via the public API route with approved=false,
 * then moderated (approved) in the Studio "Comments" desk.
 */
export const comment = defineType({
  name: 'comment',
  title: 'Comment',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      description: 'Only approved comments are shown on the site.',
      initialValue: false,
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      readOnly: true,
      description: 'Not shown publicly.',
    }),
    defineField({
      name: 'comment',
      title: 'Comment',
      type: 'text',
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'post',
      title: 'Post',
      type: 'reference',
      to: [{ type: 'post' }],
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'parent',
      title: 'Reply to',
      type: 'reference',
      to: [{ type: 'comment' }],
      readOnly: true,
      description: 'Set when this comment is a reply to another comment.',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created at',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      name: 'name',
      comment: 'comment',
      approved: 'approved',
      post: 'post.title',
    },
    prepare({ name, comment, approved, post }) {
      return {
        title: `${approved ? '✅' : '🟡'} ${name}`,
        subtitle: `${post ? `on "${post}" — ` : ''}${comment}`,
      };
    },
  },
  orderings: [
    {
      title: 'Newest',
      name: 'createdDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
  ],
});
