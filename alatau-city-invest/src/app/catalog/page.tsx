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
    CN: {
      title: "投资目录",
      sub: "比较土地机会、保存收藏，并启动投资申请流程。",
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
