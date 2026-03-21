export const ALATAU_BOUNDS = {
  minLat: 43.14,
  maxLat: 43.36,
  minLng: 76.8,
  maxLng: 77.2,
} as const;

const MAP_PADDING_PERCENT = 10;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function toNumber(value: unknown) {
  const next = Number(value);
  return Number.isFinite(next) ? next : null;
}

export function isInsideAlatauBounds(lat: number, lng: number) {
  return (
    lat >= ALATAU_BOUNDS.minLat &&
    lat <= ALATAU_BOUNDS.maxLat &&
    lng >= ALATAU_BOUNDS.minLng &&
    lng <= ALATAU_BOUNDS.maxLng
  );
}

export function latLngToMapPoint(latInput?: unknown, lngInput?: unknown) {
  const lat = toNumber(latInput);
  const lng = toNumber(lngInput);

  if (lat === null || lng === null) {
    return null;
  }

  const lngRatio =
    (clamp(lng, ALATAU_BOUNDS.minLng, ALATAU_BOUNDS.maxLng) - ALATAU_BOUNDS.minLng) /
    (ALATAU_BOUNDS.maxLng - ALATAU_BOUNDS.minLng);
  const latRatio =
    (ALATAU_BOUNDS.maxLat - clamp(lat, ALATAU_BOUNDS.minLat, ALATAU_BOUNDS.maxLat)) /
    (ALATAU_BOUNDS.maxLat - ALATAU_BOUNDS.minLat);

  const span = 100 - MAP_PADDING_PERCENT * 2;
  const x = Number((MAP_PADDING_PERCENT + lngRatio * span).toFixed(2));
  const y = Number((MAP_PADDING_PERCENT + latRatio * span).toFixed(2));

  return { x, y };
}

