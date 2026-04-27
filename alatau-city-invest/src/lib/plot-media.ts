import { Plot } from "@/lib/types";

export const PLOT_PANORAMA_MARKER = "#panorama360";
export const PLOT_COVER_MARKER = "#cover16x9";

const fallbackCoverByPurpose: Record<string, string> = {
  commercial:
    "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
  "mixed-use":
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
  residential:
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
  logistics:
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
  industrial:
    "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1200&q=80",
  hospitality:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  retail:
    "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=1200&q=80",
  education:
    "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
};

const defaultPlotCover =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80";

export function cleanPlotMediaUrl(url: string) {
  return url.replace(PLOT_PANORAMA_MARKER, "").replace(PLOT_COVER_MARKER, "");
}

export function isPlotPanoramaUrl(url: string) {
  return url.includes(PLOT_PANORAMA_MARKER);
}

export function isPlotCoverUrl(url: string) {
  return url.includes(PLOT_COVER_MARKER);
}

export function isPlotVideoUrl(url: string) {
  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(cleanPlotMediaUrl(url));
}

export function getPlotCoverUrl(plot: Plot) {
  const mediaUrls = plot.mediaUrls ?? [];
  const markedCover = mediaUrls.find(isPlotCoverUrl);
  if (markedCover) {
    return cleanPlotMediaUrl(markedCover);
  }

  const firstImage = mediaUrls.find(
    (url) => !isPlotPanoramaUrl(url) && !isPlotVideoUrl(url)
  );
  if (firstImage) {
    return cleanPlotMediaUrl(firstImage);
  }

  const purpose = plot.purpose.toLowerCase();
  return fallbackCoverByPurpose[purpose] ?? defaultPlotCover;
}
