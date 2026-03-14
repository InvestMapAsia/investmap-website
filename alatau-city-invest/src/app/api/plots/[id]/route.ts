import { PlotStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { writeAuditLog } from "@/lib/audit";
import { authOptions } from "@/lib/auth";
import { isMockMode } from "@/lib/data-mode";
import { normalizePlot } from "@/lib/db-mappers";
import { getMockPlotById, updateMockPlotStatus } from "@/lib/mock-store";
import { createInAppNotification } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  if (isMockMode()) {
    const plot = getMockPlotById(id);
    if (!plot) {
      return NextResponse.json({ error: "Plot not found" }, { status: 404 });
    }
    return NextResponse.json({ data: plot });
  }

  const plot = await prisma.plot.findUnique({ where: { id } });

  if (!plot) {
    return NextResponse.json({ error: "Plot not found" }, { status: 404 });
  }

  return NextResponse.json({ data: normalizePlot(plot) });
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  if (!role || (role !== "ADMIN" && role !== "MODERATOR")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as { status?: PlotStatus };
  if (!body.status) {
    return NextResponse.json({ error: "status is required" }, { status: 400 });
  }

  const { id } = await context.params;

  if (isMockMode()) {
    const current = getMockPlotById(id);
    if (!current) {
      return NextResponse.json({ error: "Plot not found" }, { status: 404 });
    }

    const updated = updateMockPlotStatus(id, body.status);
    if (!updated) {
      return NextResponse.json({ error: "Plot not found" }, { status: 404 });
    }

    if (updated.ownerId) {
      await createInAppNotification({
        userId: updated.ownerId,
        title: "Plot status updated",
        message: `Plot ${updated.id} status changed to ${updated.status}.`,
        type: "plot_status",
        metadata: {
          from: current.status,
          to: updated.status,
          plotId: updated.id,
        },
      });
    }

    await writeAuditLog({
      action: "PLOT_STATUS_UPDATED",
      entityType: "Plot",
      entityId: updated.id,
      actorUserId: session.user.id,
      actorRole: role,
      details: {
        from: current.status,
        to: updated.status,
      },
    });

    return NextResponse.json({ data: updated });
  }

  try {
    const current = await prisma.plot.findUnique({ where: { id } });
    if (!current) {
      return NextResponse.json({ error: "Plot not found" }, { status: 404 });
    }

    const updated = await prisma.plot.update({
      where: { id },
      data: { status: body.status },
    });

    if (updated.ownerId) {
      await createInAppNotification({
        userId: updated.ownerId,
        title: "Plot status updated",
        message: `Plot ${updated.id} status changed to ${updated.status}.`,
        type: "plot_status",
        metadata: {
          from: current.status,
          to: updated.status,
          plotId: updated.id,
        },
      });
    }

    await writeAuditLog({
      action: "PLOT_STATUS_UPDATED",
      entityType: "Plot",
      entityId: updated.id,
      actorUserId: session.user.id,
      actorRole: role,
      details: {
        from: current.status,
        to: updated.status,
      },
    });

    return NextResponse.json({ data: normalizePlot(updated) });
  } catch {
    return NextResponse.json({ error: "Plot not found" }, { status: 404 });
  }
}
