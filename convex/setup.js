import { query } from "./_generated/server";
// Drives the admin gate: is there an owner yet? (First signup claims it.)
export const status = query({
    args: {},
    handler: async (ctx) => {
        const anyUser = await ctx.db.query("users").first();
        return { hasAdmin: !!anyUser };
    },
});
