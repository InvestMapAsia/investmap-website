import { InvestorType, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { writeAuditLog } from "@/lib/audit";
import { checkRateLimit, enforceSameOrigin, getClientIp } from "@/lib/api-security";
import { authOptions } from "@/lib/auth";
import { isMockMode } from "@/lib/data-mode";
import { normalizeApplication } from "@/lib/db-mappers";
import { sanitizeText } from "@/lib/input-security";
import {
  createMockApplication,
  getMockPlotById,
  listMockApplications,
} from "@/lib/mock-store";
import { createApplicationStatusNotifications } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

const publicInvestmentStatuses = ["available", "reserved", "deal"];
const applicationSchema = z.object({
  plotId: z.string().min(1).max(120).transform((value) => sanitizeText(value, 120)),
  investorName: z.string().min(2).max(120).transform((value) => sanitizeText(value, 120)),
  investorType: z.enum(["individual", "company", "fund"]),
  amount: z.coerce.number().int().min(10_000).max(100_000_000),
  phone: z.string().min(6).max(40).transform((value) => sanitizeText(value, 40)),
  email: z.string().email().max(120).transform((value) => sanitizeText(value, 120).toLowerCase()),
  sourceOfFunds: z.string().min(2).max(1_000).transform((value) => sanitizeText(value, 1_000)),
});

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
  const blocked =
    enforceSameOrigin(request) ?? checkRateLimit(`applications:create:${getClientIp(request)}`, 20);
  if (blocked) return blocked;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized. Please sign in first." }, { status: 401 });
  }

  const parsed = applicationSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const body = parsed.data;

  if (isMockMode()) {
    const plot = getMockPlotById(body.plotId);
    if (!plot || !publicInvestmentStatuses.includes(plot.status)) {
      return NextResponse.json({ error: "Plot not found" }, { status: 404 });
    }

    const created = createMockApplication({
      plotId: body.plotId,
      investorName: body.investorName,
      investorType: body.investorType as InvestorType,
      amount: body.amount,
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
  if (!plot || !publicInvestmentStatuses.includes(plot.status)) {
    return NextResponse.json({ error: "Plot not found" }, { status: 404 });
  }

  const created = await prisma.application.create({
    data: {
      plotId: body.plotId,
      investorName: body.investorName,
      investorType: body.investorType,
      amount: body.amount,
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
