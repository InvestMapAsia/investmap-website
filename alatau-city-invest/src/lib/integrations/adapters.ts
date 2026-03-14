import crypto from "node:crypto";
import { getIntegrationConfig } from "@/lib/integrations/config";

export async function createPaymentCheckout(payload: {
  amountUsd: number;
  applicationId: string;
  email: string;
}) {
  const config = getIntegrationConfig();

  if (config.PAYMENT_PROVIDER === "none") {
    return {
      provider: "none",
      checkoutUrl: `/cabinet/investor?payment=mock&application=${payload.applicationId}`,
      status: "mocked",
    };
  }

  if (config.PAYMENT_PROVIDER === "stripe") {
    if (!config.STRIPE_SECRET_KEY) {
      throw new Error("Stripe provider selected but STRIPE_SECRET_KEY is missing.");
    }

    return {
      provider: "stripe",
      checkoutUrl: `/cabinet/investor?payment=stripe-pending&application=${payload.applicationId}`,
      status: "configured",
    };
  }

  return {
    provider: "kaspi",
    checkoutUrl: `/cabinet/investor?payment=kaspi-pending&application=${payload.applicationId}`,
    status: "configured",
  };
}

export async function createKycSession(payload: { userId: string; fullName: string }) {
  const config = getIntegrationConfig();

  if (config.KYC_PROVIDER === "none") {
    return {
      provider: "none",
      sessionId: `kyc-mock-${crypto.randomUUID()}`,
      status: "mocked",
      subject: payload.fullName,
      redirectUrl: "/cabinet/investor?kyc=mocked",
    };
  }

  if (!config.SUMSUB_APP_TOKEN || !config.SUMSUB_SECRET) {
    throw new Error("Sumsub provider selected but SUMSUB_APP_TOKEN/SUMSUB_SECRET missing.");
  }

  return {
    provider: "sumsub",
    sessionId: `sumsub-${crypto.randomUUID()}`,
    status: "configured",
    subject: payload.fullName,
    redirectUrl: "/cabinet/investor?kyc=started",
  };
}

export async function geocodeAddress(query: string) {
  const config = getIntegrationConfig();

  if (config.MAPS_PROVIDER === "none") {
    return {
      provider: "none",
      query,
      results: [
        {
          place: "Alatau City (mock)",
          lat: 43.238949,
          lng: 76.889709,
        },
      ],
      status: "mocked",
    };
  }

  if (config.MAPS_PROVIDER === "mapbox") {
    if (!config.MAPBOX_ACCESS_TOKEN) {
      throw new Error("Mapbox provider selected but MAPBOX_ACCESS_TOKEN is missing.");
    }

    return {
      provider: "mapbox",
      query,
      results: [],
      status: "configured",
    };
  }

  return {
    provider: "google",
    query,
    results: [],
    status: "configured",
  };
}
