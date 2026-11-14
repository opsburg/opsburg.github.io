import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import CategoryFilter from "@/components/blog/CategoryFilter";
import NoPosts from "@/components/blog/NoPosts";
import PostCard from "@/components/blog/PostCard";
import { getCategories, getPosts } from "@/lib/blog";
import { BLOG_DESCRIPTION, toPostRefs } from "@/lib/blog/seo";
import { SITE_URL, pageMetadata } from "@/lib/seo";
import { blogIndexSchema, breadcrumbSchema } from "@/lib/structuredData";

const base = pageMetadata({
  title: "Blog",
  description: BLOG_DESCRIPTION,
  path: "/blog",
  keywords: [
    "DevOps blog",
    "platform engineering blog",
    "SRE practices",
    "gamification in DevOps",
  ],
});

// An empty blog is not worth indexing: while there are no posts the page stays
// reachable but tells crawlers to skip it, matching the navigation, which hides
// the entry (see hasPosts() in the root layout). next-sitemap drops the URL in
// the same state, so the sitemap never advertises a noindex page.
export async function generateMetadata(): Promise<Metadata> {
  const posts = await getPosts();

  return {
    ...base,
    alternates: {
      canonical: `${SITE_URL}/blog`,
      // Declared in the head so feed readers can discover it from the blog URL.
      types: { "application/rss+xml": `${SITE_URL}/blog/rss.xml` },
    },
    ...(posts.length === 0
      ? { robots: { index: false, follow: false } }
      : {}),
  };
}

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getPosts(), getCategories()]);

  return (
    <div className="container mx-auto max-w-4xl space-y-10 px-4 py-12">
      <JsonLd
        schema={[
          blogIndexSchema({
            path: "/blog",
            name: "Blog",
            description: BLOG_DESCRIPTION,
            posts: toPostRefs(posts),
          }),
          breadcrumbSchema([{ name: "Blog", path: "/blog" }]),
        ]}
      />

      <header className="space-y-4">
        <h1 className="font-display brass-text text-4xl font-bold md:text-5xl">
          Blog
        </h1>
        <p className="text-xl leading-relaxed text-muted-foreground">
          {BLOG_DESCRIPTION}
        </p>
      </header>

      <CategoryFilter categories={categories} />

      {posts.length === 0 ? (
        // The section exists before the first post: a page saying what is
        // coming beats a 404.
        <NoPosts title="The first post is on its way" />
      ) : (
        <>
          <div className="space-y-5">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Also available as an{" "}
            <a
              href="/blog/rss.xml"
              className="text-primary hover:text-primary/80"
            >
              RSS feed
            </a>
            .
          </p>
        </>
      )}
    </div>
  );
}
