import { BusinessProjectStatus, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { writeAuditLog } from "@/lib/audit";
import { authOptions } from "@/lib/auth";
import { isMockMode } from "@/lib/data-mode";
import { normalizeBusinessProject } from "@/lib/db-mappers";
import {
  getMockBusinessProjectById,
  getMockBusinessProjectUser,
  updateMockBusinessProjectStatus,
} from "@/lib/mock-store";
import { createInAppNotification } from "@/lib/notifications";
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
    status?: BusinessProjectStatus;
    moderationNote?: string;
  };

  if (!body.status) {
    return NextResponse.json({ error: "status is required" }, { status: 400 });
  }

  const { id } = await context.params;

  if (isMockMode()) {
    const current = getMockBusinessProjectById(id);
    if (!current) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const result = updateMockBusinessProjectStatus({
      id,
      status: body.status,
      moderationNote: body.moderationNote ?? null,
    });

    if (!result) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const owner = getMockBusinessProjectUser(id);
    if (owner) {
      await createInAppNotification({
        userId: owner.id,
        title: "Project status updated",
        message: `Project ${result.updated.companyName} status changed to ${result.updated.status}.`,
        type: "business_project",
        metadata: {
          projectId: result.updated.id,
          from: result.previousStatus,
          to: result.updated.status,
        },
      });
    }

    await writeAuditLog({
      action: "BUSINESS_PROJECT_STATUS_UPDATED",
      entityType: "BusinessProject",
      entityId: result.updated.id,
      actorUserId: session.user.id,
      actorRole: role,
      details: {
        from: result.previousStatus,
        to: result.updated.status,
        moderationNote: result.updated.moderationNote,
      },
    });

    return NextResponse.json({ data: result.updated });
  }

  const current = await prisma.businessProject.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!current) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const updated = await prisma.businessProject.update({
    where: { id },
    data: {
      status: body.status,
      moderationNote: body.moderationNote ?? null,
    },
    include: { user: true },
  });

  if (updated.userId) {
    await createInAppNotification({
      userId: updated.userId,
      title: "Project status updated",
      message: `Project ${updated.companyName} status changed to ${updated.status}.`,
      type: "business_project",
      metadata: {
        projectId: updated.id,
        from: current.status,
        to: updated.status,
      },
    });
  }

  await writeAuditLog({
    action: "BUSINESS_PROJECT_STATUS_UPDATED",
    entityType: "BusinessProject",
    entityId: updated.id,
    actorUserId: session.user.id,
    actorRole: role,
    details: {
      from: current.status,
      to: updated.status,
      moderationNote: updated.moderationNote,
    },
  });

  return NextResponse.json({ data: normalizeBusinessProject(updated) });
}