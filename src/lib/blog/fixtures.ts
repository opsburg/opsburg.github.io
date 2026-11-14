import type { PortableTextBlock } from "@portabletext/types";
import type { Category, Post, PostSeo, PostSummary } from "./types";

/**
 * Placeholder posts for local development, active only with BLOG_FIXTURES=1.
 *
 * They exist so the blog (index, article, category archive, feed) can be worked
 * on before the CMS has content, or with no network at all. They are not
 * publishable copy: the env var is never set in CI, so these never ship.
 */

const CATEGORIES: Category[] = [
  {
    title: "Operations",
    slug: "operations",
    description: "Keeping a cloud up: incidents, drills, chores and recovery.",
  },
  {
    title: "The game",
    slug: "the-game",
    description: "Streaks, missions and the city: how the game is designed.",
  },
];

/** An untouched "Search & social" tab, which is how most posts ship. */
const NO_SEO: PostSeo = {
  metaTitle: null,
  metaDescription: null,
  keywords: [],
  canonicalUrl: null,
  metaImage: null,
  noIndex: false,
  noFollow: false,
  openGraph: null,
  twitter: null,
};

// Minimal Portable Text builders. The fixtures are content, not a test of the
// serializer, so paragraphs, headings and lists are enough.
let key = 0;
const nextKey = () => `fx${(key += 1)}`;

function span(text: string) {
  return { _type: "span", _key: nextKey(), text, marks: [] as string[] };
}

function block(
  text: string,
  style: "normal" | "h2" | "h3" | "blockquote" = "normal",
): PortableTextBlock {
  return {
    _type: "block",
    _key: nextKey(),
    style,
    markDefs: [],
    children: [span(text)],
  } as PortableTextBlock;
}

function listItem(text: string): PortableTextBlock {
  return {
    _type: "block",
    _key: nextKey(),
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [span(text)],
  } as PortableTextBlock;
}

function code(
  source: string,
  language = "json",
  filename?: string,
): PortableTextBlock {
  return {
    _type: "code",
    _key: nextKey(),
    language,
    filename,
    code: source,
  } as unknown as PortableTextBlock;
}

/** @sanity/table's shape: rows of plain strings, first row as the header. */
function table(rows: string[][]): PortableTextBlock {
  return {
    _type: "table",
    _key: nextKey(),
    rows: rows.map((cells) => ({
      _type: "tableRow",
      _key: nextKey(),
      cells,
    })),
  } as unknown as PortableTextBlock;
}

const POSTS: Post[] = [
  {
    slug: "a-storm-drill-in-daylight",
    title: "A storm drill in daylight",
    excerpt:
      "Most teams rehearse recovery for the first time during the real outage. A storm drill breaks one boiler house on purpose, in office hours, and times the repair.",
    publishedAt: "2026-08-12T08:00:00Z",
    updatedAt: null,
    readingMinutes: 6,
    coverImage: null,
    categories: [CATEGORIES[0], CATEGORIES[1]],
    seo: NO_SEO,
    author: null,
    body: [
      block(
        "The first time most teams restore a database from backup is the night they need to. A drill moves that first time to a Tuesday afternoon.",
      ),
      block("What a drill breaks", "h2"),
      listItem("one compute node drained, to see the services move"),
      listItem("one expired certificate, to see who notices"),
      listItem("one bad deploy, to time the rollback"),
      block("Practice is cheaper than the pager.", "blockquote"),
      code(
        `{
  "drill": "boiler-house-3",
  "breaks": "node drain",
  "goal": "services rescheduled in under 5 minutes"
}`,
        "json",
        "drills/boiler-house-3.json",
      ),
      table([
        ["In the city", "In the real world"],
        ["Storm", "Incident"],
        ["Boiler House", "Compute node"],
        ["Automaton", "AI agent"],
      ]),
    ],
  },
  {
    slug: "uptime-streaks-belong-to-the-team",
    title: "Uptime streaks belong to the team",
    excerpt:
      "A streak turns a quiet day into something worth protecting. It only works if nobody is ranked by it.",
    publishedAt: "2026-06-30T08:00:00Z",
    updatedAt: "2026-07-15T08:00:00Z",
    readingMinutes: 5,
    coverImage: null,
    categories: [CATEGORIES[1]],
    seo: NO_SEO,
    author: null,
    body: [
      block("Every day the city stays in the air adds to the streak."),
      block("No leaderboard of people", "h2"),
      block("The streak is shared, and so is the storm that breaks it."),
      block("What counts", "h3"),
      block("Outcomes like uptime and patched services, never commits."),
    ],
  },
];

/**
 * Index pages get the same summary the CMS would return: no article body and no
 * SEO fields, neither of which a card uses.
 */
export function fixturePosts(): PostSummary[] {
  return POSTS.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    readingMinutes: post.readingMinutes,
    coverImage: post.coverImage,
    categories: post.categories,
  }));
}

export function fixtureSlugs(): string[] {
  return POSTS.map((post) => post.slug);
}

export function fixturePost(slug: string): Post | null {
  return POSTS.find((post) => post.slug === slug) ?? null;
}

export function fixtureCategories(): Category[] {
  return CATEGORIES;
}
