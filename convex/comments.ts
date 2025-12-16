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
export const deleteComment = mutation({
    args: { commentId: v.id("comments") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) throw new Error("User not found");

        const comment = await ctx.db.get(args.commentId);
        if (!comment) throw new Error("Comment not found");

        // отримуємо пост раніше
        const post = await ctx.db.get(comment.postId);
        if (!post) throw new Error("Post not found");

        // якщо ти автор коментаря або автор поста, удаляєм
        if (comment.userId !== user._id && post.userId !== user._id) {
            throw new Error("Not authorized");
        }

        // удаляємо коментар
        await ctx.db.delete(args.commentId);

        // -1 комент
        await ctx.db.patch(comment.postId, {
            comments: Math.max(0, (post.comments || 0) - 1),
        });
    },
});