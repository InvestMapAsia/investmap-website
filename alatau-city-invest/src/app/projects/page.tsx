"use client";

import { ProjectsMarketplace } from "@/components/projects-marketplace";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";

export default function ProjectsPage() {
  const { lang } = useCurrentLanguage();
  const t = pickLang(lang, {
    EN: {
      title: "Business projects marketplace",
      sub: "A dedicated area for projects that seek investor capital on transparent terms.",
    },
    RU: {
      title: "Витрина бизнес-проектов",
      sub: "Отдельный раздел для проектов, которые ищут инвестиции на прозрачных условиях.",
    },
    KZ: {
      title: "Бизнес-жобалар витринасы",
      sub: "Инвестиция іздейтін жобаларға арналған ашық және түсінікті бөлім.",
    },
    CN: {
      title: "商业项目市场",
      sub: "为需要投资资本、并提供透明条款的项目设置的专属区域。",
    },
  });

  return (
    <div className="container">
      <div className="section-title">
        <h2>{t.title}</h2>
        <p>{t.sub}</p>
      </div>
      <ProjectsMarketplace />
    </div>
  );
}

