import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import seoFields from 'sanity-plugin-seofields'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
  name: 'agile-operator',
  title: 'Agile Operator',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'r51dmz2x',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Playbook Content')
              .schemaType('playbookContent')
              .child(S.documentTypeList('playbookContent').title('Playbook Content')),
            S.divider(),
            S.listItem()
              .title('Authors')
              .schemaType('author')
              .child(S.documentTypeList('author').title('Authors')),
            S.listItem()
              .title('Categories')
              .schemaType('category')
              .child(S.documentTypeList('category').title('Categories')),
            S.divider(),
            S.listItem()
              .title('Services')
              .schemaType('service')
              .child(S.documentTypeList('service').title('Services')),
            S.divider(),
            // Singletons
            S.listItem()
              .title('Margins & Mandates')
              .id('marginsAndMandates')
              .child(
                S.document()
                  .schemaType('marginsAndMandates')
                  .documentId('marginsAndMandates')
              ),
            S.listItem()
              .title('Collective Edge')
              .id('collectiveEdge')
              .child(
                S.document()
                  .schemaType('collectiveEdge')
                  .documentId('collectiveEdge')
              ),
          ]),
    }),
    visionTool(),
    seoFields({
      seoPreview: true,
      healthDashboard: {
        licenseKey: process.env.SANITY_STUDIO_SEO_LICENSE_KEY ?? 'SEOF-40D0-BDFF-FDF5',
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
