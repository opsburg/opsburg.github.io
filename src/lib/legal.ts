/**
 * Who answers for opsburg.dev, for the terms of use. The privacy and cookie
 * policies are on iubenda (see IUBENDA_* in site.ts), whose owner details must
 * match these.
 *
 * BLOCKER before publishing the legal pages: the two values in square
 * brackets must be the real ones. GDPR art. 13 requires the controller's
 * identity and contact details, so the pages cannot ship with placeholders.
 */
export const LEGAL = {
  /** Person or company responsible for the site (the "controller" under GDPR). */
  controller: "[Full name or company name]",
  /** Postal address of the controller. */
  address: "[Postal address, Italy]",
  /** Address that answers privacy requests and questions about the terms. */
  email: "info@opsburg.dev",
  /** Date shown as "Last updated" on the terms page. Change it with any edit. */
  updated: "15 November 2026",
} as const;
