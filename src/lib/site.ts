export const SITE_NAME = "Opsburg";
export const SITE_URL = "https://opsburg.github.io";
export const GITHUB_URL = "https://github.com/opsburg";

export const TAGLINE = "Build your flying city. Run real infrastructure.";
export const DESCRIPTION =
  "Opsburg is a steampunk city builder for DevOps, SRE and platform engineers. Every building in your sky city is a real piece of infrastructure, every airship is a real deploy, and every storm is a real incident.";

/** What each piece of the city stands for in the real world. */
export const CITY = [
  { building: "Clocktower", real: "Control plane", text: "The heart of the city. It keeps every gear in time." },
  { building: "Boiler House", real: "Compute node", text: "Burns coal, makes steam. More boilers, more capacity." },
  { building: "Factory", real: "Service", text: "Where the actual work gets done, one assembly line per app." },
  { building: "Vault", real: "Database", text: "Thick walls, heavy doors. What goes in must come back out." },
  { building: "Telegraph", real: "Message queue", text: "Messages hop from tower to tower, even when the line is busy." },
  { building: "Observatory", real: "Monitoring", text: "Watches the sky so you see the storm before it hits." },
  { building: "Lightning Spire", real: "Firewall", text: "Takes the strike so the rest of the city does not." },
  { building: "Airship", real: "Deploy", text: "Carries a new version from the dockyard to every island." },
] as const;

export const FORCES = [
  { name: "Storms", real: "Incidents", text: "They roll in without warning. Your automatons fly out to repair the damage." },
  { name: "Pressure", real: "Load", text: "Too much steam in the pipes and something bursts. Too little and the city stalls." },
  { name: "Coal", real: "Cost", text: "Every boiler burns it. A good mayor knows where every lump goes." },
] as const;
