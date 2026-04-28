import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { writeAuditLog } from "@/lib/audit";
import { checkRateLimit, enforceSameOrigin, getClientIp } from "@/lib/api-security";
import { authOptions } from "@/lib/auth";
import { sanitizeText } from "@/lib/input-security";
import { createKycSession } from "@/lib/integrations/adapters";
import { createInAppNotification } from "@/lib/notifications";

const kycSchema = z.object({
  fullName: z.string().min(2).max(120).transform((value) => sanitizeText(value, 120)),
});

export async function POST(request: NextRequest) {
  const blocked = enforceSameOrigin(request) ?? checkRateLimit(`kyc:${getClientIp(request)}`, 8);
  if (blocked) return blocked;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = kycSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const data = await createKycSession({ userId: session.user.id, fullName: parsed.data.fullName });

    await createInAppNotification({
      userId: session.user.id,
      title: "KYC session started",
      message: `KYC provider ${data.provider} session ${data.sessionId} started.`,
      type: "kyc",
      metadata: data,
    });

    await writeAuditLog({
      action: "KYC_SESSION_STARTED",
      entityType: "KYC",
      entityId: data.sessionId,
      actorUserId: session.user.id,
      actorRole: session.user.role ?? null,
      details: {
        provider: data.provider,
        status: data.status,
      },
    });

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Could not start KYC session" }, { status: 500 });
  }
}
