// Single source for the portal's identity + canonical URL. Set
// NEXT_PUBLIC_SITE_URL in Vercel to override; the fallback is the production
// domain so OG/sitemap/robots resolve to the real host out of the box.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://free-template.rahmanef.com";
export const SITE_NAME = "Free Templates";
export const SITE_DESC =
  "A free, open collection of production Next.js + Convex templates by Rahman Fakhrul. Clone, brand with your Brand Kit, and ship — no backend to wire, no lock-in.";

// The maker. Single source for attribution across footer, metadata, and the
// maker section. Rahman ships this fleet + rahman-resources (a slice library).
export const MAKER = {
  name: "Rahman Fakhrul",
  handle: "rahmanef63",
  site: "https://rahmanef.com",
  github: "https://github.com/rahmanef63",
  resources: "https://resource.rahmanef.com",
  email: "rahmanef63@gmail.com",
  role: "Full-stack builder · Next.js + Convex",
} as const;

// The original vibe-coding tutorial thread + the AI coder we point people to.
export const TUTORIAL_URL = "https://www.threads.com/@rahmanef_/post/DZHUirjk-Oh";
export const JULES_URL = "https://jules.google.com/";
