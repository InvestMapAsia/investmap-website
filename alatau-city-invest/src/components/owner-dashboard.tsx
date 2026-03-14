"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";
import { currency } from "@/lib/ui";
import { Plot } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";

export function OwnerDashboard() {
  const { lang } = useCurrentLanguage();
  const [ownerPlots, setOwnerPlots] = useState<Plot[]>([]);

  const t = pickLang(lang, {
    EN: {
      ownerStatus: "Owner status",
      verification: "Verification",
      verified: "Verified",
      activePlots: "Active owner plots",
      moderationQueue: "Moderation queue",
      addPlot: "Add plot",
      addProject: "Add small project",
      pricing: "Pricing plans",
      analytics: "Owner analytics",
      views: "Total views",
      leads: "Generated leads",
      conversion: "Lead conversion to dialogue",
      tips:
        "Improve title clarity and document completeness to speed up moderation and increase lead quality.",
      listings: "Owner listings",
      listingsSub: "Self-service listings with moderation status and performance metrics.",
      title: "Title",
      price: "Price",
      status: "Status",
      action: "Action",
      open: "Open",
      noPlots: "No owner plots yet.",
    },
    RU: {
      ownerStatus: "Статус собственника",
      verification: "Верификация",
      verified: "Подтвержден",
      activePlots: "Активные участки",
      moderationQueue: "Очередь модерации",
      addPlot: "Добавить участок",
      addProject: "Добавить проект",
      pricing: "Тарифы",
      analytics: "Аналитика собственника",
      views: "Просмотры",
      leads: "Лиды",
      conversion: "Конверсия лида в диалог",
      tips:
        "Повышайте качество заголовка и полноту документов, чтобы ускорить модерацию и улучшить лиды.",
      listings: "Листинги собственника",
      listingsSub: "Самостоятельные листинги со статусом модерации и метриками эффективности.",
      title: "Название",
      price: "Цена",
      status: "Статус",
      action: "Действие",
      open: "Открыть",
      noPlots: "Пока нет участков собственника.",
    },
    KZ: {
      ownerStatus: "Жер иесі статусы",
      verification: "Верификация",
      verified: "Расталған",
      activePlots: "Белсенді учаскелер",
      moderationQueue: "Модерация кезегі",
      addPlot: "Учаске қосу",
      addProject: "Жоба қосу",
      pricing: "Тарифтер",
      analytics: "Жер иесі аналитикасы",
      views: "Қаралым саны",
      leads: "Лидтер",
      conversion: "Лидтен диалогқа конверсия",
      tips:
        "Модерацияны жылдамдату және лид сапасын арттыру үшін тақырып пен құжат толықтығын жақсартыңыз.",
      listings: "Жер иесі листингтері",
      listingsSub: "Модерация статусы және тиімділік метрикалары бар self-service листингтер.",
      title: "Атауы",
      price: "Бағасы",
      status: "Статусы",
      action: "Әрекет",
      open: "Ашу",
      noPlots: "Әзірге жер иесі учаскелері жоқ.",
    },
  });

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/owner/plots");
      const payload = (await response.json()) as { data: Plot[] };
      setOwnerPlots(payload.data);
    }

    void load();
  }, []);

  const views = useMemo(
    () => ownerPlots.reduce((sum, plot) => sum + 180 + Math.round(plot.area * 44), 0),
    [ownerPlots]
  );

  const leads = useMemo(
    () => ownerPlots.reduce((sum, plot) => sum + Math.max(1, Math.round(plot.roi / 4)), 0),
    [ownerPlots]
  );

  return (
    <>
      <section className="split">
        <div className="card">
          <h3 className="card-title">{t.ownerStatus}</h3>
          <div className="metric-line">
            <span className="muted">{t.verification}</span>
            <strong>{t.verified}</strong>
          </div>
          <div className="metric-line">
            <span className="muted">{t.activePlots}</span>
            <strong>{ownerPlots.length}</strong>
          </div>
          <div className="metric-line">
            <span className="muted">{t.moderationQueue}</span>
            <strong>{ownerPlots.filter((plot) => plot.status === "moderation").length}</strong>
          </div>
          <div className="plot-actions" style={{ marginTop: 12 }}>
            <Link className="btn btn-primary" href="/owner/add-plot">
              {t.addPlot}
            </Link>
            <Link className="btn btn-ghost" href="/projects/submit">
              {t.addProject}
            </Link>
            <Link className="btn btn-ghost" href="/pricing">
              {t.pricing}
            </Link>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">{t.analytics}</h3>
          <div className="metric-line">
            <span className="muted">{t.views}</span>
            <strong>{views}</strong>
          </div>
          <div className="metric-line">
            <span className="muted">{t.leads}</span>
            <strong>{leads}</strong>
          </div>
          <div className="metric-line">
            <span className="muted">{t.conversion}</span>
            <strong>42%</strong>
          </div>
          <p className="muted">{t.tips}</p>
        </div>
      </section>

      <section className="section card">
        <div className="section-title">
          <h2>{t.listings}</h2>
          <p>{t.listingsSub}</p>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>{t.title}</th>
                <th>{t.price}</th>
                <th>{t.status}</th>
                <th>{t.views}</th>
                <th>{t.leads}</th>
                <th>{t.action}</th>
              </tr>
            </thead>
            <tbody>
              {ownerPlots.length ? (
                ownerPlots.map((plot) => (
                  <tr key={plot.id}>
                    <td>{plot.id}</td>
                    <td>{plot.title}</td>
                    <td>{currency(plot.price)}</td>
                    <td>
                      <StatusBadge status={plot.status} />
                    </td>
                    <td>{180 + Math.round(plot.area * 44)}</td>
                    <td>{Math.max(1, Math.round(plot.roi / 4))}</td>
                    <td>
                      <Link className="btn btn-ghost" href={`/plots/${plot.id}`}>
                        {t.open}
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>{t.noPlots}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

