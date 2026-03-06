import { NextResponse } from "next/server";
import { mockStreak } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(mockStreak);
}
