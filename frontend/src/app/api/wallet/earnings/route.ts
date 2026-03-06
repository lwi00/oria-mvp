import { NextResponse } from "next/server";
import { mockEarnings } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(mockEarnings);
}
