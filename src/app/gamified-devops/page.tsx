import type { Metadata } from "next";
import Link from "next/link";
import { Award, Ban, CloudLightning, EyeOff, Flame, Hammer, Hourglass, ListChecks, Map, Siren, Users } from "lucide-react";
import StreakScene from "@/components/StreakScene";
import { GITHUB_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Why gamified DevOps",
  description:
    "Keeping a cloud up is invisible work: chores get postponed, incidents are rehearsed live, knowledge sits in a few heads. Opsburg turns it into a city your team can see, share and want to look after.",
  alternates: { canonical: "/gamified-devops" },
};

const PROBLEMS = [
  {
    icon: EyeOff,
    title: "Success looks like nothing",
    text: "When the cloud is up there is nothing to see. The work behind it only shows up the day it fails.",
  },
  {
    icon: Hourglass,
    title: "Chores get postponed",
    text: "Upgrades, patches, renewals and clean-ups always lose against the next feature, until one of them turns into an incident.",
  },
  {
    icon: Siren,
    title: "Incidents are rehearsed live",
    text: "Most teams practise recovery for the first time during the real outage, at night, with everyone watching.",
  },
  {
    icon: Users,
    title: "Knowledge lives in a few heads",
    text: "The map of what runs where sits in a wiki nobody reads, or in the head of whoever is on call.",
  },
] as const;

const WHY = [
  {
    icon: Map,
    title: "A picture anyone can read",
    text: "A city shows at a glance what is healthy, what is under pressure and what is broken. A new hire learns the platform by walking through it.",
  },
  {
    icon: Flame,
    title: "A goal you can feel",
    text: "A streak turns “nothing happened today” into something worth protecting, and a storm weathered fast into a save, not a failure.",
  },
  {
    icon: ListChecks,
    title: "Small, clear steps",
    text: "Missions split the chores into things you can finish today, each with a reason, an owner and a visible result.",
  },
  {
    icon: CloudLightning,
    title: "Practice without the pager",
    text: "Storm drills let the team rehearse an incident on purpose, in daylight, so the real one finds everyone ready.",
  },
  {
    icon: Award,
    title: "Credit for the quiet work",
    text: "Every finished mission adds to the city. Whoever patched the vault or renewed the seal gets seen by the whole team.",
  },
  {
    icon: Hammer,
    title: "Play is the real thing",
    text: "There is no separate game to keep up to date. Every move in the city is an action on your stack, with the same approvals.",
  },
] as const;

const MISSIONS = [
  { real: "Renew a TLS certificate before it expires", city: "Reseal the Lightning Spire" },
  { real: "Patch a base image with known vulnerabilities", city: "Reline the boilers" },
  { real: "Add a replica before a traffic peak", city: "Fire up a reserve boiler" },
  { real: "Remove an environment nobody uses", city: "Dismantle an empty island and save the coal" },
  { real: "Rehearse an incident on purpose", city: "Call a storm drill" },
  { real: "Write the notes after an incident", city: "Log the storm on the telegraph tape" },
] as const;

const NOT = [
  {
    title: "Not a leaderboard of people",
    text: "The streak belongs to the city, which means the team. Nobody is ranked, and nobody is blamed for the storm.",
  },
  {
    title: "Not points for busywork",
    text: "The city grows with outcomes: up, patched, cheaper. Commits and closed tickets earn nothing on their own.",
  },
  {
    title: "Not a simulation",
    text: "When a mission is done, a real certificate was renewed or a real replica added. The game is the interface, the cloud is yours.",
  },
] as const;

