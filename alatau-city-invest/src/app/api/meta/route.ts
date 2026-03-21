import { NextResponse } from "next/server";
import { isMockMode } from "@/lib/data-mode";
import { listFaqs, listNews, listPricingPlans } from "@/lib/mock-db";
import { listMockPlots } from "@/lib/mock-store";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const mockPurposes = () =>
    Array.from(new Set(listMockPlots().map((item) => item.purpose))).sort((a, b) =>
      a.localeCompare(b)
    );
  const mockQueueCount = () =>
    listMockPlots().filter((item) => item.status === "moderation" || item.status === "legal_issue")
      .length;

  if (isMockMode()) {
    const purposes = mockPurposes();
    const queueCount = mockQueueCount();

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

  try {
    const [purposeRows, queueCount] = await Promise.all([
      prisma.plot.findMany({ select: { purpose: true }, distinct: ["purpose"] }),
      prisma.plot.count({ where: { OR: [{ status: "moderation" }, { status: "legal_issue" }] } }),
    ]);

    const purposes = purposeRows.map((row) => row.purpose);
    return NextResponse.json({
      data: {
        purposes: purposes.length ? purposes : mockPurposes(),
        news: listNews(),
        faqs: listFaqs(),
        pricingPlans: listPricingPlans(),
        adminQueueCount: purposes.length ? queueCount : mockQueueCount(),
      },
    });
  } catch {
    return NextResponse.json({
      data: {
        purposes: mockPurposes(),
        news: listNews(),
        faqs: listFaqs(),
        pricingPlans: listPricingPlans(),
        adminQueueCount: mockQueueCount(),
      },
    });
  }
}
