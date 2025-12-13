import { v } from "convex/values";
import { mutation, query } from "./_generated/server"; // додано квері

// добавлено query 
export const get = query({
    args: {},
    handler: async (ctx) => {
        // отримуємо поточного юзера, і дивимось чи він лайкнув пост
        const identity = await ctx.auth.getUserIdentity();
        let currentUser = null;
        if (identity) {
            currentUser = await ctx.db
                .query("users")
                .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
                .unique();
        }

        const posts = await ctx.db.query("posts").order("desc").take(100);

        return Promise.all(
            posts.map(async (post) => {
                const author = await ctx.db.get(post.userId);
                let imageUrl = post.imageUrl;

                if (post.storageId) {
                    imageUrl = (await ctx.storage.getUrl(post.storageId)) ?? undefined;
                }

                // перевіряємо в таблиці likes, чи є запис від цього юзера для цього поста
                let isLiked = false;
                if (currentUser) {
                    const like = await ctx.db
                        .query("likes")
                        .withIndex("by_user_and_post", (q) =>
                            q.eq("userId", currentUser!._id).eq("postId", post._id)
                        )
                        .unique();
                    isLiked = !!like; // якщо запис є, значить true
                }

                return {
                    ...post,
                    author,
                    imageUrl,
                    isLiked,
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

// мутація для лайка
export const toggleLike = mutation({
    args: { postId: v.id("posts") },
    handler: async (ctx, args) => {
        // перевірка, чи авторизований юзер
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) throw new Error("User not found");

        //сам пост отримання
        const post = await ctx.db.get(args.postId);
        if (!post) throw new Error("Post not found");

        // чи є лайк
        const existingLike = await ctx.db
            .query("likes")
            .withIndex("by_user_and_post", (q) =>
                q.eq("userId", user._id).eq("postId", args.postId)
            )
            .unique();

        if (existingLike) {
            // якщо лайк єсть - удаляємо, типа дізлайк
            await ctx.db.delete(existingLike._id);

            // зменшуємо лічильник не менше ніж до 0
            await ctx.db.patch(args.postId, {
                likes: Math.max(0, (post.likes || 0) - 1),
            });
        } else {
            // якщо нема - ставимо
            await ctx.db.insert("likes", {
                userId: user._id,
                postId: args.postId,
            });

            // збільшуємо на 1
            await ctx.db.patch(args.postId, {
                likes: (post.likes || 0) + 1,
            });

            // це сповіження
            // якщо не свій власний пост - сповіщення
            if (post.userId !== user._id) {
                await ctx.db.insert("notifications", {
                    receiverId: post.userId, // отримувач автор поста
                    senderId: user._id,      // хто поставив пост
                    type: "like",
                    postId: args.postId,
                });
            }
        }
    },
});