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
  seoTitle?: string
  seoDescription?: string
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
