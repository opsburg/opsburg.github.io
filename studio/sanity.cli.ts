import { defineCliConfig } from "sanity/cli"

// `sanity deploy` publishes the Studio to opsburg.sanity.studio. That
// is where posts get written — the site itself is a static export and ships no
// admin surface at all.
export default defineCliConfig({
  api: {
    projectId: "4q8ff9y3",
    dataset: "production",
  },
  // The hostname is claimed on the first deploy.
  studioHost: "opsburg",
  deployment: {
    // Let the Studio pull Sanity's own updates, so nobody has to remember to
    // redeploy it for a patch release.
    autoUpdates: true,
    // Printed by the first `sanity deploy`: without it every later deploy stops
    // to ask which application to update.
    appId: "xy6bdoh588o2wh020h8afz3h",
  },
})
