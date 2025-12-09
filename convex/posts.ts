import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const createPost = mutation({
    args: {
        storageId: v.optional(v.id("_storage")),
        caption: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) throw new Error("User not found");

        let imageUrl = undefined;
        if (args.storageId) {
            imageUrl = (await ctx.storage.getUrl(args.storageId)) ?? undefined;
        }

        await ctx.db.insert("posts", {
            userId: user._id,
            imageUrl: imageUrl,
            storageId: args.storageId,
            caption: args.caption,
            likes: 0,
            comments: 0,
        });
        await ctx.db.patch(user._id, {
            posts: (user.posts || 0) + 1,
        });
    },
});