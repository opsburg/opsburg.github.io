"use client";

import { useEffect } from "react";
import { CloudLightning } from "lucide-react";
import ErrorScreen from "@/components/ErrorScreen";

/**
 * Shown when a page crashes in the browser. The site is a static export, so
 * this only catches client-side errors; navigation and footer stay in place.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorScreen
      code="500"
      title="A storm hit this page"
      icon={<CloudLightning className="h-9 w-9" aria-hidden="true" />}
      actions={
        <button
          type="button"
          onClick={reset}
          className="px-5 py-2.5 rounded-md brass-border bg-sky-deep/40 hover:bg-brass/10"
        >
          Try again
        </button>
      }
    >
      <p>Something broke while this page was loading. The automatons are on their way.</p>
      <p className="text-base text-ink/80">Try again, or head back to the city while the sky clears.</p>
    </ErrorScreen>
  );
}
