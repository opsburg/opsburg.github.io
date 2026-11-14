#!/usr/bin/env bash
#
# Creates the Sanity webhook that rebuilds this site when a post is published.
#
# The Studio is where content changes; the site is static HTML built by GitHub
# Actions. This webhook is the wire between the two: on every create, update or
# delete of a post or a category, Sanity POSTs to GitHub's repository_dispatch
# API with event_type "sanity-publish", which is what .github/workflows/
# cms-rebuild.yml listens for.
#
# It exists as a script rather than as instructions because two of the nine
# fields — the GROQ filter and the projection — are the ones that silently break
# the chain when mistyped: a wrong projection produces a 204 from GitHub and no
# build. `sanity hooks create` is no help; in the current CLI it only opens the
# Manage UI in a browser.
#
# Usage:
#
#   SANITY_AUTH_TOKEN=...  GITHUB_DISPATCH_TOKEN=...  ./scripts/create-sanity-webhook.sh
#
# Neither token is read from a file, written to one, or echoed. Where they come
# from:
#
#   SANITY_AUTH_TOKEN     https://www.sanity.io/manage/project/4q8ff9y3/api
#                         → Tokens → Add API token, role Administrator. Only
#                         this script needs it; it is not used at build time.
#
#   GITHUB_DISPATCH_TOKEN https://github.com/settings/personal-access-tokens
#                         → fine-grained token, this repository only,
#                         Repository permissions → Contents: Read and write
#                         (that is what authorises repository_dispatch).
#                         NOTE: when it expires the blog stops updating itself;
#                         pushes and manual runs still deploy.
#
# Re-running is safe: it stops if a webhook already points at the same URL.

set -euo pipefail

PROJECT_ID="4q8ff9y3"
DATASET="production"
REPO="opsburg/opsburg.github.io"

# The event type cms-rebuild.yml listens for. Changing it here means changing it
# there too, and nothing tells you if they disagree: GitHub answers 204 to a
# dispatch nothing is listening for.
EVENT_TYPE="sanity-publish"

# The Manage API that owns webhooks, pinned. Read off the Sanity CLI, which
# calls the same endpoint (@sanity/cli: actions/hook/constants.ts).
HOOK_API="v2025-08-04"
# The API version the webhook itself runs its filter and projection under.
# Same one the site's queries are pinned to, in src/lib/blog/client.ts.
HOOK_RULE_API="v2025-02-19"

DISPATCH_URL="https://api.github.com/repos/${REPO}/dispatches"
HOOKS_ENDPOINT="https://api.sanity.io/${HOOK_API}/hooks/projects/${PROJECT_ID}"

die() { printf '%s\n' "$*" >&2; exit 1; }

[[ -n "${SANITY_AUTH_TOKEN:-}" ]] || die "SANITY_AUTH_TOKEN is not set — see the header of this script."
[[ -n "${GITHUB_DISPATCH_TOKEN:-}" ]] || die "GITHUB_DISPATCH_TOKEN is not set — see the header of this script."
command -v jq >/dev/null || die "jq is required."

echo "Checking the webhooks already on project ${PROJECT_ID}…"
existing=$(curl -fsS -H "Authorization: Bearer ${SANITY_AUTH_TOKEN}" "${HOOKS_ENDPOINT}") \
  || die "Could not read the project's webhooks. Is SANITY_AUTH_TOKEN valid, and does it have Administrator rights?"

if jq -e --arg url "${DISPATCH_URL}" 'any(.[]; .url == $url)' >/dev/null <<<"${existing}"; then
  echo
  echo "A webhook already points at ${DISPATCH_URL}:"
  jq -r --arg url "${DISPATCH_URL}" \
    '.[] | select(.url == $url) | "  \(.name)  (id \(.id), \(if .isDisabled then "DISABLED" else "enabled" end))"' \
    <<<"${existing}"
  echo
  echo "Nothing to do. To replace it, delete it first:"
  echo "  cd studio && pnpm exec sanity hooks delete"
  exit 0
fi

# The payload shape is the Manage API's `document` hook. `projection` is the
# request body GitHub receives, so event_type has to survive as a literal
# string — hence the escaped quotes.
payload=$(jq -n \
  --arg url "${DISPATCH_URL}" \
  --arg dataset "${DATASET}" \
  --arg apiVersion "${HOOK_RULE_API}" \
  --arg event "${EVENT_TYPE}" \
  --arg auth "Bearer ${GITHUB_DISPATCH_TOKEN}" \
  '{
     name: "Rebuild the site",
     description: "A post or category changed: rebuild and redeploy opsburg.dev.",
     type: "document",
     url: $url,
     dataset: $dataset,
     apiVersion: $apiVersion,
     httpMethod: "POST",
     includeDrafts: false,
     isDisabled: false,
     headers: {
       Authorization: $auth,
       Accept: "application/vnd.github+json"
     },
     rule: {
       on: ["create", "update", "delete"],
       filter: "_type == \"post\" || _type == \"category\" || _type == \"author\"",
       projection: ("{\"event_type\": \"" + $event + "\"}")
     }
   }')

echo "Creating the webhook…"
created=$(curl -fsS -X POST "${HOOKS_ENDPOINT}" \
  -H "Authorization: Bearer ${SANITY_AUTH_TOKEN}" \
  -H "Content-Type: application/json" \
  --data-binary "${payload}") \
  || die "Creating the webhook failed. The tokens are never printed, so re-read the error above from curl."

echo
jq -r '"Created: \(.name)\n  id       \(.id)\n  url      \(.url)\n  dataset  \(.dataset)\n  on       \(.rule.on | join(", "))\n  filter   \(.rule.filter)"' <<<"${created}"
echo
cat <<'NEXT'
Now check it end to end:

  1. Publish (or re-publish) any post in the Studio.
  2. The webhook's attempt log should show 204:
     https://www.sanity.io/manage/project/4q8ff9y3/api/webhooks
  3. A "CMS rebuild" run should appear:
     https://github.com/opsburg/opsburg.github.io/actions

To test the GitHub half on its own, without touching content:

  gh api -X POST repos/opsburg/opsburg.github.io/dispatches \
    -f event_type=sanity-publish
NEXT
