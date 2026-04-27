"use client";

import { InvestorDashboard } from "@/components/investor-dashboard";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";

export default function InvestorCabinetPage() {
  const { lang } = useCurrentLanguage();
  const t = pickLang(lang, {
    EN: {
      title: "Investor cabinet",
      sub: "Portfolio visibility, application tracking, favorites and action history.",
    },
    RU: {
      title: "Кабинет инвестора",
      sub: "Контроль портфеля, отслеживание заявок, избранное и история действий.",
    },
    KZ: {
      title: "Инвестор кабинеті",
      sub: "Портфель көрінісі, өтінімдерді қадағалау, таңдаулылар және әрекет тарихы.",
    },
    CN: {
      title: "投资人柜台",
      sub: "查看投资组合、跟踪申请、收藏和操作历史。",
    },
  });

  return (
    <div className="container">
      <div className="section-title">
        <h2>{t.title}</h2>
        <p>{t.sub}</p>
      </div>
      <InvestorDashboard />
    </div>
  );
}
