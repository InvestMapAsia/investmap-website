import { NextRequest, NextResponse } from "next/server";
import { writeAuditLog } from "@/lib/audit";
import { consumeEmailVerificationToken } from "@/lib/email/verification";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const result = await consumeEmailVerificationToken(token);

  const loginUrl = new URL("/login", request.nextUrl.origin);

  if (!result.ok) {
    loginUrl.searchParams.set("verified", "0");
    loginUrl.searchParams.set("reason", result.reason);
    return NextResponse.redirect(loginUrl);
  }

  await writeAuditLog({
    action: "USER_EMAIL_VERIFIED",
    entityType: "User",
    entityId: result.userId,
    actorUserId: result.userId,
    actorRole: result.role,
    details: {
      email: result.email,
    },
  });

  loginUrl.searchParams.set("verified", "1");
  return NextResponse.redirect(loginUrl);
}
