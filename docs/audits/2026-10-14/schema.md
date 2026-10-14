# Schema audit: cloudwise.co.ke (14 Oct 2026)

Method: raw HTML fetched for /, /ai-training, /about, /contact, /services and /blog/how-to-build-an-ai-readiness-plan-for-your-business. All JSON-LD is server-rendered, so no JS render was needed. The repo was read only. Nothing was modified.

**Score: 42 / 100**

## 1. Detection

| Page | JSON-LD found | Source file |
|---|---|---|
| / | Organization | src/app/layout.js (orgJsonLd, line 71) |
| /about | Organization (same block) | src/app/layout.js |
| /contact | Organization (same block) | src/app/layout.js |
| /services | Organization (same block) | src/app/layout.js |
| /ai-training | Organization, Course (with 2-3 CourseInstance), FAQPage | layout.js; src/app/ai-training/page.js (buildCourseJsonLd line 114, buildFaqJsonLd line 158) |
| /blog/[slug] | Organization, BlogPosting | layout.js; src/app/blog/[slug]/page.js (line 109) |

No Microdata or RDFa. No BreadcrumbList, WebSite, LocalBusiness, Service, ContactPage or AboutPage anywhere. The /services/[slug] pages (src/app/services/[slug]/page.js) emit nothing.

## 2. Validation

### Organization (layout.js): PASS with warnings
- @context is https://schema.org, URLs are absolute, logo and sameAs are present.
- **Address is wrong.** streetAddress is "4th Floor, Delta Annex, Delta Corner, Waiyaki Way". "Westlands" is missing. The source is `COMPANY_INFO.address` in src/lib/constants.js (line1 "4th Floor, Delta Annex, Delta Corner", line2 "Waiyaki Way", city "Nairobi"). There is no addressRegion.
- No @id, so other blocks cannot reference it. No contactPoint, geo or areaServed.
- The type is plain Organization. For a business with a physical office, ProfessionalService (a LocalBusiness subtype) is better.
- The Course provider repeats a thin Organization with only sameAs.

### Course (ai-training/page.js): PARTIAL
- Has name, description, provider, offers and hasCourseInstance. It meets Google's Course minimum.
- **One Offer at KES 13,500** (live page and `priceKes` in src/lib/training.js). The tiers in the brief (about KES 500 intro, KES 4,500-5,500 mid, higher tiers) are **not in the repo or on the live page**. Confirm which is true before publishing the tier markup below. Schema must match what the page shows.
- provider has no url (it puts the URL in sameAs) and no @id link.
- location.address is a plain string, and it says "Waiyaki Way" with no "Westlands". It should be a PostalAddress.
- Missing: inLanguage, educationalLevel, url on the Course, offers on each instance, scheduleTimezone, a VirtualLocation for the online mode.
- `courseWorkload: PT8H` is the total of two 4-hour Saturdays. Add `duration: PT4H` to the Schedule so this is clear.

### FAQPage (ai-training/page.js): INFO only
Google retired FAQ rich results on 7 May 2026. There is no SERP benefit, and any AI visibility benefit is unconfirmed. Keeping it costs little. Do not add FAQPage anywhere else. The FAQ text on line 106 also says "Waiyaki Way" without "Westlands".

### BlogPosting (blog/[slug]/page.js): PASS with warnings
- headline, image, datePublished, dateModified, author and publisher are present. Dates are ISO 8601.
- The headline has a trailing space ("...Your Business ").
- author is a Person with a name only. Add a url (an /blog/author/ route exists).
- publisher.name is "Cloudwise" while the Organization is "Cloudwise Limited". Use an @id reference.
- No BreadcrumbList.

## 3. Findings by severity

| # | Severity | Finding | File |
|---|---|---|---|
| 1 | High | Address omits Westlands in Organization, Course location and FAQ text | src/lib/constants.js, src/app/layout.js, src/app/ai-training/page.js, src/lib/training.js |
| 2 | High | Course has one Offer; tiered classes are not modelled (and not on the page) | src/app/ai-training/page.js, src/lib/training.js |
| 3 | High | No ProfessionalService/LocalBusiness with geo; Organization has no @id | src/app/layout.js |
| 4 | Medium | No BreadcrumbList on any page | new helper in src/lib, used by each page |
| 5 | Medium | /services and /services/[slug] have no Service or ItemList | src/app/services/page.js, src/app/services/[slug]/page.js |
| 6 | Medium | /about and /contact have no AboutPage or ContactPage | src/app/about/page.js, src/app/contact/page.js |
| 7 | Medium | No WebSite entity on the homepage | src/app/page.js |
| 8 | Low | Course provider is a thin duplicate; location.address is a string | src/app/ai-training/page.js |
| 9 | Low | BlogPosting trailing space, author without url, publisher not linked | src/app/blog/[slug]/page.js |
| 10 | Info | FAQPage present, no rich result since 7 May 2026 | src/app/ai-training/page.js |

