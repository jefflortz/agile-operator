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
      { source: '/professional-growth', destination: '/services/executive-coaching', permanent: true },
      { source: '/professional-growth/', destination: '/services/executive-coaching', permanent: true },
      { source: '/services/professional-growth-coaching', destination: '/services/executive-coaching', permanent: true },
      { source: '/services/professional-growth-coaching/', destination: '/services/executive-coaching', permanent: true },
      // Fractional Exec / Advisory
      { source: '/advisory', destination: '/services/interim-fractional-executive', permanent: true },
      { source: '/advisory/', destination: '/services/interim-fractional-executive', permanent: true },
      { source: '/fractional-executive', destination: '/services/interim-fractional-executive', permanent: true },
      { source: '/fractional-executive/', destination: '/services/interim-fractional-executive', permanent: true },
      { source: '/services/advisory', destination: '/services/interim-fractional-executive', permanent: true },
      { source: '/services/advisory/', destination: '/services/interim-fractional-executive', permanent: true },
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

    // ── Renamed posts: old WordPress slug → current slug ────────
    // Recovered from Semrush Indexed Pages (Sep 2026). These old URLs
    // were indexed and/or carry backlinks; without these they 404.
    const renamedPosts: Record<string, string> = {
      'launching-leading-and-scaling-when-the-margin-for-error-is-thin': 'high-stakes-leadership-margin-for-error',
      'direct-mail-in-a-digital-world-dennis-kelly-on-reinventing-a-38b-channel': 'direct-mail-marketing-dennis-kelly',
      'flying-the-business-data-dynamic-pricing-and-the-future-of-charter': 'dynamic-pricing-charter-aviation',
      'scaling-in-a-zero-tolerance-market-with-ed-gaudet-of-censinet': 'healthcare-risk-compliance-censinet-ed-gaudet',
      'generative-ai-and-the-software-industry': 'generative-ai-and-software-industry',
      'optimizing-saas-rd-spend': 'how-to-optimize-saas-rd-spend',
      'demand-generation-zero-click': 'new-age-in-demand-generation',
      'what-happens-when-a-bootstrapped-business-hits-its-real-inflection-point-not-survival-but-scale': 'bootstrapped-business-growth-inflection-point',
      'sustainable-growth': 'sustainable-growth-referral-driven-business',
      'the-dark-funnel-shinning-a-light-on-new-oppo': 'the-dark-funnel-shining-a-light-on-hidden-opportunities-2',
      'managing-the-business-planning-cycle-2': 'managing-the-business-planning-cycle',
      'from-breach-to-brand-trust-jeff-nulsen-on-rebuilding-and-scaling-with-ai-2': 'from-breach-to-brand-trust-jeff-nulsen-on-rebuilding-and-scaling-with-ai',
      'ai-private-equity-and-the-future-of-marketing-leadership': 'marketing-leadership-in-private-equity-ai',
    }
    const renamedRedirects = Object.entries(renamedPosts).flatMap(([oldSlug, newSlug]) => [
      { source: `/${oldSlug}`, destination: `/playbooks/${newSlug}`, permanent: true },
      { source: `/${oldSlug}/`, destination: `/playbooks/${newSlug}`, permanent: true },
    ])

    // ── Legacy WordPress sections and archives ───────────────────
    const legacyRedirects = [
      // Old service / offer pages
      { source: '/gtm-advisory', destination: '/services/growth-advisory', permanent: true },
      { source: '/saas-operating-services', destination: '/services', permanent: true },
      { source: '/executive-mastermind-groups', destination: '/collective-edge', permanent: true },
      { source: '/masterminds', destination: '/collective-edge', permanent: true },
      { source: '/collective-edge-ceo', destination: '/collective-edge', permanent: true },
      { source: '/about-agile-saas-expertise', destination: '/about', permanent: true },
      // Contact / subscribe funnels
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/subscribe', destination: '/contact', permanent: true },
      { source: '/diagnostic', destination: '/contact', permanent: true },
      // Old blog indexes
      { source: '/insights', destination: '/playbooks', permanent: true },
      { source: '/blogs', destination: '/playbooks', permanent: true },
      { source: '/blog-saas-insights', destination: '/playbooks', permanent: true },
      { source: '/blog-saas-insights/page/:n', destination: '/playbooks', permanent: true },
      { source: '/saas-playbooks', destination: '/playbooks', permanent: true },
      { source: '/play-books', destination: '/playbooks', permanent: true },
      { source: '/playbooks/:n(\\d+)', destination: '/playbooks', permanent: true },
      // Duplicate / staging homepages
      { source: '/home_page', destination: '/', permanent: true },
      { source: '/home-strategic-growth-solutions-duplicate', destination: '/', permanent: true },
      { source: '/saas-operating-playbook-evolved-duplicate', destination: '/', permanent: true },
      // Taxonomy archives
      { source: '/category/:slug', destination: '/playbooks?category=:slug', permanent: true },
      { source: '/category/:parent/:child', destination: '/playbooks?category=:child', permanent: true },
      { source: '/category/:slug/page/:n', destination: '/playbooks?category=:slug', permanent: true },
      { source: '/tag/:slug', destination: '/playbooks', permanent: true },
      { source: '/author/:slug', destination: '/about', permanent: true },
      { source: '/author/:slug/page/:n', destination: '/about', permanent: true },
      // Orphaned posts with live backlinks and no current equivalent.
      // Soft-landed on the Playbooks index rather than left as 404s.
      // Repoint these if the content is ever republished.
      { source: '/5-predictions-about-the-future-of-customer-success-in-2024-with-gainsight-ceo-nick-mehta-and-saastr-ceo-jason-lemkin', destination: '/playbooks', permanent: true },
      { source: '/a-founders-journey-healthcare-loss-and-building-something-that-actually-matters', destination: '/playbooks', permanent: true },
      { source: '/specialization-trust-and-the-discipline-of-scale', destination: '/playbooks', permanent: true },
      { source: '/specialization-trust-and-the-discipline-of-scale-2', destination: '/playbooks', permanent: true },
      { source: '/steve-kielen', destination: '/playbooks', permanent: true },
      { source: '/steven-keilen', destination: '/playbooks', permanent: true },
      // Date archives
      { source: '/:year(\\d{4})/:month(\\d{2})', destination: '/playbooks', permanent: true },
      { source: '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})', destination: '/playbooks', permanent: true },
    ]

    return [
      ...pageRedirects,
      ...serviceRedirects,
      ...postRedirects,
      ...renamedRedirects,
      ...legacyRedirects,
    ]
  },
}

export default nextConfig
