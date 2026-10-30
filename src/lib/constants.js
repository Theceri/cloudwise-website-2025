export const BRAND_COLORS = {
  ink: '#0A0A0B',
  ember: '#FF3F1A',
  ice: '#97D6DF',
  teal: '#447980',
}

// The apex redirects to www, so this must be the www host: it is the base for
// every canonical tag, OG url, sitemap entry, RSS link and robots host on the
// site, and a canonical that points at a redirect is a canonical search engines
// quietly discard.
export const SITE_URL = 'https://www.cloudwise.co.ke'

export const WHATSAPP_NUMBER = '+254712658775'
export const WHATSAPP_NUMBER_RAW = '254712658775'

export const COMPANY_INFO = {
  name: 'Cloudwise',
  legalName: 'Cloudwise Limited',
  tagline: 'Your ICT partner for AI, software & digital transformation.',
  email: 'hello@cloudwise.co.ke',
  phone: '+254 712 658 775',
  phoneRaw: '+254712658775',
  address: {
    line1: '4th Floor, Delta Annex, Delta Corner',
    area: 'Westlands',
    city: 'Nairobi',
    region: 'Nairobi County',
    country: 'Kenya',
    countryCode: 'KE',
  },
  founded: '2019',
  // The Google Business Profile listing (5.0 from 19 reviews, checked 16 Oct
  // 2026). Its pin is the office: -1.2661101, 36.8013824.
  geo: { lat: -1.2661101, lng: 36.8013824 },
  googleMapsUrl: 'https://www.google.com/maps?cid=15434400946695365550',
  googleReviewsUrl: 'https://www.google.com/maps?cid=15434400946695365550',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=-1.2661101,36.8013824',
  stats: {
    projectsDone: 33,
    happyCustomers: 33,
    countries: 3,
  },
}

/**
 * The one way the office address is written: "4th Floor, Delta Annex, Delta
 * Corner, Westlands, Nairobi". Every page, email and JSON-LD block reads it from
 * here, so the address can never again drift into three variants.
 */
export function formatAddress({ withCountry = false } = {}) {
  const a = COMPANY_INFO.address
  return [a.line1, a.area, a.city, withCountry ? a.country : null].filter(Boolean).join(', ')
}

/**
 * Who issues the training certificates.
 *
 * On LinkedIn the company page is called "Cloudwise Technologies", so that is
 * the issuer name a certificate carries there. LinkedIn shows the company logo
 * beside a certificate only when the certificate names the page by its id, not
 * just by its name, so the "Add to profile" link passes both.
 */
export const CERTIFICATE_ISSUER = {
  name: 'Cloudwise Technologies',
  legalName: 'Cloudwise Limited',
  linkedInOrganizationId: '90601227',
  signatory: 'Paul Theceri Ng’ang’a',
  signatoryTitle: 'Lead Trainer and Director',
}

export const SOCIAL_LINKS = [
  { name: 'Instagram', href: 'https://www.instagram.com/cloudwise.co.ke/', handle: '@cloudwise.co.ke' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@cloudwisehq_', handle: '@cloudwisehq_' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/90601227/', handle: 'Cloudwise' },
]

// `children` renders a dropdown on desktop and an indented group on mobile.
export const NAVIGATION_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  {
    name: 'AI Training',
    href: '/ai-training',
    highlight: true,
    children: [
      {
        name: 'Kickstart (Ksh 500)',
        href: '/ai-training/kickstart',
        description: '2 hours online, Wednesdays 7pm',
      },
      {
        name: 'Courses and pricing',
        href: '/ai-training',
        description: 'Kickstart, Essentials and the full Programme',
      },
      {
        name: 'Private and team training',
        href: '/ai-training/teams',
        description: 'One-to-one, or 10 people or more',
      },
      {
        name: 'Free resources',
        href: '/resources',
        description: 'Prompt pack, readiness guide and AI tools',
      },
    ],
  },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
]

// Helper: build a prefilled WhatsApp link
export function whatsappLink(message = "Hello Cloudwise, I'd like to learn more.") {
  return `https://wa.me/${WHATSAPP_NUMBER_RAW}?text=${encodeURIComponent(message)}`
}
