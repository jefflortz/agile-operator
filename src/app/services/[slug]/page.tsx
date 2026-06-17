import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PortableText } from '@portabletext/react'
import { getServicePillarPage, getServicePillarSlugs, getRelatedContent } from '@/lib/queries'
import type { ServicePillarPage, PlaybookContentPreview } from '@/lib/types'
import { Container } from '@/components/ui/Container'
import { FadeIn, FadeInStagger } from '@/components/ui/FadeIn'
import { GridPattern } from '@/components/ui/GridPattern'
import { Border } from '@/components/ui/Border'
import Button from '@/components/ui/Button'

// ── Static params for build-time generation ──────────────────────────────────
export async function generateStaticParams() {
  const slugs = await getServicePillarSlugs()
  return slugs.map((slug) => ({ slug }))
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const page = await getServicePillarPage(slug)
  if (!page) return {}

  const seoTitle = page.seo?.title ?? `${page.serviceName} | Agile Operator`
  const seoDesc = page.seo?.description ?? page.heroSubhead ?? ''

  return {
    title: seoTitle,
    description: seoDesc,
    keywords: page.seo?.keywords,
    alternates: { canonical: page.seo?.canonicalUrl ?? `/services/${slug}` },
    openGraph: {
      title: page.seo?.openGraph?.title ?? seoTitle,
      description: page.seo?.openGraph?.description ?? seoDesc,
      url: `/services/${slug}`,
    },
  }
}

// ── JSON-LD ───────────────────────────────────────────────────────────────────
function ServiceJsonLd({ page }: { page: ServicePillarPage }) {
  const baseUrl = 'https://www.agile-operator.com'
  const pageUrl = `${baseUrl}/services/${page.slug}`

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Service',
      '@id': `${pageUrl}#service`,
      name: page.serviceName,
      description: page.seo?.description ?? page.heroSubhead ?? '',
      url: pageUrl,
      provider: {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'Agile Operator',
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
        { '@type': 'ListItem', position: 2, name: 'Services', item: `${baseUrl}/services` },
        { '@type': 'ListItem', position: 3, name: page.serviceName, item: pageUrl },
      ],
    },
  ]

  if (page.faq && page.faq.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: page.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          // Flatten portable text blocks to plain text for schema
          text: (item.answer as Array<{ children?: Array<{ text?: string }> }>)
            .map((block) =>
              block.children?.map((child) => child.text ?? '').join('') ?? ''
            )
            .join(' '),
        },
      })),
    })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
      }}
    />
  )
}

// ── Portable text components ──────────────────────────────────────────────────
const introComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mt-5 text-lg text-gray-600 leading-relaxed">{children}</p>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mt-8 font-display text-xl font-medium text-navy-900">{children}</h3>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-navy-900">{children}</strong>
    ),
  },
}

const faqComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-base text-gray-600 leading-relaxed mt-2 first:mt-0">{children}</p>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-navy-900">{children}</strong>
    ),
  },
}

