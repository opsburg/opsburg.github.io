import Link from "next/link";
import { GITHUB_URL, SITE_NAME, TAGLINE } from "@/lib/site";

export default function Footer() {
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
          <Link href="/faq" className="hover:text-cream">FAQ</Link>
          <a href={GITHUB_URL} className="hover:text-cream">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
