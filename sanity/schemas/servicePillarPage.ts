import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'servicePillarPage',
  title: 'Service Pillar Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'cta', title: 'CTA' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── Identity ──────────────────────────────────────────────────────────────
    defineField({
      name: 'serviceName',
      title: 'Service Name',
      type: 'string',
      group: 'content',
      description: 'Short label shown as the eyebrow tag (e.g. "Growth Advisory")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'serviceName', maxLength: 64 },
      description: 'Must match the Next.js route. e.g. "growth-advisory" → /services/growth-advisory',
      validation: (Rule) => Rule.required(),
    }),

    // ── Hero ──────────────────────────────────────────────────────────────────
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline (H1)',
      type: 'string',
      group: 'content',
      description: 'Main keyword-rich H1. ~60–80 chars.',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'heroSubhead',
      title: 'Hero Subhead',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Supporting sentence(s) beneath the H1. 1–2 sentences.',
    }),

    // ── Intro ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'introHeadline',
      title: 'Intro Section Headline',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'introBody',
      title: 'Intro Body',
      type: 'array',
      group: 'content',
      of: [{ type: 'block' }],
      description: '2–3 paragraphs describing the service in depth. Target 200–350 words.',
    }),

    // ── Benefits ──────────────────────────────────────────────────────────────
    defineField({
      name: 'benefitsHeadline',
      title: 'Benefits Section Headline',
      type: 'string',
      group: 'content',
      initialValue: 'What You Walk Away With',
    }),
    defineField({
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      group: 'content',
      description: '4–6 concrete outcomes. Each card = title + short description.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2, validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: 'title', subtitle: 'description' } },
        },
      ],
      validation: (Rule) => Rule.min(2).max(6),
    }),

    // ── Process ───────────────────────────────────────────────────────────────
    defineField({
      name: 'processHeadline',
      title: 'Process Section Headline',
      type: 'string',
      group: 'content',
      initialValue: 'How It Works',
    }),
    defineField({
      name: 'processSteps',
      title: 'Process Steps',
      type: 'array',
      group: 'content',
      description: '3–5 steps describing the engagement model.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Step Title', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3, validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: 'title', subtitle: 'description' } },
        },
      ],
      validation: (Rule) => Rule.min(2).max(6),
    }),

    // ── Related Playbooks ─────────────────────────────────────────────────────
    defineField({
      name: 'relatedCategory',
      title: 'Related Playbook Category',
      type: 'reference',
      to: [{ type: 'category' }],
      group: 'content',
      description: 'Articles from this category will appear in the "From the Playbook" section.',
    }),

    // ── FAQ ───────────────────────────────────────────────────────────────────
    defineField({
      name: 'faqHeadline',
      title: 'FAQ Section Headline',
      type: 'string',
      group: 'content',
      initialValue: 'Common Questions',
    }),
    defineField({
      name: 'faq',
      title: 'FAQ Items',
      type: 'array',
      group: 'content',
      description: '4–8 questions. Each item feeds Google FAQ rich results.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'question', title: 'Question', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'answer', title: 'Answer', type: 'array', of: [{ type: 'block' }], validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: 'question' } },
        },
      ],
      validation: (Rule) => Rule.min(2).max(10),
    }),

    // ── CTA ───────────────────────────────────────────────────────────────────
    defineField({
      name: 'ctaHeadline',
      title: 'CTA Headline',
      type: 'string',
      group: 'cta',
      initialValue: 'Ready to get started?',
    }),
    defineField({
      name: 'ctaBody',
      title: 'CTA Body Text',
      type: 'text',
      rows: 2,
      group: 'cta',
    }),
    defineField({
      name: 'ctaButtonLabel',
      title: 'CTA Button Label',
      type: 'string',
      group: 'cta',
      initialValue: 'Book a Strategy Session',
    }),

    // ── SEO ───────────────────────────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
      group: 'seo',
    }),
  ],

  preview: {
    select: { title: 'serviceName', subtitle: 'heroHeadline' },
    prepare({ title, subtitle }) {
      return { title: `Service: ${title}`, subtitle }
    },
  },
})
