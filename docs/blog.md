# The blog: how it works and how to switch it on

The site is a static export (`output: "export"` in `next.config.ts`): what ends
up on GitHub Pages is HTML, CSS, JS and images. Nothing runs there, so no CMS
can run on the site itself.

So the blog works like this:

```
Write on opsburg.sanity.studio  (Sanity Studio, hosted)
        │  hit Publish
        ▼
Sanity webhook  →  GitHub repository_dispatch (sanity-publish)
        ▼
GitHub Actions: CMS rebuild  →  Deploy to GitHub Pages
                (pnpm run build, reading posts from Sanity's API)
        ▼
GitHub Pages  →  opsburg.dev/blog/...   static HTML
```

The CMS is headless: it only serves content over an API, and pages are generated
at build time. What goes online is HTML and CSS like the rest of the site — no
JavaScript needed to read a post, no calls to the CMS from a reader's browser.

**The consequence that matters:** a post published in the Studio appears online
when the build finishes, not immediately. In practice a couple of minutes.

## Project coordinates

| | |
|---|---|
| Sanity organisation | `o5wpf39s3` |
| Project ID | `4q8ff9y3` |
| Dataset | `production` (public, anonymous read) |
| Hosted Studio | https://opsburg.sanity.studio |
| Project settings | https://www.sanity.io/manage/project/4q8ff9y3 |

Project ID and dataset are not secrets — both appear in plain text in every
image URL served from Sanity's CDN — so they live in the code
(`src/lib/blog/client.ts`) rather than in GitHub secrets. The `SANITY_PROJECT_ID`
and `SANITY_DATASET` env vars exist only to point somewhere else without editing
it; `SANITY_PROJECT_ID=off` builds the site with no blog at all.

## Switching it on

### 1. Make the dataset public

At https://www.sanity.io/manage/project/4q8ff9y3/datasets the `production`
dataset must be **public**: the build reads it anonymously, with no token. A
private dataset makes every blog query fail, and a failed query fails the build
on purpose (see the end of this page).

### 2. Publish the Studio

The Studio is the only part with an admin UI, and Sanity hosts it for free. From
`studio/`:

```bash
cd studio
pnpm install
pnpm run deploy      # claims opsburg.sanity.studio and publishes
```

The first `pnpm run deploy` asks you to authenticate (`pnpm dlx sanity login`)
and prints an application id — paste it into `studio/sanity.cli.ts` as
`deployment.appId`, otherwise every later deploy stops to ask which application
to update. After that it only needs rerunning when the schema in
`studio/schemaTypes/` changes; the Studio pulls Sanity's own updates by itself.

To work on the schema locally: `pnpm dev` (Studio on http://localhost:3333,
pointed at the production dataset, so content edits are real) and
`pnpm run validate` to check the schema.

> **Why the Studio has its own `pnpm-workspace.yaml`.** It is a separate app and
> its ~900 dependencies must not end up in the site's install or its bundle. But
> pnpm walks up the tree looking for a workspace file and the repository root has
> one, so without `studio/pnpm-workspace.yaml` an install here resolves against
> that root and installs nothing. That file makes `studio/` its own pnpm root,
> with its own lockfile and its own `node_modules`. Do not delete it, and do not
> add `studio` to the root workspace's packages: the site's `pnpm install` in CI
> would then install the whole Studio on every build.

### 3. The webhook that rebuilds the site

**a) GitHub token.** At https://github.com/settings/personal-access-tokens create
a fine-grained token with:

- Repository access: only `opsburg/opsburg.github.io`
- Permissions → Repository → **Contents: Read and write**
  (this is what authorises `repository_dispatch`)
- Expiry: the longest you can accept. **When it expires the blog stops
  self-updating** — manual runs and pushes still deploy.

**b) Sanity token.** At
https://www.sanity.io/manage/project/4q8ff9y3/api → *Tokens* → *Add API token*,
role **Administrator**. It is used once, by the script below, to create the
webhook; the build never sees it.

**c) Create the webhook.**

```bash
SANITY_AUTH_TOKEN=<token from b> \
GITHUB_DISPATCH_TOKEN=<token from a> \
  ./scripts/create-sanity-webhook.sh
```

Re-running is safe: the script stops if a webhook already points at the same
URL. Neither token is read from a file, written to one, or echoed.

The script exists because two of the nine fields — the GROQ filter and the
projection — are the ones that silently break the chain when mistyped: a wrong
projection still gets a `204` out of GitHub, and no build ever starts. The
Sanity CLI is no help here; `sanity hooks create` only opens the Manage UI in a
browser.

<details>
<summary>The same thing by hand, if you would rather use the UI</summary>

At https://www.sanity.io/manage/project/4q8ff9y3/api/webhooks →
*Create webhook*:

