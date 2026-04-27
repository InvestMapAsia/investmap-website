import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { writeAuditLog } from "@/lib/audit";
import { authOptions } from "@/lib/auth";
import { isMockMode } from "@/lib/data-mode";
import { normalizePlot } from "@/lib/db-mappers";
import { ALATAU_BOUNDS, isInsideAlatauBounds, latLngToMapPoint } from "@/lib/map-geo";
import { getMockPlotById, updateMockOwnerPlot } from "@/lib/mock-store";
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

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = session.user.role as Role;
  if (role !== "OWNER" && role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
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
    return NextResponse.json({ error: "Both mapLat and mapLng are required" }, { status: 400 });
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
    cadastral: body.cadastral ?? id,
    district: body.district,
    purpose: body.purpose,
    area,
    price,
    legalOwnerType: body.legalOwnerType,
    hasUtilities: Boolean(body.hasUtilities),
    description: body.description,
  });

  if (isMockMode()) {
    const current = getMockPlotById(id);
    if (!current || current.source !== "owner") {
      return NextResponse.json({ error: "Plot not found" }, { status: 404 });
    }

    if (role !== "ADMIN" && current.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = updateMockOwnerPlot({
      id,
      ownerId: role === "ADMIN" ? undefined : session.user.id,
      data: {
        title: body.title,
        cadastral: body.cadastral ?? id,
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
        mediaUrls: current.mediaUrls,
        mapAddress: normalizeOptionalText(body.mapAddress),
        mapLat,
        mapLng,
      },
    });

    if (!updated) {
      return NextResponse.json({ error: "Plot not found" }, { status: 404 });
    }

    await createInAppNotification({
      userId: updated.ownerId ?? session.user.id,
      title: "Plot edits submitted",
      message: `Edits for ${updated.id} were sent to moderation.`,
      type: "plot_edit",
      metadata: { plotId: updated.id, qualityScore },
    });

    await writeAuditLog({
      action: "OWNER_PLOT_EDIT_SUBMITTED",
      entityType: "Plot",
      entityId: updated.id,
      actorUserId: session.user.id,
      actorRole: role,
      details: { qualityScore, status: updated.status },
    });

    return NextResponse.json({ data: updated, qualityScore });
  }

  const current = await prisma.plot.findUnique({ where: { id } });
  if (!current || current.source !== "owner") {
    return NextResponse.json({ error: "Plot not found" }, { status: 404 });
  }

  if (role !== "ADMIN" && current.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.plot.update({
    where: { id },
    data: {
      title: body.title,
      district: body.district,
      purpose: body.purpose,
      area,
      price,
      roi: roi ?? current.roi,
      irr: irr ?? current.irr,
      riskScore: qualityScore >= 80 ? 34 : 47,
      legalGrade: qualityScore >= 80 ? "b" : "c",
      status: "moderation",
      x: mapPoint?.x ?? current.x,
      y: mapPoint?.y ?? current.y,
      distanceCenterKm: distanceCenterKm ?? current.distanceCenterKm,
      utilities: body.hasUtilities ? ["Electricity", "Water"] : ["Not verified"],
      ownerType: body.legalOwnerType,
      timeline: ["Owner edits submitted for moderation"],
      mapAddress: normalizeOptionalText(body.mapAddress),
      mapLat,
      mapLng,
    },
  });

  await createInAppNotification({
    userId: updated.ownerId ?? session.user.id,
    title: "Plot edits submitted",
    message: `Edits for ${updated.id} were sent to moderation.`,
    type: "plot_edit",
    metadata: { plotId: updated.id, qualityScore },
  });

  await writeAuditLog({
    action: "OWNER_PLOT_EDIT_SUBMITTED",
    entityType: "Plot",
    entityId: updated.id,
    actorUserId: session.user.id,
    actorRole: role,
    details: { qualityScore, status: updated.status },
  });

  return NextResponse.json({ data: normalizePlot(updated), qualityScore });
}
