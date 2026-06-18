import { client } from '@/lib/sanity'
import { urlFor } from '@/lib/sanity'

const PUBLISHED = `!(_id in path("drafts.**"))`
const BASE_URL = 'https://www.agile-operator.com'

type Episode = {
  _id: string
  title: string
  slug: string
  publishedAt: string
  excerpt?: string
  guestName?: string
  guestTitle?: string
  podcastDuration?: string
  youtubeUrl?: string
  spotifyUrl?: string
  applePodcastUrl?: string
  featuredImage?: { asset: { _ref: string }; alt?: string }
}

async function getEpisodes(): Promise<Episode[]> {
  return client.fetch(
    `*[_type == "playbookContent" && ${PUBLISHED} && contentType == "episode"]
     | order(publishedAt desc) [0...100] {
       _id,
       title,
       "slug": slug.current,
       publishedAt,
       excerpt,
       guestName,
       guestTitle,
       podcastDuration,
       youtubeUrl,
       spotifyUrl,
       applePodcastUrl,
       featuredImage,
     }`
  )
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function rfcDate(dateStr: string): string {
  return new Date(dateStr).toUTCString()
}

// iTunes duration format: HH:MM:SS or MM:SS
// Sanity stores it as a human string like "42 min" — pass through as-is if valid,
// otherwise omit. Once you store proper HH:MM:SS values in Sanity this will be perfect.
function itunesDuration(raw?: string): string | null {
  if (!raw) return null
  // Already in HH:MM:SS or MM:SS format
  if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(raw)) return raw
  // "42 min" → "42:00"
  const minMatch = raw.match(/^(\d+)\s*min/)
  if (minMatch) return `${minMatch[1]}:00`
  return null
}

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // re-generate at most once per hour

export async function GET() {
  const episodes = await getEpisodes()

  const showImageUrl = `${BASE_URL}/Margin%20and%20Mandates/mm-cover.png`
  const feedUrl = `${BASE_URL}/feed/podcast`

  const items = episodes
    .map((ep) => {
      const episodeUrl = `${BASE_URL}/playbooks/${ep.slug}`
      const thumbUrl = ep.featuredImage
        ? urlFor(ep.featuredImage).width(1400).height(1400).url()
        : showImageUrl
      const duration = itunesDuration(ep.podcastDuration)
      const description = ep.excerpt
        ? escapeXml(ep.excerpt)
        : escapeXml(ep.title)
      const title = ep.guestName
        ? `${escapeXml(ep.title)} with ${escapeXml(ep.guestName)}`
        : escapeXml(ep.title)

      return `
    <item>
      <title>${title}</title>
      <link>${episodeUrl}</link>
      <guid isPermaLink="true">${episodeUrl}</guid>
      <description><![CDATA[${ep.excerpt ?? ep.title}]]></description>
      <pubDate>${rfcDate(ep.publishedAt)}</pubDate>
      <itunes:title>${title}</itunes:title>
      <itunes:summary><![CDATA[${ep.excerpt ?? ep.title}]]></itunes:summary>
      <itunes:image href="${escapeXml(thumbUrl)}" />
      ${duration ? `<itunes:duration>${duration}</itunes:duration>` : ''}
      ${ep.guestName ? `<itunes:author>${escapeXml(ep.guestName)}</itunes:author>` : ''}
      ${ep.youtubeUrl ? `<media:content url="${escapeXml(ep.youtubeUrl)}" medium="video" />` : ''}
    </item>`
    })
    .join('\n')

  const lastBuildDate = episodes[0]?.publishedAt
    ? rfcDate(episodes[0].publishedAt)
    : new Date().toUTCString()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Margins &amp; Mandates</title>
    <link>${BASE_URL}/margins-and-mandates</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <description>Conversations with CEOs and operators about the plays, pivots, and pressure-tested leadership that define their companies. Hosted by Jeff Lortz.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <image>
      <url>${showImageUrl}</url>
      <title>Margins &amp; Mandates</title>
      <link>${BASE_URL}/margins-and-mandates</link>
    </image>
    <itunes:author>Jeff Lortz</itunes:author>
    <itunes:owner>
      <itunes:name>Jeff Lortz</itunes:name>
      <itunes:email>jeff@agile-operator.com</itunes:email>
    </itunes:owner>
    <itunes:image href="${showImageUrl}" />
    <itunes:category text="Business">
      <itunes:category text="Management" />
    </itunes:category>
    <itunes:category text="Technology" />
    <itunes:explicit>false</itunes:explicit>
    <itunes:type>episodic</itunes:type>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
