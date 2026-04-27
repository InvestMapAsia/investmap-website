import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/api-security";
import { geocodeAddress } from "@/lib/integrations/adapters";

export async function GET(request: NextRequest) {
  const blocked = checkRateLimit(`geocode:${getClientIp(request)}`, 60);
  if (blocked) return blocked;

  const query = request.nextUrl.searchParams.get("query")?.trim();
  if (!query) {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }
  if (query.length > 240) {
    return NextResponse.json({ error: "query is too long" }, { status: 400 });
  }

  try {
    const data = await geocodeAddress(query);
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Could not geocode address" }, { status: 500 });
  }
}
