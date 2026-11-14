import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import CategoryFilter from "@/components/blog/CategoryFilter";
import NoPosts from "@/components/blog/NoPosts";
import PostCard from "@/components/blog/PostCard";
import {
  PLACEHOLDER_SLUG,
  getCategories,
  getCategory,
  getPostsByCategory,
  withPlaceholder,
} from "@/lib/blog";
import { toPostRefs } from "@/lib/blog/seo";
import { SITE_NAME, pageMetadata } from "@/lib/seo";
import { blogIndexSchema, breadcrumbSchema } from "@/lib/structuredData";

interface Params {
  slug: string;
}

// Only categories with at least one published post, see CATEGORIES_IN_USE in
// src/lib/blog/queries.ts. A category that loses its last post loses its page
// on the next build, and the sitemap follows. While no category is in use, only
// the reserved page is generated, which keeps the route alive.
export async function generateStaticParams(): Promise<Params[]> {
  const categories = await getCategories();
  return withPlaceholder(categories.map((category) => category.slug)).map(
    (slug) => ({ slug }),
  );
}

function describe(title: string, custom: string | null): string {
  return (
    custom ||
    `Posts on ${title.toLowerCase()} from the ${SITE_NAME} team: platform engineering, SRE and gamified DevOps.`
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) {
    return {
      title: "Posts coming soon",
      robots: { index: false, follow: false },
    };
  }

  return pageMetadata({
    title: `${category.title} — Blog`,
    description: describe(category.title, category.description),
    path: `/blog/category/${category.slug}`,
    keywords: [`DevOps ${category.title.toLowerCase()}`],
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const [category, posts, categories] = await Promise.all([
    getCategory(slug),
    getPostsByCategory(slug),
    getCategories(),
  ]);

  if (!category) {
    // Reserved page: exists only while no category has posts.
    if (slug !== PLACEHOLDER_SLUG) notFound();
    return (
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <NoPosts title="The first post is on its way" />
      </div>
    );
  }

  const path = `/blog/category/${category.slug}`;
  const description = describe(category.title, category.description);

  return (
    <div className="container mx-auto max-w-4xl space-y-10 px-4 py-12">
      <JsonLd
        schema={[
          blogIndexSchema({
            path,
            name: `${category.title} — Blog`,
            description,
            posts: toPostRefs(posts),
          }),
          breadcrumbSchema([
            { name: "Blog", path: "/blog" },
            { name: category.title, path },
          ]),
        ]}
      />

      <header className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
          Topic
        </p>
        <h1 className="font-display brass-text text-4xl font-bold md:text-5xl">
          {category.title}
        </h1>
        {category.description && (
          <p className="text-xl leading-relaxed text-muted-foreground">
            {category.description}
          </p>
        )}
      </header>

      <CategoryFilter categories={categories} current={category.slug} />

      <div className="space-y-5">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
