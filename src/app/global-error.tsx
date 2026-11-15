"use client";

import { useEffect } from "react";
import { CloudLightning } from "lucide-react";
import "./globals.css";
import ErrorScreen from "@/components/ErrorScreen";

/**
 * Last resort, when the root layout itself crashes: it replaces the whole
 * document, so it brings its own <html> and <body> and has no navigation.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <title>Something went wrong | Opsburg</title>
        <ErrorScreen
          code="500"
          title="The whole sky went dark"
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
          <p>Opsburg could not load. The automatons are on their way.</p>
        </ErrorScreen>
      </body>
    </html>
  );
}
