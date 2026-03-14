"use client";

import { CatalogExplorer } from "@/components/catalog-explorer";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";

export default function CatalogPage() {
  const { lang } = useCurrentLanguage();
  const t = pickLang(lang, {
    EN: {
      title: "Investment catalog",
      sub: "Compare land opportunities, save favorites, and launch application flows.",
    },
    RU: {
      title: "Инвестиционный каталог",
      sub: "Сравнивайте участки, сохраняйте в избранное и запускайте процесс подачи заявки.",
    },
    KZ: {
      title: "Инвестициялық каталог",
      sub: "Учаскелерді салыстырыңыз, таңдаулыға сақтаңыз және өтінім процесін бастаңыз.",
    },
  });

  return (
    <div className="container">
      <div className="section-title">
        <h2>{t.title}</h2>
        <p>{t.sub}</p>
      </div>
      <CatalogExplorer />
    </div>
  );
}
