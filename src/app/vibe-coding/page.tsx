import type { Metadata } from "next";
import Link from "next/link";
import {
  Bot,
  Building2,
  Coins,
  Cpu,
  Fingerprint,
  KeyRound,
  Laptop,
  ScrollText,
  Server,
  ShieldCheck,
  Ship,
  Sparkles,
  UserCheck,
  UserX,
} from "lucide-react";
import WorkshopScene from "@/components/WorkshopScene";
import { GITHUB_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Vibe coding for everyone, governed",
  description:
    "Anyone in the company can describe an app or an AI agent and watch it get built. Opsburg makes sure it starts from your templates, passes your checks, waits for the right approval and runs on your cloud.",
  alternates: { canonical: "/vibe-coding" },
};

const RISKS = [
  {
    icon: Sparkles,
    title: "An app in an afternoon",
    text: "With AI, a marketer or an analyst can build a working tool in an afternoon. Great, until it holds customer data.",
  },
  {
    icon: Laptop,
    title: "Running where?",
    text: "On a laptop, a personal cloud account, a free hosting plan. Nobody knows it exists until it breaks or leaks.",
  },
  {
    icon: KeyRound,
    title: "Secrets in the code",
    text: "Keys pasted into a prompt end up in the repository, and in its history for good.",
  },
  {
    icon: UserX,
    title: "Nobody owns it",
    text: "No updates, no logs, no one on call. The person who built it moves on, the app stays.",
  },
] as const;

const STEPS = [
  {
    icon: ScrollText,
    title: "Start from an approved template",
    text: "The platform team owns the templates: stack, sign-on, logging, database. Nobody starts from a blank page or a random tutorial.",
  },
  {
    icon: Bot,
    title: "Describe it, the agents build it",
    text: "Say what you need. AI agents, on the models your company chose, write the code in a real repository on GitHub, GitLab or Azure DevOps, CI included.",
  },
  {
    icon: ShieldCheck,
    title: "Checks on every change",
    text: "Tests, security scans and your policies run before anything moves. A failed gate stops the airship, not the person: the agent reads the error and fixes it.",
  },
  {
    icon: UserCheck,
    title: "A person approves production",
    text: "Builders try things freely in their own environment. What reaches production waits for someone with the right role.",
  },
  {
    icon: Ship,
    title: "Shipped through GitOps",
    text: "Approved versions are deployed by Argo CD to your Kubernetes, behind your single sign-on, with rollback one click away.",
  },
  {
    icon: Building2,
    title: "It joins the city",
    text: "The new app gets a building, an owner, logs and alerts. When it needs care, its owner gets a mission, not a surprise.",
  },
] as const;

const FOR_BUILDERS = [
  "Build what you need without waiting months in a backlog",
  "No servers, keys or YAML to learn",
  "A live link to share as soon as it is approved",
  "Automatons that help when something breaks",
] as const;

const FOR_PLATFORM = [
  "Every app starts from a template you own",
  "Every change passes your checks",
  "Production only after the right approval",
  "One map of what runs, who owns it and what it costs",
] as const;

const WALLS = [
  { icon: Fingerprint, title: "Single sign-on and roles", text: "Who can build, who can approve, who can see. Your identity provider decides." },
  { icon: Cpu, title: "Your AI models", text: "Agents use only the providers and models you allow, with your keys." },
  { icon: KeyRound, title: "Secrets out of the code", text: "Keys are set on the platform by the people allowed to, never pasted into a prompt." },
  { icon: Coins, title: "Coal budgets", text: "Each workshop has a cost limit, so a weekend experiment doesn't burn the month's budget." },
  { icon: ScrollText, title: "Everything on the tape", text: "Every build, check, approval and deploy is recorded, with who did it and when." },
  { icon: Server, title: "On your cloud", text: "Self-hosted on your Kubernetes. The apps your people build never leave it." },
] as const;

