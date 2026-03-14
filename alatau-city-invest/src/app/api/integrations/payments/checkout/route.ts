import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createPaymentCheckout } from "@/lib/integrations/adapters";
import { createInAppNotification } from "@/lib/notifications";
import { writeAuditLog } from "@/lib/audit";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { amountUsd?: number; applicationId?: string };
  if (!body.amountUsd || !body.applicationId) {
    return NextResponse.json({ error: "amountUsd and applicationId are required" }, { status: 400 });
  }

  try {
    const data = await createPaymentCheckout({
      amountUsd: body.amountUsd,
      applicationId: body.applicationId,
      email: session.user.email,
    });

    if (session.user.id) {
      await createInAppNotification({
        userId: session.user.id,
        title: "Payment checkout created",
        message: `Checkout prepared for application ${body.applicationId}.`,
        type: "payment_checkout",
        metadata: {
          applicationId: body.applicationId,
          amountUsd: body.amountUsd,
          provider: data.provider,
        },
      });

      await writeAuditLog({
        action: "PAYMENT_CHECKOUT_CREATED",
        entityType: "Payment",
        entityId: body.applicationId,
        actorUserId: session.user.id,
        actorRole: session.user.role ?? null,
        details: {
          provider: data.provider,
          amountUsd: body.amountUsd,
        },
      });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
