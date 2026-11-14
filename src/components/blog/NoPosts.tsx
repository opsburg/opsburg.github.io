import Link from "next/link";

/**
 * Shown when there is nothing to list: on /blog before the first post, and on
 * the reserved page that keeps the dynamic routes alive while the CMS is empty
 * (see PLACEHOLDER_SLUG in @/lib/blog).
 */
export default function NoPosts({ title }: { title: string }) {
  return (
    <div className="rounded-lg border-2 border-border bg-card/60 p-10 text-center backdrop-blur-sm">
      <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
        We are writing the first pieces from the workshop: running a cloud
        as a city, gamified DevOps and governed vibe coding. In the meantime,{" "}
        <Link
          href="/gamified-devops"
          className="text-primary hover:text-primary/80"
        >
          why a game
        </Link>{" "}
        and the{" "}
        <Link href="/faq" className="text-primary hover:text-primary/80">
          FAQ
        </Link>{" "}
        cover much of the same ground.
      </p>
    </div>
  );
}
