import { NextRequest, NextResponse } from "next/server";
import { mockChallenges, createChallenge } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(mockChallenges);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const challenge = createChallenge(body);
  return NextResponse.json(challenge);
}
