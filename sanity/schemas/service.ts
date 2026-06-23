import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'outcomes',
      title: 'Outcomes',
      description: 'Up to 3 outcomes',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: '1 = first, 2 = second, 3 = third',
    }),
    defineField({
      name: 'pillarPage',
      title: 'Pillar Landing Page',
      type: 'reference',
      to: [{ type: 'servicePillarPage' }],
      description: 'Links the "Learn More" button on the services index to this service\'s dedicated landing page.',
    }),
  ],
  orderings: [
    { title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'headline' },
  },
})
