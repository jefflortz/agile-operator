import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'playbookContent',
  title: 'Playbook Content',
  type: 'document',
  fields: [
    defineField({
      name: 'contentType',
      title: 'Content Type',
      type: 'string',
      options: {
        list: [
          { title: 'Article', value: 'article' },
          { title: 'Podcast Episode', value: 'episode' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
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
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Card preview text. 320–560 characters for consistent card sizing.',
      validation: (Rule) => Rule.required()
        .min(320).error('Excerpt must be at least 320 characters.')
        .max(560).error('Excerpt must be 560 characters or fewer.'),
    }),

    // --- Article fields ---
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
            defineField({ name: 'caption', title: 'Caption', type: 'string' }),
          ],
        },
      ],
      hidden: ({ document }) => document?.contentType !== 'article',
    }),

    // --- Episode fields ---
    defineField({
      name: 'guestName',
      title: 'Guest Name',
      type: 'string',
      hidden: ({ document }) => document?.contentType !== 'episode',
    }),
    defineField({
      name: 'guestTitle',
      title: 'Guest Title',
      type: 'string',
      hidden: ({ document }) => document?.contentType !== 'episode',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      hidden: ({ document }) => document?.contentType !== 'episode',
    }),
    defineField({
      name: 'spotifyUrl',
      title: 'Spotify URL',
      type: 'url',
      hidden: ({ document }) => document?.contentType !== 'episode',
    }),
    defineField({
      name: 'applePodcastUrl',
      title: 'Apple Podcasts URL',
      type: 'url',
      hidden: ({ document }) => document?.contentType !== 'episode',
    }),
    defineField({
      name: 'showNotes',
      title: 'Show Notes',
      type: 'array',
      of: [{ type: 'block' }],
      hidden: ({ document }) => document?.contentType !== 'episode',
    }),
    defineField({
      name: 'podcastUrl',
      title: 'Podcast Audio URL',
      type: 'url',
      description: 'Direct MP3/audio file URL from podcast host.',
      hidden: ({ document }) => document?.contentType !== 'episode',
    }),
    defineField({
      name: 'podcastDuration',
      title: 'Episode Duration',
      type: 'string',
      description: 'e.g. 42:30',
      hidden: ({ document }) => document?.contentType !== 'episode',
    }),

    // --- SEO ---
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
      group: 'seo',
    }),
  ],
  groups: [
    { name: 'seo', title: 'SEO' },
  ],
  preview: {
    select: {
      title: 'title',
      contentType: 'contentType',
      media: 'featuredImage',
      guest: 'guestName',
    },
    prepare({ title, contentType, media, guest }) {
      const subtitle = contentType === 'episode' && guest
        ? `Episode · ${guest}`
        : 'Article'
      return { title, subtitle, media }
    },
  },
})
