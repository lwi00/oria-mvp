import type { PrismaClient } from "@prisma/client";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";

export async function sendFriendRequest(
  prisma: PrismaClient,
  requesterId: string,
  addresseeId: string,
) {
  if (requesterId === addresseeId) {
    throw new BadRequestError("Cannot send friend request to yourself");
  }

  // Check if friendship already exists in either direction
  const existing = await prisma.friendship.findFirst({
    where: {
      OR: [
        { requesterId, addresseeId },
        { requesterId: addresseeId, addresseeId: requesterId },
      ],
    },
  });

  if (existing) {
    throw new BadRequestError("Friendship already exists");
  }

  return prisma.friendship.create({
    data: { requesterId, addresseeId },
  });
}

export async function acceptFriendRequest(
  prisma: PrismaClient,
  userId: string,
  friendshipId: string,
) {
  const friendship = await prisma.friendship.findUnique({
    where: { id: friendshipId },
  });
  if (!friendship) throw new NotFoundError("Friendship");
  if (friendship.addresseeId !== userId) {
    throw new BadRequestError("Not authorized to accept this request");
  }

  return prisma.friendship.update({
    where: { id: friendshipId },
    data: { status: "accepted" },
  });
}

export async function rejectFriendRequest(
  prisma: PrismaClient,
  userId: string,
  friendshipId: string,
) {
  const friendship = await prisma.friendship.findUnique({
    where: { id: friendshipId },
  });
  if (!friendship) throw new NotFoundError("Friendship");
  if (friendship.addresseeId !== userId) {
    throw new BadRequestError("Not authorized to reject this request");
  }

  return prisma.friendship.update({
    where: { id: friendshipId },
    data: { status: "rejected" },
  });
}

export async function removeFriend(
  prisma: PrismaClient,
  userId: string,
  friendshipId: string,
) {
  const friendship = await prisma.friendship.findUnique({
    where: { id: friendshipId },
  });
  if (!friendship) throw new NotFoundError("Friendship");
  if (
    friendship.requesterId !== userId &&
    friendship.addresseeId !== userId
  ) {
    throw new BadRequestError("Not part of this friendship");
  }

  return prisma.friendship.delete({ where: { id: friendshipId } });
}

export async function getFriends(prisma: PrismaClient, userId: string) {
  const friendships = await prisma.friendship.findMany({
    where: {
      status: "accepted",
      OR: [{ requesterId: userId }, { addresseeId: userId }],
    },
    include: {
      requester: { include: { streak: true } },
      addressee: { include: { streak: true } },
    },
  });

  return friendships.map((f) => {
    const friend =
      f.requesterId === userId ? f.addressee : f.requester;
    return {
      friendshipId: f.id,
      user: {
        id: friend.id,
        displayName: friend.displayName,
        avatarUrl: friend.avatarUrl,
        streak: friend.streak,
      },
    };
  });
}

export async function getFeed(
  prisma: PrismaClient,
  userId: string,
  limit: number,
  cursor?: string,
) {
  // Get friend IDs
  const friendships = await prisma.friendship.findMany({
    where: {
      status: "accepted",
      OR: [{ requesterId: userId }, { addresseeId: userId }],
    },
  });

  const friendIds = friendships.map((f) =>
    f.requesterId === userId ? f.addresseeId : f.requesterId,
  );

  // Include own events too
  const userIds = [userId, ...friendIds];

  return prisma.feedEvent.findMany({
    where: {
      userId: { in: userIds },
      ...(cursor ? { createdAt: { lt: new Date(cursor) } } : {}),
    },
    include: {
      user: {
        select: {
          id: true,
          displayName: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getLeaderboard(
  prisma: PrismaClient,
  userId: string,
) {
  // Get friend IDs
  const friendships = await prisma.friendship.findMany({
    where: {
      status: "accepted",
      OR: [{ requesterId: userId }, { addresseeId: userId }],
    },
  });

  const friendIds = friendships.map((f) =>
    f.requesterId === userId ? f.addresseeId : f.requesterId,
  );

  const userIds = [userId, ...friendIds];

  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    include: { streak: true },
    orderBy: { streak: { currentCount: "desc" } },
  });

  return users.map((u, i) => ({
    rank: i + 1,
    id: u.id,
    displayName: u.displayName,
    avatarUrl: u.avatarUrl,
    streak: u.streak?.currentCount ?? 0,
    apy: u.streak?.currentApy ?? 4.0,
    isMe: u.id === userId,
  }));
}
