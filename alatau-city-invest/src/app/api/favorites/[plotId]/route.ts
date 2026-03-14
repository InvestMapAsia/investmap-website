import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { writeAuditLog } from "@/lib/audit";
import { authOptions } from "@/lib/auth";
import { isMockMode } from "@/lib/data-mode";
import { removeMockFavorite } from "@/lib/mock-store";
import { prisma } from "@/lib/prisma";

export async function DELETE(_request: NextRequest, context: { params: Promise<{ plotId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plotId } = await context.params;

  if (isMockMode()) {
    removeMockFavorite({ userId: session.user.id, plotId });

    await writeAuditLog({
      action: "FAVORITE_REMOVED",
      entityType: "Favorite",
      entityId: plotId,
      actorUserId: session.user.id,
      actorRole: session.user.role ?? null,
      details: { plotId },
    });

    return NextResponse.json({ success: true });
  }

  await prisma.favorite.deleteMany({
    where: {
      userId: session.user.id,
      plotId,
    },
  });

  await writeAuditLog({
    action: "FAVORITE_REMOVED",
    entityType: "Favorite",
    entityId: plotId,
    actorUserId: session.user.id,
    actorRole: session.user.role ?? null,
    details: { plotId },
  });

  return NextResponse.json({ success: true });
}
