import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, enforceSameOrigin, getClientIp } from "@/lib/api-security";
import { aiAnalyze } from "@/lib/mock-db";

export async function POST(request: NextRequest) {
  const blocked = enforceSameOrigin(request) ?? checkRateLimit(`ai:${getClientIp(request)}`, 20);
  if (blocked) return blocked;

  const body = (await request.json().catch(() => null)) as { prompt?: string } | null;

  if (!body?.prompt || !body.prompt.trim()) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const answer = aiAnalyze(body.prompt.slice(0, 2_000));
  return NextResponse.json({ data: { answer } });
}
