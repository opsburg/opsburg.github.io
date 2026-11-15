import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The shared body of the error pages: 404 (src/app/not-found.tsx) and the
 * runtime error boundaries (src/app/error.tsx, src/app/global-error.tsx).
 */
export default function ErrorScreen({
  code,
  title,
  children,
  icon,
  actions,
}: {
  code: string;
  title: string;
  children: ReactNode;
  icon: ReactNode;
  /** Extra buttons before the "Back to the city" link. */
  actions?: ReactNode;
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full brass-border bg-sky-deep/60 text-brass animate-drift">
        {icon}
      </div>
      <p className="mt-8 text-copper uppercase tracking-[0.25em] text-xs font-semibold">Error {code}</p>
      <h1 className="font-display text-4xl sm:text-5xl font-bold mt-3">
        <span className="brass-text">{title}</span>
      </h1>
      <div className="text-ink text-lg mt-6 space-y-3">{children}</div>
      <div className="flex flex-wrap justify-center gap-3 mt-10">
        {actions}
        <Link
          href="/"
          className="px-5 py-2.5 rounded-md font-semibold brass-button hover:brightness-110"
        >
          Back to the city
        </Link>
        <Link href="/faq" className="px-5 py-2.5 rounded-md brass-border bg-sky-deep/40 hover:bg-brass/10">
          Read the FAQ
        </Link>
      </div>
    </div>
  );
}
