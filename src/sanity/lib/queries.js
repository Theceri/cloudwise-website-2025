import { groq } from 'next-sanity';

// ---- Reusable projections -------------------------------------------------

const postCardFields = groq`
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  featured,
  mainImage,
  "readingTime": round(length(pt::text(body)) / 5 / 180),
  "author": author->{name, "slug": slug.current, image, role},
  "categories": categories[]->{title, "slug": slug.current, color}
`;

// ---- Listing --------------------------------------------------------------

// All published posts (newest first). Used by the blog index + search base.
export const postsQuery = groq`
  *[_type == "post" && defined(slug.current) && publishedAt <= now()]
    | order(featured desc, publishedAt desc) {
    ${postCardFields}
  }
`;

// Paginated slice of posts. $start and $end are indices.
export const paginatedPostsQuery = groq`{
  "posts": *[_type == "post" && defined(slug.current) && publishedAt <= now()]
    | order(publishedAt desc) [$start...$end] { ${postCardFields} },
  "total": count(*[_type == "post" && defined(slug.current) && publishedAt <= now()])
}`;

// Just slugs, for generateStaticParams.
export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)]{ "slug": slug.current }
`;

// ---- Single post ----------------------------------------------------------

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    _updatedAt,
    mainImage,
    body,
    tags,
    "readingTime": round(length(pt::text(body)) / 5 / 180),
    "author": author->{
      name, "slug": slug.current, image, role, bio, social
    },
    "categories": categories[]->{_id, title, "slug": slug.current, color},
    seo
  }
`;

// Related posts: share a category, exclude current. Falls back to recent.
export const relatedPostsQuery = groq`
  *[_type == "post" && slug.current != $slug && defined(slug.current)
    && count(categories[@._ref in $categoryIds]) > 0]
    | order(publishedAt desc) [0...3] { ${postCardFields} }
`;

// ---- Categories -----------------------------------------------------------

export const categoriesQuery = groq`
  *[_type == "category"] | order(title asc){
    _id, title, "slug": slug.current, description, color,
    "count": count(*[_type == "post" && references(^._id) && publishedAt <= now()])
  }
`;

export const categoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0]{
    _id, title, "slug": slug.current, description, color
  }
`;

export const postsByCategoryQuery = groq`
  *[_type == "post" && defined(slug.current) && publishedAt <= now()
    && $slug in categories[]->slug.current]
    | order(publishedAt desc) { ${postCardFields} }
`;

export const categorySlugsQuery = groq`
  *[_type == "category" && defined(slug.current)]{ "slug": slug.current }
`;

// ---- Authors --------------------------------------------------------------

export const authorBySlugQuery = groq`
  *[_type == "author" && slug.current == $slug][0]{
    _id, name, "slug": slug.current, image, role, bio, social
  }
`;

export const postsByAuthorQuery = groq`
  *[_type == "post" && defined(slug.current) && publishedAt <= now()
    && author->slug.current == $slug]
    | order(publishedAt desc) { ${postCardFields} }
`;

export const authorSlugsQuery = groq`
  *[_type == "author" && defined(slug.current)]{ "slug": slug.current }
`;

// ---- Tags -----------------------------------------------------------------

export const postsByTagQuery = groq`
  *[_type == "post" && defined(slug.current) && publishedAt <= now()
    && $tag in tags]
    | order(publishedAt desc) { ${postCardFields} }
`;

// ---- Search ---------------------------------------------------------------

export const searchPostsQuery = groq`
  *[_type == "post" && defined(slug.current) && publishedAt <= now() && (
    title match $q || excerpt match $q || pt::text(body) match $q
    || count((categories[]->title)[@ match $q]) > 0
  )] | order(publishedAt desc) { ${postCardFields} }
`;

// ---- Comments -------------------------------------------------------------

// Approved comments for a post, oldest first (threading resolved client-side).
export const approvedCommentsQuery = groq`
  *[_type == "comment" && post._ref == $postId && approved == true]
    | order(createdAt asc){
      _id, name, comment, createdAt,
      "parent": parent._ref
  }
`;

// ---- Site settings --------------------------------------------------------

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    blogTitle, blogDescription, ogImage
  }
`;

// ---- Sitemap / RSS feeds --------------------------------------------------

export const sitemapPostsQuery = groq`
  *[_type == "post" && defined(slug.current) && publishedAt <= now()]{
    "slug": slug.current, _updatedAt, publishedAt
  }
`;

export const feedPostsQuery = groq`
  *[_type == "post" && defined(slug.current) && publishedAt <= now()]
    | order(publishedAt desc) [0...20]{
    title, "slug": slug.current, excerpt, publishedAt,
    "author": author->name,
    "categories": categories[]->title
  }
`;
