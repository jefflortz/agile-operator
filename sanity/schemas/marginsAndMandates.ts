import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'marginsAndMandates',
  title: 'Margins & Mandates',
  type: 'document',
  fields: [
    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image / Show Art',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({ name: 'spotifyUrl', title: 'Spotify URL', type: 'url' }),
    defineField({ name: 'youtubeChannelUrl', title: 'YouTube Channel URL', type: 'url' }),
    defineField({ name: 'applePodcastUrl', title: 'Apple Podcasts URL', type: 'url' }),
    defineField({ name: 'rssUrl', title: 'RSS Feed URL', type: 'url' }),
    defineField({
      name: 'featuredEpisodes',
      title: 'Featured Episodes',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'playbookContent' }] }],
      description: 'Episodes to feature on the landing page (3–4 recommended)',
      validation: (Rule) => Rule.max(4),
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Margins & Mandates Settings' }
    },
  },
})