## 4. Ready-to-paste JSON-LD

### 4.1 Replace the Organization in src/app/layout.js
Also change `COMPANY_INFO.address` in src/lib/constants.js so line2 reads "Westlands" (or add a `suburb` field). The coordinates are approximate for Delta Corner, Westlands: verify them on Google Maps before shipping. Opening hours are not in the repo, so add `openingHoursSpecification` once confirmed.

```json
{
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  "@id": "https://www.cloudwise.co.ke/#organization",
  "name": "Cloudwise Limited",
  "alternateName": "Cloudwise",
  "url": "https://www.cloudwise.co.ke",
  "logo": {
    "@type": "ImageObject",
    "url": "https://www.cloudwise.co.ke/logo1.png"
  },
  "image": "https://www.cloudwise.co.ke/logo1.png",
  "description": "Cloudwise builds software, AI agents and automation for businesses in Kenya, and runs hands-on AI training for individuals and teams.",
  "email": "hello@cloudwise.co.ke",
  "telephone": "+254712658775",
  "foundingDate": "2019",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "4th Floor, Delta Annex, Delta Corner",
    "addressLocality": "Westlands, Nairobi",
    "addressRegion": "Nairobi County",
    "addressCountry": "KE"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": -1.2644, "longitude": 36.8040 },
  "areaServed": { "@type": "Country", "name": "Kenya" },
  "contactPoint": [{
    "@type": "ContactPoint",
    "contactType": "customer service",
    "telephone": "+254712658775",
    "email": "hello@cloudwise.co.ke",
    "areaServed": "KE",
    "availableLanguage": ["English"]
  }],
  "sameAs": [
    "https://www.instagram.com/cloudwise.co.ke/",
    "https://www.tiktok.com/@cloudwisehq_",
    "https://www.linkedin.com/company/90601227/"
  ]
}
```

