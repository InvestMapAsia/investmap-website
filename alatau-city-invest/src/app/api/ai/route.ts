import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, enforceSameOrigin, getClientIp } from "@/lib/api-security";
import { sanitizeText } from "@/lib/input-security";
import { aiAnalyze } from "@/lib/mock-db";

const extractionAttempt =
  /\b(ignore previous|show all|dump|database|db data|all database|secrets?|tokens?|passwords?|admin data|private data|чужие данные|база данных|парол|секрет)\b/i;

export async function POST(request: NextRequest) {
  const blocked = enforceSameOrigin(request) ?? checkRateLimit(`ai:${getClientIp(request)}`, 20);
  if (blocked) return blocked;

  const body = (await request.json().catch(() => null)) as { prompt?: string } | null;

  const prompt = sanitizeText(body?.prompt, 2_000);
  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  if (extractionAttempt.test(prompt)) {
    return NextResponse.json({
      data: {
        answer:
          "I can help compare public investment opportunities, risks and ROI, but I cannot reveal private accounts, admin data, secrets or database dumps.",
      },
    });
  }

  const answer = aiAnalyze(prompt);
  return NextResponse.json({ data: { answer } });
}
