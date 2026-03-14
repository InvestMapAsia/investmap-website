import { aiAnalyze } from "@/lib/mock-db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { prompt?: string };

  if (!body.prompt || !body.prompt.trim()) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const answer = aiAnalyze(body.prompt);
  return NextResponse.json({ data: { answer } });
}
