import type { PrismaClient } from "@prisma/client";
import type { UpdateUserBody } from "./users.schemas.js";
import { NotFoundError } from "../../lib/errors.js";

export async function getMe(prisma: PrismaClient, userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { streak: true },
  });
  if (!user) throw new NotFoundError("User");
  return user;
}

export async function updateMe(
  prisma: PrismaClient,
  userId: string,
  data: UpdateUserBody,
) {
  return prisma.user.update({
    where: { id: userId },
    data,
    include: { streak: true },
  });
}

export async function getUser(prisma: PrismaClient, userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      displayName: true,
      avatarUrl: true,
      goalType: true,
      streak: {
        select: {
          currentCount: true,
          longestCount: true,
          currentApy: true,
        },
      },
    },
  });
  if (!user) throw new NotFoundError("User");
  return user;
}
