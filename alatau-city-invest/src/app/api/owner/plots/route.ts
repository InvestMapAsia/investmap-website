import { PlotSource, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { writeAuditLog } from "@/lib/audit";
import { authOptions } from "@/lib/auth";
import { isMockMode } from "@/lib/data-mode";
import { normalizePlot } from "@/lib/db-mappers";
import { ALATAU_BOUNDS, isInsideAlatauBounds, latLngToMapPoint } from "@/lib/map-geo";
import { createMockOwnerPlot, listMockOwnerPlots } from "@/lib/mock-store";
import { createInAppNotification } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

function normalizeOptionalNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return undefined;
  const next = Number(value);
  return Number.isFinite(next) ? next : undefined;
}

function normalizeOptionalText(value: unknown) {
  if (typeof value !== "string") return undefined;
  const next = value.trim();
  return next.length ? next : undefined;
}

function scoreOwnerListing(payload: {
  title: string;
  cadastral: string;
  district: string;
  purpose: string;
  area: number;
  price: number;
  legalOwnerType: string;
  hasUtilities: boolean;
  description: string;
}) {
  let score = 0;
  if (payload.title.trim().length > 3) score += 10;
  if (payload.cadastral.trim().length >= 6) score += 10;
  if (payload.district.trim().length > 1) score += 10;
  if (payload.purpose.trim().length > 1) score += 10;
  if (payload.area > 0) score += 10;
  if (payload.price >= 10000) score += 10;
  if (payload.legalOwnerType.trim().length > 1) score += 10;
  if (payload.hasUtilities) score += 10;
  if (payload.description.trim().length > 120) score += 20;
  return Math.min(100, score);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = session.user.role as Role;

  if (isMockMode()) {
    const rows = listMockOwnerPlots({ userId: session.user.id, role });
    return NextResponse.json({ data: rows });
  }

  try {
    const rows = await prisma.plot.findMany({
      where:
        role === "ADMIN" || role === "MODERATOR"
          ? { source: "owner" }
          : { source: "owner", ownerId: session.user.id },
      orderBy: { updatedAt: "desc" },
    });

    const normalized = rows.map(normalizePlot);
    if (normalized.length) {
      return NextResponse.json({ data: normalized });
    }

    const fallback = listMockOwnerPlots({ userId: session.user.id, role });
    return NextResponse.json({ data: fallback });
  } catch {
    const fallback = listMockOwnerPlots({ userId: session.user.id, role });
    return NextResponse.json({ data: fallback });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = session.user.role as Role;
  if (role !== "OWNER" && role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as {
    title?: string;
    cadastral?: string;
    district?: string;
    purpose?: string;
    area?: number | string;
    price?: number | string;
    roi?: number | string;
    irr?: number | string;
    distanceCenterKm?: number | string;
    legalOwnerType?: string;
    hasUtilities?: boolean;
    description?: string;
    mapAddress?: string;
    mapLat?: number | string;
    mapLng?: number | string;
  };

  const area = normalizeOptionalNumber(body.area);
  const price = normalizeOptionalNumber(body.price);
  const roi = normalizeOptionalNumber(body.roi);
  const irr = normalizeOptionalNumber(body.irr);
  const distanceCenterKm = normalizeOptionalNumber(body.distanceCenterKm);
  const mapLat = normalizeOptionalNumber(body.mapLat);
  const mapLng = normalizeOptionalNumber(body.mapLng);
  const hasMapLat = mapLat !== undefined;
  const hasMapLng = mapLng !== undefined;
  const mapPoint = latLngToMapPoint(mapLat, mapLng);

  if (hasMapLat !== hasMapLng) {
    return NextResponse.json(
      { error: "Both mapLat and mapLng are required when coordinates are provided" },
      { status: 400 }
    );
  }

  if (hasMapLat && hasMapLng && !isInsideAlatauBounds(mapLat, mapLng)) {
    return NextResponse.json(
      {
        error:
          `Coordinates must be inside Alatau bounds: lat ${ALATAU_BOUNDS.minLat}..${ALATAU_BOUNDS.maxLat}, ` +
          `lng ${ALATAU_BOUNDS.minLng}..${ALATAU_BOUNDS.maxLng}`,
      },
      { status: 400 }
    );
  }

  if (
    !body.title ||
    !body.cadastral ||
    !body.district ||
    !body.purpose ||
    area === undefined ||
    price === undefined ||
    !body.legalOwnerType ||
    !body.description
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const qualityScore = scoreOwnerListing({
    title: body.title,
    cadastral: body.cadastral,
    district: body.district,
    purpose: body.purpose,
    area,
    price,
    legalOwnerType: body.legalOwnerType,
    hasUtilities: Boolean(body.hasUtilities),
    description: body.description,
  });

  if (isMockMode()) {
    const created = createMockOwnerPlot(
      {
        title: body.title,
        cadastral: body.cadastral,
        district: body.district,
        purpose: body.purpose,
        area,
        price,
        roi,
        irr,
        distanceCenterKm,
        legalOwnerType: body.legalOwnerType,
        hasUtilities: Boolean(body.hasUtilities),
        description: body.description,
        mapAddress: normalizeOptionalText(body.mapAddress),
        mapLat,
        mapLng,
      },
      session.user.id
    );

    await createInAppNotification({
      userId: session.user.id,
      title: "Owner listing submitted",
      message: `Listing ${created.id} submitted for moderation.`,
      type: "owner_listing",
      metadata: {
        plotId: created.id,
        qualityScore,
      },
    });

    await writeAuditLog({
      action: "OWNER_PLOT_CREATED",
      entityType: "Plot",
      entityId: created.id,
      actorUserId: session.user.id,
      actorRole: role,
      details: {
        qualityScore,
        source: created.source,
      },
    });

    return NextResponse.json(
      {
        data: created,
        qualityScore,
      },
      { status: 201 }
    );
  }

  const id = `OWN-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;

  const randomX = Math.floor(Math.random() * 70 + 15);
  const randomY = Math.floor(Math.random() * 70 + 15);

  let created;
  try {
    created = await prisma.plot.create({
      data: {
        id,
        slug: id.toLowerCase(),
        title: body.title,
        district: body.district,
        purpose: body.purpose,
        area,
        price,
        currency: "USD",
        roi: roi ?? 12,
        irr: irr ?? 15,
        riskScore: qualityScore >= 80 ? 34 : 47,
        legalGrade: qualityScore >= 80 ? "b" : "c",
        status: "moderation",
        x: mapPoint?.x ?? randomX,
        y: mapPoint?.y ?? randomY,
        distanceCenterKm: distanceCenterKm ?? 9,
        utilities: body.hasUtilities ? ["Electricity", "Water"] : ["Not verified"],
        tags: ["Self-service"],
        ownerType: body.legalOwnerType,
        docs: ["Owner provided package"],
        timeline: ["Moderation pending"],
        mapAddress: normalizeOptionalText(body.mapAddress),
        mapLat,
        mapLng,
        source: PlotSource.owner,
        ownerId: session.user.id,
      },
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unexpected database error";
    return NextResponse.json({ error: "Failed to create plot", detail }, { status: 500 });
  }

  await createInAppNotification({
    userId: session.user.id,
    title: "Owner listing submitted",
    message: `Listing ${created.id} submitted for moderation.`,
    type: "owner_listing",
    metadata: {
      plotId: created.id,
      qualityScore,
    },
  });

  await writeAuditLog({
    action: "OWNER_PLOT_CREATED",
    entityType: "Plot",
    entityId: created.id,
    actorUserId: session.user.id,
    actorRole: role,
    details: {
      qualityScore,
      source: created.source,
    },
  });

  return NextResponse.json(
    {
      data: normalizePlot(created),
      qualityScore,
    },
    { status: 201 }
  );
}
