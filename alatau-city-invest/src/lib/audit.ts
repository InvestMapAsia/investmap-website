import { Role } from "@prisma/client";
import { isMockMode } from "@/lib/data-mode";
import { createMockAuditLog } from "@/lib/mock-store";
import { prisma } from "@/lib/prisma";

export async function writeAuditLog(payload: {
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: unknown;
  actorUserId?: string | null;
  actorRole?: Role | null;
}) {
  if (isMockMode()) {
    createMockAuditLog({
      action: payload.action,
      entityType: payload.entityType,
      entityId: payload.entityId ?? null,
      details: payload.details ?? null,
      actorUserId: payload.actorUserId ?? null,
      actorRole: payload.actorRole ?? null,
    });
    return;
  }

  await prisma.auditLog.create({
    data: {
      action: payload.action,
      entityType: payload.entityType,
      entityId: payload.entityId ?? null,
      details: payload.details ? (payload.details as object) : undefined,
      actorUserId: payload.actorUserId ?? null,
      actorRole: payload.actorRole ?? null,
    },
  });
}
