import { BusinessProjectStatus, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { writeAuditLog } from "@/lib/audit";
import { checkRateLimit, enforceSameOrigin, getClientIp } from "@/lib/api-security";
import { authOptions } from "@/lib/auth";
import { isMockMode } from "@/lib/data-mode";
import { normalizeBusinessProject } from "@/lib/db-mappers";
import { sanitizeOptionalText } from "@/lib/input-security";
import {
  getMockBusinessProjectById,
  getMockBusinessProjectUser,
  updateMockBusinessProjectStatus,
} from "@/lib/mock-store";
import { createInAppNotification } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

const statusSchema = z.object({
  status: z.enum(["submitted", "under_review", "needs_revision", "approved", "rejected"]),
  moderationNote: z.string().max(1_000).optional().nullable().transform((value) => sanitizeOptionalText(value, 1_000) ?? null),
});

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const blocked =
    enforceSameOrigin(request) ?? checkRateLimit(`admin:projects:update:${getClientIp(request)}`, 60);
  if (blocked) return blocked;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = session.user.role as Role;
  if (role !== "ADMIN" && role !== "MODERATOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = statusSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const body = parsed.data as { status: BusinessProjectStatus; moderationNote: string | null };

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
