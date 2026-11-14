import type { Metadata } from "next";
import { DESCRIPTION, GITHUB_URL, SITE_NAME, SITE_URL } from "./site";

export { GITHUB_URL, SITE_NAME, SITE_URL };

/** The social card every page falls back to (public/og.jpg, 1280×640). */
export const OG_IMAGE = `${SITE_URL}/og.jpg`;

/** Search terms every page adds to its own. */
export const CORE_KEYWORDS = [
  "internal developer platform",
  "platform engineering",
  "GitOps",
  "Kubernetes",
  "SRE",
  "gamified DevOps",
];

interface PageMetaInput {
  title: string;
  description: string;
  /** Path with a leading slash, e.g. "/blog". Used for canonical and og:url. */
  path: string;
  keywords?: string[];
  /** Set for pages that should stay out of the index. */
  noindex?: boolean;
}

/** A full metadata object for a page: canonical, robots, Open Graph and X card. */
export function pageMetadata({ title, description, path, keywords = [], noindex = false }: PageMetaInput): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    keywords: [...keywords, ...CORE_KEYWORDS],
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
      images: [{ url: OG_IMAGE, width: 1280, height: 640, alt: SITE_NAME }],
    },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE] },
  };
}

export const ORGANIZATION_DESCRIPTION = DESCRIPTION;
