import { NextRequest, NextResponse } from "next/server";
import { deposit } from "@/lib/mock-data";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = deposit(body.amount, body.token);
  return NextResponse.json(result);
}
