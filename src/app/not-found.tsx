import type { Metadata } from "next";
import { Compass } from "lucide-react";
import ErrorScreen from "@/components/ErrorScreen";

// Exported as out/404.html, which GitHub Pages serves for every missing path.
export const metadata: Metadata = {
  title: "Page not found",
  description: "This island is not on the map.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <ErrorScreen code="404" title="Lost in the clouds" icon={<Compass className="h-9 w-9" aria-hidden="true" />}>
      <p>This island is not on the map. The page may have drifted away, or the address has a typo.</p>
      <p className="text-base text-ink/80">Turn the airship around and head back to the city.</p>
    </ErrorScreen>
  );
}
