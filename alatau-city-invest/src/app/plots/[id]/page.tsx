import { notFound } from "next/navigation";
import { PlotPageView } from "@/components/plot-page-view";
import { getPlotById, listPlots } from "@/lib/mock-db";

export default async function PlotPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plot = getPlotById(id);

  if (!plot) {
    notFound();
  }

  const similar = listPlots()
    .filter((item) => item.id !== plot.id && item.purpose === plot.purpose)
    .slice(0, 3);

  return <PlotPageView plot={plot} similar={similar} />;
}
