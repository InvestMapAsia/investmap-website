import { InvestorType, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { writeAuditLog } from "@/lib/audit";
import { authOptions } from "@/lib/auth";
import { isMockMode } from "@/lib/data-mode";
import { normalizeApplication } from "@/lib/db-mappers";
import {
  createMockApplication,
  getMockPlotById,
  listMockApplications,
} from "@/lib/mock-store";
import { createApplicationStatusNotifications } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = session.user.role as Role;

  if (isMockMode()) {
    return NextResponse.json({
      data: listMockApplications({
        userId: session.user.id,
        role,
      }),
    });
  }

  const rows = await prisma.application.findMany({
    where:
      role === "ADMIN" || role === "MODERATOR"
        ? undefined
        : {
            userId: session.user.id,
          },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: rows.map(normalizeApplication) });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized. Please sign in first." }, { status: 401 });
  }

  const body = (await request.json()) as {
    plotId?: string;
    investorName?: string;
    investorType?: InvestorType;
    amount?: number;
    phone?: string;
    email?: string;
    sourceOfFunds?: string;
  };

  if (
    !body.plotId ||
    !body.investorName ||
    !body.investorType ||
    !body.amount ||
    !body.phone ||
    !body.email ||
    !body.sourceOfFunds
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (isMockMode()) {
    const plot = getMockPlotById(body.plotId);
    if (!plot) {
      return NextResponse.json({ error: "Plot not found" }, { status: 404 });
    }

    const created = createMockApplication({
      plotId: body.plotId,
      investorName: body.investorName,
      investorType: body.investorType,
      amount: Number(body.amount),
      phone: body.phone,
      email: body.email,
      sourceOfFunds: body.sourceOfFunds,
      userId: session.user.id,
    });

    await createApplicationStatusNotifications({
      userId: session.user.id,
      investorName: created.investorName,
      applicationId: created.id,
      plotId: created.plotId,
      status: created.status,
      reviewNote: created.reviewNote,
    });

    await writeAuditLog({
      action: "APPLICATION_CREATED",
      entityType: "Application",
      entityId: created.id,
      actorUserId: session.user.id,
      actorRole: session.user.role as Role,
      details: {
        plotId: created.plotId,
        amount: created.amount,
        investorType: created.investorType,
      },
    });

    return NextResponse.json({ data: created }, { status: 201 });
  }

  const plot = await prisma.plot.findUnique({ where: { id: body.plotId } });
  if (!plot) {
    return NextResponse.json({ error: "Plot not found" }, { status: 404 });
  }

  const created = await prisma.application.create({
    data: {
      plotId: body.plotId,
      investorName: body.investorName,
      investorType: body.investorType,
      amount: Number(body.amount),
      phone: body.phone,
      email: body.email,
      sourceOfFunds: body.sourceOfFunds,
      userId: session.user.id,
    },
  });

  await createApplicationStatusNotifications({
    userId: session.user.id,
    investorName: created.investorName,
    applicationId: created.id,
    plotId: created.plotId,
    status: created.status,
    reviewNote: created.reviewNote,
  });

  await writeAuditLog({
    action: "APPLICATION_CREATED",
    entityType: "Application",
    entityId: created.id,
    actorUserId: session.user.id,
    actorRole: session.user.role as Role,
    details: {
      plotId: created.plotId,
      amount: created.amount,
      investorType: created.investorType,
    },
  });

  return NextResponse.json({ data: normalizeApplication(created) }, { status: 201 });
}
