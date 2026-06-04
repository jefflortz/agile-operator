import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'collectiveEdge',
  title: 'Collective Edge',
  type: 'document',
  fields: [
    defineField({
      name: 'cohortStatus',
      title: 'Cohort Status',
      type: 'string',
      options: {
        list: [
          { title: 'Forming (applications open)', value: 'forming' },
          { title: 'Active (cohort underway)', value: 'active' },
          { title: 'Closed (not accepting applications)', value: 'closed' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'cohortLabel',
      title: 'Cohort Label',
      type: 'string',
      description: 'Shown publicly — e.g. "Founding cohort forming Summer 2026"',
    }),
    defineField({
      name: 'seatsTotal',
      title: 'Total Seats',
      type: 'number',
    }),
    defineField({
      name: 'seatsRemaining',
      title: 'Seats Remaining',
      type: 'number',
    }),
    defineField({
      name: 'applicationOpen',
      title: 'Application Open',
      type: 'boolean',
      description: 'Controls whether the Apply form is visible on the page',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Collective Edge Settings' }
    },
  },
})
