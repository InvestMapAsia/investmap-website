import { PlotSource, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { writeAuditLog } from "@/lib/audit";
import { authOptions } from "@/lib/auth";
import { isMockMode } from "@/lib/data-mode";
import { normalizePlot } from "@/lib/db-mappers";
import { createMockOwnerPlot, listMockOwnerPlots } from "@/lib/mock-store";
import { createInAppNotification } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

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

  const rows = await prisma.plot.findMany({
    where:
      role === "ADMIN" || role === "MODERATOR"
        ? { source: "owner" }
        : { source: "owner", ownerId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ data: rows.map(normalizePlot) });
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
    area?: number;
    price?: number;
    roi?: number;
    irr?: number;
    distanceCenterKm?: number;
    legalOwnerType?: string;
    hasUtilities?: boolean;
    description?: string;
  };

  if (
    !body.title ||
    !body.cadastral ||
    !body.district ||
    !body.purpose ||
    !body.area ||
    !body.price ||
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
    area: Number(body.area),
    price: Number(body.price),
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
        area: Number(body.area),
        price: Number(body.price),
        roi: body.roi,
        irr: body.irr,
        distanceCenterKm: body.distanceCenterKm,
        legalOwnerType: body.legalOwnerType,
        hasUtilities: Boolean(body.hasUtilities),
        description: body.description,
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

  const id = `OWN-${Math.floor(Math.random() * 9000 + 1000)}`;

  const created = await prisma.plot.create({
    data: {
      id,
      slug: id.toLowerCase(),
      title: body.title,
      district: body.district,
      purpose: body.purpose,
      area: Number(body.area),
      price: Number(body.price),
      currency: "USD",
      roi: body.roi ?? 12,
      irr: body.irr ?? 15,
      riskScore: qualityScore >= 80 ? 34 : 47,
      legalGrade: qualityScore >= 80 ? "b" : "c",
      status: "moderation",
      x: Math.floor(Math.random() * 70 + 15),
      y: Math.floor(Math.random() * 70 + 15),
      distanceCenterKm: body.distanceCenterKm ?? 9,
      utilities: body.hasUtilities ? ["Electricity", "Water"] : ["Not verified"],
      tags: ["Self-service"],
      ownerType: body.legalOwnerType,
      docs: ["Owner provided package"],
      timeline: ["Moderation pending"],
      source: PlotSource.owner,
      ownerId: session.user.id,
    },
  });

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
