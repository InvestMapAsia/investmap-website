import { ApplicationStatus, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { writeAuditLog } from "@/lib/audit";
import { authOptions } from "@/lib/auth";
import { isMockMode } from "@/lib/data-mode";
import { normalizeApplication } from "@/lib/db-mappers";
import {
  getMockApplicationById,
  getMockApplicationUser,
  updateMockApplicationStatus,
} from "@/lib/mock-store";
import { createApplicationStatusNotifications } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = session.user.role as Role;
  if (role !== "ADMIN" && role !== "MODERATOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as {
    status?: ApplicationStatus;
    reviewNote?: string;
  };

  if (!body.status) {
    return NextResponse.json({ error: "status is required" }, { status: 400 });
  }

  const { id } = await context.params;

  if (isMockMode()) {
    const current = getMockApplicationById(id);
    if (!current) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const result = updateMockApplicationStatus({
      id,
      status: body.status,
      reviewNote: body.reviewNote ?? null,
    });

    if (!result) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const user = getMockApplicationUser(id);
    if (user) {
      await createApplicationStatusNotifications({
        userId: user.id,
        investorName: user.name ?? result.updated.investorName,
        applicationId: result.updated.id,
        plotId: result.updated.plotId,
        status: result.updated.status,
        reviewNote: result.updated.reviewNote,
      });
    }

    await writeAuditLog({
      action: "APPLICATION_STATUS_UPDATED",
      entityType: "Application",
      entityId: result.updated.id,
      actorUserId: session.user.id,
      actorRole: role,
      details: {
        from: result.previousStatus,
        to: result.updated.status,
        reviewNote: result.updated.reviewNote,
      },
    });

    return NextResponse.json({ data: result.updated });
  }

  const current = await prisma.application.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!current) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const updated = await prisma.application.update({
    where: { id },
    data: {
      status: body.status,
      reviewNote: body.reviewNote ?? null,
    },
    include: { user: true },
  });

  if (updated.userId && updated.user) {
    await createApplicationStatusNotifications({
      userId: updated.userId,
      investorName: updated.user.name ?? updated.investorName,
      applicationId: updated.id,
      plotId: updated.plotId,
      status: updated.status,
      reviewNote: updated.reviewNote,
    });
  }

  await writeAuditLog({
    action: "APPLICATION_STATUS_UPDATED",
    entityType: "Application",
    entityId: updated.id,
    actorUserId: session.user.id,
    actorRole: role,
    details: {
      from: current.status,
      to: updated.status,
      reviewNote: updated.reviewNote,
    },
  });

  return NextResponse.json({ data: normalizeApplication(updated) });
}
