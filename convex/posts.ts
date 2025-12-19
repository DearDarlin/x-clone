import { v } from "convex/values";
import { mutation, MutationCtx, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";
import { Id } from "./_generated/dataModel";

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
                let isBookmarked = false; // змінна для закладки

                if (currentUser) {
                    // перевірка лайка
                    const like = await ctx.db
                        .query("likes")
                        .withIndex("by_user_and_post", (q) =>
                            q.eq("userId", currentUser!._id).eq("postId", post._id)
                        )
                        .unique();
                    isLiked = !!like; // якщо запис є, значить true

                    // перевірка чи пост в закладках
                    const bookmark = await ctx.db
                        .query("bookmarks")
                        .withIndex("by_user_and_post", (q) =>
                            q.eq("userId", currentUser!._id).eq("postId", post._id)
                        )
                        .unique();
                    isBookmarked = !!bookmark;
                }

                return {
                    ...post,
                    author,
                    imageUrl,
                    isLiked,
                    isBookmarked, // повертаємо статус
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

        // отримання посилання на картинку
        let imageUrl = undefined;
        if (args.storageId) {
            imageUrl = (await ctx.storage.getUrl(args.storageId)) ?? undefined;
        }

        // запис поста в базу
        await ctx.db.insert("posts", {
            userId: user._id,
            imageUrl: imageUrl,
            storageId: args.storageId,
            caption: args.caption,
            likes: 0,
            comments: 0,
        });

        // оновлення лічильника постів
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

            // розлайк, удаляєм сповіщення
            const notification = await ctx.db
                .query("notifications")
                .withIndex("by_post", (q) => q.eq("postId", args.postId))
                .filter((q) => q.eq(q.field("senderId"), user._id))
                .filter((q) => q.eq(q.field("type"), "like"))
                .first();

            if (notification) {
                await ctx.db.delete(notification._id);
            }

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

// видалення поста
export const deletePost = mutation({
    args: { postId: v.id("posts") },
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

        // перевірка власника
        if (post.userId !== user._id) {
            throw new Error("Not authorized");
        }

        // видалення лайків
        const likes = await ctx.db
            .query("likes")
            .withIndex("by_post", (q) => q.eq("postId", args.postId))
            .collect();
        for (const like of likes) await ctx.db.delete(like._id);

        // видалення коментарів
        const comments = await ctx.db
            .query("comments")
            .withIndex("by_post", (q) => q.eq("postId", args.postId))
            .collect();
        for (const comment of comments) await ctx.db.delete(comment._id);

        // видалення закладок
        const bookmarks = await ctx.db
            .query("bookmarks")
            .withIndex("by_post", (q) => q.eq("postId", args.postId))
            .collect();
        for (const bookmark of bookmarks) await ctx.db.delete(bookmark._id);

        // видалення сповіщень
        const notifications = await ctx.db
            .query("notifications")
            .withIndex("by_post", (q) => q.eq("postId", args.postId))
            .collect();
        for (const notification of notifications) await ctx.db.delete(notification._id);

        // видалення файлу зі сховища
        if (post.storageId) {
            await ctx.storage.delete(post.storageId);
        }

        // видалення поста
        await ctx.db.delete(args.postId);

        // зменшення лічильника постів
        await ctx.db.patch(user._id, {
            posts: Math.max(0, (user.posts || 0) - 1),
        });
    },
});

// пошук постів через користувача
export const getPostsByUser = query({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const user = args.userId
      ? await ctx.db.get(args.userId)
      : await getAuthenticatedUser(ctx);
 
    if (!user) throw new Error("User not found");
 
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId || user._id))
      .collect();
 
    return posts;
  },
});