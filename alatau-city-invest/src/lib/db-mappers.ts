import {
  Plot as PrismaPlot,
  Application as PrismaApplication,
  Notification as PrismaNotification,
  AuditLog as PrismaAuditLog,
  BusinessProject as PrismaBusinessProject,
  Prisma,
} from "@prisma/client";
import {
  Application,
  AuditLogItem,
  BusinessProject,
  NotificationItem,
  Plot,
} from "@/lib/types";
import { latLngToMapPoint } from "@/lib/map-geo";

function toStringArray(value: Prisma.JsonValue): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item));
}

export function normalizePlot(row: PrismaPlot): Plot {
  const mapPoint = latLngToMapPoint(row.mapLat, row.mapLng);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    district: row.district,
    purpose: row.purpose,
    area: row.area,
    price: row.price,
    currency: "USD",
    roi: row.roi,
    irr: row.irr,
    riskScore: row.riskScore,
    legalGrade: row.legalGrade,
    status: row.status,
    x: mapPoint?.x ?? row.x,
    y: mapPoint?.y ?? row.y,
    distanceCenterKm: row.distanceCenterKm,
    utilities: toStringArray(row.utilities),
    tags: toStringArray(row.tags),
    ownerType: row.ownerType,
    updatedAt: row.updatedAt.toISOString().slice(0, 10),
    docs: toStringArray(row.docs),
    timeline: toStringArray(row.timeline),
    mediaUrls: row.mediaUrls ? toStringArray(row.mediaUrls) : [],
    mapAddress: row.mapAddress ?? undefined,
    mapLat: row.mapLat ?? undefined,
    mapLng: row.mapLng ?? undefined,
    ownerId: row.ownerId ?? undefined,
    source: row.source,
  };
}

export function normalizeApplication(row: PrismaApplication): Application {
  return {
    id: row.id,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    status: row.status,
    reviewNote: row.reviewNote ?? null,
    plotId: row.plotId,
    investorName: row.investorName,
    investorType: row.investorType,
    amount: row.amount,
    phone: row.phone,
    email: row.email,
    sourceOfFunds: row.sourceOfFunds,
  };
}

export function normalizeNotification(row: PrismaNotification): NotificationItem {
  return {
    id: row.id,
    createdAt: row.createdAt.toISOString(),
    readAt: row.readAt?.toISOString() ?? null,
    title: row.title,
    message: row.message,
    type: row.type,
    emailHtml: row.emailHtml ?? null,
    metadata: row.metadata ?? null,
  };
}

export function normalizeAuditLog(row: PrismaAuditLog): AuditLogItem {
  return {
    id: row.id,
    createdAt: row.createdAt.toISOString(),
    action: row.action,
    entityType: row.entityType,
    entityId: row.entityId ?? null,
    actorRole: row.actorRole ?? null,
    actorUserId: row.actorUserId ?? null,
    details: row.details ?? null,
  };
}

export function normalizeBusinessProject(row: PrismaBusinessProject): BusinessProject {
  return {
    id: row.id,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    status: row.status,
    moderationNote: row.moderationNote ?? null,
    companyName: row.companyName,
    businessOverview: row.businessOverview,
    market: row.market,
    businessModel: row.businessModel,
    traction: row.traction,
    legalReadiness: row.legalReadiness,
    financialForecasts: row.financialForecasts,
    investmentTerms: row.investmentTerms,
    founderName: row.founderName,
    founderEmail: row.founderEmail,
    founderPhone: row.founderPhone,
    city: row.city ?? undefined,
    website: row.website ?? null,
    requestedAmount: row.requestedAmount ?? null,
    minimumTicket: row.minimumTicket ?? null,
    mediaUrls: row.mediaUrls ? toStringArray(row.mediaUrls) : [],
    mapAddress: row.mapAddress ?? undefined,
    mapLat: row.mapLat ?? undefined,
    mapLng: row.mapLng ?? undefined,
  };
}
