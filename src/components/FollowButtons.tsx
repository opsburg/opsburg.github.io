import { siBluesky, siGithub, siInstagram, siThreads, siX } from "simple-icons";
import { FOLLOW_LINKS } from "@/lib/site";

const ICONS: Record<string, { path: string }> = {
  Instagram: siInstagram,
  X: siX,
  Bluesky: siBluesky,
  Threads: siThreads,
  GitHub: siGithub,
};

/** The brand mark of one of Opsburg's accounts, drawn in the current text colour so it fits the brass theme. */
export function SocialIcon({ label, className = "h-4 w-4" }: Readonly<{ label: string; className?: string }>) {
  const icon = ICONS[label];
  if (!icon) return null;
  return (
    <svg role="img" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d={icon.path} />
    </svg>
  );
}

/**
 * The social accounts where the journey goes out, as buttons that open the profile directly.
 * Instagram comes first and is the main call to action, because that is where the Reels are.
 */
export default function FollowButtons({
  className = "",
  align = "center",
}: Readonly<{
  className?: string;
  align?: "center" | "start";
}>) {
  return (
    <div className={`flex flex-wrap gap-3 ${align === "center" ? "justify-center" : "justify-start"} ${className}`}>
      {FOLLOW_LINKS.map((s, i) => (
        <a
          key={s.href}
          href={s.href}
          target="_blank"
          rel="me noopener"
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-md ${
            i === 0 ? "font-semibold brass-button hover:brightness-110" : "brass-border bg-sky-deep/40 hover:bg-brass/10"
          }`}
        >
          <SocialIcon label={s.label} />
          {s.label}
        </a>
      ))}
    </div>
  );
}
