import { NextRequest, NextResponse } from "next/server";
import { appleHealthConnected, connectAppleHealth, syncAppleHealth } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ connected: appleHealthConnected });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.action === "connect") {
    connectAppleHealth();
    return NextResponse.json({ connected: true });
  }

  if (body.action === "sync") {
    if (!appleHealthConnected) {
      return NextResponse.json({ error: "Not connected" }, { status: 400 });
    }
    const result = syncAppleHealth();
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
