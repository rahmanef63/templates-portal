import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Portal CMS schema. authTables = @convex-dev/auth (single-admin). Content is
// the template catalogue + a settings singleton; the public site reads both,
// the admin panel writes them. Seeded from data/templates.ts + app/site.ts.
export default defineSchema({
  ...authTables,

  templates: defineTable({
    slug: v.string(),
    title: v.string(),
    vertical: v.string(),
    blurb: v.string(),
    demo: v.string(),
    repo: v.string(),
    thumb: v.string(),
    features: v.array(v.string()),
    order: v.number(),
  })
    .index("by_order", ["order"])
    .index("by_slug", ["slug"]),

  settings: defineTable({
    siteName: v.optional(v.string()),
    siteDesc: v.optional(v.string()),
    makerName: v.optional(v.string()),
    makerRole: v.optional(v.string()),
    makerHandle: v.optional(v.string()),
    makerSite: v.optional(v.string()),
    makerGithub: v.optional(v.string()),
    makerResources: v.optional(v.string()),
    onboardedAt: v.optional(v.number()),
  }),
});
