import { Bot, Cog, Map, ServerCog, ShieldCheck, Siren, Users } from "lucide-react";
import SkyCity from "@/components/SkyCity";
import { CITY, DESCRIPTION, FORCES, GITHUB_URL, POWER } from "@/lib/site";

const STOPS = [
  {
    icon: Users,
    title: "People stop",
    text: "The cloud region that hosts your tools goes down. Tickets, deploys, dashboards: the whole team waits for someone else's status page.",
  },
  {
    icon: Bot,
    title: "Agents stop",
    text: "The AI model behind your agents is rate-limited or offline. Every automated process that called it stalls, all at once.",
  },
  {
    icon: Siren,
    title: "Nobody can fix it",
    text: "The failure is not in your code or your servers. There is nothing to roll back, nobody to page, no date for the return.",
  },
] as const;

const STEPS = [
  {
    icon: Map,
    title: "Map your power lines",
    text: "Found your city from your real stack. Every building shows which provider it draws power from, so the single points of failure light up on the map.",
  },
  {
    icon: ServerCog,
    title: "Build your own engines",
    text: "Move what matters onto infrastructure you control: your servers, a European cloud, an open model you run yourself.",
  },
  {
    icon: Cog,
    title: "Lay reserve lines",
    text: "Give each critical building and each automaton a second source, so the load moves over when the first one goes dark.",
  },
  {
    icon: ShieldCheck,
    title: "Rehearse the blackout",
    text: "Cut a power plant on purpose and watch what keeps flying. Fix what falls before a real outage finds it.",
  },
] as const;

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-10 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-copper uppercase tracking-[0.25em] text-xs font-semibold">Business continuity, played as a city</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight mt-4">
            When the giants stumble, your city <span className="brass-text">keeps flying</span>.
          </h1>
          <p className="text-ink text-lg mt-6 max-w-xl">{DESCRIPTION}</p>
          <div className="flex flex-wrap gap-3 mt-8">
            <a
              href={GITHUB_URL}
              className="px-5 py-2.5 rounded-md font-semibold text-sky-deep bg-gradient-to-r from-[#f1d27a] via-brass to-copper hover:brightness-110"
            >
              Follow the build on GitHub
            </a>
            <a href="#risk" className="px-5 py-2.5 rounded-md brass-border hover:bg-brass/10">
              See the risk
            </a>
          </div>
          <p className="text-sm text-ink/70 mt-4">In the workshop. Not playable yet.</p>
        </div>
        <SkyCity />
      </section>

      {/* The risk */}
      <section id="risk" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-20">
        <h2 className="font-display text-3xl font-bold">One hiccup over there, a full stop over here</h2>
        <p className="text-ink mt-3 max-w-2xl">
          Your processes now run on people and on agents, and both run on a few US clouds and AI models. When one of them
          has a bad hour, it is your bad hour too.
        </p>
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {STOPS.map((item) => (
            <div key={item.title} className="rounded-lg border border-copper/40 bg-copper/5 p-5">
              <item.icon className="w-6 h-6 text-copper" aria-hidden="true" />
              <p className="font-semibold mt-3">{item.title}</p>
              <p className="text-ink text-sm mt-2">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Power */}
      <section id="power" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-20">
        <h2 className="font-display text-3xl font-bold">Where your city gets its power</h2>
        <p className="text-ink mt-3 max-w-2xl">
          In Opsburg the dependency is something you can see. Every building is wired to a power plant, and the map shows
          what goes dark when one of them does.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {POWER.map((item) => (
            <div key={item.name} className="rounded-lg brass-border bg-sky-deep/50 p-5">
              <p className="font-display text-lg text-cream">{item.name}</p>
              <p className="text-copper text-sm font-semibold mt-1">{item.real}</p>
              <p className="text-ink text-sm mt-3">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-20">
        <h2 className="font-display text-3xl font-bold">How a city learns to fly on its own</h2>
        <ol className="grid md:grid-cols-2 gap-6 mt-8">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <div className="shrink-0 w-11 h-11 rounded-full brass-border flex items-center justify-center">
                <step.icon className="w-5 h-5 text-brass" aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold">
                  <span className="text-copper mr-2">{index + 1}.</span>
                  {step.title}
                </p>
                <p className="text-ink text-sm mt-1">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* The city */}
      <section id="city" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-20">
        <h2 className="font-display text-3xl font-bold">Every building is the real thing</h2>
        <p className="text-ink mt-3 max-w-2xl">
          No toy simulation. Each piece of your city is backed by a piece of your stack, and each move in the game is an
          action on it.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {CITY.map((item) => (
            <div key={item.building} className="rounded-lg brass-border bg-sky-deep/50 p-5">
              <p className="font-display text-lg text-cream">{item.building}</p>
              <p className="text-copper text-sm font-semibold mt-1">{item.real}</p>
              <p className="text-ink text-sm mt-3">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {FORCES.map((force) => (
            <div key={force.name} className="rounded-lg border border-copper/40 bg-copper/5 p-5">
              <p className="font-display text-lg">
                {force.name} <span className="text-copper text-sm font-sans font-semibold">= {force.real}</span>
              </p>
              <p className="text-ink text-sm mt-2">{force.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-3xl font-bold">
          Build a city that <span className="brass-text">stays up</span>
        </h2>
        <p className="text-ink mt-4">
          Opsburg is in the workshop. Follow the GitHub organization to see it take shape, and tell us which outage
          stopped your company last time.
        </p>
        <a
          href={GITHUB_URL}
          className="inline-block mt-8 px-6 py-3 rounded-md font-semibold text-sky-deep bg-gradient-to-r from-[#f1d27a] via-brass to-copper hover:brightness-110"
        >
          github.com/opsburg
        </a>
      </section>
    </div>
  );
}
