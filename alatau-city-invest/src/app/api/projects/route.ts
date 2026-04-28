import { BusinessProjectStatus, Prisma, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { writeAuditLog } from "@/lib/audit";
import { checkRateLimit, enforceSameOrigin, getClientIp } from "@/lib/api-security";
import { authOptions } from "@/lib/auth";
import { isMockMode } from "@/lib/data-mode";
import { normalizeBusinessProject, toPublicBusinessProject } from "@/lib/db-mappers";
import {
  sanitizeHttpUrl,
  sanitizeMediaUrl,
  sanitizeOptionalText,
  sanitizeStringArray,
  sanitizeText,
} from "@/lib/input-security";
import { createMockBusinessProject, listMockBusinessProjects } from "@/lib/mock-store";
import { createInAppNotification } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

const businessProjectStatuses = new Set<BusinessProjectStatus>([
  "submitted",
  "under_review",
  "needs_revision",
  "approved",
  "rejected",
]);

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
  return Math.min(100, score);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const requestedStatus = searchParams.get("status") ?? "all";
  const search = sanitizeOptionalText(searchParams.get("search"), 120);
  const scope = (searchParams.get("scope") as "market" | "mine" | null) ?? "market";

  if (
    requestedStatus !== "all" &&
    !businessProjectStatuses.has(requestedStatus as BusinessProjectStatus)
  ) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const role = (session?.user?.role as Role | undefined) ?? undefined;
  const isPrivileged = role === "ADMIN" || role === "MODERATOR";
  const status = requestedStatus as BusinessProjectStatus | "all";
  const effectivePublicStatus = !userId && !isPrivileged ? "approved" : status;

  if (scope === "mine" && !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isMockMode()) {
    const rows = listMockBusinessProjects({
      userId,
      role,
      status: effectivePublicStatus,
      search,
      scope,
    });

    const data = scope === "market" && !isPrivileged
      ? rows.map(toPublicBusinessProject)
      : rows;

    return NextResponse.json({ data });
  }

  const where: Prisma.BusinessProjectWhereInput = {};

  if (search) {
    where.OR = [
      { companyName: { contains: search, mode: "insensitive" } },
      { market: { contains: search, mode: "insensitive" } },
      { businessOverview: { contains: search, mode: "insensitive" } },
      { founderName: { contains: search, mode: "insensitive" } },
    ];
  }

  if (scope === "mine" && userId) {
    where.userId = userId;
    if (status !== "all") {
      where.status = status;
    }
  } else if (isPrivileged) {
    if (status !== "all") {
      where.status = status;
    }
  } else if (userId) {
    where.AND = [
      {
        OR: [{ status: "approved" }, { userId }],
      },
    ];

    if (status !== "all") {
      where.AND.push({ status });
    }
  } else {
    where.status = "approved";
  }

  try {
    const rows = await prisma.businessProject.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const normalized = rows.map((row) => {
      const project = normalizeBusinessProject(row);
      const canViewPrivate = isPrivileged || Boolean(userId && row.userId === userId);
      return canViewPrivate ? project : toPublicBusinessProject(project);
    });
    if (normalized.length) {
      return NextResponse.json({ data: normalized });
    }

    if (scope === "market" && process.env.NODE_ENV !== "production") {
      const fallbackRows = listMockBusinessProjects({
        userId,
        role,
        status: effectivePublicStatus,
        search,
        scope,
      });
      return NextResponse.json({
        data: !isPrivileged ? fallbackRows.map(toPublicBusinessProject) : fallbackRows,
      });
    }

    return NextResponse.json({ data: normalized });
  } catch {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Could not load projects" }, { status: 500 });
    }

    const fallbackRows = listMockBusinessProjects({
      userId,
      role,
      status: effectivePublicStatus,
      search,
      scope,
    });
    return NextResponse.json({
      data: !isPrivileged ? fallbackRows.map(toPublicBusinessProject) : fallbackRows,
    });
  }
}

export async function POST(request: NextRequest) {
  const blocked = enforceSameOrigin(request) ?? checkRateLimit(`projects:create:${getClientIp(request)}`, 20);
  if (blocked) return blocked;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.email || !session.user.role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
    requestedAmount?: number;
    minimumTicket?: number;
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
    requestedAmount: body?.requestedAmount ? Number(body.requestedAmount) : undefined,
    minimumTicket: body?.minimumTicket ? Number(body.minimumTicket) : undefined,
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
    const created = createMockBusinessProject({
      ...payload,
      userId: session.user.id,
    });

    await createInAppNotification({
      userId: session.user.id,
      title: "Project submitted",
      message: `Project ${created.companyName} submitted for moderation.`,
      type: "business_project",
      metadata: {
        projectId: created.id,
        readinessScore,
      },
    });

    await writeAuditLog({
      action: "BUSINESS_PROJECT_CREATED",
      entityType: "BusinessProject",
      entityId: created.id,
      actorUserId: session.user.id,
      actorRole: session.user.role as Role,
      details: {
        status: created.status,
        readinessScore,
      },
    });

    return NextResponse.json({ data: created, readinessScore }, { status: 201 });
  }

  const created = await prisma.businessProject.create({
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
      mediaUrls: payload.mediaUrls,
      mapAddress: payload.mapAddress,
      mapLat: payload.mapLat,
      mapLng: payload.mapLng,
      userId: session.user.id,
    },
  });

  await createInAppNotification({
    userId: session.user.id,
    title: "Project submitted",
    message: `Project ${created.companyName} submitted for moderation.`,
    type: "business_project",
    metadata: {
      projectId: created.id,
      readinessScore,
    },
  });

  await writeAuditLog({
    action: "BUSINESS_PROJECT_CREATED",
    entityType: "BusinessProject",
    entityId: created.id,
    actorUserId: session.user.id,
    actorRole: session.user.role as Role,
    details: {
      status: created.status,
      readinessScore,
    },
  });

  return NextResponse.json(
    {
      data: normalizeBusinessProject(created),
      readinessScore,
    },
    { status: 201 }
  );
}

