"use client";

import { PricingSelector } from "@/components/pricing-selector";
import { useMemo } from "react";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";
import { pricingPageText, pricingPlanOverridesByLang } from "@/lib/i18n-content";
import { listPricingPlans } from "@/lib/mock-db";

export default function PricingPage() {
  const { lang } = useCurrentLanguage();
  const basePlans = listPricingPlans();
  const t = pickLang(lang, pricingPageText);
  const localizedPlansById = pricingPlanOverridesByLang[lang];

  const plans = useMemo(
    () =>
      basePlans.map((plan) => ({
        ...plan,
        ...(localizedPlansById[plan.id] ?? {}),
      })),
    [basePlans, localizedPlansById]
  );

  return (
    <div className="container">
      <div className="section-title">
        <h2>{t.title}</h2>
        <p>{t.sub}</p>
      </div>
      <PricingSelector plans={plans} />
    </div>
  );
}
