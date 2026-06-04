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
    return [
      // WordPress root slugs → /playbooks/[slug]
      // Add existing post slugs here as needed during migration
      // Example:
      // {
      //   source: '/peer-advisory-council',
      //   destination: '/playbooks/peer-advisory-council',
      //   permanent: true,
      // },
    ]
  },
}

export default nextConfig
