import type { FastifyInstance } from "fastify";
import { friendRequestSchema, feedQuerySchema } from "./social.schemas.js";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  getFriends,
  getFeed,
  getLeaderboard,
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

  app.get("/feed", async (request, reply) => {
    const { limit, cursor } = feedQuerySchema.parse(request.query);
    const events = await getFeed(app.prisma, request.userId, limit, cursor);
    return reply.send(events);
  });

  app.get("/leaderboard", async (request, reply) => {
    const board = await getLeaderboard(app.prisma, request.userId);
    return reply.send(board);
  });
}
