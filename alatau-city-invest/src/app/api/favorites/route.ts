import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { writeAuditLog } from "@/lib/audit";
import { authOptions } from "@/lib/auth";
import { isMockMode } from "@/lib/data-mode";
import { addMockFavorite, listMockFavoriteIds } from "@/lib/mock-store";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isMockMode()) {
    return NextResponse.json({ data: listMockFavoriteIds(session.user.id) });
  }

  const items = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    select: { plotId: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: items.map((item) => item.plotId) });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { plotId?: string };
  if (!body.plotId) {
    return NextResponse.json({ error: "plotId is required" }, { status: 400 });
  }

  if (isMockMode()) {
    const ok = addMockFavorite({ userId: session.user.id, plotId: body.plotId });
    if (!ok) {
      return NextResponse.json({ error: "Plot not found" }, { status: 404 });
    }

    await writeAuditLog({
      action: "FAVORITE_ADDED",
      entityType: "Favorite",
      entityId: body.plotId,
      actorUserId: session.user.id,
      actorRole: session.user.role ?? null,
      details: {
        plotId: body.plotId,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  }

  const plot = await prisma.plot.findUnique({ where: { id: body.plotId }, select: { id: true } });
  if (!plot) {
    return NextResponse.json({ error: "Plot not found" }, { status: 404 });
  }

  await prisma.favorite.upsert({
    where: {
      userId_plotId: {
        userId: session.user.id,
        plotId: body.plotId,
      },
    },
    update: {},
    create: {
      userId: session.user.id,
      plotId: body.plotId,
    },
  });

  await writeAuditLog({
    action: "FAVORITE_ADDED",
    entityType: "Favorite",
    entityId: body.plotId,
    actorUserId: session.user.id,
    actorRole: session.user.role ?? null,
    details: {
      plotId: body.plotId,
    },
  });

  return NextResponse.json({ success: true }, { status: 201 });
}

