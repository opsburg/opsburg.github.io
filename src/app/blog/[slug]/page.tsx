import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, RefreshCw, User } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import ArticleBody from "@/components/blog/ArticleBody";
import BlogImage from "@/components/blog/BlogImage";
import NoPosts from "@/components/blog/NoPosts";
import PostCard from "@/components/blog/PostCard";
import {
  PLACEHOLDER_SLUG,
  dateAttribute,
  formatDate,
  getPost,
  getPostSlugs,
  getRelatedPosts,
  readingLabel,
  withPlaceholder,
} from "@/lib/blog";
import {
  OG_HEIGHT,
  OG_WIDTH,
  socialImage,
  socialText,
  toPostRef,
} from "@/lib/blog/seo";
import { CORE_KEYWORDS, SITE_NAME, SITE_URL } from "@/lib/seo";
import { blogPostingSchema, breadcrumbSchema } from "@/lib/structuredData";

interface Params {
  slug: string;
}

// Static export: every article page is created here, at build time. While the
// CMS has no posts only the reserved page is generated, which is what keeps the
// route alive (see PLACEHOLDER_SLUG).
export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getPostSlugs();
  return withPlaceholder(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    return {
      title: "Posts coming soon",
      robots: { index: false, follow: false },
    };
  }

  // Everything below comes from the Studio's "Search & social" tab where it was
  // filled in, and from the post itself where it was not.
  const { seo } = post;
  const title = seo.metaTitle || post.title;
  const description = seo.metaDescription || post.excerpt;
  const url = `${SITE_URL}/blog/${post.slug}`;

  const og = socialText(post, "openGraph", { title, description });
  const ogImg = socialImage(post, "openGraph");
  const tw = socialText(post, "twitter", { title, description });
  const twImg = socialImage(post, "twitter");

  return {
    title,
    description,
    keywords: [
      ...seo.keywords,
      ...post.categories.map((category) => category.title),
      ...CORE_KEYWORDS,
    ],
    // A canonical typed into the SEO tab wins: that field exists precisely for
    // a post that is a secondary copy of something published elsewhere.
    alternates: { canonical: seo.canonicalUrl || url },
    robots: { index: !seo.noIndex, follow: !seo.noFollow },
    openGraph: {
      title: og.title,
      description: og.description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      images: [
        { url: ogImg.url, width: OG_WIDTH, height: OG_HEIGHT, alt: ogImg.alt },
      ],
    },
    twitter: {
      card:
        seo.twitter?.card === "summary" ? "summary" : "summary_large_image",
      title: tw.title,
      description: tw.description,
      images: [twImg.url],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    // The reserved page exists only while the CMS is empty. Any other unknown
    // slug is a real 404.
    if (slug !== PLACEHOLDER_SLUG) notFound();
    return (
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <NoPosts title="The first post is on its way" />
      </div>
    );
  }

  const related = await getRelatedPosts(post);

  return (
    <>
      <JsonLd
        schema={[
          blogPostingSchema({ ...toPostRef(post), author: post.author }),
          breadcrumbSchema([
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

      <article className="container mx-auto max-w-4xl space-y-8 px-4 py-12">
        <header className="space-y-5">
          <Link
            href="/blog"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            ← All posts
          </Link>

          {post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/blog/category/${category.slug}`}
                  className="rounded-md border border-primary/40 px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-primary no-underline transition-colors hover:bg-primary/10"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          )}

          <h1 className="font-display brass-text text-3xl font-bold md:text-5xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl leading-relaxed text-foreground">
              {post.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            {post.author && (
              <span className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span className="text-foreground">{post.author.name}</span>
                {post.author.role && <span>· {post.author.role}</span>}
              </span>
            )}
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <time dateTime={dateAttribute(post.publishedAt)}>
                {formatDate(post.publishedAt)}
              </time>
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              {readingLabel(post.readingMinutes)}
            </span>
            {post.updatedAt && (
              <span className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-primary" />
                Updated{" "}
                <time dateTime={dateAttribute(post.updatedAt)}>
                  {formatDate(post.updatedAt)}
                </time>
              </span>
            )}
          </div>
        </header>

        {post.coverImage && (
          <figure>
            <BlogImage
              image={post.coverImage}
              ratio={16 / 9}
              priority
              sizes="(min-width: 1024px) 896px, 100vw"
              className="w-full rounded-lg border-2 border-border object-cover"
            />
            {post.coverImage.caption && (
              <figcaption className="mt-3 text-center text-sm text-muted-foreground">
                {post.coverImage.caption}
              </figcaption>
            )}
          </figure>
        )}

        {/* Body: narrower than the page grid, because prose reads badly wide. */}
        <div className="mx-auto max-w-[720px]">
          <ArticleBody value={post.body} />
        </div>
      </article>

      {related.length > 0 && (
        <div className="container mx-auto max-w-4xl space-y-5 px-4 pb-16">
          <h2 className="text-2xl font-semibold text-foreground">
            Keep reading
          </h2>
          {related.map((item) => (
            <PostCard key={item.slug} post={item} />
          ))}
        </div>
      )}
    </>
  );
}
