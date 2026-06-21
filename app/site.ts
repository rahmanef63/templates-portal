// Single source for the portal's identity + canonical URL. Set
// NEXT_PUBLIC_SITE_URL in Vercel to the real domain; the fallback is the
// current Vercel alias so OG/sitemap/robots resolve sanely out of the box.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://portal-pi-lake.vercel.app";
export const SITE_NAME = "Templates Portal";
export const SITE_DESC =
  "One place to discover, demo, set up, and update your templates. Build your Brand Kit once and reuse it across every template — no backend, no lock-in.";
