import { isCmsConfigured, query } from "./client";
import {
  CATEGORIES_IN_USE,
  CATEGORY_BY_SLUG,
  POST_BY_SLUG,
  POST_SLUGS,
  POSTS,
  POSTS_BY_CATEGORY,
  RELATED_POSTS,
} from "./queries";
import type {
  Author,
  Category,
  CmsImage,
  Post,
  PostSeo,
  PostSummary,
  SocialOverrides,
} from "./types";

/**
 * The blog API the pages use.
 *
 * Pages import from here and nowhere deeper: underneath sits the CMS
 * (client.ts + queries.ts), but no page knows it. Everything runs during
 * `next build`, since the site is a static export.
 */

export type {
  Category,
  CmsImage,
  Post,
  PostSeo,
  PostSummary,
  SocialOverrides,
} from "./types";

// Fake content for working locally before the CMS has anything in it:
// `BLOG_FIXTURES=1 pnpm dev`. Never set in CI, so it cannot reach production.
const USE_FIXTURES = process.env.BLOG_FIXTURES === "1";

/**
 * Reserved slug for the blog's dynamic routes.
 *
 * With `output: "export"` Next.js aborts the build if a dynamic route produces
 * no page at all, and while the CMS is empty neither /blog/[slug] nor
 * /blog/category/[slug] would produce one. This slug is the page that keeps
 * both routes alive: it says posts are on the way, asks search engines not to
 * index it, stays out of the sitemap (see next-sitemap.config.js) and is linked
 * from nowhere. The moment a real post exists it stops being generated.
 */
export const PLACEHOLDER_SLUG = "no-posts-yet";

/** For use in the blog routes' generateStaticParams. */
export function withPlaceholder(slugs: string[]): string[] {
  return slugs.length > 0 ? slugs : [PLACEHOLDER_SLUG];
}

// Queries return the length of the article's text, not a duration: the estimate
// is computed here so tuning it does not mean touching GROQ.
// ~5 characters per word, 200 words per minute, one minute minimum.
const CHARS_PER_WORD = 5;
const WORDS_PER_MINUTE = 200;

type RawSummary = Omit<PostSummary, "readingMinutes" | "coverImage"> & {
  characters: number | null;
  coverImage: CmsImage | null;
};

function readingMinutes(characters: number | null): number {
  if (!characters) return 1;
  return Math.max(
    1,
    Math.round(characters / CHARS_PER_WORD / WORDS_PER_MINUTE),
  );
}

// A GROQ projection over an empty image field can come back as an object with
// every key null. Without a `ref` there is no asset to render.
function normalizeImage(image: CmsImage | null): CmsImage | null {
  return image && image.ref ? image : null;
}

/**
 * The SEO tab as it comes out of GROQ. Sanity returns an object with every key
 * null for an object field that was never opened, so nothing here can be
 * trusted to exist.
 */
type RawSeo = {
  [K in keyof PostSeo]: PostSeo[K] | null;
};

function toSocial(raw: SocialOverrides | null): SocialOverrides | null {
  if (!raw) return null;
  const social: SocialOverrides = {
    title: raw.title ?? null,
    description: raw.description ?? null,
    image: normalizeImage(raw.image),
    imageUrl: raw.imageUrl ?? null,
  };
  // An untouched tab projects to an object of nulls, which is not an override.
  return social.title || social.description || social.image || social.imageUrl
    ? social
    : null;
}

function toSeo(raw: RawSeo | null): PostSeo {
  const twitter = raw?.twitter ?? null;
  const twitterSocial = toSocial(twitter);

  return {
    metaTitle: raw?.metaTitle ?? null,
    metaDescription: raw?.metaDescription ?? null,
    keywords: raw?.keywords ?? [],
    canonicalUrl: raw?.canonicalUrl ?? null,
    metaImage: normalizeImage(raw?.metaImage ?? null),
    noIndex: raw?.noIndex ?? false,
    noFollow: raw?.noFollow ?? false,
    openGraph: toSocial(raw?.openGraph ?? null),
    twitter:
      twitterSocial || twitter?.card
        ? { ...(twitterSocial ?? EMPTY_SOCIAL), card: twitter?.card ?? null }
        : null,
  };
}

const EMPTY_SOCIAL: SocialOverrides = {
  title: null,
  description: null,
  image: null,
  imageUrl: null,
};

/** The author projection, with the same image normalisation as a cover. */
type RawAuthor = Omit<Author, "image"> & { image: CmsImage | null };

