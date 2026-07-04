import { v, ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Public read of the settings singleton (site name/desc + maker identity).
export const get = query({
  args: {},
  handler: async (ctx) => ctx.db.query("settings").first(),
});

const FIELDS = {
  siteName: v.optional(v.string()),
  siteDesc: v.optional(v.string()),
  makerName: v.optional(v.string()),
  makerRole: v.optional(v.string()),
  makerHandle: v.optional(v.string()),
  makerSite: v.optional(v.string()),
  makerGithub: v.optional(v.string()),
  makerResources: v.optional(v.string()),
};

// Upsert the singleton. Admin-only.
export const upsert = mutation({
  args: FIELDS,
  handler: async (ctx, args) => {
    const uid = await getAuthUserId(ctx);
    if (!uid) throw new ConvexError("Sign in as admin to edit settings.");
    const patch: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(args)) if (val !== undefined) patch[k] = val;
    const existing = await ctx.db.query("settings").first();
    if (existing) {
      await ctx.db.patch(existing._id, patch);
      return existing._id;
    }
    return ctx.db.insert("settings", patch);
  },
});
