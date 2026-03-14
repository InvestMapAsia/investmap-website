export type DataMode = "db" | "mock";

export function getDataMode(): DataMode {
  const raw = (process.env.DATA_MODE ?? process.env.APP_DATA_MODE ?? "db").toLowerCase();
  return raw === "mock" ? "mock" : "db";
}

export function isMockMode() {
  return getDataMode() === "mock";
}
