import { query, mutation } from './_generated/server';
import { v } from 'convex/values';
import { getAuthenticatedUser } from './users';

export const getNotifications = query({
  handler: async (ctx) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const notifications = await ctx.db
      .query('notifications')
      .withIndex('by_receiver', (q) => q.eq('receiverId', currentUser._id))
      .order('desc')
      .collect();

    const notificationsWithInfo = await Promise.all(
      notifications.map(async (notification) => {
        const sender = await ctx.db.get(notification.senderId);
        // якщо отправитель видалив акаунт — ігноруємо
        if (!sender) return null;

        let post = null;
        let comment = null;

        if (notification.postId) {
          post = await ctx.db.get(notification.postId);

          // якщо це лайк або комент, але пост видалено — ігноруємо сповіщення
          if (!post && (notification.type === 'like' || notification.type === 'comment')) {
            return null;
          }
        }

        if (notification.type === 'comment' && notification.commentId) {
          comment = await ctx.db.get(notification.commentId);

          // якщо коментар удалили — повертаємо null, щоб приховати сповіщення
          if (!comment) return null;
        }

        return {
          ...notification,
          sender: {
            _id: sender._id,
            username: sender.username,
            image: sender.image,
          },
          post,
          comment: comment?.content,
        };
      })
    );

    return notificationsWithInfo.filter((n) => n !== null);
  },
});