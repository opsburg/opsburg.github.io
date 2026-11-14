import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import BlogImage from "./BlogImage";
import { dateAttribute, formatDate, readingLabel } from "@/lib/blog";
import type { PostSummary } from "@/lib/blog/types";
import { cn } from "@/lib/cn";

/**
 * A post preview on index pages.
 *
 * The link wraps the whole row: a large hit area beats a clickable title on
 * touch. Categories are plain labels here rather than links — an <a> nested in
 * an <a> is invalid HTML — and the archives are reachable from the filter row
 * at the top of the index instead.
 */
export default function PostCard({
  post,
  className,
}: {
  post: PostSummary;
  className?: string;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex gap-5 rounded-lg border-2 border-border bg-card/60 p-5 no-underline backdrop-blur-sm transition-colors hover:border-primary/50",
        className,
      )}
    >
      {post.coverImage && (
        <div className="relative hidden h-24 w-24 shrink-0 overflow-hidden rounded-lg sm:block">
          <BlogImage
            image={post.coverImage}
            ratio={1}
            sizes="96px"
            widths={[192, 288]}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
          {post.title}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <time dateTime={dateAttribute(post.publishedAt)}>
              {formatDate(post.publishedAt)}
            </time>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {readingLabel(post.readingMinutes)}
          </span>
          {post.categories.slice(0, 2).map((category) => (
            <span key={category.slug} className="text-primary/80">
              {category.title}
            </span>
          ))}
        </div>
        {post.excerpt && (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}