// ── Playbook card ─────────────────────────────────────────────────────────────
function PlaybookCard({ item }: { item: PlaybookContentPreview }) {
  const slug = typeof item.slug === 'string' ? item.slug : item.slug?.current
  return (
    <article className="flex flex-col">
      <Border className="pt-8 flex-1 flex flex-col">
        <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-3">
          {item.contentType === 'episode' ? 'Podcast Episode' : 'Article'}
        </p>
        <h3 className="font-display text-lg font-medium text-navy-900 leading-snug">
          <a href={`/playbooks/${slug}`} className="hover:text-gold-500 transition-colors">
            {item.title}
          </a>
        </h3>
        {item.excerpt && (
          <p className="mt-3 text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">
            {item.excerpt}
          </p>
        )}
        <a
          href={`/playbooks/${slug}`}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-gold-500 transition-colors"
        >
          Read more
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </Border>
    </article>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function ServicePillarPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = await getServicePillarPage(slug)
  if (!page) notFound()

  // Pull up to 3 related playbook articles if a category is linked
  let relatedItems: PlaybookContentPreview[] = []
  if (page.relatedCategory) {
    relatedItems = await getRelatedContent([page.relatedCategory._id], '', 3)
  }

  return (
    <>
      <ServiceJsonLd page={page} />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="relative isolate overflow-hidden pt-14">
        <GridPattern
          className="absolute inset-x-0 -top-14 -z-10 h-[800px] w-full mask-[linear-gradient(to_bottom_left,white_40%,transparent_50%)] fill-navy-50 stroke-navy-900/5"
          yOffset={-96}
          interactive
        />
        <Container className="pb-20 pt-20 sm:pb-28 sm:pt-32 md:pt-40">
          <FadeIn className="max-w-3xl">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-gray-400">
                <li><a href="/" className="hover:text-navy-900 transition-colors">Home</a></li>
                <li aria-hidden="true">/</li>
                <li><a href="/services" className="hover:text-navy-900 transition-colors">Services</a></li>
                <li aria-hidden="true">/</li>
                <li className="text-navy-700 font-medium">{page.serviceName}</li>
              </ol>
            </nav>

            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
              {page.serviceName}
            </p>
            <h1 className="font-display text-5xl font-medium tracking-tight text-balance text-navy-900 sm:text-6xl">
              {page.heroHeadline}
            </h1>
            {page.heroSubhead && (
              <p className="mt-6 text-xl text-gray-600 max-w-2xl leading-relaxed">
                {page.heroSubhead}
              </p>
            )}
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/contact" size="lg">Book a Strategy Session</Button>
              <Button href="/services" size="lg" variant="outline">View All Services</Button>
            </div>
          </FadeIn>
        </Container>
      </div>

      {/* ── Intro ──────────────────────────────────────────────────────────── */}
      {page.introBody && page.introBody.length > 0 && (
        <div className="bg-white py-20 sm:py-28">
          <Container>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
              <FadeIn>
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
                  About This Service
                </p>
                <h2 className="font-display text-3xl font-medium tracking-tight text-navy-900 sm:text-4xl text-balance">
                  {page.introHeadline ?? `What is ${page.serviceName}?`}
                </h2>
              </FadeIn>
              <FadeIn>
                <PortableText
                  value={page.introBody as Parameters<typeof PortableText>[0]['value']}
                  components={introComponents}
                />
              </FadeIn>
            </div>
          </Container>
        </div>
      )}

      {/* ── Benefits ───────────────────────────────────────────────────────── */}
      {page.benefits && page.benefits.length > 0 && (
        <div className="bg-navy-50 py-20 sm:py-28">
          <Container>
            <FadeIn>
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
                Outcomes
              </p>
              <h2 className="font-display text-3xl font-medium tracking-tight text-navy-900 sm:text-4xl text-balance max-w-2xl">
                {page.benefitsHeadline ?? 'What You Walk Away With'}
              </h2>
            </FadeIn>
            <FadeInStagger className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {page.benefits.map((benefit) => (
                <FadeIn key={benefit._key}>
                  <Border className="pt-8 h-full">
                    <h3 className="font-display text-lg font-medium text-navy-900">
                      {benefit.title}
                    </h3>
                    <p className="mt-3 text-base text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </Border>
                </FadeIn>
              ))}
            </FadeInStagger>
          </Container>
        </div>
      )}

      {/* ── Process ────────────────────────────────────────────────────────── */}
      {page.processSteps && page.processSteps.length > 0 && (
        <div className="bg-white py-20 sm:py-28">
          <Container>
            <FadeIn className="max-w-2xl">
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
                Our Approach
              </p>
              <h2 className="font-display text-3xl font-medium tracking-tight text-navy-900 sm:text-4xl text-balance">
                {page.processHeadline ?? 'How It Works'}
              </h2>
            </FadeIn>
            <FadeInStagger className="mt-14 space-y-10">
              {page.processSteps.map((step, index) => (
                <FadeIn key={step._key}>
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-[4rem_1fr] lg:items-start">
                    <p
                      className="font-display text-5xl font-medium text-navy-900 opacity-[0.08] leading-none select-none"
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <div>
                      <h3 className="font-display text-xl font-medium text-navy-900">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-base text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </FadeInStagger>
          </Container>
        </div>
      )}

      {/* ── Related Playbooks ──────────────────────────────────────────────── */}
      {relatedItems.length > 0 && (
        <div className="bg-navy-50 py-20 sm:py-28">
          <Container>
            <FadeIn>
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
                From the Playbook
              </p>
              <h2 className="font-display text-3xl font-medium tracking-tight text-navy-900 sm:text-4xl text-balance max-w-2xl">
                Insights on {page.serviceName}
              </h2>
            </FadeIn>
            <FadeInStagger className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedItems.map((item) => (
                <FadeIn key={item._id}>
                  <PlaybookCard item={item} />
                </FadeIn>
              ))}
            </FadeInStagger>
            <FadeIn className="mt-10">
              <Button href="/playbooks" variant="outline">Browse All Playbook Content</Button>
            </FadeIn>
          </Container>
        </div>
      )}

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      {page.faq && page.faq.length > 0 && (
        <div className="bg-white py-20 sm:py-28">
          <Container>
            <FadeIn className="max-w-2xl">
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
                FAQ
              </p>
              <h2 className="font-display text-3xl font-medium tracking-tight text-navy-900 sm:text-4xl text-balance">
                {page.faqHeadline ?? 'Common Questions'}
              </h2>
            </FadeIn>
            <FadeInStagger className="mt-14 space-y-0 divide-y divide-navy-100">
              {page.faq.map((item) => (
                <FadeIn key={item._key} className="py-8">
                  <h3 className="font-display text-lg font-medium text-navy-900">
                    {item.question}
                  </h3>
                  <div className="mt-4">
                    <PortableText
                      value={item.answer as Parameters<typeof PortableText>[0]['value']}
                      components={faqComponents}
                    />
                  </div>
                </FadeIn>
              ))}
            </FadeInStagger>
          </Container>
        </div>
      )}

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <div className="bg-navy-900 py-24 sm:py-32">
        <Container>
          <FadeIn>
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-400 mb-4">
              Let&apos;s talk
            </p>
            <h2 className="font-display text-4xl font-medium tracking-tight text-white sm:text-5xl max-w-2xl text-balance">
              {page.ctaHeadline ?? 'Ready to get started?'}
            </h2>
            {page.ctaBody && (
              <p className="mt-6 text-lg text-navy-200 max-w-xl">{page.ctaBody}</p>
            )}
            <div className="mt-8">
              <Button
                href="/contact"
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 hover:text-white"
              >
                {page.ctaButtonLabel ?? 'Book a Strategy Session'}
              </Button>
            </div>
          </FadeIn>
        </Container>
      </div>
    </>
  )
}
