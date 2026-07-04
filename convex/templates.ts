import { v, ConvexError } from "convex/values";
import { mutation, query, type MutationCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

async function requireAdmin(ctx: MutationCtx) {
  const uid = await getAuthUserId(ctx);
  if (!uid) throw new ConvexError("Sign in as admin to edit content.");
  return uid;
}

// Public — the catalogue, ordered.
export const list = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("templates").withIndex("by_order").collect();
    return rows.sort((a, b) => a.order - b.order);
  },
});

const FIELDS = {
  slug: v.string(),
  title: v.string(),
  vertical: v.string(),
  blurb: v.string(),
  demo: v.string(),
  repo: v.string(),
  thumb: v.string(),
  features: v.array(v.string()),
};

export const create = mutation({
  args: FIELDS,
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const all = await ctx.db.query("templates").collect();
    const order = all.length ? Math.max(...all.map((t) => t.order)) + 1 : 0;
    return ctx.db.insert("templates", { ...args, order });
  },
});

export const update = mutation({
  args: {
    id: v.id("templates"),
    slug: v.optional(v.string()),
    title: v.optional(v.string()),
    vertical: v.optional(v.string()),
    blurb: v.optional(v.string()),
    demo: v.optional(v.string()),
    repo: v.optional(v.string()),
    thumb: v.optional(v.string()),
    features: v.optional(v.array(v.string())),
  },
  handler: async (ctx, { id, ...rest }) => {
    await requireAdmin(ctx);
    const patch: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(rest)) if (val !== undefined) patch[k] = val;
    await ctx.db.patch(id, patch);
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("templates") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    await ctx.db.delete(id);
  },
});

// Persist a new ordering. `ids` is the full list in the desired order.
export const reorder = mutation({
  args: { ids: v.array(v.id("templates")) },
  handler: async (ctx, { ids }) => {
    await requireAdmin(ctx);
    await Promise.all(ids.map((id, i) => ctx.db.patch(id, { order: i })));
  },
});
