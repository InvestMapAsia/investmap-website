"use client";

import { OwnerDashboard } from "@/components/owner-dashboard";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";

export default function OwnerCabinetPage() {
  const { lang } = useCurrentLanguage();
  const t = pickLang(lang, {
    EN: {
      title: "Owner cabinet",
      sub: "Manage listings, leads, moderation status and placement performance.",
    },
    RU: {
      title: "Кабинет собственника",
      sub: "Управляйте листингами, лидами, статусами модерации и эффективностью размещения.",
    },
    KZ: {
      title: "Жер иесі кабинеті",
      sub: "Листингтерді, лидтерді, модерация статусын және жариялау тиімділігін басқарыңыз.",
    },
    CN: {
      title: "业主柜台",
      sub: "管理 listing、潜在线索、审核状态和发布效果。",
    },
  });

  return (
    <div className="container">
      <div className="section-title">
        <h2>{t.title}</h2>
        <p>{t.sub}</p>
      </div>
      <OwnerDashboard />
    </div>
  );
}
