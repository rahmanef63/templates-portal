import { mutation } from "./_generated/server";
import { TEMPLATES } from "../data/templates";

// Idempotent, additive seed: inserts any template slug from the in-repo defaults
// that isn't already in the table (existing rows + their admin edits untouched),
// and settings once. Safe to run repeatedly. Run after deploy: `npx convex run seed:run`.
export const run = mutation({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("templates").collect();
    const present = new Set(rows.map((t) => t.slug));
    let order = rows.length ? Math.max(...rows.map((t) => t.order)) + 1 : 0;
    for (const t of TEMPLATES) {
      if (present.has(t.slug)) continue;
      await ctx.db.insert("templates", {
        slug: t.slug,
        title: t.title,
        vertical: t.vertical,
        blurb: t.blurb,
        demo: t.demo,
        repo: t.repo,
        thumb: t.thumb,
        features: t.features,
        order: order++,
      });
    }
    if (!(await ctx.db.query("settings").first())) {
      await ctx.db.insert("settings", {
        siteName: "Free Templates",
        siteDesc:
          "A free, open collection of production Next.js + Convex templates by Rahman Fakhrul. Clone, brand with your Brand Kit, and ship — no backend to wire, no lock-in.",
        makerName: "Rahman Fakhrul",
        makerRole: "Full-stack builder · Next.js + Convex",
        makerHandle: "rahmanef63",
        makerSite: "https://rahmanef.com",
        makerGithub: "https://github.com/rahmanef63",
        makerResources: "https://resource.rahmanef.com",
      });
    }
    return { templates: (await ctx.db.query("templates").collect()).length };
  },
});
