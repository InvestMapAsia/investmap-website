import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { PlotPageView } from "@/components/plot-page-view";
import { authOptions } from "@/lib/auth";
import { isMockMode } from "@/lib/data-mode";
import { normalizePlot, toPublicPlot } from "@/lib/db-mappers";
import { getMockPlotById, listMockPlots } from "@/lib/mock-store";
import { prisma } from "@/lib/prisma";
import { Plot } from "@/lib/types";

const publicPlotStatuses = ["available", "reserved", "deal"] as const;

async function loadPlotPageData(id: string): Promise<{ plot: Plot; similar: Plot[] } | null> {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const userId = session?.user?.id;
  const isPrivileged = role === "ADMIN" || role === "MODERATOR";

  if (isMockMode()) {
    const plot = getMockPlotById(id);
    if (!plot) return null;
    const canView =
      isPrivileged ||
      publicPlotStatuses.includes(plot.status as (typeof publicPlotStatuses)[number]) ||
      plot.ownerId === userId;
    if (!canView) return null;

    const similar = listMockPlots({ purpose: plot.purpose })
      .filter(
        (item) =>
          item.id !== plot.id &&
          (isPrivileged ||
            publicPlotStatuses.includes(item.status as (typeof publicPlotStatuses)[number]) ||
            item.ownerId === userId)
      )
      .slice(0, 3);

    const canViewPrivate = isPrivileged || plot.ownerId === userId;
    return {
      plot: canViewPrivate ? plot : toPublicPlot(plot),
      similar: canViewPrivate ? similar : similar.map(toPublicPlot),
    };
  }

  try {
    let row = await prisma.plot.findUnique({ where: { id } });
    if (!row) {
      row = await prisma.plot.findUnique({ where: { slug: id.toLowerCase() } });
    }

    if (row) {
      const plot = normalizePlot(row);
      const canView =
        isPrivileged ||
        publicPlotStatuses.includes(plot.status as (typeof publicPlotStatuses)[number]) ||
        plot.ownerId === userId;
      if (!canView) return null;

      const similarRows = await prisma.plot.findMany({
        where: {
          purpose: row.purpose,
          id: { not: row.id },
          ...(isPrivileged
            ? {}
            : {
                status: { in: [...publicPlotStatuses] },
              }),
        },
        orderBy: { roi: "desc" },
        take: 3,
      });

      const canViewPrivate = isPrivileged || plot.ownerId === userId;
      return {
        plot: canViewPrivate ? plot : toPublicPlot(plot),
        similar: similarRows.map((item) =>
          canViewPrivate ? normalizePlot(item) : toPublicPlot(normalizePlot(item))
        ),
      };
    }
  } catch {
    if (process.env.NODE_ENV === "production") {
      return null;
    }
  }

  const fallback = getMockPlotById(id);
  if (!fallback) return null;
  const canView =
    isPrivileged ||
    publicPlotStatuses.includes(fallback.status as (typeof publicPlotStatuses)[number]) ||
    fallback.ownerId === userId;
  if (!canView) return null;

  const similar = listMockPlots({ purpose: fallback.purpose })
    .filter(
      (item) =>
        item.id !== fallback.id &&
        (isPrivileged ||
          publicPlotStatuses.includes(item.status as (typeof publicPlotStatuses)[number]) ||
          item.ownerId === userId)
    )
    .slice(0, 3);

  const canViewPrivate = isPrivileged || fallback.ownerId === userId;
  return {
    plot: canViewPrivate ? fallback : toPublicPlot(fallback),
    similar: canViewPrivate ? similar : similar.map(toPublicPlot),
  };
}

export default async function PlotPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await loadPlotPageData(id);

  if (!data) {
    notFound();
  }

  return <PlotPageView plot={data.plot} similar={data.similar} />;
}
