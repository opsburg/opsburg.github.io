import Link from "next/link";
import { COOKIE_POLICY_URL, PRIVACY_POLICY_URL, SITE_NAME, SOCIAL_LINKS, TAGLINE } from "@/lib/site";

export default function Footer({ showBlog = false }: { showBlog?: boolean }) {
  return (
    <footer className="border-t border-brass/20 mt-24">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col sm:flex-row gap-6 justify-between text-sm text-ink">
        <div>
          <p className="font-display text-lg brass-text">{SITE_NAME}</p>
          <p className="mt-1">{TAGLINE}</p>
        </div>
        <div className="flex flex-wrap gap-5 items-start">
          <Link href="/gamified-devops" className="hover:text-cream">Why a game</Link>
          <Link href="/vibe-coding" className="hover:text-cream">Vibe coding</Link>
          {showBlog && <Link href="/blog" className="hover:text-cream">Blog</Link>}
          <Link href="/faq" className="hover:text-cream">FAQ</Link>
        </div>
      </div>
      <nav aria-label="Opsburg on social media" className="max-w-6xl mx-auto px-4 pb-6 flex flex-wrap gap-5 text-sm text-ink">
        {SOCIAL_LINKS.map((s) => (
          <a key={s.href} href={s.href} rel="me noopener" target="_blank" className="hover:text-cream">
            {s.label}
          </a>
        ))}
      </nav>
      <div className="max-w-6xl mx-auto px-4 pb-8 flex flex-wrap gap-5 text-xs text-ink/70">
        <a href={PRIVACY_POLICY_URL} className="hover:text-cream">Privacy policy</a>
        <a href={COOKIE_POLICY_URL} className="hover:text-cream">Cookie policy</a>
        <Link href="/terms" className="hover:text-cream">Terms</Link>
        {/* iubenda opens the consent preferences on any link with this class. */}
        <a href="#" className="iubenda-cs-preferences-link hover:text-cream">Cookie settings</a>
      </div>
    </footer>
  );
}
