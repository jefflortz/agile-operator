import { client } from './sanity'
import type { PlaybookContentPreview, PlaybookContent, Service } from './types'

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

// Single content item by slug
export async function getContentBySlug(slug: string): Promise<PlaybookContent | null> {
  return client.fetch(
    `*[_type == "playbookContent" && slug.current == $slug][0] {
      ...,
      "slug": slug.current,
      "categories": categories[]->{_id, title, "slug": slug.current},
      "author": author->{_id, name, title, photo}
    }`,
    { slug }
  )
}

// Categories that have at least one article
export async function getActiveCategories(): Promise<{ title: string; slug: string }[]> {
  return client.fetch(
    `*[_type == "category" && count(*[_type == "playbookContent" && references(^._id)]) > 0] | order(title asc) {
      title,
      "slug": slug.current
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
