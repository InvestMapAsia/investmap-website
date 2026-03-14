import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createKycSession } from "@/lib/integrations/adapters";
import { createInAppNotification } from "@/lib/notifications";
import { writeAuditLog } from "@/lib/audit";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { fullName?: string };
  if (!body.fullName) {
    return NextResponse.json({ error: "fullName is required" }, { status: 400 });
  }

  try {
    const data = await createKycSession({ userId: session.user.id, fullName: body.fullName });

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
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