export default function VibeCodingPage() {
  return (
    <div>
      {/* Hero: the workshop, the gates, the city */}
      {/* Text on top, the scene fills the rest of the screen below it */}
      <section className="relative -mt-16 flex min-h-[100svh] flex-col overflow-hidden bg-sky-deep">
        <div className="relative z-10 mx-auto max-w-3xl px-4 pt-24 text-center md:pt-28">
          <p className="text-copper uppercase tracking-[0.25em] text-xs font-semibold">Vibe coding, governed</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] mt-4">
            Vibe coding for everyone. <span className="brass-text">Governed.</span>
          </h1>
          <p className="text-ink text-lg mt-6">
            Anyone in the company can describe an app or an agent and watch it get built. Opsburg makes sure it starts from
            your templates, passes your checks, waits for the right approval and runs on your cloud, not on someone&apos;s
            laptop.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <a
              href="#how"
              className="px-5 py-2.5 rounded-md font-semibold text-sky-deep bg-gradient-to-r from-[#f1d27a] via-brass to-copper hover:brightness-110"
            >
              How it works
            </a>
            <a href={GITHUB_URL} className="px-5 py-2.5 rounded-md brass-border bg-sky-deep/40 hover:bg-brass/10">
              Follow the build on GitHub
            </a>
          </div>
        </div>
        <div className="relative min-h-[340px] flex-1 md:min-h-[420px]">
          <WorkshopScene />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-sky-deep to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-sky" />
        </div>
        <p className="sr-only">
          Animated scene: on a small island fenced in brass, a brass automaton builds an app floor by floor on a glowing
          blueprint. An airship lifts it and carries it through three brass gates labelled Tests, Security and
          Approval. At the last gate it waits until the lamp turns from amber to green, then it lands in the city,
          labelled Your cloud, and the new building&apos;s windows light up.
        </p>
      </section>

      {/* The risk */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl font-bold">The new shadow IT builds itself</h2>
        <p className="text-ink mt-3 max-w-2xl">
          Saying no doesn&apos;t work: people build anyway, because now they can. Opsburg says yes, inside the walls.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {RISKS.map((item) => (
            <div key={item.title} className="rounded-lg brass-border bg-sky-deep/50 p-5">
              <item.icon className="w-6 h-6 text-brass" aria-hidden="true" />
              <p className="font-semibold mt-3">{item.title}</p>
              <p className="text-ink text-sm mt-2">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-20">
        <h2 className="font-display text-3xl font-bold">From an idea to your cloud, through the gates</h2>
        <p className="text-ink mt-3 max-w-2xl">
          The same road for everyone, whether they write code for a living or have never opened a terminal.
        </p>
        <ol className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {STEPS.map((step, index) => (
            <li key={step.title} className="rounded-lg border border-copper/40 bg-copper/5 p-5">
              <div className="flex items-center gap-3">
                <span className="shrink-0 w-10 h-10 rounded-full brass-border flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-brass" aria-hidden="true" />
                </span>
                <p className="font-semibold">
                  <span className="text-copper mr-2">{index + 1}.</span>
                  {step.title}
                </p>
              </div>
              <p className="text-ink text-sm mt-3">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Two sides */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl font-bold">Freedom to build, and a platform that stays in charge</h2>
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <div className="rounded-lg brass-border bg-sky-deep/50 p-6">
            <p className="font-display text-xl text-cream">For the builder</p>
            <ul className="mt-4 space-y-2 text-ink text-sm list-disc pl-5 marker:text-brass">
              {FOR_BUILDERS.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg brass-border bg-sky-deep/50 p-6">
            <p className="font-display text-xl text-cream">For the platform team</p>
            <ul className="mt-4 space-y-2 text-ink text-sm list-disc pl-5 marker:text-brass">
              {FOR_PLATFORM.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* The walls */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl font-bold">The walls, one by one</h2>
        <p className="text-ink mt-3 max-w-2xl">The platform team draws them once. Everyone builds inside them.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {WALLS.map((item) => (
            <div key={item.title} className="rounded-lg brass-border bg-sky-deep/50 p-5">
              <item.icon className="w-6 h-6 text-copper" aria-hidden="true" />
              <p className="font-semibold mt-3">{item.title}</p>
              <p className="text-ink text-sm mt-2">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-3xl font-bold">
          Let everyone build. <span className="brass-text">Keep the city safe.</span>
        </h2>
        <p className="text-ink mt-4">
          Opsburg is in the workshop, not playable yet. Follow the build on GitHub, and tell us what your people are
          already building on their own.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <a
            href={GITHUB_URL}
            className="px-6 py-3 rounded-md font-semibold text-sky-deep bg-gradient-to-r from-[#f1d27a] via-brass to-copper hover:brightness-110"
          >
            github.com/opsburg
          </a>
          <Link href="/gamified-devops" className="px-6 py-3 rounded-md brass-border hover:bg-brass/10">
            Why gamified DevOps
          </Link>
        </div>
      </section>
    </div>
  );
}
