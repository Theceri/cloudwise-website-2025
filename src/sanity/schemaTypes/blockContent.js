import { defineType, defineArrayMember } from 'sanity';
import { ImageIcon, CodeBlockIcon, PlayIcon, InfoOutlineIcon } from '@sanity/icons';

/**
 * Rich text ("Portable Text") used for post bodies and author bios.
 * Includes images, code blocks, callouts and YouTube embeds.
 */
export const blockContent = defineType({
  title: 'Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Heading 2', value: 'h2' },
        { title: 'Heading 3', value: 'h3' },
        { title: 'Heading 4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Code', value: 'code' },
          { title: 'Strike', value: 'strike-through' },
        ],
        annotations: [
          {
            title: 'Link',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
                validation: (Rule) =>
                  Rule.uri({
                    scheme: ['http', 'https', 'mailto', 'tel'],
                  }),
              },
              {
                title: 'Open in new tab',
                name: 'blank',
                type: 'boolean',
                initialValue: true,
              },
            ],
          },
        ],
      },
    }),

    // Inline image with required alt text + optional caption.
    defineArrayMember({
      type: 'image',
      icon: ImageIcon,
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          description: 'Important for SEO and accessibility.',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
      ],
    }),

    // Code block with language selection.
    defineArrayMember({
      type: 'object',
      name: 'codeBlock',
      title: 'Code block',
      icon: CodeBlockIcon,
      fields: [
        {
          name: 'language',
          title: 'Language',
          type: 'string',
          options: {
            list: [
              'bash', 'javascript', 'typescript', 'jsx', 'tsx', 'json',
              'html', 'css', 'python', 'sql', 'yaml', 'php', 'text',
            ],
          },
          initialValue: 'text',
        },
        {
          name: 'filename',
          title: 'Filename (optional)',
          type: 'string',
        },
        {
          name: 'code',
          title: 'Code',
          type: 'text',
          rows: 8,
          validation: (Rule) => Rule.required(),
        },
      ],
      preview: {
        select: { language: 'language', filename: 'filename' },
        prepare({ language, filename }) {
          return { title: filename || 'Code block', subtitle: language };
        },
      },
    }),

    // Highlighted callout / note.
    defineArrayMember({
      type: 'object',
      name: 'callout',
      title: 'Callout',
      icon: InfoOutlineIcon,
      fields: [
        {
          name: 'tone',
          title: 'Tone',
          type: 'string',
          options: {
            list: [
              { title: 'Info', value: 'info' },
              { title: 'Tip', value: 'tip' },
              { title: 'Warning', value: 'warning' },
            ],
            layout: 'radio',
          },
          initialValue: 'info',
        },
        {
          name: 'text',
          title: 'Text',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.required(),
        },
      ],
      preview: {
        select: { text: 'text', tone: 'tone' },
        prepare({ text, tone }) {
          return { title: text, subtitle: `Callout · ${tone}` };
        },
      },
    }),

    // YouTube embed by URL.
    defineArrayMember({
      type: 'object',
      name: 'youtube',
      title: 'YouTube',
      icon: PlayIcon,
      fields: [
        {
          name: 'url',
          title: 'YouTube URL',
          type: 'url',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'caption',
          title: 'Caption',
          type: 'string',
        },
      ],
      preview: {
        select: { url: 'url' },
        prepare({ url }) {
          return { title: 'YouTube embed', subtitle: url };
        },
      },
    }),
  ],
});
