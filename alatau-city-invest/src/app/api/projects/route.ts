import { BusinessProjectStatus, Prisma, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { writeAuditLog } from "@/lib/audit";
import { authOptions } from "@/lib/auth";
import { isMockMode } from "@/lib/data-mode";
import { normalizeBusinessProject } from "@/lib/db-mappers";
import { createMockBusinessProject, listMockBusinessProjects } from "@/lib/mock-store";
import { createInAppNotification } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

function normalizeText(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function normalizeOptionalText(value: unknown) {
  const next = normalizeText(value);
  return next.length ? next : undefined;
}

function normalizeStringArray(value: unknown) {
  if (Array.isArray(value)) {
    const result = value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter((item) => item.length > 0);
    return result.length ? result : undefined;
  }

  if (typeof value === "string") {
    const result = value
      .split(/\r?\n|,/g)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    return result.length ? result : undefined;
  }

  return undefined;
}

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
  const status =
    (searchParams.get("status") as BusinessProjectStatus | "all" | null) ?? "all";
  const search = searchParams.get("search") ?? undefined;
  const scope = (searchParams.get("scope") as "market" | "mine" | null) ?? "market";

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const role = (session?.user?.role as Role | undefined) ?? undefined;

  if (scope === "mine" && !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isMockMode()) {
    const rows = listMockBusinessProjects({
      userId,
      role,
      status,
      search,
      scope,
    });

    return NextResponse.json({ data: rows });
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
  } else if (role === "ADMIN" || role === "MODERATOR") {
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
    where.status = status === "all" ? "approved" : status;
  }

  const rows = await prisma.businessProject.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: rows.map(normalizeBusinessProject) });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.email || !session.user.role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
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
  };

  const payload = {
    companyName: normalizeText(body.companyName),
    businessOverview: normalizeText(body.businessOverview),
    market: normalizeText(body.market),
    businessModel: normalizeText(body.businessModel),
    traction: normalizeText(body.traction),
    legalReadiness: normalizeText(body.legalReadiness),
    financialForecasts: normalizeText(body.financialForecasts),
    investmentTerms: normalizeText(body.investmentTerms),
    founderName: normalizeText(body.founderName),
    founderEmail: normalizeText(body.founderEmail),
    founderPhone: normalizeText(body.founderPhone),
    city: normalizeOptionalText(body.city),
    website: normalizeOptionalText(body.website),
    requestedAmount: body.requestedAmount ? Number(body.requestedAmount) : undefined,
    minimumTicket: body.minimumTicket ? Number(body.minimumTicket) : undefined,
    mediaUrls: normalizeStringArray(body.mediaUrls),
    mapAddress: normalizeOptionalText(body.mapAddress),
    mapLat: normalizeOptionalNumber(body.mapLat),
    mapLng: normalizeOptionalNumber(body.mapLng),
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
    !payload.founderPhone
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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

