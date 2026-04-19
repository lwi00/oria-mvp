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
  // Verify user exists before updating
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError("User");
  return prisma.user.update({
    where: { id: userId },
    data,
    include: { streak: true },
  });
}

export async function discoverUsers(prisma: PrismaClient, userId: string) {
  // Find users who are NOT friends with the current user
  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [{ requesterId: userId }, { addresseeId: userId }],
      status: { in: ["accepted", "pending"] },
    },
    select: { requesterId: true, addresseeId: true },
  });

  const friendIds = new Set<string>();
  friendIds.add(userId);
  for (const f of friendships) {
    friendIds.add(f.requesterId);
    friendIds.add(f.addresseeId);
  }

  return prisma.user.findMany({
    where: { id: { notIn: [...friendIds] } },
    select: {
      id: true,
      displayName: true,
      avatarUrl: true,
      goalType: true,
      streak: {
        select: { currentCount: true, currentApy: true },
      },
    },
    take: 10,
  });
}

export async function searchUsers(prisma: PrismaClient, userId: string, q: string) {
  const query = q.trim();
  if (query.length < 2) return [];

  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [{ requesterId: userId }, { addresseeId: userId }],
      status: { in: ["accepted", "pending"] },
    },
    select: { requesterId: true, addresseeId: true },
  });

  const excludedIds = new Set<string>();
  excludedIds.add(userId);
  for (const f of friendships) {
    excludedIds.add(f.requesterId);
    excludedIds.add(f.addresseeId);
  }

  return prisma.user.findMany({
    where: {
      id: { notIn: [...excludedIds] },
      displayName: { contains: query, mode: "insensitive" },
    },
    select: {
      id: true,
      displayName: true,
      avatarUrl: true,
      goalType: true,
      streak: { select: { currentCount: true, currentApy: true } },
    },
    take: 20,
    orderBy: { displayName: "asc" },
  });
}

export async function getUserProfile(prisma: PrismaClient, userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, displayName: true, avatarUrl: true, goalType: true, targetKm: true, createdAt: true,
      streak: true,
      activities: { orderBy: { weekStart: "desc" }, take: 12 },
    },
  });
  if (!user) throw new NotFoundError("User");

  const totalKm = user.activities.reduce((sum: number, a: { distanceKm: number }) => sum + a.distanceKm, 0);
  const weeksActive = user.activities.length;
  const goalMetWeeks = user.activities.filter((a: { goalMet: boolean }) => a.goalMet).length;

  return {
    ...user,
    stats: { totalKm: Math.round(totalKm * 10) / 10, weeksActive, goalMetWeeks },
  };
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
