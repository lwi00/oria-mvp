import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function computeApy(s: number): number {
  if (s <= 0) return 4.0;
  if (s >= 10) return 8.0;
  const progress = Math.log(1 + s) / Math.log(11);
  return Math.round((4 + 4 * Math.min(1, progress)) * 100) / 100;
}

function getMonday(weeksAgo: number): Date {
  const d = new Date();
  const day = d.getUTCDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setUTCDate(d.getUTCDate() - diff - weeksAgo * 7);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.challengeMember.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.feedEvent.deleteMany();
  await prisma.deposit.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.friendship.deleteMany();
  await prisma.streak.deleteMany();
  await prisma.user.deleteMany();

  // Create 5 users matching mockup data
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: "00000000-0000-0000-0000-000000000001",
        privyId: "did:privy:mock-user-001",
        displayName: "Talam D.",
        walletAddr: "0x1234567890abcdef1234567890abcdef12345678",
        goalType: "running",
        targetKm: 15,
        streak: {
          create: { currentCount: 6, longestCount: 6, lastWeekMet: true, currentApy: computeApy(6) },
        },
      },
    }),
    prisma.user.create({
      data: {
        id: "00000000-0000-0000-0000-000000000002",
        privyId: "did:privy:mock-user-002",
        displayName: "Eva M.",
        goalType: "running",
        targetKm: 12,
        streak: {
          create: { currentCount: 10, longestCount: 10, lastWeekMet: true, currentApy: computeApy(10) },
        },
      },
    }),
    prisma.user.create({
      data: {
        id: "00000000-0000-0000-0000-000000000003",
        privyId: "did:privy:mock-user-003",
        displayName: "Louis D.",
        goalType: "running",
        targetKm: 10,
        streak: {
          create: { currentCount: 4, longestCount: 5, lastWeekMet: true, currentApy: computeApy(4) },
        },
      },
    }),
    prisma.user.create({
      data: {
        id: "00000000-0000-0000-0000-000000000004",
        privyId: "did:privy:mock-user-004",
        displayName: "Emma D.",
        goalType: "cycling",
        targetKm: 20,
        streak: {
          create: { currentCount: 3, longestCount: 3, lastWeekMet: true, currentApy: computeApy(3) },
        },
      },
    }),
    prisma.user.create({
      data: {
        id: "00000000-0000-0000-0000-000000000005",
        privyId: "did:privy:mock-user-005",
        displayName: "Raph N.",
        goalType: "running",
        targetKm: 8,
        streak: {
          create: { currentCount: 2, longestCount: 4, lastWeekMet: true, currentApy: computeApy(2) },
        },
      },
    }),
  ]);

  console.log(`Created ${users.length} users`);

  // Create activities for past 8 weeks
  const activityData = [
    // Talam: 6-week streak (met last 6 weeks)
    ...Array.from({ length: 8 }, (_, i) => ({
      userId: users[0].id,
      weekStart: getMonday(i),
      distanceKm: i < 6 ? 16 + Math.random() * 5 : 8 + Math.random() * 4,
      goalMet: i < 6,
    })),
    // Eva: 10-week streak
    ...Array.from({ length: 8 }, (_, i) => ({
      userId: users[1].id,
      weekStart: getMonday(i),
      distanceKm: 13 + Math.random() * 8,
      goalMet: true,
    })),
    // Louis: 4-week streak
    ...Array.from({ length: 8 }, (_, i) => ({
      userId: users[2].id,
      weekStart: getMonday(i),
      distanceKm: i < 4 ? 11 + Math.random() * 5 : 5 + Math.random() * 3,
      goalMet: i < 4,
    })),
    // Emma: 3-week streak
    ...Array.from({ length: 8 }, (_, i) => ({
      userId: users[3].id,
      weekStart: getMonday(i),
      distanceKm: i < 3 ? 22 + Math.random() * 8 : 10 + Math.random() * 5,
      goalMet: i < 3,
    })),
    // Raph: 2-week streak
    ...Array.from({ length: 8 }, (_, i) => ({
      userId: users[4].id,
      weekStart: getMonday(i),
      distanceKm: i < 2 ? 9 + Math.random() * 3 : 4 + Math.random() * 2,
      goalMet: i < 2,
    })),
  ];

  for (const a of activityData) {
    await prisma.activity.create({
      data: {
        userId: a.userId,
        weekStart: a.weekStart,
        distanceKm: Math.round(a.distanceKm * 10) / 10,
        goalMet: a.goalMet,
        source: "manual",
      },
    });
  }
  console.log(`Created ${activityData.length} activities`);

  // Create friendships (all users are friends)
  const friendshipPairs = [
    [0, 1], [0, 2], [0, 3], [0, 4],
    [1, 2], [1, 3], [1, 4],
    [2, 3], [2, 4],
    [3, 4],
  ];

  for (const [a, b] of friendshipPairs) {
    await prisma.friendship.create({
      data: {
        requesterId: users[a].id,
        addresseeId: users[b].id,
        status: "accepted",
      },
    });
  }
  console.log(`Created ${friendshipPairs.length} friendships`);

  // Create challenges
  const challenge1 = await prisma.challenge.create({
    data: {
      creatorId: users[1].id,
      title: "Summer 10K Challenge",
      description: "Run at least 10km every week this summer!",
      goalKmWeek: 10,
      startDate: getMonday(4),
      endDate: getMonday(-4),
      maxMembers: 6,
      status: "active",
    },
  });

  const challenge2 = await prisma.challenge.create({
    data: {
      creatorId: users[2].id,
      title: "Dauphine Run Club",
      description: "Weekly running club for the Dauphine community",
      goalKmWeek: 15,
      startDate: getMonday(8),
      endDate: getMonday(-8),
      maxMembers: 20,
      status: "active",
    },
  });

  // Add members to challenges
  const c1Members = [users[0], users[1], users[2], users[3]];
  for (const u of c1Members) {
    await prisma.challengeMember.create({
      data: {
        challengeId: challenge1.id,
        userId: u.id,
        weeksMet: Math.floor(Math.random() * 4) + 1,
        weeksTotal: 4,
      },
    });
  }

  const c2Members = [users[0], users[1], users[2], users[3], users[4]];
  for (const u of c2Members) {
    await prisma.challengeMember.create({
      data: {
        challengeId: challenge2.id,
        userId: u.id,
        weeksMet: Math.floor(Math.random() * 6) + 1,
        weeksTotal: 8,
      },
    });
  }
  console.log("Created 2 challenges with members");

  // Create deposits for Talam
  const deposits = [
    { amount: 950, token: "USDC", status: "earning", daysAgo: 30 },
    { amount: 1000, token: "USDC", status: "earning", daysAgo: 16 },
    { amount: 500, token: "USDC", status: "earning", daysAgo: 2 },
  ];

  for (const d of deposits) {
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - d.daysAgo);
    await prisma.deposit.create({
      data: {
        userId: users[0].id,
        amount: d.amount,
        token: d.token,
        status: d.status,
        earningAt: createdAt,
        createdAt,
      },
    });
  }
  console.log(`Created ${deposits.length} deposits`);

  // Create feed events
  const feedEvents = [
    { userId: users[1].id, eventType: "streak_milestone", payload: { streakCount: 10 }, hoursAgo: 2 },
    { userId: users[2].id, eventType: "goal_met", payload: { weekStart: getMonday(0).toISOString(), distanceKm: 18.2 }, hoursAgo: 5 },
    { userId: users[3].id, eventType: "challenge_joined", payload: { challengeId: challenge1.id, title: "Summer 10K Challenge" }, hoursAgo: 24 },
    { userId: users[4].id, eventType: "deposit", payload: { amount: 500, token: "USDC" }, hoursAgo: 28 },
    { userId: users[2].id, eventType: "streak_milestone", payload: { streakCount: 4 }, hoursAgo: 48 },
  ];

  for (const e of feedEvents) {
    const createdAt = new Date();
    createdAt.setHours(createdAt.getHours() - e.hoursAgo);
    await prisma.feedEvent.create({
      data: {
        userId: e.userId,
        eventType: e.eventType,
        payload: e.payload,
        createdAt,
      },
    });
  }
  console.log(`Created ${feedEvents.length} feed events`);

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
