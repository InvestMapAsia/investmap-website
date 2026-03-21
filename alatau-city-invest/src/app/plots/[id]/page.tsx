import { notFound } from "next/navigation";
import { PlotPageView } from "@/components/plot-page-view";
import { isMockMode } from "@/lib/data-mode";
import { normalizePlot } from "@/lib/db-mappers";
import { getMockPlotById, listMockPlots } from "@/lib/mock-store";
import { prisma } from "@/lib/prisma";
import { Plot } from "@/lib/types";

async function loadPlotPageData(id: string): Promise<{ plot: Plot; similar: Plot[] } | null> {
  if (isMockMode()) {
    const plot = getMockPlotById(id);
    if (!plot) return null;

    const similar = listMockPlots({ purpose: plot.purpose })
      .filter((item) => item.id !== plot.id)
      .slice(0, 3);

    return { plot, similar };
  }

  try {
    let row = await prisma.plot.findUnique({ where: { id } });
    if (!row) {
      row = await prisma.plot.findUnique({ where: { slug: id.toLowerCase() } });
    }

    if (row) {
      const plot = normalizePlot(row);
      const similarRows = await prisma.plot.findMany({
        where: {
          purpose: row.purpose,
          id: { not: row.id },
        },
        orderBy: { roi: "desc" },
        take: 3,
      });

      return {
        plot,
        similar: similarRows.map(normalizePlot),
      };
    }
  } catch {
    // Fallback to mock data below.
  }

  const fallback = getMockPlotById(id);
  if (!fallback) return null;

  const similar = listMockPlots({ purpose: fallback.purpose })
    .filter((item) => item.id !== fallback.id)
    .slice(0, 3);

  return { plot: fallback, similar };
}

export default async function PlotPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await loadPlotPageData(id);

  if (!data) {
    notFound();
  }

  return <PlotPageView plot={data.plot} similar={data.similar} />;
}