| Field | Value |
|---|---|
| Name | `Rebuild the site` |
| URL | `https://api.github.com/repos/opsburg/opsburg.github.io/dispatches` |
| Dataset | `production` |
| Trigger on | Create, Update, Delete |
| Filter | `_type == "post" \|\| _type == "category"` |
| Projection | `{"event_type": "sanity-publish"}` |
| Status | Enabled |
| HTTP method | `POST` |
| API version | `v2025-02-19` |
| Headers | `Authorization: Bearer <token from step a>`<br>`Accept: application/vnd.github+json` |

</details>

**d) Check it.** Publish a test post and look at two things: the webhook's
*Attempt log* (expect `204`) at
https://www.sanity.io/manage/project/4q8ff9y3/api/webhooks, and a **CMS
rebuild** run appearing in
https://github.com/opsburg/opsburg.github.io/actions.

To test the GitHub half on its own, without touching content — this needs no
Sanity webhook and no PAT, only a logged-in `gh`:

```bash
gh api -X POST repos/opsburg/opsburg.github.io/dispatches \
  -f event_type=sanity-publish
```

If the webhook is missing or broken the site still updates on every push to
`main`, and *Deploy to GitHub Pages* can be run by hand.

**e) Green run, old content.** If a rebuild finishes clean and the site still
shows the previous version of a post, suspect Next's fetch cache before the
webhook. The CMS reads live in `src/lib/blog/client.ts`, and Next stores each
response under `.next/cache/fetch-cache`; a `force-cache` there gets a one-year
TTL, so any workflow step that restores `.next/cache` between runs pins the blog
to the content of the first build. That is why the queries carry a
`revalidate: 5` and why the workflow caches only the pnpm store. Do not add a
`.next/cache` step: it buys a few seconds of build time and costs correctness.

## The two pipelines

```
.github/workflows/
  deploy.yml        push to main, pull_request, manual, workflow_call
  cms-rebuild.yml   repository_dispatch (sanity-publish) -> calls deploy.yml
```

Both end in the same deploy, and the build exists once — `cms-rebuild.yml` calls
`deploy.yml` rather than repeating it, so there is no second copy to keep in
step. What the split buys is legibility: in the Actions tab, *Deploy to GitHub
Pages* runs are code changes and *CMS rebuild* runs are content changes, which
is the first thing you want to know when the site shows something unexpected.

Two things about this arrangement that are easy to get wrong:

- **The two workflows must not share a concurrency group.** `cms-rebuild.yml`
  and the `deploy.yml` run it calls are two separate runs. If both waited on
  `pages`, the caller would hold the group while the callee queued behind it,
  and the rebuild would never start. So the caller has its own group,
  `cms-rebuild` — which still collapses a burst of publications into one
  rebuild — and `pages` stays on the workflow that actually deploys.
- **A called workflow gets no secrets unless they are passed.** Hence
  `secrets: inherit` in `cms-rebuild.yml`; without it the build loses the
  reCAPTCHA key and the Search Console token. Permissions work the other way
  round: a called workflow can drop them but never add them, so the set granted
  in the caller has to cover everything `deploy.yml` does.

## Studio plugins

Four plugins, each backing one type or one tab. The rule they all follow: a
field visible in the Studio is a field the site renders. Anything else gets
hidden or removed, because a panel that invites an author to fill in something
the site ignores is worse than no panel.

| Plugin | What it gives the author | Where the site reads it |
|---|---|---|
| `@sanity/code-input` | the `code` block: syntax highlighting, language dropdown, filename | `ArticleBody.tsx` → `code` |
| `@sanity/table` | the `table` block: rows of plain strings | `ArticleBody.tsx` → `table` |
| `sanity-plugin-seofields` | the post's "Search & social" tab (`seoFields`) | the `seo` projection in `queries.ts`, consumed in `blog/[slug]/page.tsx` |
| `@sanity/vision` | GROQ console, for trying a query before it goes in the site | — (authoring tool) |

Two details worth knowing:

- **Tables have no header flag.** `@sanity/table` stores rows and nothing else,
  so the serializer treats the **first row as the header**. There is no way to
  mark a table as headerless; if you need one, put a dash in the first row.
- **The code block's highlighted lines are not rendered.** The plugin lets you
  click line numbers to highlight them; showing that on the site would need a
  syntax highlighter in the page, and the site ships none — code blocks are
  static markup. The language and the filename are rendered.

### The SEO tab

`seoFields` offers far more than a blog needs, so the plugin is configured down
to what the site actually consumes (`studio/sanity.config.ts`):

- **Search**: title, description, keywords, canonical URL, meta image, robots
  (`noIndex` / `noFollow`), plus the live SERP preview
- **Open Graph** and **X / Twitter**: title, description, image, card type
- switched off: focus keyword, hreflangs (the site is English-only), custom meta
  attributes, the GEO checklist and the meta-tag HTML preview

Every field is optional, and each has a fallback derived from the post: title →
post title, description → excerpt, images → cover image → the site card. A post
whose SEO tab was never opened is still fully described. The plugin's own
`buildSeoMeta` helper is deliberately **not** used: the site keeps its metadata
pipeline in `src/lib/seo.ts` and reads these fields as plain data, so a Studio
plugin never becomes a dependency of the website.

