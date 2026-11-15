"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { getPreference, setPreference, type ThemePreference } from "@/lib/theme";

const NEXT: Record<ThemePreference, ThemePreference> = { system: "light", light: "dark", dark: "system" };

/**
 * Cycles the theme: system, light, dark. The icon is picked by CSS from <html data-theme>, so it is right
 * from the first paint; the state only drives the label.
 */
export default function ThemeToggle() {
  const [preference, setState] = useState<ThemePreference>("system");

  useEffect(() => {
    setState(getPreference());
  }, []);

  const next = NEXT[preference];
  return (
    <button
      type="button"
      onClick={() => {
        setPreference(next);
        setState(next);
      }}
      aria-label={`Theme: ${preference}. Switch to ${next}`}
      title={`Theme: ${preference}`}
      className="theme-toggle inline-flex h-8 w-8 items-center justify-center rounded-md brass-border text-cream hover:bg-brass/10"
    >
      <Monitor className="theme-icon-system h-4 w-4" aria-hidden="true" />
      <Sun className="theme-icon-light h-4 w-4" aria-hidden="true" />
      <Moon className="theme-icon-dark h-4 w-4" aria-hidden="true" />
    </button>
  );
}
