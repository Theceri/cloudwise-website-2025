import { JsonLd, breadcrumbJsonLd, webPageJsonLd } from '@/lib/seo/jsonld';

export const metadata = {
  // The root template adds " · Cloudwise".
  title: 'About us: Nairobi ICT and AI Company',
  description:
    'Cloudwise is a Nairobi-based ICT company founded in 2019, building AI products, web & mobile apps and digital transformation solutions across East Africa.',
  alternates: { canonical: '/about' },
};

export default function AboutLayout({ children }) {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({ type: 'AboutPage', path: '/about', name: 'About Cloudwise' }),
          breadcrumbJsonLd([['About', '/about']]),
        ]}
      />
      {children}
    </>
  );
}
