import { JsonLd, breadcrumbJsonLd, webPageJsonLd } from '@/lib/seo/jsonld';

export const metadata = {
  // The root template adds " · Cloudwise".
  title: 'Contact us: Delta Annex, Westlands, Nairobi',
  description:
    'Get in touch with Cloudwise for projects, quotes or AI training. Call +254 712 658 775, email hello@cloudwise.co.ke, or message us on WhatsApp.',
  alternates: { canonical: '/contact' },
};

export default function ContactLayout({ children }) {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({ type: 'ContactPage', path: '/contact', name: 'Contact Cloudwise' }),
          breadcrumbJsonLd([['Contact', '/contact']]),
        ]}
      />
      {children}
    </>
  );
}
