import { PlotStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { writeAuditLog } from "@/lib/audit";
import { checkRateLimit, enforceSameOrigin, getClientIp } from "@/lib/api-security";
import { authOptions } from "@/lib/auth";
import { isMockMode } from "@/lib/data-mode";
import { normalizePlot, toPublicPlot } from "@/lib/db-mappers";
import { getMockPlotById, updateMockPlotStatus } from "@/lib/mock-store";
import { createInAppNotification } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

const plotStatuses = new Set<PlotStatus>([
  "available",
  "reserved",
  "deal",
  "moderation",
  "sold",
  "legal_issue",
]);
const publicPlotStatuses: PlotStatus[] = ["available", "reserved", "deal"];

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const userId = session?.user?.id;
  const isPrivileged = role === "ADMIN" || role === "MODERATOR";

  if (isMockMode()) {
    const plot = getMockPlotById(id);
    if (!plot) {
      return NextResponse.json({ error: "Plot not found" }, { status: 404 });
    }
    const canView = isPrivileged || publicPlotStatuses.includes(plot.status) || plot.ownerId === userId;
    if (!canView) {
      return NextResponse.json({ error: "Plot not found" }, { status: 404 });
    }
    return NextResponse.json({ data: isPrivileged || plot.ownerId === userId ? plot : toPublicPlot(plot) });
  }

  try {
    const plot = await prisma.plot.findUnique({ where: { id } });

    if (!plot) {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Plot not found" }, { status: 404 });
      }

      const fallback = getMockPlotById(id);
      if (!fallback) {
        return NextResponse.json({ error: "Plot not found" }, { status: 404 });
      }
      return NextResponse.json({ data: fallback });
    }

    const normalized = normalizePlot(plot);
    const canView =
      isPrivileged || publicPlotStatuses.includes(normalized.status) || normalized.ownerId === userId;
    if (!canView) {
      return NextResponse.json({ error: "Plot not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: isPrivileged || normalized.ownerId === userId ? normalized : toPublicPlot(normalized),
    });
  } catch {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Plot not found" }, { status: 404 });
    }

    const fallback = getMockPlotById(id);
    if (!fallback) {
      return NextResponse.json({ error: "Plot not found" }, { status: 404 });
    }
    const canView = isPrivileged || publicPlotStatuses.includes(fallback.status) || fallback.ownerId === userId;
    if (!canView) {
      return NextResponse.json({ error: "Plot not found" }, { status: 404 });
    }
    return NextResponse.json({ data: isPrivileged || fallback.ownerId === userId ? fallback : toPublicPlot(fallback) });
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const blocked = enforceSameOrigin(request) ?? checkRateLimit(`plots:status:${getClientIp(request)}`, 60);
  if (blocked) return blocked;

  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  if (!role || (role !== "ADMIN" && role !== "MODERATOR")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as { status?: PlotStatus } | null;
  if (!body?.status) {
    return NextResponse.json({ error: "status is required" }, { status: 400 });
  }
  if (!plotStatuses.has(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
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
