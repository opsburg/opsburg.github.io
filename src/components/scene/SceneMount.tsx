"use client";

import { useEffect, useRef, useState } from "react";
import SkyCity from "../SkyCity";
import { supportsWebGL, type Cleanup } from "./kit";

/** Mounts a three.js scene full-bleed in its parent, with the SVG city as the fallback when WebGL is missing. */
export default function SceneMount({
  build,
  fallbackClassName = "absolute inset-0 flex items-center justify-end pr-[6vw]",
}: {
  build: (container: HTMLDivElement, reducedMotion: boolean) => Cleanup;
  fallbackClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    if (!supportsWebGL()) {
      setFallback(true);
      return;
    }
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cleanup: Cleanup | undefined;
    try {
      cleanup = build(container, reducedMotion);
      setReady(true);
    } catch {
      setFallback(true);
    }
    return () => cleanup?.();
    // The build function is fixed for the life of the page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (fallback) {
    return (
      <div className={fallbackClassName}>
        <div className="w-full max-w-xl opacity-90">
          <SkyCity />
        </div>
      </div>
    );
  }

  return <div ref={ref} className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`} />;
}
