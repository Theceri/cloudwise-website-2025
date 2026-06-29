import { defineType, defineField } from 'sanity';
import { CogIcon } from '@sanity/icons';

/**
 * Singleton settings for the blog. Provides fallbacks for titles,
 * descriptions and social share images.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Blog Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'blogTitle',
      title: 'Blog title',
      type: 'string',
      initialValue: 'Cloudwise Blog',
    }),
    defineField({
      name: 'blogDescription',
      title: 'Blog description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'ogImage',
      title: 'Default social share image',
      type: 'image',
      description: 'Used when a post has no cover or share image (1200×630).',
      options: { hotspot: true },
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Blog Settings' };
    },
  },
});
