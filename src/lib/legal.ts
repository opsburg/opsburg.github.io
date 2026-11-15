/**
 * Who answers for opsburg.dev, for the terms of use. The privacy and cookie
 * policies are on iubenda (see IUBENDA_* in site.ts), whose owner details must
 * match these.
 *
 * The controller is a private individual, so the site publishes the name and
 * a contact email, which is what GDPR art. 13 asks for, and no home address.
 */
export const LEGAL = {
  /** Person responsible for the site (the "controller" under GDPR). */
  controller: "Lorenzo De Francesco",
  /** Address that answers privacy requests and questions about the terms. */
  email: "info@opsburg.dev",
  /** Date shown as "Last updated" on the terms page. Change it with any edit. */
  updated: "15 November 2026",
} as const;