function toAuthor(raw: RawAuthor | null): Author | null {
  if (!raw?.name) return null;
  return {
    name: raw.name,
    role: raw.role ?? null,
    bio: raw.bio ?? null,
    image: normalizeImage(raw.image),
    links: raw.links ?? [],
  };
}

function toSummary(raw: RawSummary): PostSummary {
  return {
    slug: raw.slug,
    title: raw.title,
    excerpt: raw.excerpt ?? "",
    publishedAt: raw.publishedAt,
    updatedAt: raw.updatedAt ?? null,
    readingMinutes: readingMinutes(raw.characters),
    coverImage: normalizeImage(raw.coverImage),
    categories: raw.categories ?? [],
  };
}

export async function getPosts(): Promise<PostSummary[]> {
  if (USE_FIXTURES) return (await import("./fixtures")).fixturePosts();
  if (!isCmsConfigured()) return [];
  const posts = await query<RawSummary[]>(POSTS);
  return (posts ?? []).map(toSummary);
}

// Whether the blog has anything to show. Used by the root layout to decide if
// the "Blog" entry belongs in the navigation and the footer: reuses the slug
// query, which is the cheapest one, and rides the same fetch cache as the rest
// of the build.
export async function hasPosts(): Promise<boolean> {
  return (await getPostSlugs()).length > 0;
}

export async function getPostSlugs(): Promise<string[]> {
  if (USE_FIXTURES) return (await import("./fixtures")).fixtureSlugs();
  if (!isCmsConfigured()) return [];
  return (await query<string[]>(POST_SLUGS)) ?? [];
}

export async function getPost(slug: string): Promise<Post | null> {
  if (USE_FIXTURES) return (await import("./fixtures")).fixturePost(slug);
  if (!isCmsConfigured()) return null;

  const raw = await query<
    | (RawSummary & {
        body: Post["body"];
        seo: RawSeo | null;
        author: RawAuthor | null;
      })
    | null
  >(POST_BY_SLUG, { slug });
  if (!raw) return null;

  return {
    ...toSummary(raw),
    body: raw.body ?? [],
    seo: toSeo(raw.seo),
    author: toAuthor(raw.author),
  };
}

export async function getCategories(): Promise<Category[]> {
  if (USE_FIXTURES) return (await import("./fixtures")).fixtureCategories();
  if (!isCmsConfigured()) return [];
  return (await query<Category[]>(CATEGORIES_IN_USE)) ?? [];
}

export async function getCategory(slug: string): Promise<Category | null> {
  if (USE_FIXTURES) {
    const categories = (await import("./fixtures")).fixtureCategories();
    return categories.find((category) => category.slug === slug) ?? null;
  }
  if (!isCmsConfigured()) return null;
  return (await query<Category | null>(CATEGORY_BY_SLUG, { slug })) ?? null;
}

export async function getPostsByCategory(slug: string): Promise<PostSummary[]> {
  if (USE_FIXTURES) {
    const posts = (await import("./fixtures")).fixturePosts();
    return posts.filter((post) =>
      post.categories.some((category) => category.slug === slug),
    );
  }
  if (!isCmsConfigured()) return [];
  const posts = await query<RawSummary[]>(POSTS_BY_CATEGORY, { slug });
  return (posts ?? []).map(toSummary);
}

/**
 * Suggestions at the end of an article. If the post has no categories, or no
 * other post shares them, this falls back to the most recent posts: an empty
 * "keep reading" section is worse than a loosely related one.
 */
export async function getRelatedPosts(
  post: Post,
  limit = 3,
): Promise<PostSummary[]> {
  const categories = post.categories.map((category) => category.slug);

  if (categories.length > 0 && !USE_FIXTURES && isCmsConfigured()) {
    const related = await query<RawSummary[]>(RELATED_POSTS, {
      slug: post.slug,
      categories,
      limit,
    });
    if (related && related.length > 0) return related.map(toSummary);
  }

  const posts = await getPosts();
  return posts.filter((other) => other.slug !== post.slug).slice(0, limit);
}

// --- formatting ------------------------------------------------------------

// Fixed to UTC: the same ISO timestamp must render as the same date whether the
// build runs on a CI runner in UTC or on a laptop in Rome.
const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(iso: string): string {
  return DATE_FORMAT.format(new Date(iso));
}

/** Just the date part of an ISO timestamp, for a <time datetime> attribute. */
export function dateAttribute(iso: string): string {
  return iso.slice(0, 10);
}

export function readingLabel(minutes: number): string {
  return `${minutes} min read`;
}
