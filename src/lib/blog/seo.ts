import { OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";
import { imageUrl } from "./image";
import type { Post, PostSummary, SocialOverrides } from "./types";

/**
 * The bridge between CMS content and page metadata.
 *
 * It sits apart because three consumers need it — Next metadata, JSON-LD and
 * the RSS feed — and all three have to derive the same URL and the same social
 * image. Doing it once here keeps them from drifting.
 */

/** Open Graph wants 1200x630. Posts without a cover fall back to the site card. */
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/** The site-wide social card, public/og.jpg. */
const FALLBACK_OG_IMAGE = OG_IMAGE;

export function postUrl(slug: string): string {
  return `${SITE_URL}/blog/${slug}`;
}

export function ogImage(post: PostSummary): { url: string; alt: string } {
  const cover = post.coverImage;
  const url =
    (cover &&
      imageUrl(cover, { width: OG_WIDTH, height: OG_HEIGHT, crop: true })) ||
    FALLBACK_OG_IMAGE;

  return { url, alt: cover?.alt || post.title };
}

/**
 * The card image for one social channel, resolved through the SEO tab.
 *
 * Four steps down, each a deliberate fallback rather than a coincidence:
 * the channel's own override (an upload, or a URL typed into the plugin), then
 * the shared meta image, then the post's cover, then the site card. So a post
 * that never had its SEO tab opened still gets a correct, specific preview.
 */
export function socialImage(
  post: Post,
  channel: "openGraph" | "twitter",
): { url: string; alt: string } {
  const override: SocialOverrides | null = post.seo[channel];
  const candidates = [override?.image, post.seo.metaImage, post.coverImage];

  for (const image of candidates) {
    if (!image) continue;
    const url = imageUrl(image, {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      crop: true,
    });
    if (url) return { url, alt: image.alt || post.title };
  }

  // A URL typed by hand cannot be resized, so it is only worth using once no
  // uploaded image is available.
  if (override?.imageUrl) {
    return { url: override.imageUrl, alt: override.title || post.title };
  }

  return { url: FALLBACK_OG_IMAGE, alt: post.title };
}

/** Title and description for one channel, falling back to the page's own. */
export function socialText(
  post: Post,
  channel: "openGraph" | "twitter",
  fallback: { title: string; description: string },
): { title: string; description: string } {
  const override = post.seo[channel];
  return {
    title: override?.title || fallback.title,
    description: override?.description || fallback.description,
  };
}

/**
 * The article image for structured data. Unlike ogImage this does not fall back
 * to the product card: the same generic picture repeated on every BlogPosting
 * tells search engines nothing.
 */
export function articleImage(post: PostSummary): string | null {
  return post.coverImage ? imageUrl(post.coverImage, { width: OG_WIDTH }) : null;
}

/** Only the post fields structured data and the feed consume. */
export interface BlogPostRef {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string | null;
  imageUrl?: string | null;
  categories?: readonly string[];
}

/** CMS summary -> the minimal shape structured data and the feed consume. */
export function toPostRef(post: PostSummary): BlogPostRef {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    imageUrl: articleImage(post),
    categories: post.categories.map((category) => category.title),
  };
}

export function toPostRefs(posts: readonly PostSummary[]): BlogPostRef[] {
  return posts.map(toPostRef);
}

/** Used by the feed and the index metadata, so the wording stays in one place. */
export const BLOG_TITLE = `Blog — ${SITE_NAME}`;
export const BLOG_DESCRIPTION =
  "News from the Opsburg workshop: keeping a cloud up and running, platform engineering, SRE and why we turned it into a city-builder game.";
