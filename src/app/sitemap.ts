import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getCategories, getPosts } from "@/lib/blog";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  const categories = await getCategories();
  // An empty blog is noindex, so it stays out of the sitemap until the first post.
  const blog: MetadataRoute.Sitemap = posts.length
    ? [
        { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.7 },
        ...posts.map((p) => ({
          url: `${SITE_URL}/blog/${p.slug}`,
          lastModified: p.updatedAt ?? p.publishedAt,
          changeFrequency: "monthly" as const,
          priority: 0.6,
        })),
        ...categories.map((c) => ({
          url: `${SITE_URL}/blog/category/${c.slug}`,
          changeFrequency: "weekly" as const,
          priority: 0.4,
        })),
      ]
    : [];
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/gamified-devops`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/vibe-coding`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/faq`, changeFrequency: "monthly", priority: 0.6 },
    ...blog,
  ];
}
