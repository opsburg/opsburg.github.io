import Link from "next/link";
import { GITHUB_URL, SITE_NAME } from "@/lib/site";

export default function Navigation() {
  return (
    <header className="fixed top-0 inset-x-0 z-20 bg-sky-deep/80 backdrop-blur border-b border-brass/20">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold brass-text">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" width={32} height={32} />
          {SITE_NAME}
        </Link>
        <div className="flex items-center gap-5 text-sm text-ink">
          <Link href="/#platform" className="hover:text-cream hidden sm:inline">Platform</Link>
          <Link href="/#game" className="hover:text-cream hidden sm:inline">The game</Link>
          <Link href="/faq" className="hover:text-cream">FAQ</Link>
          <a href={GITHUB_URL} className="px-3 py-1.5 rounded-md brass-border text-cream hover:bg-brass/10">
            GitHub
          </a>
        </div>
      </nav>
    </header>
  );
}
