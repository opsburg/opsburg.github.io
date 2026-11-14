/**
 * Joins class names, dropping the falsy ones.
 *
 * Deliberately not the design system's `cn`: that one is re-exported through
 * src/components/design-system.ts, which carries "use client", and a function
 * imported from a client module cannot be called during server rendering. The
 * blog components need it on the server, and they only ever append classes —
 * they never override a conflicting utility — so plain joining is enough.
 */
export function cn(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(" ");
}
