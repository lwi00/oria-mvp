import type { FastifyInstance } from "fastify";
import { friendRequestSchema, feedQuerySchema } from "./social.schemas.js";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  getFriends,
  getPendingRequests,
  getSentRequests,
  cancelFriendRequest,
  getFeed,
  getFriendsWeeklyProgress,
  getLeaderboard,
  getWeeklyLeaderboard,
  likeFeedEvent,
  pokeFriend,
  getNotifications,
  getUnreadCount,
  markNotificationsRead,
} from "./social.service.js";

export default async function socialRoutes(app: FastifyInstance) {
  app.post("/friends/request", async (request, reply) => {
    const { addresseeId } = friendRequestSchema.parse(request.body);
    const friendship = await sendFriendRequest(
      app.prisma,
      request.userId,
      addresseeId,
    );
    return reply.status(201).send(friendship);
  });

  app.post("/friends/:id/accept", async (request, reply) => {
    const { id } = request.params as { id: string };
    const friendship = await acceptFriendRequest(
      app.prisma,
      request.userId,
      id,
    );
    return reply.send(friendship);
  });

  app.post("/friends/:id/reject", async (request, reply) => {
    const { id } = request.params as { id: string };
    const friendship = await rejectFriendRequest(
      app.prisma,
      request.userId,
      id,
    );
    return reply.send(friendship);
  });

  app.delete("/friends/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    await removeFriend(app.prisma, request.userId, id);
    return reply.status(204).send();
  });

  app.get("/friends", async (request, reply) => {
    const friends = await getFriends(app.prisma, request.userId);
    return reply.send(friends);
  });

  app.get("/friends/pending", async (request, reply) => {
    const pending = await getPendingRequests(app.prisma, request.userId);
    return reply.send(pending);
  });

  app.get("/friends/sent", async (request, reply) => {
    const sent = await getSentRequests(app.prisma, request.userId);
    return reply.send(sent);
  });

  app.delete("/friends/sent/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    await cancelFriendRequest(app.prisma, request.userId, id);
    return reply.status(204).send();
  });

  app.get("/notifications", async (request, reply) => {
    const notifications = await getNotifications(app.prisma, request.userId);
    return reply.send(notifications);
  });

  app.get("/notifications/unread-count", async (request, reply) => {
    const count = await getUnreadCount(app.prisma, request.userId);
    return reply.send({ count });
  });

  app.post("/notifications/mark-read", async (request, reply) => {
    await markNotificationsRead(app.prisma, request.userId);
    return reply.send({ ok: true });
  });

  app.get("/feed", async (request, reply) => {
    const { limit, cursor } = feedQuerySchema.parse(request.query);
    const events = await getFeed(app.prisma, request.userId, limit, cursor);
    return reply.send(events);
  });

  app.get("/friends/weekly", async (request, reply) => {
    const progress = await getFriendsWeeklyProgress(app.prisma, request.userId);
    return reply.send(progress);
  });

  app.get("/leaderboard", async (request, reply) => {
    const board = await getLeaderboard(app.prisma, request.userId);
    return reply.send(board);
  });

  app.get("/leaderboard/weekly", async (request, reply) => {
    const board = await getWeeklyLeaderboard(app.prisma, request.userId);
    return reply.send(board);
  });

  app.post("/feed/:id/like", async (request, reply) => {
    const { id } = request.params as { id: string };
    const event = await likeFeedEvent(app.prisma, request.userId, id);
    return reply.send({ likes: event.likes, liked: ((event.likedBy as string[]) ?? []).includes(request.userId) });
  });

  // POST /api/friends/:userId/poke — poke a friend with a fun motivational message
  app.post("/friends/:userId/poke", async (request, reply) => {
    const { userId: friendUserId } = request.params as { userId: string };
    const result = await pokeFriend(app.prisma, request.userId, friendUserId);
    return reply.send(result);
  });
}
