/*
 * Light and dark theme.
 *
 * "system" follows prefers-color-scheme and leaves <html> without a data-theme attribute; "light" and
 * "dark" are the visitor's explicit choice, stored in localStorage and set as data-theme on <html>. The
 * CSS in globals.css reads both, and THEME_SCRIPT applies the stored choice before the first paint.
 */

export type ThemePreference = "system" | "light" | "dark";
export type Theme = "light" | "dark";

export const THEME_KEY = "opsburg-theme";

/** Inline in <head>: applies the stored choice before the page paints, so there is no flash. */
export const THEME_SCRIPT = `try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

const LIGHT_QUERY = "(prefers-color-scheme: light)";

export function getPreference(): ThemePreference {
  const value = document.documentElement.getAttribute("data-theme");
  return value === "light" || value === "dark" ? value : "system";
}

export function setPreference(preference: ThemePreference) {
  const root = document.documentElement;
  if (preference === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", preference);
  try {
    if (preference === "system") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, preference);
  } catch {
    // Storage blocked: the choice lasts for this page only
  }
}

/** The theme in effect: the explicit choice, or the system's. */
export function getTheme(): Theme {
  const preference = getPreference();
  if (preference !== "system") return preference;
  return window.matchMedia(LIGHT_QUERY).matches ? "light" : "dark";
}

/** Calls back whenever the theme in effect may have changed: a new choice, or the system switching. */
export function onThemeChange(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  const media = window.matchMedia(LIGHT_QUERY);
  media.addEventListener("change", callback);
  return () => {
    observer.disconnect();
    media.removeEventListener("change", callback);
  };
}
