import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// перемкнути закладку
export const toggleBookmark = mutation({
    args: { postId: v.id("posts") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) throw new Error("User not found");

        const existingBookmark = await ctx.db
            .query("bookmarks")
            .withIndex("by_user_and_post", (q) =>
                q.eq("userId", user._id).eq("postId", args.postId)
            )
            .unique();

        if (existingBookmark) {
            await ctx.db.delete(existingBookmark._id);
        } else {
            await ctx.db.insert("bookmarks", {
                userId: user._id,
                postId: args.postId,
            });
        }
    },
});