/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for SEO landing pages
  // output: 'export', // Uncomment for full static export

  // ESLint - temporarily ignore during builds for debugging
  eslint: {
    ignoreDuringBuilds: true, // TODO: Re-enable after fixing all warnings
  },
  typescript: {
    ignoreBuildErrors: false, // Still check TypeScript
  },

  // Image optimization
  images: {
    domains: ['images.unsplash.com'],
  },

  // Redirect www to non-www (configure in Vercel as well)
  async redirects() {
    return [];
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
