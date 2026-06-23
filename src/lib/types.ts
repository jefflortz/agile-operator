export type ContentType = 'article' | 'episode'

export type Category = {
  _id: string
  title: string
  slug: string  // projected as slug.current in all GROQ queries
}

export type Author = {
  _id: string
  name: string
  title?: string
  bio?: unknown[]
  photo?: SanityImage
}

export type SanityImage = {
  _type: 'image'
  asset: { _ref: string; _type: 'reference' }
  alt?: string
  hotspot?: { x: number; y: number }
}

export type PlaybookContent = {
  _id: string
  _type: 'playbookContent'
  contentType: ContentType
  title: string
  slug: { current: string }
  publishedAt: string
  author?: Author
  categories?: Category[]
  featuredImage?: SanityImage
  excerpt?: string
  // Article fields
  body?: any[]
  // Episode fields
  guestName?: string
  guestTitle?: string
  youtubeUrl?: string
  spotifyUrl?: string
  applePodcastUrl?: string
  podcastDuration?: string
  showNotes?: unknown[]
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
    canonicalUrl?: string
    openGraph?: { title?: string; description?: string; image?: unknown }
  }
}

export type PlaybookContentPreview = Pick<
  PlaybookContent,
  | '_id'
  | 'contentType'
  | 'title'
  | 'slug'
  | 'publishedAt'
  | 'featuredImage'
  | 'excerpt'
  | 'guestName'
  | 'guestTitle'
  | 'youtubeUrl'
  | 'spotifyUrl'
> & {
  categories?: Pick<Category, 'title' | 'slug'>[]
}

export type Service = {
  _id: string
  title: string
  headline?: string
  description?: unknown[]
  outcomes?: string[]
  order?: number
  pillarPageSlug?: string
}

export type ServicePillarBenefit = {
  _key: string
  title: string
  description: string
}

export type ServicePillarStep = {
  _key: string
  title: string
  description: string
}

export type ServicePillarFAQ = {
  _key: string
  question: string
  answer: unknown[]
}

export type ServicePillarPage = {
  _id: string
  serviceName: string
  slug: string
  heroHeadline: string
  heroSubhead?: string
  introHeadline?: string
  introBody?: unknown[]
  benefitsHeadline?: string
  benefits?: ServicePillarBenefit[]
  processHeadline?: string
  processSteps?: ServicePillarStep[]
  faqHeadline?: string
  faq?: ServicePillarFAQ[]
  relatedCategory?: { _id: string; title: string; slug: string }
  ctaHeadline?: string
  ctaBody?: string
  ctaButtonLabel?: string
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
    canonicalUrl?: string
    openGraph?: { title?: string; description?: string; image?: unknown }
  }
}

export type MarginsAndMandates = {
  tagline?: string
  description?: string
  coverImage?: SanityImage
  spotifyUrl?: string
  youtubeChannelUrl?: string
  applePodcastUrl?: string
  rssUrl?: string
  featuredEpisodes?: PlaybookContentPreview[]
}
