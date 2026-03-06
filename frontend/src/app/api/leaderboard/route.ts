import { NextResponse } from "next/server";
import { mockLeaderboard } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(mockLeaderboard);
}
