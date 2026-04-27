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

  if (isMockMode()) {
    const purposes = mockPurposes();

    return NextResponse.json({
      data: {
        purposes,
        news: listNews(),
        faqs: listFaqs(),
        pricingPlans: listPricingPlans(),
      },
    });
  }

  try {
    const purposeRows = await prisma.plot.findMany({ select: { purpose: true }, distinct: ["purpose"] });

    const purposes = purposeRows.map((row) => row.purpose);
    return NextResponse.json({
      data: {
        purposes: purposes.length ? purposes : mockPurposes(),
        news: listNews(),
        faqs: listFaqs(),
        pricingPlans: listPricingPlans(),
      },
    });
  } catch {
    return NextResponse.json({
      data: {
        purposes: mockPurposes(),
        news: listNews(),
        faqs: listFaqs(),
        pricingPlans: listPricingPlans(),
      },
    });
  }
}
