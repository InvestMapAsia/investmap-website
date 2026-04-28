import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { checkRateLimit, enforceSameOrigin, getClientIp } from "@/lib/api-security";
import { authOptions } from "@/lib/auth";
import { isMockMode } from "@/lib/data-mode";
import { markMockNotificationRead } from "@/lib/mock-store";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const blocked =
    enforceSameOrigin(request) ?? checkRateLimit(`notifications:read:${getClientIp(request)}`, 120);
  if (blocked) return blocked;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id || id.length > 120) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  if (isMockMode()) {
    const updated = markMockNotificationRead({ userId: session.user.id, id });
    return NextResponse.json({ updated });
  }

  const updated = await prisma.notification.updateMany({
    where: { id, userId: session.user.id, readAt: null },
    data: { readAt: new Date() },
  });

  return NextResponse.json({ updated: updated.count });
}
