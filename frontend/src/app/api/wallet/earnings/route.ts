import { NextResponse } from "next/server";
import { mockEarnings, recalcEarnings } from "@/lib/mock-data";

export async function GET() {
  recalcEarnings();
  return NextResponse.json(mockEarnings);
}
