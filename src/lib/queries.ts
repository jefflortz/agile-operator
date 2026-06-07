import { client } from './sanity'
import type { PlaybookContentPreview, PlaybookContent, Service, MarginsAndMandates } from './types'

// Shared projection for card previews
const previewProjection = `
  _id,
  contentType,
  title,
  "slug": slug.current,
  publishedAt,
  featuredImage,
  excerpt,
  guestName,
  guestTitle,
  youtubeUrl,
  spotifyUrl,
  "categories": categories[]->{title, "slug": slug.current}
`

// Latest mixed content (articles + episodes) for homepage
export async function getLatestContent(limit = 5): Promise<PlaybookContentPreview[]> {
  return client.fetch(
    `*[_type == "playbookContent"] | order(publishedAt desc) [0...$limit] {
      ${previewProjection}
    }`,
    { limit }
  )
}

// Articles only
export async function getLatestArticles(limit = 6): Promise<PlaybookContentPreview[]> {
  return client.fetch(
    `*[_type == "playbookContent" && contentType == "article"] | order(publishedAt desc) [0...$limit] {
      ${previewProjection}
    }`,
    { limit }
  )
}

// Episodes only
export async function getLatestEpisodes(limit = 5): Promise<PlaybookContentPreview[]> {
  return client.fetch(
    `*[_type == "playbookContent" && contentType == "episode"] | order(publishedAt desc) [0...$limit] {
      ${previewProjection}
    }`,
    { limit }
  )
}

// All content for playbooks index (paginated)
export async function getAllContent(
  contentType?: 'article' | 'episode',
  categorySlug?: string,
  page = 1,
  perPage = 12
): Promise<{ items: PlaybookContentPreview[]; total: number }> {
  const filters = [
    `_type == "playbookContent"`,
    contentType ? `contentType == "${contentType}"` : null,
    categorySlug ? `"${categorySlug}" in categories[]->slug.current` : null,
  ].filter(Boolean).join(' && ')

  const start = (page - 1) * perPage
  const end = start + perPage - 1

  const [items, total] = await Promise.all([
    client.fetch(
      `*[${filters}] | order(publishedAt desc) [${start}...${end}] { ${previewProjection} }`
    ),
    client.fetch(`count(*[${filters}])`),
  ])

  return { items, total }
}

// Lightweight metadata fetch for generateMetadata (avoids fetching full body twice)
export async function getContentMetadata(slug: string): Promise<{
  title: string
  excerpt?: string
  publishedAt?: string
  featuredImage?: { asset: { _ref: string }; alt?: string }
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
    canonicalUrl?: string
    openGraph?: { title?: string; description?: string; image?: string }
  }
} | null> {
  return client.fetch(
    `*[_type == "playbookContent" && slug.current == $slug][0] {
      title, excerpt, publishedAt, featuredImage, seo
    }`,
    { slug }
  )
}

// All slugs for sitemap
export async function getAllSlugs(): Promise<string[]> {
  const docs = await client.fetch(
    `*[_type == "playbookContent" && defined(slug.current)] { "slug": slug.current }`
  )
  return docs.map((d: { slug: string }) => d.slug)
}

// Single content item by slug
export async function getContentBySlug(slug: string): Promise<PlaybookContent | null> {
  return client.fetch(
    `*[_type == "playbookContent" && slug.current == $slug][0] {
      ...,
      "slug": slug.current,
      "categories": categories[]->{_id, title, "slug": slug.current},
      "author": author->{_id, name, title, bio, photo}
    }`,
    { slug }
  )
}

// Categories that have at least one article, with counts
export async function getActiveCategories(): Promise<{ title: string; slug: string; total: number }[]> {
  return client.fetch(
    `*[_type == "category" && count(*[_type == "playbookContent" && references(^._id)]) > 0] {
      title,
      "slug": slug.current,
      "total": count(*[_type == "playbookContent" && references(^._id)])
    } | order(total desc)`
  )
}

// Related content — matched on primary category, excluding current slug
export async function getRelatedContent(
  categoryIds: string[],
  excludeSlug: string,
  limit = 3
): Promise<PlaybookContentPreview[]> {
  if (!categoryIds.length) return []
  const firstCategoryId = categoryIds[0]
  return client.fetch(
    `*[_type == "playbookContent" && slug.current != $excludeSlug && references($firstCategoryId)] | order(publishedAt desc) [0...${limit}] {
      ${previewProjection}
    }`,
    { firstCategoryId, excludeSlug }
  )
}

// Margins & Mandates singleton
export async function getMarginsAndMandates(): Promise<MarginsAndMandates | null> {
  return client.fetch(
    `*[_type == "marginsAndMandates"][0] {
      tagline,
      description,
      coverImage,
      spotifyUrl,
      youtubeChannelUrl,
      applePodcastUrl,
      rssUrl,
      "featuredEpisodes": featuredEpisodes[]->{
        ${previewProjection}
      }
    }`
  )
}

// Services (ordered)
export async function getServices(): Promise<Service[]> {
  return client.fetch(
    `*[_type == "service"] | order(order asc) {
      _id, title, headline, description, outcomes, order
    }`
  )
}
