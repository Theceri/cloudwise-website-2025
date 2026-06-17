export const BRAND_COLORS = {
  ink: '#0A0A0B',
  ember: '#FF3F1A',
  ice: '#97D6DF',
  teal: '#447980',
}

export const SITE_URL = 'https://cloudwise.co.ke'

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
    line1: '4th Floor, Delta Annex',
    line2: 'Waiyaki Way',
    city: 'Nairobi',
    country: 'Kenya',
  },
  founded: '2019',
  stats: {
    projectsDone: 33,
    happyCustomers: 33,
    countries: 3,
  },
}

export const SOCIAL_LINKS = [
  { name: 'Instagram', href: 'https://www.instagram.com/cloudwise.co.ke/', handle: '@cloudwise.co.ke' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@cloudwisehq_', handle: '@cloudwisehq_' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/90601227/', handle: 'Cloudwise' },
]

export const NAVIGATION_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'AI Training', href: '/ai-training', highlight: true },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
]

// Helper: build a prefilled WhatsApp link
export function whatsappLink(message = "Hello Cloudwise, I'd like to learn more.") {
  return `https://wa.me/${WHATSAPP_NUMBER_RAW}?text=${encodeURIComponent(message)}`
}
