import { LEGAL } from "@/lib/legal";
import { COOKIE_POLICY_URL, PRIVACY_POLICY_URL } from "@/lib/site";

const PAGES = [
  { href: PRIVACY_POLICY_URL, label: "Privacy policy" },
  { href: COOKIE_POLICY_URL, label: "Cookie policy" },
  { href: "/terms", label: "Terms of use" },
] as const;

/** The frame the three legal pages share: title, date, a link to the other two, then the text. */
export default function LegalPage({
  title,
  path,
  children,
}: {
  title: string;
  path: "/terms";
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-display text-4xl font-bold">{title}</h1>
      <p className="mt-3 text-sm text-ink">Last updated: {LEGAL.updated}</p>
      <nav aria-label="Legal" className="mt-4 flex flex-wrap gap-4 text-sm">
        {PAGES.filter((p) => p.href !== path).map((p) => (
          <a key={p.href} href={p.href} className="text-brass hover:text-cream underline underline-offset-4">
            {p.label}
          </a>
        ))}
      </nav>
      <div className="article mt-10">{children}</div>
    </div>
  );
}
