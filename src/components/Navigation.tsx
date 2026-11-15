import Link from "next/link";
import { FOLLOW_LINKS, SITE_NAME } from "@/lib/site";
import { SocialIcon } from "./FollowButtons";
import ThemeToggle from "./ThemeToggle";

export default function Navigation({ showBlog = false }: { showBlog?: boolean }) {
  return (
    <header className="fixed top-0 inset-x-0 z-20 bg-sky-deep/80 backdrop-blur border-b border-brass/20">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold brass-text">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" width={32} height={32} />
          {SITE_NAME}
        </Link>
        <div className="flex items-center gap-3 sm:gap-5 text-sm text-ink">
          <Link href="/#platform" className="hover:text-cream hidden md:inline">Platform</Link>
          <Link href="/gamified-devops" className="hover:text-cream hidden sm:inline">Why a game</Link>
          <Link href="/vibe-coding" className="hover:text-cream hidden sm:inline">Vibe coding</Link>
          {showBlog && <Link href="/blog" className="hover:text-cream">Blog</Link>}
          <Link href="/faq" className="hover:text-cream">FAQ</Link>
          <a
            href={FOLLOW_LINKS[0].href}
            target="_blank"
            rel="me noopener"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md brass-border text-cream hover:bg-brass/10"
          >
            <SocialIcon label={FOLLOW_LINKS[0].label} className="h-3.5 w-3.5" />
            Follow
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
