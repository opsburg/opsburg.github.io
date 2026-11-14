import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import BlogImage from "./BlogImage";
import type { CmsImage } from "@/lib/blog/types";

/**
 * Serializer for article bodies.
 *
 * The CMS hands over Portable Text — a tree, not HTML — which means the markup
 * is decided here, in one place, and no tag typed into the CMS reaches the
 * page. It is also why nothing in the blog needs dangerouslySetInnerHTML.
 *
 * Typography lives in globals.css under `.article`; this file only decides
 * structure. Every type handled here must exist in the Studio schema
 * (studio/schemaTypes/blockContent.ts) and vice versa: adding one on only one
 * side makes it invisible.
 */

interface LinkMark {
  href?: string;
  blank?: boolean;
}

interface CalloutValue {
  tone?: "note" | "warning";
  text?: string;
}

/** @sanity/code-input's value. `highlightedLines` is ignored: rendering it
 *  would need a real highlighter in the page, and the site ships none. */
interface CodeValue {
  code?: string;
  language?: string;
  filename?: string;
}

/** @sanity/table's value: rows of plain strings, no per-cell formatting. */
interface TableValue {
  rows?: { _key?: string; cells?: string[] }[];
}

const CALLOUT_TONES = {
  note: "border-primary/30 bg-primary/5",
  warning: "border-yellow-500/40 bg-yellow-500/10",
} as const;

const components: PortableTextComponents = {
  block: {
    // Headings inside an article start at h2: the h1 is the article title.
    h2: ({ children, value }) => <h2 id={headingId(value)}>{children}</h2>,
    h3: ({ children, value }) => <h3 id={headingId(value)}>{children}</h3>,
    h4: ({ children }) => <h4>{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote>
        <p>{children}</p>
      </blockquote>
    ),
    normal: ({ children }) => <p>{children}</p>,
  },

  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    code: ({ children }) => <code>{children}</code>,
    underline: ({ children }) => (
      <span className="underline underline-offset-2">{children}</span>
    ),

    // External link. `rel="noopener"` whenever it opens a new tab; no blanket
    // nofollow — a link to a source deserves to pass value.
    link: ({ children, value }) => {
      const { href, blank } = (value ?? {}) as LinkMark;
      if (!href) return <>{children}</>;
      return (
        <a
          href={href}
          {...(blank
            ? { target: "_blank", rel: "noopener noreferrer" }
            : undefined)}
        >
          {children}
        </a>
      );
    },

    // Link to another post: the query projects the referenced slug into href.
    internalLink: ({ children, value }) => {
      const { href } = (value ?? {}) as { href?: string };
      if (!href) return <>{children}</>;
      return <Link href={`/blog/${href}`}>{children}</Link>;
    },
  },

  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
    number: ({ children }) => <ol>{children}</ol>,
  },

  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },

  types: {
    image: ({ value }) => {
      const image = value as CmsImage;
      if (!image?.ref) return null;
      return (
        <figure>
          <BlogImage
            image={image}
            sizes="(min-width: 768px) 720px, 100vw"
            className="w-full rounded-lg border border-primary/20"
          />
          {image.caption ? <figcaption>{image.caption}</figcaption> : null}
        </figure>
      );
    },

    // A note or a warning: it sits outside the thread of the argument but
    // inside the article, so it is an <aside>, not a bolded paragraph.
    callout: ({ value }) => {
      const { tone = "note", text } = (value ?? {}) as CalloutValue;
      if (!text) return null;
      return (
        <aside
          className={`rounded-lg border px-5 py-4 text-[0.95rem] leading-relaxed ${
            CALLOUT_TONES[tone] ?? CALLOUT_TONES.note
          }`}
        >
          {text}
        </aside>
      );
    },

    code: ({ value }) => {
      const { code, language, filename } = (value ?? {}) as CodeValue;
      if (!code) return null;
      return (
        <div className="code-block">
          {filename && <p className="code-block-name">{filename}</p>}
          <pre>
            <code className={language ? `language-${language}` : undefined}>
              {code}
            </code>
          </pre>
        </div>
      );
    },

    // The plugin stores no header flag, so the first row is the header by
    // convention — which is also the only arrangement that makes sense for the
    // comparison tables these posts use.
    table: ({ value }) => {
      const rows = ((value ?? {}) as TableValue).rows ?? [];
      if (rows.length === 0) return null;
      const [header, ...body] = rows;

      return (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {(header.cells ?? []).map((cell, index) => (
                  <th key={index} scope="col">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, rowIndex) => (
                <tr key={row._key ?? rowIndex}>
                  {(row.cells ?? []).map((cell, index) => (
                    <td key={index}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },

    divider: () => <hr />,
  },
};

/**
 * Anchor for a heading, so a section of an article can be linked directly.
 * Derived from the heading text, falling back to the block's key, which is
 * stable in the CMS.
 */
function headingId(block: PortableTextBlock): string | undefined {
  const text = (block.children ?? [])
    .map((child) => ("text" in child ? String(child.text) : ""))
    .join(" ");
  const slug = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || (block._key ? `section-${block._key}` : undefined);
}

export default function ArticleBody({ value }: { value: PortableTextBlock[] }) {
  return (
    <div className="article">
      <PortableText value={value} components={components} />
    </div>
  );
}
