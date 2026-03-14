"use client";

import { MapExplorer } from "@/components/map-explorer";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";

export default function MapPage() {
  const { lang } = useCurrentLanguage();
  const t = pickLang(lang, {
    EN: {
      title: "Interactive map",
      sub: "Filter inventory by purpose, risk, legal status and pricing profile.",
    },
    RU: {
      title: "Интерактивная карта",
      sub: "Фильтруйте участки по назначению, риску, юридическому статусу и ценовому профилю.",
    },
    KZ: {
      title: "Интерактивті карта",
      sub: "Инвентарьді мақсат, тәуекел, заңдық статус және баға профилі бойынша сүзгіден өткізіңіз.",
    },
  });

  return (
    <div className="container">
      <div className="section-title">
        <h2>{t.title}</h2>
        <p>{t.sub}</p>
      </div>
      <MapExplorer />
    </div>
  );
}
