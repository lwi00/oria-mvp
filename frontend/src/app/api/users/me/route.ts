import { NextRequest, NextResponse } from "next/server";
import { mockUser, updateUser } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(mockUser);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const updated = updateUser(body);
  return NextResponse.json(updated);
}
