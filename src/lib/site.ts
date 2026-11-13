export const SITE_NAME = "Opsburg";
export const SITE_URL = "https://opsburg.github.io";
export const GITHUB_URL = "https://github.com/opsburg";

export const TAGLINE = "When the giants stumble, your city keeps flying.";
export const DESCRIPTION =
  "Your company's work, done by people and by AI agents, now runs on a handful of US clouds and AI models. One hiccup on their side and everything stops. Opsburg is a city builder for the teams who keep it running: every building is real infrastructure, and the game is making sure no single giant can ground your city.";

/** The dependency the whole game is about: where the city gets its power. */
export const POWER = [
  {
    name: "Foreign power plants",
    real: "US cloud and AI providers",
    text: "Cheap, strong, and not yours. Most of your city draws from two or three of them.",
  },
  {
    name: "Blackout",
    real: "A provider outage",
    text: "A region goes down, a model is rate-limited, a login service fails. People stop. Agents stop. Nobody on your side can fix it.",
  },
  {
    name: "Own engines",
    real: "Infrastructure you control",
    text: "Your servers, a European cloud, an open model you run yourself. Slower to build, impossible to switch off from outside.",
  },
  {
    name: "Reserve lines",
    real: "Failover",
    text: "A second source behind every building that matters, ready to take the load when the first one goes dark.",
  },
] as const;

/** What each piece of the city stands for in the real world. */
export const CITY = [
  { building: "Clocktower", real: "Control plane", text: "The heart of the city. It keeps every gear in time." },
  { building: "Boiler House", real: "Compute node", text: "Burns coal, makes steam. More boilers, more capacity." },
  { building: "Factory", real: "Service", text: "Where the actual work gets done, one assembly line per app." },
  { building: "Vault", real: "Database", text: "Thick walls, heavy doors. What goes in must come back out." },
  { building: "Telegraph", real: "Message queue", text: "Messages hop from tower to tower, even when the line is busy." },
  { building: "Observatory", real: "Monitoring", text: "Watches the sky so you see the storm before it hits." },
  { building: "Lightning Spire", real: "Firewall", text: "Takes the strike so the rest of the city does not." },
  { building: "Automaton", real: "AI agent", text: "Works day and night, as long as its power plant answers." },
] as const;

export const FORCES = [
  { name: "Storms", real: "Incidents", text: "They roll in without warning. Your automatons fly out to repair the damage." },
  { name: "Pressure", real: "Load", text: "Too much steam in the pipes and something bursts. Too little and the city stalls." },
  { name: "Coal", real: "Cost", text: "Every boiler burns it. A good mayor knows where every lump goes." },
] as const;
