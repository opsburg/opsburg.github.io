import Link from "next/link";
import type { Category } from "@/lib/blog/types";

/**
 * The topic row above the post list, shared by the index and the archives.
 *
 * `current` is the slug of the category being viewed, or undefined on /blog,
 * where "All posts" is the active entry instead.
 */
export default function CategoryFilter({
  categories,
  current,
}: {
  categories: Category[];
  current?: string;
}) {
  if (categories.length === 0) return null;

  const base =
    "rounded-md border px-3 py-1.5 text-sm no-underline transition-colors";
  const active = "border-primary bg-primary/10 text-primary";
  const idle =
    "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground";

  return (
    <nav
      aria-label="Topics"
      className="flex flex-wrap items-center gap-3 border-y border-border py-4"
    >
      <span className="text-xs uppercase tracking-wider text-muted-foreground">
        Topics
      </span>
      <Link
        href="/blog"
        aria-current={current ? undefined : "page"}
        className={`${base} ${current ? idle : active}`}
      >
        All posts
      </Link>
      {categories.map((category) => {
        const isCurrent = category.slug === current;
        return (
          <Link
            key={category.slug}
            href={`/blog/category/${category.slug}`}
            aria-current={isCurrent ? "page" : undefined}
            className={`${base} ${isCurrent ? active : idle}`}
          >
            {category.title}
          </Link>
        );
      })}
    </nav>
  );
}
