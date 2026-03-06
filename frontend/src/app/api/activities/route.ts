import { NextRequest, NextResponse } from "next/server";
import { mockActivities, logActivity } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(mockActivities);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = logActivity(body.distanceKm);
  return NextResponse.json(result);
}
