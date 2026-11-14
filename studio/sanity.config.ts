import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"
import { codeInput } from "@sanity/code-input"
import { table } from "@sanity/table"
import seofields from "sanity-plugin-seofields"
import { schemaTypes } from "./schemaTypes"

/**
 * The Studio, i.e. the authoring app.
 *
 * It is a separate application from the site: it lives on
 * opsburg.sanity.studio, keeps its dependencies in
 * studio/package.json, and never enters the Next.js static export. The site
 * reads content from Sanity's API during `next build` and knows nothing about
 * this panel.
 */
export default defineConfig({
  name: "default",
  title: "Blog - Opsburg",

  projectId: "4q8ff9y3",
  dataset: "production",

  plugins: [
    structureTool(),
    // GROQ console, for checking a query before it goes into the site.
    visionTool({ defaultApiVersion: "2025-02-19" }),

    // The `code` type used in article bodies: syntax highlighting, a language
    // dropdown and an optional filename. Half the posts on this blog are going
    // to contain a config snippet.
    codeInput(),

    // The `table` type used in article bodies. Rows of plain strings — see the
    // serializer in src/components/blog/ArticleBody.tsx, which treats the first
    // row as the header.
    table(),

    // The `seoFields` object used by the post's "Search & social" tab.
    //
    // Every field left visible here is one the site actually reads (see the seo
    // projection in src/lib/blog/queries.ts). The rest are switched off on
    // purpose: a panel that invites an author to fill in a field the site
    // ignores is worse than no panel.
    seofields({
      seoPreview: {
        prefix: (doc) => {
          const slug = (doc.slug as { current?: string } | undefined)?.current
          return `/blog/${slug || "untitled"}`
        },
        // The site renders titles as "<page> | Opsburg" (src/app/layout.tsx),
        // so the preview has to show it too
        // or the length warnings are measured against the wrong string.
        titleSuffix: "Opsburg",
      },
      // Not read by the site:
      // - focusKeyword / geoChecklist / metaTagsPreview are authoring aids that
      //   would be stored in the document without ever being rendered
      // - hreflangs: the site is English-only
      // - metaAttributes: arbitrary meta tags are not something we want authored
      //   per post
      defaultHiddenFields: ["focusKeyword", "hreflangs", "metaAttributes"],
      geo: false,
      metaTagsPreview: false,
      fieldGroups: [
        {
          name: "meta",
          title: "Search",
          default: true,
          fields: [
            "title",
            "description",
            "keywords",
            "canonicalUrl",
            "metaImage",
            "robots",
            "preview",
          ],
        },
        { name: "openGraph", title: "Open Graph", fields: ["openGraph"] },
        { name: "twitter", title: "X / Twitter", fields: ["twitter"] },
      ],
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
