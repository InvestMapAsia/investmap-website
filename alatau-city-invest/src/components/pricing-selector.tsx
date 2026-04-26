"use client";

import { useState } from "react";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";
import { pricingSelectorText } from "@/lib/i18n-content";
import { PricingPlan } from "@/lib/types";

export function PricingSelector({ plans }: { plans: PricingPlan[] }) {
  const { lang } = useCurrentLanguage();
  const [selectedId, setSelectedId] = useState<string>(plans[0]?.id ?? "");
  const [result, setResult] = useState<string | null>(null);

  const t = pickLang(lang, pricingSelectorText);

  const selectedPlan = plans.find((plan) => plan.id === selectedId);

  const activate = () => {
    if (!selectedPlan) return;

    const today = new Date();
    const until =
      selectedPlan.durationDays > 0
        ? new Date(today.getTime() + selectedPlan.durationDays * 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 10)
        : null;

    localStorage.setItem(
      "aci_owner_plan",
      JSON.stringify({
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        priceUsd: selectedPlan.priceUsd,
        activeUntil: until,
        pricingMode: selectedPlan.durationDays > 0 ? "duration" : "placement",
      })
    );

    setResult(
      until
        ? `${t.planWord} ${selectedPlan.name} ${t.activated} ${until}.`
        : `${t.planWord} ${selectedPlan.name} ${t.activated}.`
    );
  };

  return (
    <>
      <section className="grid pricing-single-grid">
        {plans.map((plan) => (
          <article
            className="card"
            key={plan.id}
            style={{ outline: selectedId === plan.id ? "2px solid #0f5a73" : "" }}
            onClick={() => setSelectedId(plan.id)}
          >
            <h3 className="card-title">{plan.name}</h3>
            <p className="muted">
              {plan.durationDays > 0 ? `${plan.durationDays} ${t.days}` : t.perPlacement}
            </p>
            <p className="plot-price" style={{ margin: "8px 0" }}>
              {plan.priceUsd} USD
            </p>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="section card" style={{ maxWidth: 760 }}>
        <h3 className="card-title">{t.checkout}</h3>
        <p className="muted">
          {t.selected} {selectedPlan?.name} · {selectedPlan?.priceUsd} USD ·{" "}
          {selectedPlan?.durationDays ? `${selectedPlan.durationDays} ${t.days}` : t.perPlacement}
        </p>

        <div className="form-grid" style={{ marginTop: 12 }}>
          <div className="form-field">
            <label>{t.payer}</label>
            <select>
              <option>{t.individual}</option>
              <option>{t.company}</option>
            </select>
          </div>
          <div className="form-field">
            <label>{t.invoice}</label>
            <input type="email" />
          </div>
          <div className="form-field">
            <label>{t.tax}</label>
            <input />
          </div>
          <div className="form-field">
            <label>{t.promo}</label>
            <input />
          </div>
        </div>

        <div className="plot-actions" style={{ marginTop: 14 }}>
          <button className="btn btn-primary" onClick={activate} type="button">
            {t.activate}
          </button>
        </div>
      </section>

      {result ? (
        <section className="section card">
          <strong>{result}</strong>
        </section>
      ) : null}
    </>
  );
}
