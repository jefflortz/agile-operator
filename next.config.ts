import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  async redirects() {
    // WordPress page redirects (old WP slugs → new Next.js routes)
    const pageRedirects = [
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/about-us/', destination: '/about', permanent: true },
      { source: '/contact-saas-experts', destination: '/contact', permanent: true },
      { source: '/contact-saas-experts/', destination: '/contact', permanent: true },
      { source: '/book-your-strategy-session', destination: '/contact', permanent: true },
      { source: '/book-your-strategy-session/', destination: '/contact', permanent: true },
      { source: '/newsletter', destination: '/contact', permanent: true },
      { source: '/newsletter/', destination: '/contact', permanent: true },
    ]

    // Service page redirects from WordPress URLs
    const serviceRedirects = [
      // Growth Advisory (WP may have used either slug — add both to be safe)
      { source: '/business-growth', destination: '/services/growth-advisory', permanent: true },
      { source: '/business-growth/', destination: '/services/growth-advisory', permanent: true },
      { source: '/growth-advisory', destination: '/services/growth-advisory', permanent: true },
      { source: '/growth-advisory/', destination: '/services/growth-advisory', permanent: true },
      { source: '/services/business-growth', destination: '/services/growth-advisory', permanent: true },
      { source: '/services/business-growth/', destination: '/services/growth-advisory', permanent: true },
      { source: '/business-growth-consulting', destination: '/services/growth-advisory', permanent: true },
      { source: '/business-growth-consulting/', destination: '/services/growth-advisory', permanent: true },
      // Professional Growth / Executive Coaching
      { source: '/professional-growth', destination: '/services/professional-growth', permanent: true },
      { source: '/professional-growth/', destination: '/services/professional-growth', permanent: true },
      { source: '/services/professional-growth-coaching', destination: '/services/professional-growth', permanent: true },
      { source: '/services/professional-growth-coaching/', destination: '/services/professional-growth', permanent: true },
      // Fractional Exec / Advisory
      { source: '/advisory', destination: '/services/fractional-executive', permanent: true },
      { source: '/advisory/', destination: '/services/fractional-executive', permanent: true },
      { source: '/fractional-executive', destination: '/services/fractional-executive', permanent: true },
      { source: '/fractional-executive/', destination: '/services/fractional-executive', permanent: true },
      { source: '/services/advisory', destination: '/services/fractional-executive', permanent: true },
      { source: '/services/advisory/', destination: '/services/fractional-executive', permanent: true },
    ]

    const postSlugs = [
      'peer-advisory-council',
      'home-care-software-saas-founder-journey',
      'dynamic-pricing-charter-aviation',
      'bootstrapped-business-growth-inflection-point',
      'healthcare-risk-compliance-censinet-ed-gaudet',
      'marketing-leadership-in-private-equity-ai',
      'direct-mail-marketing-dennis-kelly',
      'building-categories-brands-and-credibility-in-cybersecurity',
      'ai-hr-and-the-future-of-work-marketing-insights-from-pam-boiros',
      'from-legacy-to-lift-off-go-to-market-lessons-from-saas-cmo-steve-martin',
      'trust-teams-and-tough-markets-how-nate-burke-builds-a-marketing-engine',
      'human-data-ai-johan-abadies-blueprint-for-modern-demand-generation',
      'from-breach-to-brand-trust-jeff-nulsen-on-rebuilding-and-scaling-with-ai',
      'everyone-owns-pipeline-inside-nasunis-co-sell-culture',
      'selling-data-to-doubters-michelle-katz-on-marketing-to-the-legal-world',
      'new-age-in-demand-generation',
      'how-mature-is-your-marketing-engine',
      'consistency-in-leadership',
      '6-steps-to-annual-business-planning',
      'managing-the-business-planning-cycle',
      'hyper-adaptive-leadership',
      'from-service-to-saas-the-case-for-hiring-former-military-officers-in-tech',
      'clarity-addressing-the-crisis-of-trust-in-organizations',
      'transforming-professional-services-to-accelerate-customer-led-growth',
      'the-role-of-strategy-in-business-planning',
      'why-leadership-adaptability-and-resilience-matter',
      'navigating-the-transition-with-a-growth-mindset',
      'customer-led-growth-vs-product-led-growth',
      'the-future-of-customer-retention-leveraging-ai-for-predictive-churn-analytics',
      'technical-debt-and-the-impact-on-saas-growth',
      'cross-functional-teams-improving-collaboration-across-silos',
      'how-to-optimize-saas-rd-spend',
      'how-to-leverage-ai-and-llms-to-improve-sales-forecasting',
      'unlocking-the-power-of-high-performing-teams',
      'customer-segmentation-strategies-and-how-to-drive-engagement-through-personalization',
      '5-data-driven-techniques-to-improve-saas-customer-retention-in-2024',
      'customer-lifetime-value-cltv-a-primer',
      'the-dark-funnel-shining-a-light-on-hidden-opportunities-2',
      'generative-ai-and-software-industry',
      'brand-vs-demand-marketing-mix',
      'high-stakes-leadership-margin-for-error',
      'margins-mandates-mayhem',
      'sustainable-growth-referral-driven-business',
    ]

    // Both with and without trailing slash — WordPress indexed the trailing-slash versions
    const postRedirects = postSlugs.flatMap((slug) => [
      { source: `/${slug}`, destination: `/playbooks/${slug}`, permanent: true },
      { source: `/${slug}/`, destination: `/playbooks/${slug}`, permanent: true },
    ])

    return [...pageRedirects, ...serviceRedirects, ...postRedirects]
  },
}

export default nextConfig
