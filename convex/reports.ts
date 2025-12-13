import { v } from "convex/values";
import { mutation } from "./_generated/server";

// відправка скарги
export const sendReport = mutation({
    args: {
        postId: v.id("posts"),
        reason: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) throw new Error("User not found");

        // записуємо скаргу в базу
        await ctx.db.insert("reports", {
            userId: user._id,
            postId: args.postId,
            reason: args.reason,
            status: "pending",
        });
    },
});