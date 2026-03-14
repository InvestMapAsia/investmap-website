import { z } from "zod";

const schema = z.object({
  MAPS_PROVIDER: z.enum(["none", "mapbox", "google"]).default("none"),
  MAPBOX_ACCESS_TOKEN: z.string().optional(),
  PAYMENT_PROVIDER: z.enum(["none", "stripe", "kaspi"]).default("none"),
  STRIPE_SECRET_KEY: z.string().optional(),
  KYC_PROVIDER: z.enum(["none", "sumsub"]).default("none"),
  SUMSUB_APP_TOKEN: z.string().optional(),
  SUMSUB_SECRET: z.string().optional(),
});

export type IntegrationConfig = z.infer<typeof schema>;

export function getIntegrationConfig(): IntegrationConfig {
  return schema.parse({
    MAPS_PROVIDER: process.env.MAPS_PROVIDER ?? "none",
    MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN,
    PAYMENT_PROVIDER: process.env.PAYMENT_PROVIDER ?? "none",
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    KYC_PROVIDER: process.env.KYC_PROVIDER ?? "none",
    SUMSUB_APP_TOKEN: process.env.SUMSUB_APP_TOKEN,
    SUMSUB_SECRET: process.env.SUMSUB_SECRET,
  });
}
