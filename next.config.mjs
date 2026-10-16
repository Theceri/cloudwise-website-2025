/** @type {import('next').NextConfig} */
const nextConfig = {
  // Do not advertise the framework in every response.
  poweredByHeader: false,

  // Security headers on every route. Only HSTS was sent before (technical
  // audit, 14 October 2026), on a site whose checkout takes payments.
  // frame-ancestors 'self' stops other sites framing the checkout
  // (clickjacking) while still letting the embedded Studio preview the site.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
        ],
      },
    ];
  },

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
