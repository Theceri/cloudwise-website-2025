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
};

export default nextConfig;
