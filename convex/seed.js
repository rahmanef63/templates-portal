import { mutation } from "./_generated/server";
import { TEMPLATES } from "../data/templates";
// Idempotent seed: fills templates + settings from the in-repo defaults the
// first time only. Safe to run repeatedly (skips whatever already exists).
// Run after deploy: `npx convex run seed:run`.
export const run = mutation({
    args: {},
    handler: async (ctx) => {
        if (!(await ctx.db.query("templates").first())) {
            for (let i = 0; i < TEMPLATES.length; i++) {
                const t = TEMPLATES[i];
                await ctx.db.insert("templates", {
                    slug: t.slug,
                    title: t.title,
                    vertical: t.vertical,
                    blurb: t.blurb,
                    demo: t.demo,
                    repo: t.repo,
                    thumb: t.thumb,
                    features: t.features,
                    order: i,
                });
            }
        }
        if (!(await ctx.db.query("settings").first())) {
            await ctx.db.insert("settings", {
                siteName: "Free Templates",
                siteDesc: "A free, open collection of production Next.js + Convex templates by Rahman Fakhrul. Clone, brand with your Brand Kit, and ship — no backend to wire, no lock-in.",
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
