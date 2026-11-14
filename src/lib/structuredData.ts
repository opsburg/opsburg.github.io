import { GITHUB_URL, ORGANIZATION_DESCRIPTION, SITE_NAME, SITE_URL } from "./seo";

/**
 * JSON-LD builders. Every node references the site's Organization and WebSite
 * by @id, so the whole site stays one entity.
 */

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: ORGANIZATION_DESCRIPTION,
    sameAs: [GITHUB_URL],
  };
}

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: ORGANIZATION_DESCRIPTION,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { name: "Home", path: "/" },
      ...items,
    ].map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

/**
 * Structured data for the blog.
 *
 * Three kinds of page, three shapes:
 * - /blog is an index: CollectionPage plus an ItemList pointing at the
 *   articles. Index pages are exactly the case Google wants ItemList for.
 * - /blog/[slug] is the article: BlogPosting, the only node Google uses for
 *   article rich results.
 * - /blog/category/[slug] is an archive, so a CollectionPage like the index.
 *
 * Every node references the site's canonical Organization and WebSite by @id
 * instead of restating them, so the whole site stays one entity.
 */

export function blogIndexSchema({
  path,
  name,
  description,
  posts,
}: {
  path: string;
  name: string;
  description: string;
  posts: readonly { slug: string; title: string }[];
}) {
  const url = `${SITE_URL}${path}`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: "en",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntity: {
      // The list carries positions and URLs, not content: the article page is
      // the only one that emits a BlogPosting, so there is exactly one node per
      // post across the site.
      "@type": "ItemList",
      numberOfItems: posts.length,
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: post.title,
        url: `${SITE_URL}/blog/${post.slug}`,
      })),
    },
  };
}

export function blogPostingSchema(post: {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string | null;
  imageUrl?: string | null;
  categories?: readonly string[];
  author?: {
    name: string;
    role: string | null;
    bio: string | null;
    links: readonly string[];
  } | null;
}) {
  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    url,
    datePublished: post.publishedAt,
    // Google expects dateModified even on a post that was never revised; there
    // it simply equals the publication date.
    dateModified: post.updatedAt ?? post.publishedAt,
    inLanguage: "en",
    // A named Person outranks a company byline for the answer engines, which is
    // the whole point of the author type in the CMS. Posts without one keep the
    // Organization, so nothing published before this regressed.
    author: post.author
      ? {
          "@type": "Person",
          name: post.author.name,
          ...(post.author.role ? { jobTitle: post.author.role } : {}),
          ...(post.author.bio ? { description: post.author.bio } : {}),
          ...(post.author.links.length
            ? { sameAs: [...post.author.links] }
            : {}),
        }
      : { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    ...(post.imageUrl ? { image: post.imageUrl } : {}),
    ...(post.categories?.length
      ? { articleSection: [...post.categories] }
      : {}),
  };
}
