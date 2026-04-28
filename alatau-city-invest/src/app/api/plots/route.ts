import { Prisma, PlotStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isMockMode } from "@/lib/data-mode";
import { normalizePlot, toPublicPlot } from "@/lib/db-mappers";
import { listMockPlots } from "@/lib/mock-store";
import { prisma } from "@/lib/prisma";

const pricePresets = [
  { key: "all", label: "Any" },
  { key: "lt300", label: "Under 300k USD" },
  { key: "300to600", label: "300k - 600k USD" },
  { key: "gt600", label: "Over 600k USD" },
];

const plotStatuses = new Set<PlotStatus>([
  "available",
  "reserved",
  "deal",
  "moderation",
  "sold",
  "legal_issue",
]);
const publicPlotStatuses: PlotStatus[] = ["available", "reserved", "deal"];
const riskFilters = new Set(["all", "low", "medium", "high"]);
const priceFilters = new Set(pricePresets.map((item) => item.key));
const sortOptions = new Set(["roi_desc", "price_asc", "price_desc", "risk_asc"]);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const purpose = (searchParams.get("purpose") ?? "all").slice(0, 120);
  const requestedStatus = searchParams.get("status") ?? "all";
  const risk = (searchParams.get("risk") as "all" | "low" | "medium" | "high" | null) ?? "all";
  const price =
    (searchParams.get("price") as "all" | "lt300" | "300to600" | "gt600" | null) ?? "all";
  const sort =
    (searchParams.get("sort") as "roi_desc" | "price_asc" | "price_desc" | "risk_asc" | null) ??
    "roi_desc";

  if (requestedStatus !== "all" && !plotStatuses.has(requestedStatus as PlotStatus)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  if (!riskFilters.has(risk) || !priceFilters.has(price) || !sortOptions.has(sort)) {
    return NextResponse.json({ error: "Invalid filter" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const publicOnly = role !== "ADMIN" && role !== "MODERATOR";
  const status = requestedStatus as PlotStatus | "all";

  const mockRows = () =>
    listMockPlots({
      purpose,
      status: publicOnly && status !== "all" && !publicPlotStatuses.includes(status)
        ? "all"
        : status,
      risk,
      price,
      sort,
    }).filter((plot) => !publicOnly || publicPlotStatuses.includes(plot.status));

  const mockResponse = () => {
    const rows = mockRows().map((plot) => (publicOnly ? toPublicPlot(plot) : plot));
    const purposes = Array.from(
      new Set(
        listMockPlots()
          .filter((item) => !publicOnly || publicPlotStatuses.includes(item.status))
          .map((item) => item.purpose)
      )
    ).sort((a, b) => a.localeCompare(b));

    return NextResponse.json({
      data: rows,
      meta: {
        purposes,
        pricePresets,
      },
    });
  };

  if (isMockMode()) {
    return mockResponse();
  }

  const where: Prisma.PlotWhereInput = {};

  if (purpose !== "all") {
    where.purpose = purpose;
  }

  if (publicOnly) {
    if (status !== "all" && !publicPlotStatuses.includes(status)) {
      return NextResponse.json({
        data: [],
        meta: {
          purposes: [],
          pricePresets,
        },
      });
    }

    where.status = status === "all" ? { in: publicPlotStatuses } : status;
  } else if (status !== "all") {
    where.status = status;
  }

  if (risk === "low") {
    where.riskScore = { lte: 30 };
  }
  if (risk === "medium") {
    where.riskScore = { gt: 30, lte: 45 };
  }
  if (risk === "high") {
    where.riskScore = { gt: 45 };
  }

  if (price === "lt300") {
    where.price = { lt: 300000 };
  }
  if (price === "300to600") {
    where.price = { gte: 300000, lte: 600000 };
  }
  if (price === "gt600") {
    where.price = { gt: 600000 };
  }

  const orderBy: Prisma.PlotOrderByWithRelationInput =
    sort === "price_asc"
      ? { price: "asc" }
      : sort === "price_desc"
        ? { price: "desc" }
        : sort === "risk_asc"
          ? { riskScore: "asc" }
          : { roi: "desc" };

  try {
    const [rows, purposeRows] = await Promise.all([
      prisma.plot.findMany({ where, orderBy }),
      prisma.plot.findMany({
        where: publicOnly ? { status: { in: publicPlotStatuses } } : undefined,
        select: { purpose: true },
        distinct: ["purpose"],
        orderBy: { purpose: "asc" },
      }),
    ]);

    const normalized = rows.map((row) =>
      publicOnly ? toPublicPlot(normalizePlot(row)) : normalizePlot(row)
    );
    if (!normalized.length) {
      return process.env.NODE_ENV === "production"
        ? NextResponse.json({
            data: [],
            meta: {
              purposes: purposeRows.map((item) => item.purpose),
              pricePresets,
            },
          })
        : mockResponse();
    }

    return NextResponse.json({
      data: normalized,
      meta: {
        purposes: purposeRows.map((item) => item.purpose),
        pricePresets,
      },
    });
  } catch {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Could not load plots" }, { status: 500 });
    }

    return mockResponse();
  }
}
