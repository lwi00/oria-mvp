import { NextRequest, NextResponse } from "next/server";
import { mockChallenges, mockUser } from "@/lib/mock-data";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const challenge = mockChallenges.find((c) => c.id === id);
  if (!challenge) {
    return NextResponse.json({ message: "Challenge not found" }, { status: 404 });
  }

  if (challenge.members.some((m) => m.userId === mockUser.id)) {
    return NextResponse.json({ message: "Already a member" }, { status: 400 });
  }

  const member = {
    id: `cm-${Date.now()}`,
    userId: mockUser.id,
    weeksMet: 0,
    weeksTotal: 0,
    user: { id: mockUser.id, displayName: mockUser.displayName, avatarUrl: null },
  };
  challenge.members.push(member);
  challenge._count.members += 1;

  return NextResponse.json(member);
}