### Plugins that were removed

- `sanity-plugin-another-table` — a Sanity **v2** plugin (`sanity.json` /
  `parts`, peer dependency on `@sanity/base@^2.30`, React 17). It cannot load in
  Studio 6. `@sanity/table` replaces it.
- `sanity-plugin-markdown` — an alternative body format, not an addition.
  Portable Text stays the single format: the markup is decided by one serializer
  in the site, which is what keeps CMS-authored HTML out of the pages and means
  restyling the blog never touches a post.
- `next-sanity` — a toolkit for querying and live-previewing from Next.js. It
  belongs to a website, not to the Studio, and this website does not need it:
  `src/lib/blog/client.ts` is a plain `fetch` against the query API, which is
  all a build-time read of a public dataset requires.
- `@sanity/image-url` — moved out of the Studio and into the **site**, where it
  is used (`src/lib/blog/image.ts`). It is the reason the hotspot works: both
  image fields enable it, and turning a stored hotspot into the right CDN
  parameters is what the builder does. Hand-rolled URLs had to fall back to
  `crop=entropy`, which guesses.

## Writing a post

1. https://opsburg.sanity.studio → **Post** → Create.
2. Title, then generate the URL slug from it.
3. Excerpt: two lines for someone who has not opened the page. It is what shows
   in the index, in search results and in a LinkedIn preview.
4. Categories: one or two.
5. Cover: landscape, at least 1600px on the long edge, with alt text.
6. Body. Section headings start at "Section heading (H2)" — the h1 is already
   the post title.
7. Publish.

Two things worth knowing:

- **Never change a slug after publishing.** A live URL is one someone may have
  saved or linked; changing it breaks that. Titles can always be fixed, slugs
  cannot.
- **The published date does not schedule anything.** It only sets the order in
  the index. A post goes live when you hit Publish, future date or not — and a
  future-dated post that is never published never appears by itself.

To pull a post: Unpublish in the Studio. The next build removes the page from
the site and from the sitemap.

## How it is put together

```
src/lib/blog/
  client.ts     GROQ over HTTP to Sanity's API (no SDK)
  queries.ts    the queries: the only place that knows the CMS schema
  types.ts      the shape content takes for the rest of the app
  index.ts      the API pages use (getPosts, getPost, ...)
  image.ts      URLs and srcsets from Sanity's image CDN, hotspot included
  seo.ts        social images and the data structured data needs
  fixtures.ts   fake posts for local development
src/components/blog/
  ArticleBody.tsx     Portable Text to HTML: the markup is decided here
  BlogImage.tsx       <img> with a srcset from the CDN
  PostCard.tsx        index preview
  CategoryFilter.tsx  the topic row, shared by index and archives
  NoPosts.tsx         empty state
src/lib/structuredData.ts   blogIndexSchema / blogPostingSchema, tied to the
                            site's Organization and WebSite by @id
src/app/blog/
  page.tsx                  /blog
  [slug]/page.tsx           /blog/post-name
  category/[slug]/page.tsx  /blog/category/category-name
  rss.xml/route.ts          /blog/rss.xml
studio/                     the CMS: separate project, never part of the site
scripts/create-sanity-webhook.sh  creates the publish -> rebuild webhook
.github/workflows/
  deploy.yml                build and deploy; also callable
  cms-rebuild.yml           what a publication in the CMS triggers
```

Pages import from `src/lib/blog` and nothing deeper: they know neither GROQ nor
Sanity. Article typography lives in `src/app/globals.css` under `.article`,
because that markup comes from a serializer and cannot carry Tailwind utilities
element by element.

The `Blog` entry in the header and the footer is conditional: the root layout
calls `hasPosts()` and only passes `showBlog` once the CMS has a published post,
so an empty blog is never advertised.

### Local development without the CMS

```bash
BLOG_FIXTURES=1 pnpm dev
```

Renders the blog with two fake posts (`src/lib/blog/fixtures.ts`), handy for
working on layout and styles. The variable is never set in CI, so it cannot
reach production.

### Three decisions worth not undoing

**A failed CMS query fails the build.** `src/lib/blog/client.ts` throws instead
of returning an empty list. A build that "succeeds" with zero posts — a network
blip, a dataset flipped to private, a wrong project id — would publish a site
with every article silently deleted. A red build leaves what is online
untouched.

**Queries hit `api.sanity.io`, not `apicdn.sanity.io`.** The CDN can lag a
publication by a few seconds, and the build starts at the moment of publication:
through the CDN we would risk shipping the previous version of the post that was
just published.

**There is a reserved `no-posts-yet` page.** With `output: "export"` Next.js
aborts the build if a dynamic route generates no page at all, which is exactly
the state of `/blog/[slug]` and `/blog/category/[slug]` while the CMS is empty.
That page is `noindex`, excluded from the sitemap and linked from nowhere, and it
stops being generated as soon as a real post exists.