export default function GamifiedDevopsPage() {
  return (
    <div>
      {/* Hero: the city grows one building per day of the streak */}
      <section className="relative -mt-16 h-[100svh] min-h-[600px] overflow-hidden bg-sky-deep">
        <StreakScene />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-sky-deep/90 via-sky-deep/50 to-transparent md:bg-gradient-to-r md:from-sky-deep/90 md:via-sky-deep/45 md:via-30% md:to-transparent md:to-55%" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-sky" />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-24 pt-24 md:justify-center md:pb-16">
          <div className="max-w-xl">
            <p className="text-copper uppercase tracking-[0.25em] text-xs font-semibold">Why gamified DevOps</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] mt-4">
              The work that keeps your cloud up <span className="brass-text">deserves to be seen</span>.
            </h1>
            <p className="text-ink text-lg mt-6">
              When the cloud is up, nobody notices. The patch, the renewed certificate, the alert answered at 3 a.m.: all
              invisible. Opsburg turns that work into a city that grows every day it stays in the air, so the whole team
              can see it, share it and want to do it.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <a
                href="#why"
                className="px-5 py-2.5 rounded-md font-semibold text-sky-deep bg-gradient-to-r from-[#f1d27a] via-brass to-copper hover:brightness-110"
              >
                Why it works
              </a>
              <Link href="/#platform" className="px-5 py-2.5 rounded-md brass-border bg-sky-deep/40 hover:bg-brass/10">
                The platform underneath
              </Link>
            </div>
          </div>
        </div>
        <p className="sr-only">
          Animated scene: a clocktower stands alone on a floating island. Every day the cloud stays up, a lamp on the
          island&apos;s rim turns green and a new building rises in a puff of steam. On the seventh day an airship dock is
          built, an airship lands, fireworks go up and the airship sails off with the next release.
        </p>
      </section>

      {/* The problem */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl font-bold">Running a cloud is invisible work</h2>
        <p className="text-ink mt-3 max-w-2xl">
          Dashboards tell you what is wrong right now. They don&apos;t make anyone want to do the boring things that keep it
          from going wrong.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {PROBLEMS.map((item) => (
            <div key={item.title} className="rounded-lg brass-border bg-sky-deep/50 p-5">
              <item.icon className="w-6 h-6 text-brass" aria-hidden="true" />
              <p className="font-semibold mt-3">{item.title}</p>
              <p className="text-ink text-sm mt-2">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why a game */}
      <section id="why" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-20">
        <h2 className="font-display text-3xl font-bold">What a game does better than a dashboard</h2>
        <p className="text-ink mt-3 max-w-2xl">
          Games are very good at one thing: making people care about a system and come back to look after it. That is
          exactly what keeping a cloud up needs.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {WHY.map((item) => (
            <div key={item.title} className="rounded-lg border border-copper/40 bg-copper/5 p-5">
              <item.icon className="w-6 h-6 text-copper" aria-hidden="true" />
              <p className="font-semibold mt-3">{item.title}</p>
              <p className="text-ink text-sm mt-2">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Missions are real tasks */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl font-bold">Every mission is a real task</h2>
        <p className="text-ink mt-3 max-w-2xl">
          The game word never hides the real one. Each mission shows the task, the resource it touches and the change it
          makes.
        </p>
        <div className="mt-8 overflow-hidden rounded-lg brass-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-sky-deep/70">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold text-cream">
                  The real work
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-copper">
                  The mission in the city
                </th>
              </tr>
            </thead>
            <tbody>
              {MISSIONS.map((row) => (
                <tr key={row.real} className="border-t border-brass/20">
                  <td className="px-4 py-3 text-ink">{row.real}</td>
                  <td className="px-4 py-3 font-display text-cream">{row.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* What it is not */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl font-bold">What it is not</h2>
        <p className="text-ink mt-3 max-w-2xl">Gamification done wrong is surveillance with badges. These are the rules we build by.</p>
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {NOT.map((item) => (
            <div key={item.title} className="rounded-lg brass-border bg-sky-deep/50 p-5">
              <Ban className="w-6 h-6 text-copper" aria-hidden="true" />
              <p className="font-semibold mt-3">{item.title}</p>
              <p className="text-ink text-sm mt-2">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-3xl font-bold">
          Keeping it up <span className="brass-text">is the game</span>
        </h2>
        <p className="text-ink mt-4">
          Streaks, missions and storm drills are in the workshop, not playable yet. Follow the build on GitHub, and tell us
          which chore your team keeps postponing.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <a
            href={GITHUB_URL}
            className="px-6 py-3 rounded-md font-semibold text-sky-deep bg-gradient-to-r from-[#f1d27a] via-brass to-copper hover:brightness-110"
          >
            github.com/opsburg
          </a>
          <Link href="/vibe-coding" className="px-6 py-3 rounded-md brass-border hover:bg-brass/10">
            Vibe coding, governed
          </Link>
        </div>
      </section>
    </div>
  );
}
