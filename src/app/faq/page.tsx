import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Questions about Opsburg, the steampunk city builder where every building is real infrastructure.",
  alternates: { canonical: "/faq" },
};

const FAQS = [
  {
    q: "What is Opsburg?",
    a: "A city builder for DevOps, SRE and platform engineers. You grow a flying steampunk city, and every building, airship and storm maps to a real piece of your infrastructure: services, deploys, incidents.",
  },
  {
    q: "Is it a simulation?",
    a: "No. When you place a factory, a real service is created. When an airship takes off, a real version is built and deployed. The game is the interface, the infrastructure is yours.",
  },
  {
    q: "What does it connect to?",
    a: "GitHub, GitLab and Azure DevOps for code and pipelines, Argo CD and Kubernetes for deploys, and the major AI model providers for the automatons.",
  },
  {
    q: "Who are the automatons?",
    a: "AI agents that work for your city. They read logs, propose fixes and repair damage after a storm. Anything that touches production waits for your approval.",
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
