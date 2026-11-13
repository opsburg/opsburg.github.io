export const SITE_NAME = "Opsburg";
export const SITE_URL = "https://opsburg.dev";
export const GITHUB_URL = "https://github.com/opsburg";

export const TAGLINE = "Keep your cloud up and running. Play it like a city.";
export const DESCRIPTION =
  "Opsburg builds and ships your apps and AI agents, from the repository to your Kubernetes. Then it turns running them into a game: every service is a building, every deploy an airship, every incident a storm. Your team keeps the city flying, and your cloud stays up.";

/** What the platform does, before any game. */
export const PLATFORM = [
  {
    name: "Build",
    real: "Apps and AI agents from templates",
    text: "Describe the service or the agent you need. Opsburg creates the repository on GitHub, GitLab or Azure DevOps, from a proven template, CI included.",
  },
  {
    name: "Ship",
    real: "One click to your Kubernetes",
    text: "A tag builds the image and registers the version. One click deploys it through GitOps and Argo CD, in every environment, with rollback.",
  },
  {
    name: "Run",
    real: "Logs, health, AI that helps",
    text: "Live state, logs and incidents for every service. AI agents read the logs, propose the fix and wait for your approval before touching production.",
  },
  {
    name: "Your rules",
    real: "SSO, roles, your models",
    text: "Your single sign-on, your roles, your AI models, your cloud. Self-host it, or connect it to your AI client through MCP.",
  },
] as const;

/** What each piece of the city stands for in the real world. */
export const CITY = [
  { building: "Clocktower", real: "Control plane", text: "The heart of the city. It keeps every gear in time." },
  { building: "Boiler House", real: "Compute node", text: "Burns coal, makes steam. More boilers, more capacity." },
  { building: "Factory", real: "Service", text: "Where the actual work gets done, one assembly line per app." },
  { building: "Vault", real: "Database", text: "Thick walls, heavy doors. What goes in must come back out." },
  { building: "Telegraph", real: "Message queue and logs", text: "Messages hop from tower to tower, and every one leaves a line on the tape." },
  { building: "Observatory", real: "Monitoring", text: "Watches the sky so you see the storm before it hits." },
  { building: "Airship", real: "Deploy", text: "Carries a new version from the shipyard to every island." },
  { building: "Automaton", real: "AI agent", text: "Flies out to repair what a storm broke, and asks before it touches production." },
] as const;

export const FORCES = [
  { name: "Storms", real: "Incidents", text: "They roll in without warning. Weather them fast and the city keeps its streak." },
  { name: "Pressure", real: "Load", text: "Too much steam in the pipes and something bursts. Too little and the city stalls." },
  { name: "Coal", real: "Cost", text: "Every boiler burns it. A good mayor knows where every lump goes." },
] as const;

/** The game: what makes keeping the cloud up something a team wants to do. */
export const GAME = [
  {
    name: "Uptime streaks",
    text: "Every day the city stays in the air adds to the streak. A storm you weather fast keeps it alive.",
  },
  {
    name: "Missions",
    text: "Real chores turned into missions: patch the vaults, retire the old airships, add a reserve boiler before the season of storms.",
  },
  {
    name: "Storm drills",
    text: "Rehearse an incident on purpose and see who repairs it first. Better drills, shorter real storms.",
  },
  {
    name: "A city that grows",
    text: "Every service, environment and team adds a building. The city is the picture of your platform, for everyone to see.",
  },
] as const;
