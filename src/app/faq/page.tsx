import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Questions about Opsburg, the platform that builds and ships your apps and AI agents and turns keeping your cloud up into a game.",
  alternates: { canonical: "/faq" },
};

const FAQS = [
  {
    q: "What is Opsburg?",
    a: "A platform that builds and ships your apps and AI agents, from the repository to your Kubernetes, with a game on top: your stack is a flying city, and keeping it up and running is how you play.",
  },
  {
    q: "What does it actually do?",
    a: "It creates repositories from templates on GitHub, GitLab or Azure DevOps with CI included, registers every version you build, deploys it through GitOps and Argo CD to your environments, and shows live state, logs and incidents. AI agents help read logs and propose fixes.",
  },
  {
    q: "Why a game?",
    a: "Because keeping a cloud up is a lot of small chores and a few bad nights. Streaks, missions and storm drills make the chores visible and the team faster when a real storm comes.",
  },
  {
    q: "Isn't gamification just badges and leaderboards?",
    a: "Not here. The streak belongs to the team, nobody is ranked or blamed, and the city grows with outcomes like uptime and patched services, not with commits. More on the Why a game page.",
  },
  {
    q: "Can people who don't write code build apps with it?",
    a: "Yes, that is the idea: describe the app and AI agents build it from a template your platform team approved, through tests, security checks and a human approval before production. More on the Vibe coding page.",
  },
  {
    q: "Is it a simulation?",
    a: "No. When you place a factory, a real service is created. When an airship takes off, a real version is built and deployed. The game is the interface, the infrastructure is yours.",
  },
  {
    q: "Who are the automatons?",
    a: "AI agents that work for your city. They read logs, propose fixes and repair damage after a storm, on the AI models you choose. Anything that touches production waits for your approval.",
  },
  {
    q: "Can I host it myself?",
    a: "Yes, that is the plan: one container, or a Helm chart on your Kubernetes, with your single sign-on.",
  },
  {
    q: "Can I play it today?",
    a: "Not yet. Opsburg is in the workshop. Follow the GitHub organization to see it take shape.",
  },
] as const;

export default function FaqPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-display text-4xl font-bold">Frequently asked questions</h1>
      <div className="mt-10 space-y-3">
        {FAQS.map((item) => (
          <details key={item.q} className="group rounded-lg brass-border bg-sky-deep/50 p-5">
            <summary className="cursor-pointer font-semibold list-none flex justify-between gap-4">
              {item.q}
              <span className="text-brass group-open:rotate-45 transition-transform" aria-hidden="true">
                +
              </span>
            </summary>
            <p className="text-ink mt-3">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
