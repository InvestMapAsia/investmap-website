import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { writeAuditLog } from "@/lib/audit";
import { checkRateLimit, enforceSameOrigin, getClientIp } from "@/lib/api-security";
import { authOptions } from "@/lib/auth";
import { isMockMode } from "@/lib/data-mode";
import { createPaymentCheckout } from "@/lib/integrations/adapters";
import { listMockApplications } from "@/lib/mock-store";
import { createInAppNotification } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

const checkoutSchema = z.object({
  applicationId: z.string().min(1).max(120),
});

export async function POST(request: NextRequest) {
  const blocked =
    enforceSameOrigin(request) ?? checkRateLimit(`payment:checkout:${getClientIp(request)}`, 12);
  if (blocked) return blocked;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = checkoutSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { applicationId } = parsed.data;
  const application = isMockMode()
    ? listMockApplications({
        userId: session.user.id,
        role: session.user.role === "ADMIN" || session.user.role === "MODERATOR" ? session.user.role : "INVESTOR",
      }).find((item) => item.id === applicationId)
    : await prisma.application.findFirst({
        where: {
          id: applicationId,
          userId: session.user.id,
        },
      });

  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  try {
    const data = await createPaymentCheckout({
      amountUsd: application.amount,
      applicationId,
      email: session.user.email,
    });

    await createInAppNotification({
      userId: session.user.id,
      title: "Payment checkout created",
      message: `Checkout prepared for application ${applicationId}.`,
      type: "payment_checkout",
      metadata: {
        applicationId,
        amountUsd: application.amount,
        provider: data.provider,
      },
    });

    await writeAuditLog({
      action: "PAYMENT_CHECKOUT_CREATED",
      entityType: "Payment",
      entityId: applicationId,
      actorUserId: session.user.id,
      actorRole: session.user.role ?? null,
      details: {
        provider: data.provider,
        amountUsd: application.amount,
      },
    });

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Could not create payment checkout" }, { status: 500 });
  }
}
