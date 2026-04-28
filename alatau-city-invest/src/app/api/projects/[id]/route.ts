import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { writeAuditLog } from "@/lib/audit";
import { checkRateLimit, enforceSameOrigin, getClientIp } from "@/lib/api-security";
import { authOptions } from "@/lib/auth";
import { isMockMode } from "@/lib/data-mode";
import { normalizeBusinessProject } from "@/lib/db-mappers";
import {
  sanitizeHttpUrl,
  sanitizeMediaUrl,
  sanitizeOptionalText,
  sanitizeStringArray,
  sanitizeText,
} from "@/lib/input-security";
import {
  getMockBusinessProjectById,
  getMockBusinessProjectUser,
  updateMockBusinessProject,
} from "@/lib/mock-store";
import { createInAppNotification } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

function normalizeOptionalNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return undefined;
  const next = Number(value);
  return Number.isFinite(next) ? next : undefined;
}

function calculateReadinessScore(payload: {
  companyName: string;
  businessOverview: string;
  market: string;
  businessModel: string;
  traction: string;
  legalReadiness: string;
  financialForecasts: string;
  investmentTerms: string;
  founderName: string;
  founderEmail: string;
  founderPhone: string;
  website?: string;
  mediaUrls?: string[];
}) {
  let score = 0;
  if (payload.companyName.length >= 3) score += 10;
  if (payload.businessOverview.length >= 60) score += 15;
  if (payload.market.length >= 20) score += 12;
  if (payload.businessModel.length >= 30) score += 12;
  if (payload.traction.length >= 30) score += 14;
  if (payload.legalReadiness.length >= 20) score += 12;
  if (payload.financialForecasts.length >= 25) score += 12;
  if (payload.investmentTerms.length >= 25) score += 10;
  if (payload.founderName.length >= 4) score += 1;
  if (payload.founderEmail.includes("@")) score += 1;
  if (payload.founderPhone.length >= 8) score += 1;
  if (payload.website && payload.website.startsWith("http")) score += 1;
  if (payload.mediaUrls?.length) score += 1;
  return Math.min(100, score);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const blocked = enforceSameOrigin(request) ?? checkRateLimit(`projects:update:${getClientIp(request)}`, 30);
  if (blocked) return blocked;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const role = session.user.role as Role;
  const body = (await request.json().catch(() => null)) as {
    companyName?: string;
    businessOverview?: string;
    market?: string;
    businessModel?: string;
    traction?: string;
    legalReadiness?: string;
    financialForecasts?: string;
    investmentTerms?: string;
    founderName?: string;
    founderEmail?: string;
    founderPhone?: string;
    city?: string;
    website?: string;
    requestedAmount?: number | string;
    minimumTicket?: number | string;
    mediaUrls?: string[] | string;
    mapAddress?: string;
    mapLat?: number | string;
    mapLng?: number | string;
  } | null;

  const payload = {
    companyName: sanitizeText(body?.companyName, 120),
    businessOverview: sanitizeText(body?.businessOverview, 2_000),
    market: sanitizeText(body?.market, 240),
    businessModel: sanitizeText(body?.businessModel, 1_200),
    traction: sanitizeText(body?.traction, 1_200),
    legalReadiness: sanitizeText(body?.legalReadiness, 1_200),
    financialForecasts: sanitizeText(body?.financialForecasts, 1_200),
    investmentTerms: sanitizeText(body?.investmentTerms, 1_200),
    founderName: sanitizeText(body?.founderName, 120),
    founderEmail: sanitizeText(body?.founderEmail, 160).toLowerCase(),
    founderPhone: sanitizeText(body?.founderPhone, 60),
    city: sanitizeOptionalText(body?.city, 120),
    website: sanitizeHttpUrl(body?.website),
    requestedAmount: normalizeOptionalNumber(body?.requestedAmount),
    minimumTicket: normalizeOptionalNumber(body?.minimumTicket),
    mediaUrls: sanitizeStringArray(body?.mediaUrls, sanitizeMediaUrl),
    mapAddress: sanitizeOptionalText(body?.mapAddress, 240),
    mapLat: normalizeOptionalNumber(body?.mapLat),
    mapLng: normalizeOptionalNumber(body?.mapLng),
  };

  if (
    !payload.companyName ||
    !payload.businessOverview ||
    !payload.market ||
    !payload.businessModel ||
    !payload.traction ||
    !payload.legalReadiness ||
    !payload.financialForecasts ||
    !payload.investmentTerms ||
    !payload.founderName ||
    !payload.founderEmail ||
    !payload.founderPhone ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.founderEmail) ||
    (payload.requestedAmount !== undefined && payload.requestedAmount < 1_000) ||
    (payload.minimumTicket !== undefined && payload.minimumTicket < 100)
  ) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const readinessScore = calculateReadinessScore(payload);

  if (isMockMode()) {
    const current = getMockBusinessProjectById(id);
    if (!current) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const owner = getMockBusinessProjectUser(id);
    if (role !== "ADMIN" && owner?.id !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = updateMockBusinessProject({
      id,
      ...payload,
      mediaUrls: payload.mediaUrls ?? current.mediaUrls,
    });

    if (!updated) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    await createInAppNotification({
      userId: owner?.id ?? session.user.id,
      title: "Project edits submitted",
      message: `Edits for ${updated.companyName} were sent to moderation.`,
      type: "business_project_edit",
      metadata: { projectId: updated.id, readinessScore },
    });

    await writeAuditLog({
      action: "BUSINESS_PROJECT_EDIT_SUBMITTED",
      entityType: "BusinessProject",
      entityId: updated.id,
      actorUserId: session.user.id,
      actorRole: role,
      details: { status: updated.status, readinessScore },
    });

    return NextResponse.json({ data: updated, readinessScore });
  }

  const current = await prisma.businessProject.findUnique({ where: { id } });
  if (!current) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  if (role !== "ADMIN" && current.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const existingMediaUrls = Array.isArray(current.mediaUrls)
    ? current.mediaUrls.map((item) => String(item))
    : undefined;

  const updated = await prisma.businessProject.update({
    where: { id },
    data: {
      companyName: payload.companyName,
      businessOverview: payload.businessOverview,
      market: payload.market,
      businessModel: payload.businessModel,
      traction: payload.traction,
      legalReadiness: payload.legalReadiness,
      financialForecasts: payload.financialForecasts,
      investmentTerms: payload.investmentTerms,
      founderName: payload.founderName,
      founderEmail: payload.founderEmail,
      founderPhone: payload.founderPhone,
      city: payload.city,
      website: payload.website,
      requestedAmount: payload.requestedAmount,
      minimumTicket: payload.minimumTicket,
      mediaUrls: payload.mediaUrls ?? existingMediaUrls,
      mapAddress: payload.mapAddress,
      mapLat: payload.mapLat,
      mapLng: payload.mapLng,
      status: "submitted",
      moderationNote: null,
    },
  });

  await createInAppNotification({
    userId: updated.userId ?? session.user.id,
    title: "Project edits submitted",
    message: `Edits for ${updated.companyName} were sent to moderation.`,
    type: "business_project_edit",
    metadata: { projectId: updated.id, readinessScore },
  });

  await writeAuditLog({
    action: "BUSINESS_PROJECT_EDIT_SUBMITTED",
    entityType: "BusinessProject",
    entityId: updated.id,
    actorUserId: session.user.id,
    actorRole: role,
    details: { status: updated.status, readinessScore },
  });

  return NextResponse.json({ data: normalizeBusinessProject(updated), readinessScore });
}
