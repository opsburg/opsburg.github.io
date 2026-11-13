import { Anchor, CloudLightning, Flame, Map, Ship, Target, Trophy, Wrench } from "lucide-react";
import HeroScene from "@/components/HeroScene";
import { CITY, DESCRIPTION, FORCES, GAME, GITHUB_URL, PLATFORM } from "@/lib/site";

const GAME_ICONS = [Flame, Target, CloudLightning, Map];

const STEPS = [
  {
    icon: Anchor,
    title: "Found your city",
    text: "Connect your Git provider, your cluster and your sign-on. Your first island rises from the clouds with a clocktower on top.",
  },
  {
    icon: Wrench,
    title: "Build on real ground",
    text: "Place a factory and Opsburg creates the service or the agent: repository, pipeline, container, all from proven templates.",
  },
  {
    icon: Ship,
    title: "Launch the airships",
    text: "Tag a version and an airship takes off. Behind it, a real build and a real GitOps deploy through Argo CD.",
  },
  {
    icon: Trophy,
    title: "Keep the city flying",
    text: "When something breaks a storm hits the island. Read the telegraph, send your automatons, clear the sky and keep the streak.",
  },
] as const;

export default function Home() {
  return (
    <div>
      {/* Hero: full screen, the 3D city behind the headline */}
      <section className="relative -mt-16 h-[100svh] min-h-[600px] overflow-hidden bg-sky-deep">
        <HeroScene />
        {/* Scrims keep the headline readable over the scene */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-sky-deep/90 via-sky-deep/50 to-transparent md:bg-gradient-to-r md:from-sky-deep/90 md:via-sky-deep/45 md:via-30% md:to-transparent md:to-55%" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-sky" />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-24 pt-24 md:justify-center md:pb-16">
          <div className="max-w-xl">
            <p className="text-copper uppercase tracking-[0.25em] text-xs font-semibold">A city builder for your cloud</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] mt-4">
              Keep your cloud <span className="brass-text">up and running</span>. Play it like a city.
            </h1>
            <p className="text-ink text-lg mt-6">{DESCRIPTION}</p>
            <div className="flex flex-wrap gap-3 mt-8">
              <a
                href={GITHUB_URL}
                className="px-5 py-2.5 rounded-md font-semibold text-sky-deep bg-gradient-to-r from-[#f1d27a] via-brass to-copper hover:brightness-110"
              >
                Follow the build on GitHub
              </a>
              <a href="#platform" className="px-5 py-2.5 rounded-md brass-border bg-sky-deep/40 hover:bg-brass/10">
                See what it does
              </a>
            </div>
            <p className="text-sm text-ink/80 mt-4">In the workshop. Not playable yet.</p>
          </div>
        </div>
        <p className="sr-only">
          Animated scene: a steampunk city floats over the clouds. A storm rolls in and lightning strikes a boiler house,
          which goes dark with a red lamp. A small brass automaton flies out from the clocktower, repairs it, and the lights
          come back on. The city keeps flying.
        </p>
        <a
          href="#platform"
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-xs uppercase tracking-[0.25em] text-ink/80 hover:text-cream"
        >
          Scroll
        </a>
      </section>

      {/* The platform */}
      <section id="platform" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-20">
        <h2 className="font-display text-3xl font-bold">Build, ship and run, in one place</h2>
        <p className="text-ink mt-3 max-w-2xl">
          Under the brass, Opsburg is a real platform for your apps and AI agents: your repositories, your pipelines, your
          Kubernetes.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {PLATFORM.map((item) => (
            <div key={item.name} className="rounded-lg brass-border bg-sky-deep/50 p-5">
              <p className="font-display text-lg text-cream">{item.name}</p>
              <p className="text-copper text-sm font-semibold mt-1">{item.real}</p>
              <p className="text-ink text-sm mt-3">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The game */}
      <section id="game" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-20">
        <h2 className="font-display text-3xl font-bold">Keeping it up is the game</h2>
        <p className="text-ink mt-3 max-w-2xl">
          Running a cloud is a hundred small chores and a few bad nights. Opsburg turns them into a city your team wants to
          look after.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {GAME.map((item, index) => {
            const Icon = GAME_ICONS[index];
            return (
              <div key={item.name} className="rounded-lg border border-copper/40 bg-copper/5 p-5">
                <Icon className="w-6 h-6 text-copper" aria-hidden="true" />
                <p className="font-semibold mt-3">{item.name}</p>
                <p className="text-ink text-sm mt-2">{item.text}</p>
              </div>
            );
          })}
        </div>
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

      {/* How it works */}
      <section id="how" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-20">
        <h2 className="font-display text-3xl font-bold">How a city grows</h2>
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

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-3xl font-bold">
          The shipyard is <span className="brass-text">open</span>
        </h2>
        <p className="text-ink mt-4">
          Opsburg is in the workshop. Follow the GitHub organization to see it take shape, and tell us which storm keeps
          you up at night.
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
