import { FOLLOW_LINKS } from "@/lib/site";

/** The social accounts where the journey goes out, as buttons: the first one is the main call to action. */
export default function FollowButtons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap justify-center gap-3 ${className}`}>
      {FOLLOW_LINKS.map((s, i) => (
        <a
          key={s.href}
          href={s.href}
          target="_blank"
          rel="me noopener"
          className={
            i === 0
              ? "px-6 py-3 rounded-md font-semibold brass-button hover:brightness-110"
              : "px-6 py-3 rounded-md brass-border hover:bg-brass/10"
          }
        >
          {s.label}
        </a>
      ))}
    </div>
  );
}
