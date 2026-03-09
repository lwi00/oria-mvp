import { NextResponse } from "next/server";
import { getDeposits } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(getDeposits());
}
