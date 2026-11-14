/**
 * Publishes the drafts whose publishedAt has arrived.
 *
 * Why this exists rather than a date filter on the site's query: the site is a
 * static export, and src/lib/blog/queries.ts deliberately has no
 * `publishedAt <= now()` clause, because a future-dated post would sit
 * invisible until some later build that might never happen. Keeping
 * "published in the CMS" and "visible on the site" the same thing is worth
 * more than scheduling, so scheduling is built the other way round: the post
 * stays a draft until its date, and then something publishes it for real.
 *
 * That something is this script. Publishing fires the Sanity webhook that
 * already drives .github/workflows/cms-rebuild.yml, so nothing here needs to
 * know how the site is built.
 *
 * No @sanity/client: same reasoning as src/lib/blog/client.ts — two HTTP calls
 * do not justify a dependency.
 */

const PROJECT_ID = process.env.SANITY_PROJECT_ID || "4q8ff9y3";
const DATASET = process.env.SANITY_DATASET || "production";
const TOKEN = process.env.SANITY_WRITE_TOKEN;
const DRY_RUN = process.env.DRY_RUN === "true";
const API = `https://${PROJECT_ID}.api.sanity.io/v2023-05-03`;

if (!TOKEN) {
  console.error("SANITY_WRITE_TOKEN is not set.");
  process.exit(1);
}

const auth = { Authorization: `Bearer ${TOKEN}` };

async function json(res, what) {
  if (!res.ok) throw new Error(`${what}: HTTP ${res.status} ${await res.text()}`);
  return res.json();
}

// Drafts carry the full document, so one query is enough to both find them and
// have the body to publish.
const QUERY = `*[_id in path("drafts.**") && _type == "post"
  && defined(slug.current) && defined(publishedAt) && publishedAt <= now()]`;

const found = await json(
  await fetch(`${API}/data/query/${DATASET}?query=${encodeURIComponent(QUERY)}`, { headers: auth }),
  "query",
);
const due = found.result ?? [];

if (due.length === 0) {
  console.log("Nothing due.");
  process.exit(0);
}

console.log(`${due.length} post(s) due:`);
for (const d of due) console.log(`  ${d.publishedAt}  ${d.slug.current}`);

if (DRY_RUN) {
  console.log("DRY_RUN: nothing was published.");
  process.exit(0);
}

// Publishing is createOrReplace at the id without the drafts. prefix, then
// removing the draft — the same two operations the Studio's Publish performs.
const mutations = due.flatMap((doc) => {
  const published = { ...doc, _id: doc._id.replace(/^drafts\./, "") };
  delete published._rev;
  delete published._createdAt;
  delete published._updatedAt;
  return [{ createOrReplace: published }, { delete: { id: doc._id } }];
});

const result = await json(
  await fetch(`${API}/data/mutate/${DATASET}`, {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify({ mutations }),
  }),
  "mutate",
);

console.log(`Published ${due.length}. Transaction ${result.transactionId}.`);
console.log("The Sanity webhook now triggers the CMS rebuild; no build is started here.");
