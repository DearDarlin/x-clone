import { v } from "convex/values";
import { mutation, query } from "./_generated/server"; // <--- Додали 'query'

// добавлено query 
export const get = query({
    args: {},
    handler: async (ctx) => {
        const posts = await ctx.db.query("posts").order("desc").take(100);

        return Promise.all(
            posts.map(async (post) => {
                const author = await ctx.db.get(post.userId);
                let imageUrl = post.imageUrl;

                if (post.storageId) {
                    imageUrl = (await ctx.storage.getUrl(post.storageId)) ?? undefined;
                }

                return {
                    ...post,
                    author,
                    imageUrl,
                };
            })
        );
    },
});

// генерую юрл
export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

// створюю пост
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