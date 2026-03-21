import { Prisma, PlotStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { isMockMode } from "@/lib/data-mode";
import { normalizePlot } from "@/lib/db-mappers";
import { listMockPlots } from "@/lib/mock-store";
import { prisma } from "@/lib/prisma";

const pricePresets = [
  { key: "all", label: "Any" },
  { key: "lt300", label: "Under 300k USD" },
  { key: "300to600", label: "300k - 600k USD" },
  { key: "gt600", label: "Over 600k USD" },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const purpose = searchParams.get("purpose") ?? "all";
  const status = (searchParams.get("status") as PlotStatus | "all" | null) ?? "all";
  const risk = (searchParams.get("risk") as "all" | "low" | "medium" | "high" | null) ?? "all";
  const price =
    (searchParams.get("price") as "all" | "lt300" | "300to600" | "gt600" | null) ?? "all";
  const sort =
    (searchParams.get("sort") as "roi_desc" | "price_asc" | "price_desc" | "risk_asc" | null) ??
    "roi_desc";

  const mockRows = () =>
    listMockPlots({
      purpose,
      status,
      risk,
      price,
      sort,
    });

  const mockResponse = () => {
    const rows = mockRows();
    const purposes = Array.from(new Set(listMockPlots().map((item) => item.purpose))).sort((a, b) =>
      a.localeCompare(b)
    );

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

  if (status !== "all") {
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
        select: { purpose: true },
        distinct: ["purpose"],
        orderBy: { purpose: "asc" },
      }),
    ]);

    const normalized = rows.map(normalizePlot);
    if (!normalized.length) {
      return mockResponse();
    }

    return NextResponse.json({
      data: normalized,
      meta: {
        purposes: purposeRows.map((item) => item.purpose),
        pricePresets,
      },
    });
  } catch {
    return mockResponse();
  }
}
