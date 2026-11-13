import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Questions about Opsburg, the city builder that keeps your company's people and agents working when a cloud or AI giant goes down.",
  alternates: { canonical: "/faq" },
};

const FAQS = [
  {
    q: "What is Opsburg?",
    a: "A city builder for the teams who keep a company running. Your flying city is your real stack: every building is a service, a server or an AI agent, wired to the providers it depends on. The game is keeping the city in the air when one of those providers fails.",
  },
  {
    q: "What problem does it solve?",
    a: "Work done by people and by AI agents now depends on a few US clouds and AI models. When one of them has an outage, processes stop and nobody inside the company can fix it. Opsburg makes those dependencies visible and helps you build alternatives you control.",
  },
  {
    q: "Is it against US providers?",
    a: "No. It is against depending on any single provider you cannot control. A US cloud behind a European one and a self-hosted model is a strong city; any single source with nothing behind it is a weak one.",
  },
  {
    q: "Is it a simulation?",
    a: "No. The buildings are your real services and servers, and the moves you make in the game are actions on them. A rehearsed blackout cuts a real dependency in a controlled way.",
  },
  {
    q: "Who are the automatons?",
    a: "AI agents that work for your city. They read logs, propose fixes and repair damage after a storm. They can run on more than one model, including one you host yourself, and anything that touches production waits for your approval.",
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
