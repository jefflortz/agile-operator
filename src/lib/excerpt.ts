export const EXCERPT_MAX = 560

/**
 * Truncates an excerpt to EXCERPT_MAX characters at the nearest word boundary.
 * Acts as a safety net for migrated content that predates the Sanity validation rule.
 */
export function truncateExcerpt(text: string | undefined | null): string {
  if (!text) return ''
  if (text.length <= EXCERPT_MAX) return text
  const cut = text.slice(0, EXCERPT_MAX)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + '…'
}
