/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },

  // The Safaricom certificates are read from disk at runtime to build the B2B
  // security credential. Next.js bundles only files it can statically trace, and
  // the path is computed at runtime — so without this they ship in the repo but
  // are missing from the deployed function, and settlement fails in production
  // while working perfectly in development.
  outputFileTracingIncludes: {
    '/api/**': ['./ProductionCertificate.cer', './SandboxCertificate.cer'],
  },

  // The Women Biz360 masterclass ran once and will not run again, so its pages
  // are gone. The URLs are kept as permanent redirects rather than left to 404:
  // they were shared on WhatsApp and in the partner's own posts, and everything
  // a visitor following one of those links now wants is on the training page.
  async redirects() {
    return [
      { source: '/women-biz360', destination: '/ai-training', permanent: true },
      { source: '/women-biz360/:path*', destination: '/ai-training', permanent: true },
    ];
  },
};

export default nextConfig;
