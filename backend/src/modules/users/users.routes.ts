import type { FastifyInstance } from "fastify";
import { updateUserSchema } from "./users.schemas.js";
import { getMe, updateMe, getUser, discoverUsers } from "./users.service.js";

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

  app.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = await getUser(app.prisma, id);
    return reply.send(user);
  });
}
