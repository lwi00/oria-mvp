import type { FastifyInstance } from "fastify";
import { updateUserSchema } from "./users.schemas.js";
import { getMe, updateMe, getUser, getUserProfile, discoverUsers, searchUsers } from "./users.service.js";

export default async function usersRoutes(app: FastifyInstance) {
  app.get("/me", async (request, reply) => {
    const user = await getMe(app.prisma, request.userId);
    return reply.send(user);
  });

  app.patch("/me", async (request, reply) => {
    const data = updateUserSchema.parse(request.body);
    const user = await updateMe(app.prisma, request.userId, data);
    return reply.send(user);
  });

  app.get("/discover", async (request, reply) => {
    const users = await discoverUsers(app.prisma, request.userId);
    return reply.send(users);
  });

  app.get("/search", async (request, reply) => {
    const { q } = request.query as { q?: string };
    const users = await searchUsers(app.prisma, request.userId, q ?? "");
    return reply.send(users);
  });

  app.get("/:id/profile", async (request, reply) => {
    const { id } = request.params as { id: string };
    const profile = await getUserProfile(app.prisma, id);
    return reply.send(profile);
  });

  app.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = await getUser(app.prisma, id);
    return reply.send(user);
  });
}
