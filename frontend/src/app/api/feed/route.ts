import { NextRequest, NextResponse } from "next/server";
import { mockFeed } from "@/lib/mock-data";

export async function GET(req: NextRequest) {
  const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "20");
  return NextResponse.json(mockFeed.slice(0, limit));
}
