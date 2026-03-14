"use client";

import { OwnerAddPlotForm } from "@/components/owner-add-plot-form";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";

export default function OwnerAddPlotPage() {
  const { lang } = useCurrentLanguage();
  const t = pickLang(lang, {
    EN: {
      title: "Self-service plot placement",
      sub: "Owner onboarding flow with quality scoring, legal data and moderation submission.",
    },
    RU: {
      title: "Самостоятельное размещение участка",
      sub: "Сценарий для собственников: оценка качества, юридические данные и отправка на модерацию.",
    },
    KZ: {
      title: "Учаскені өз бетінше орналастыру",
      sub: "Жер иелеріне арналған ағын: сапа бағасы, заңдық деректер және модерацияға жіберу.",
    },
  });

  return (
    <div className="container" style={{ maxWidth: 980 }}>
      <div className="section-title">
        <h2>{t.title}</h2>
        <p>{t.sub}</p>
      </div>
      <OwnerAddPlotForm />
    </div>
  );
}
