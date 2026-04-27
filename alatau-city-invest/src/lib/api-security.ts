import { NextRequest, NextResponse } from "next/server";

const DEFAULT_WINDOW_MS = 60_000;
const buckets = new Map<string, { count: number; resetAt: number }>();

export function getClientIp(request: NextRequest | Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export function checkRateLimit(key: string, limit: number, windowMs = DEFAULT_WINDOW_MS) {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  current.count += 1;
  if (current.count <= limit) {
    return null;
  }

  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: {
        "Retry-After": String(Math.ceil((current.resetAt - now) / 1000)),
      },
    }
  );
}

export function enforceSameOrigin(request: NextRequest | Request) {
  const method = request.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return null;
  }

  const secFetchSite = request.headers.get("sec-fetch-site");
  if (secFetchSite && secFetchSite !== "same-origin" && secFetchSite !== "same-site") {
    return NextResponse.json({ error: "Cross-site request blocked" }, { status: 403 });
  }

  const origin = request.headers.get("origin");
  if (!origin) {
    return null;
  }

  const allowed = new Set(
    [
      process.env.NEXTAUTH_URL,
      process.env.NEXT_PUBLIC_SITE_URL,
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    ].filter(Boolean)
  );

  try {
    const requestOrigin = new URL(request.url).origin;
    allowed.add(requestOrigin);
  } catch {
    // The framework should always provide an absolute request URL.
  }

  if (!allowed.has(origin)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }

  return null;
}
