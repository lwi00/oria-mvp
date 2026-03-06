import { NextResponse } from "next/server";
import { mockWallet } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(mockWallet);
}
