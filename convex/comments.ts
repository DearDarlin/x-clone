import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// додавання коментаря
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

        // створюємо коментар
        const commentId = await ctx.db.insert("comments", {
            userId: user._id,
            postId: args.postId,
            content: args.content,
        });

        // збільшуємо лічильник коментарів у пості
        await ctx.db.patch(args.postId, {
            comments: (post.comments || 0) + 1,
        });

        // створюємо сповіщення (якщо коментуємо не свій пост)
        if (post.userId !== user._id) {
            await ctx.db.insert("notifications", {
                receiverId: post.userId,
                senderId: user._id,
                type: "comment",
                postId: args.postId,
                commentId: commentId, // записуємо ID коментаря, щоб потім можна було видалити
            });
        }
    },
});

// отримання коментарів
export const getComments = query({
    args: { postId: v.id("posts") },
    handler: async (ctx, args) => {
        const comments = await ctx.db
            .query("comments")
            .withIndex("by_post", (q) => q.eq("postId", args.postId))
            .order("desc") // нові зверху
            .collect();

        // для кожного коментаря дістаємо автора
        return Promise.all(
            comments.map(async (c) => {
                const author = await ctx.db.get(c.userId);
                return { ...c, author };
            })
        );
    },
});

// видалення коментаря
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

        // отримуємо пост, щоб оновити лічильник та перевірити власника
        const post = await ctx.db.get(comment.postId);
        if (!post) throw new Error("Post not found");

        // перевірка прав: видалити може автор коментаря АБО власник поста
        if (comment.userId !== user._id && post.userId !== user._id) {
            throw new Error("Not authorized");
        }

        // видалення сповіщенянь, пов'язаних з цим коментарем
        const notifications = await ctx.db
            .query("notifications")
            .withIndex("by_post", (q) => q.eq("postId", comment.postId))
            .filter((q) => q.eq(q.field("commentId"), args.commentId))
            .collect();

        for (const notification of notifications) {
            await ctx.db.delete(notification._id);
        }

        // видаляємо сам коментар
        await ctx.db.delete(args.commentId);

        // зменшуємо лічильник коментарів у пості
        if (post) {
            await ctx.db.patch(comment.postId, {
                comments: Math.max(0, (post.comments || 0) - 1),
            });
        }
    },
});