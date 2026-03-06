import type { FastifyInstance } from "fastify";
import { updateUserSchema } from "./users.schemas.js";
import { getMe, updateMe, getUser } from "./users.service.js";

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

  app.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = await getUser(app.prisma, id);
    return reply.send(user);
  });
}
