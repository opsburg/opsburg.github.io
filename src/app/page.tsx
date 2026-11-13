import { Anchor, Bot, CloudLightning, GitBranch, Ship, Wrench } from "lucide-react";
import SkyCity from "@/components/SkyCity";
import { CITY, DESCRIPTION, FORCES, GITHUB_URL } from "@/lib/site";

const STEPS = [
  {
    icon: Anchor,
    title: "Found your city",
    text: "Connect your Git provider and your cluster. Your first island rises from the clouds with a clocktower on top.",
  },
  {
    icon: Wrench,
    title: "Build on real ground",
    text: "Place a factory and Opsburg creates the service: repository, pipeline, container, all from proven templates.",
  },
  {
    icon: Ship,
    title: "Launch the airships",
    text: "Tag a version and an airship takes off. Behind it, a real build and a real GitOps deploy through Argo CD.",
  },
  {
    icon: CloudLightning,
    title: "Weather the storms",
    text: "When something breaks, a storm hits the island. Read the logs, send your automatons, watch the sky clear.",
  },
] as const;

const BACKSTAGE = [
  { icon: GitBranch, title: "Your Git, your pipelines", text: "GitHub, GitLab and Azure DevOps. The code lives in your repositories, not in the game." },
  { icon: Ship, title: "GitOps under the hull", text: "Deploys go through Argo CD to your Kubernetes. Every airship leaves a commit behind." },
  { icon: Bot, title: "Automatons with a brain", text: "AI agents do the heavy lifting: they read logs, open fixes and ask before they touch production." },
] as const;

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-10 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-copper uppercase tracking-[0.25em] text-xs font-semibold">A city builder for DevOps</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight mt-4">
            Build your <span className="brass-text">flying city</span>.
            <br />
            Run real infrastructure.
          </h1>
          <p className="text-ink text-lg mt-6 max-w-xl">{DESCRIPTION}</p>
          <div className="flex flex-wrap gap-3 mt-8">
            <a
              href={GITHUB_URL}
              className="px-5 py-2.5 rounded-md font-semibold text-sky-deep bg-gradient-to-r from-[#f1d27a] via-brass to-copper hover:brightness-110"
            >
              Follow the build on GitHub
            </a>
            <a href="#city" className="px-5 py-2.5 rounded-md brass-border hover:bg-brass/10">
              Tour the city
            </a>
          </div>
          <p className="text-sm text-ink/70 mt-4">In the workshop. Not playable yet.</p>
        </div>
        <SkyCity />
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

      {/* Backstage */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl font-bold">Behind the brass</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {BACKSTAGE.map((item) => (
            <div key={item.title} className="rounded-lg brass-border bg-sky-deep/50 p-5">
              <item.icon className="w-6 h-6 text-brass" aria-hidden="true" />
              <p className="font-semibold mt-3">{item.title}</p>
              <p className="text-ink text-sm mt-2">{item.text}</p>
            </div>
          ))}
        </div>
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
