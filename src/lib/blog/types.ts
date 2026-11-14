import type { PortableTextBlock } from "@portabletext/types";

/**
 * The shape blog content takes once it has left the CMS.
 *
 * This is the only contract between Sanity and the rest of the app: pages know
 * these types, not GROQ and not Sanity. Swapping CMS means rewriting
 * src/lib/blog/client.ts and the queries, and nothing under src/app.
 */

/** Sanity's hotspot: relative coordinates of the point that must survive a crop. */
export interface Hotspot {
  x: number;
  y: number;
  height: number;
  width: number;
}

/** Sanity's crop: how much the author trimmed off each edge, as a fraction. */
export interface Crop {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/**
 * A reference to a Sanity image asset. The query does not return a URL — it
 * returns the asset reference plus the author's framing, and imageUrl() derives
 * the crops from both.
 */
export interface CmsImage {
  ref: string;
  alt: string | null;
  caption: string | null;
  /** Base64 blur placeholder Sanity computes on upload. */
  lqip: string | null;
  width: number | null;
  height: number | null;
  hotspot: Hotspot | null;
  crop: Crop | null;
}

/**
 * The person a post is attributed to.
 *
 * Only what the Person node of a post's linked data needs. `links` becomes
 * sameAs, which is what lets an engine tie the byline to the accounts it can
 * already see — a name on its own asserts expertise, a name plus profiles
 * lets it be checked.
 */
export interface Author {
  name: string;
  role: string | null;
  bio: string | null;
  image: CmsImage | null;
  links: string[];
}

export interface Category {
  title: string;
  slug: string;
  description: string | null;
}

/**
 * The post's SEO overrides, from the `seoFields` object the Studio's
 * "Search & social" tab writes (sanity-plugin-seofields).
 *
 * Every field is optional and every one has a fallback derived from the post
 * itself, so a post with an untouched SEO tab is fully described. Only the
 * fields the site renders are projected — see the seo block in queries.ts.
 */
export interface SocialOverrides {
  title: string | null;
  description: string | null;
  /** Either an uploaded image or a URL typed into the plugin's `imageUrl`. */
  image: CmsImage | null;
  imageUrl: string | null;
}

export interface PostSeo {
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string[];
  /** Set only to point search engines at a different URL than the post's own. */
  canonicalUrl: string | null;
  metaImage: CmsImage | null;
  noIndex: boolean;
  noFollow: boolean;
  openGraph: SocialOverrides | null;
  twitter: (SocialOverrides & { card: string | null }) | null;
}

/** Everything a card needs: no body, which is by far the heaviest field. */
export interface PostSummary {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string | null;
  readingMinutes: number;
  coverImage: CmsImage | null;
  categories: Category[];
}

export interface Post extends PostSummary {
  body: PortableTextBlock[];
  seo: PostSeo;
  /** Null on posts written before authors existed: they stay with the project. */
  author: Author | null;
}
