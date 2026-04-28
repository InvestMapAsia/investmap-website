const CONTROL_CHARS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;
const SCRIPT_BLOCK = /<\s*script\b[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi;
const STYLE_BLOCK = /<\s*style\b[^>]*>[\s\S]*?<\s*\/\s*style\s*>/gi;
const HTML_TAG = /<\/?[^>]+>/g;
const EVENT_HANDLER = /\bon[a-z]+\s*=/gi;
const JS_PROTOCOL = /javascript\s*:/gi;

const MEDIA_MARKERS = ["#panorama360", "#cover16x9"] as const;

export function sanitizeText(value: unknown, maxLength = 2_000) {
  if (typeof value !== "string") return "";

  return value
    .replace(CONTROL_CHARS, " ")
    .replace(SCRIPT_BLOCK, " ")
    .replace(STYLE_BLOCK, " ")
    .replace(HTML_TAG, " ")
    .replace(EVENT_HANDLER, " ")
    .replace(JS_PROTOCOL, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function sanitizeOptionalText(value: unknown, maxLength = 2_000) {
  const next = sanitizeText(value, maxLength);
  return next.length ? next : undefined;
}

export function sanitizeHttpUrl(value: unknown, maxLength = 2_048) {
  if (typeof value !== "string") return undefined;
  const raw = value.replace(CONTROL_CHARS, "").trim().slice(0, maxLength);

  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return undefined;
    }
    return url.toString();
  } catch {
    return undefined;
  }
}

export function stripMediaMarkers(value: string) {
  return MEDIA_MARKERS.reduce((next, marker) => next.replaceAll(marker, ""), value);
}

export function sanitizeMediaUrl(value: unknown) {
  if (typeof value !== "string") return undefined;
  const raw = value.replace(CONTROL_CHARS, "").trim();
  const markers = MEDIA_MARKERS.filter((marker) => raw.includes(marker));
  const safeBase = sanitizeHttpUrl(stripMediaMarkers(raw));

  if (!safeBase) return undefined;
  return `${safeBase}${markers.join("")}`;
}

export function sanitizeStringArray(
  value: unknown,
  sanitizer: (item: unknown) => string | undefined = (item) => sanitizeOptionalText(item)
) {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  const items = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(/\r?\n|,/g)
      : [];

  const result = items
    .map((item) => sanitizer(item))
    .filter((item): item is string => Boolean(item));

  return result.length ? result : undefined;
}