### 4.2 WebSite (homepage only, src/app/page.js)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.cloudwise.co.ke/#website",
  "url": "https://www.cloudwise.co.ke",
  "name": "Cloudwise",
  "inLanguage": "en-KE",
  "publisher": { "@id": "https://www.cloudwise.co.ke/#organization" }
}
```

### 4.3 Course with tiers (src/app/ai-training/page.js, replace buildCourseJsonLd)
The KES 500 and KES 4,500 prices come from the brief. The KES 13,500 offer is what the site sells today. Confirm tier names, prices and the higher tiers, then drive both page and schema from one array in src/lib/training.js so they cannot drift. Add one Offer per tier the page actually shows.

```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "@id": "https://www.cloudwise.co.ke/ai-training#course",
  "name": "Cloudwise AI Productivity Training",
  "description": "Hands-on AI training that gives you and your team the skills to use AI for real business results. No tech background required.",
  "url": "https://www.cloudwise.co.ke/ai-training",
  "inLanguage": "en",
  "educationalLevel": "Beginner",
  "provider": { "@id": "https://www.cloudwise.co.ke/#organization" },
  "offers": [
    {
      "@type": "Offer",
      "name": "Intro class",
      "price": "500",
      "priceCurrency": "KES",
      "category": "Paid",
      "url": "https://www.cloudwise.co.ke/ai-training/register",
      "availability": "https://schema.org/InStock"
    },
    {
      "@type": "Offer",
      "name": "Mid tier",
      "price": "4500",
      "priceCurrency": "KES",
      "category": "Paid",
      "url": "https://www.cloudwise.co.ke/ai-training/register",
      "availability": "https://schema.org/InStock"
    },
    {
      "@type": "Offer",
      "name": "AI Productivity Training (2 Saturdays, 8 hours)",
      "price": "13500",
      "priceCurrency": "KES",
      "category": "Paid",
      "url": "https://www.cloudwise.co.ke/ai-training/register",
      "availability": "https://schema.org/InStock"
    }
  ],
  "hasCourseInstance": [
    {
      "@type": "CourseInstance",
      "name": "Cloudwise AI Productivity Training, Nov 2026 cohort",
      "courseMode": ["Online", "Onsite"],
      "courseWorkload": "PT8H",
      "startDate": "2026-11-07",
      "endDate": "2026-11-14",
      "inLanguage": "en",
      "courseSchedule": {
        "@type": "Schedule",
        "repeatCount": 2,
        "repeatFrequency": "P1W",
        "byDay": "https://schema.org/Saturday",
        "startTime": "09:00:00",
        "endTime": "13:00:00",
        "duration": "PT4H",
        "scheduleTimezone": "Africa/Nairobi",
        "startDate": "2026-11-07",
        "endDate": "2026-11-14"
      },
      "location": [
        {
          "@type": "Place",
          "name": "Cloudwise, Delta Annex, Delta Corner",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "4th Floor, Delta Annex, Delta Corner",
            "addressLocality": "Westlands, Nairobi",
            "addressCountry": "KE"
          }
        },
        { "@type": "VirtualLocation", "url": "https://www.cloudwise.co.ke/ai-training" }
      ],
      "offers": {
        "@type": "Offer",
        "price": "13500",
        "priceCurrency": "KES",
        "url": "https://www.cloudwise.co.ke/ai-training/register",
        "availability": "https://schema.org/InStock"
      }
    }
  ]
}
```
Repeat the CourseInstance for each open cohort. The existing `cohorts.map` already does this.

### 4.4 BreadcrumbList (one helper, reused per page)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.cloudwise.co.ke" },
    { "@type": "ListItem", "position": 2, "name": "AI Training", "item": "https://www.cloudwise.co.ke/ai-training" }
  ]
}
```
Blog post: Home, Blog (https://www.cloudwise.co.ke/blog), then the post URL. Service detail: Home, Services (https://www.cloudwise.co.ke/services), then the service URL.

### 4.5 AboutPage (src/app/about/page.js)

```json
{
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "url": "https://www.cloudwise.co.ke/about",
  "name": "About Cloudwise",
  "isPartOf": { "@id": "https://www.cloudwise.co.ke/#website" },
  "about": { "@id": "https://www.cloudwise.co.ke/#organization" }
}
```

### 4.6 ContactPage (src/app/contact/page.js)

```json
{
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "url": "https://www.cloudwise.co.ke/contact",
  "name": "Contact Cloudwise",
  "isPartOf": { "@id": "https://www.cloudwise.co.ke/#website" },
  "about": { "@id": "https://www.cloudwise.co.ke/#organization" }
}
```
The visible "Visit us" value (contact/page.js line 35) uses address.line1 plus city. Add Westlands there too.

### 4.7 Service (src/app/services/[slug]/page.js, one per slug; example for `ai`)

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://www.cloudwise.co.ke/services/ai#service",
  "name": "AI Agent Development",
  "serviceType": "AI Agent Development",
  "description": "Intelligent agents for customer-service automation, predictive analytics and personalised recommendations, tailored to your business.",
  "url": "https://www.cloudwise.co.ke/services/ai",
  "provider": { "@id": "https://www.cloudwise.co.ke/#organization" },
  "areaServed": { "@type": "Country", "name": "Kenya" }
}
```
Generate these from the existing `SERVICES` array (id, title, longDescription). On /services add an ItemList of the eight Service URLs.

### 4.8 BlogPosting changes (src/app/blog/[slug]/page.js)
- `headline: post.title.trim()`
- author: add `url` pointing at `${SITE_URL}/blog/author/<author slug>` (check the Sanity query returns the slug)
- `publisher: { '@id': 'https://www.cloudwise.co.ke/#organization' }`
- `inLanguage: 'en'`

## 5. Not recommended
HowTo (rich results removed 2023), new FAQPage (no rich result), SpecialAnnouncement, CourseInfo, EstimatedSalary, LearningVideo. Do not add AggregateRating or Review: no real review data was found.

## 6. Open questions
1. Are the tiered classes (KES 500, 4,500-5,500, higher) live? The repo and live page sell one KES 13,500 track only.
2. Confirm opening hours and the Westlands coordinates.
3. After deploy, validate in Google's Rich Results Test and validator.schema.org.
