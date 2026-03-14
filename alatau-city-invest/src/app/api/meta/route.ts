import { NextResponse } from "next/server";
import { isMockMode } from "@/lib/data-mode";
import { listFaqs, listNews, listPricingPlans } from "@/lib/mock-db";
import { listMockPlots } from "@/lib/mock-store";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (isMockMode()) {
    const purposes = Array.from(new Set(listMockPlots().map((item) => item.purpose))).sort((a, b) =>
      a.localeCompare(b)
    );
    const queueCount = listMockPlots().filter(
      (item) => item.status === "moderation" || item.status === "legal_issue"
    ).length;

    return NextResponse.json({
      data: {
        purposes,
        news: listNews(),
        faqs: listFaqs(),
        pricingPlans: listPricingPlans(),
        adminQueueCount: queueCount,
      },
    });
  }

  const [purposeRows, queueCount] = await Promise.all([
    prisma.plot.findMany({ select: { purpose: true }, distinct: ["purpose"] }),
    prisma.plot.count({ where: { OR: [{ status: "moderation" }, { status: "legal_issue" }] } }),
  ]);

  return NextResponse.json({
    data: {
      purposes: purposeRows.map((row) => row.purpose),
      news: listNews(),
      faqs: listFaqs(),
      pricingPlans: listPricingPlans(),
      adminQueueCount: queueCount,
    },
  });
}
