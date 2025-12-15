import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// отримати коментарі поста
export const getComments = query({
    args: { postId: v.id("posts") },
    handler: async (ctx, args) => {
        const comments = await ctx.db
            .query("comments")
            .withIndex("by_post", (q) => q.eq("postId", args.postId))
            .order("desc")
            .collect();

        return Promise.all(
            comments.map(async (comment) => {
                const author = await ctx.db.get(comment.userId);
                return {
                    ...comment,
                    author,
                };
            })
        );
    },
});

// додати коментар
export const addComment = mutation({
    args: {
        postId: v.id("posts"),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) throw new Error("User not found");

        const post = await ctx.db.get(args.postId);
        if (!post) throw new Error("Post not found");

        const commentId = await ctx.db.insert("comments", {
            userId: user._id,
            postId: args.postId,
            content: args.content,
        });

        // оновлення лічильника
        await ctx.db.patch(args.postId, {
            comments: (post.comments || 0) + 1,
        });

        // сповіщення автору
        if (post.userId !== user._id) {
            await ctx.db.insert("notifications", {
                receiverId: post.userId,
                senderId: user._id,
                type: "comment",
                postId: args.postId,
                commentId: commentId,
            });
        }
    },
});