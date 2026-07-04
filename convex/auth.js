import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { ConvexError } from "convex/values";
// Zero-config admin onboarding (same pattern as the fleet templates):
// - Fresh backend (no admin yet): the FIRST signup claims ownership, no secret.
//   After that, signups are closed automatically.
// - If ADMIN_SIGNUP_KEY (Convex env) is set: every signup must pass it — works
//   as a first-owner lock and as an invite token for adding more admins.
// Existing admins always sign in.
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
    providers: [
        Password({
            profile(params) {
                const required = process.env.ADMIN_SIGNUP_KEY;
                if (params.flow === "signUp" && required && params.signupKey !== required) {
                    throw new ConvexError("Wrong setup key.");
                }
                const email = params.email;
                return { email, name: params.name || email };
            },
            // PBKDF2 via WebCrypto (~50ms). Scrypt/bcrypt exceed the Dokploy proxy's
            // 60s WebSocket cap and abort the signup action mid-flight.
            crypto: {
                async hashSecret(password) {
                    const salt = crypto.getRandomValues(new Uint8Array(16));
                    const km = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
                    const hb = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 10000, hash: "SHA-256" }, km, 256);
                    const hex = (b) => Array.from(b)
                        .map((x) => x.toString(16).padStart(2, "0"))
                        .join("");
                    return `pbkdf2_${hex(salt)}_${hex(new Uint8Array(hb))}`;
                },
                async verifySecret(password, hash) {
                    const parts = hash.split("_");
                    if (parts[0] !== "pbkdf2" || parts.length !== 3)
                        return false;
                    const salt = new Uint8Array(parts[1].match(/.{2}/g).map((b) => parseInt(b, 16)));
                    const km = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
                    const hb = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 10000, hash: "SHA-256" }, km, 256);
                    const hex = Array.from(new Uint8Array(hb))
                        .map((b) => b.toString(16).padStart(2, "0"))
                        .join("");
                    return hex === parts[2];
                },
            },
        }),
    ],
    callbacks: {
        async createOrUpdateUser(ctx, args) {
            if (args.existingUserId)
                return args.existingUserId;
            const email = args.profile.email;
            if (email) {
                const dup = await ctx.db
                    .query("users")
                    .filter((q) => q.eq(q.field("email"), email))
                    .first();
                if (dup)
                    return dup._id;
            }
            // First user is allowed freely and becomes the owner. Once an admin
            // exists, block silent new-account creation unless an invite key is set
            // (the key itself is checked in profile()).
            const anyUser = await ctx.db.query("users").first();
            if (anyUser && !process.env.ADMIN_SIGNUP_KEY) {
                throw new ConvexError("Signups are closed.");
            }
            return ctx.db.insert("users", {
                email,
                name: args.profile.name || email,
            });
        },
    },
});
