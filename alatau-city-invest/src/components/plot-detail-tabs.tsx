"use client";

import { useState } from "react";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";
import { Plot } from "@/lib/types";

export function PlotDetailTabs({ plot }: { plot: Plot }) {
  const { lang } = useCurrentLanguage();
  const [tab, setTab] = useState<"legal" | "analysis" | "roadmap">("legal");

  const t = pickLang(lang, {
    EN: {
      legalBlock: "Legal block",
      analysis: "Investment analysis",
      roadmap: "Infrastructure roadmap",
      legalDocs: "Legal documents",
      lastUpdate: "Last legal update:",
      verifyLevel: "Verification level depends on document completeness.",
      scenario: "Scenario model",
      conservative: "Conservative",
      base: "Base",
      optimistic: "Optimistic",
      assumptions: "Model assumptions blend infrastructure timeline, liquidity profile and legal confidence.",
      milestones: "Roadmap milestones",
      media: "Media gallery",
      noMedia: "No media uploaded for this plot yet.",
      openMedia: "Open media",
    },
    RU: {
      legalBlock: "Юридический блок",
      analysis: "Инвестиционный анализ",
      roadmap: "Инфраструктурная карта",
      legalDocs: "Юридические документы",
      lastUpdate: "Последнее юр. обновление:",
      verifyLevel: "Уровень верификации зависит от полноты пакета документов.",
      scenario: "Сценарная модель",
      conservative: "Консервативный",
      base: "Базовый",
      optimistic: "Оптимистичный",
      assumptions: "Модель учитывает инфраструктурные сроки, профиль ликвидности и уровень юридической уверенности.",
      milestones: "Ключевые этапы",
      media: "Медиагалерея",
      noMedia: "Для этого участка пока нет загруженных медиа.",
      openMedia: "Открыть медиа",
    },
    KZ: {
      legalBlock: "Заң блогы",
      analysis: "Инвестициялық талдау",
      roadmap: "Инфрақұрылым жол картасы",
      legalDocs: "Заң құжаттары",
      lastUpdate: "Соңғы заң жаңартуы:",
      verifyLevel: "Верификация деңгейі құжаттардың толықтығына байланысты.",
      scenario: "Сценарий моделі",
      conservative: "Консервативті",
      base: "Базалық",
      optimistic: "Оптимистік",
      assumptions: "Модель инфрақұрылым мерзімдерін, өтімділік профилін және заңдық сенімділік деңгейін біріктіреді.",
      milestones: "Негізгі кезеңдер",
      media: "Медиа галерея",
      noMedia: "Бұл учаске үшін медиа әлі жүктелмеген.",
      openMedia: "Медианы ашу",
    },
  });

  const isVideoUrl = (url: string) => /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url);

  return (
    <section className="section card">
      <div className="tabs">
        <button
          className={tab === "legal" ? "tab-btn active" : "tab-btn"}
          type="button"
          onClick={() => setTab("legal")}
        >
          {t.legalBlock}
        </button>
        <button
          className={tab === "analysis" ? "tab-btn active" : "tab-btn"}
          type="button"
          onClick={() => setTab("analysis")}
        >
          {t.analysis}
        </button>
        <button
          className={tab === "roadmap" ? "tab-btn active" : "tab-btn"}
          type="button"
          onClick={() => setTab("roadmap")}
        >
          {t.roadmap}
        </button>
      </div>

      <div className={tab === "legal" ? "tab-pane active" : "tab-pane"}>
        <h3 className="card-title">{t.legalDocs}</h3>
        <ul>
          {plot.docs.map((doc) => (
            <li key={doc}>{doc}</li>
          ))}
        </ul>
        <p className="muted">
          {t.lastUpdate} {plot.updatedAt}. {t.verifyLevel}
        </p>
      </div>

      <div className={tab === "analysis" ? "tab-pane active" : "tab-pane"}>
        <h3 className="card-title">{t.scenario}</h3>
        <div className="metric-line">
          <span className="muted">{t.conservative}</span>
          <strong>11% annualized</strong>
        </div>
        <div className="metric-line">
          <span className="muted">{t.base}</span>
          <strong>{plot.roi}% annualized</strong>
        </div>
        <div className="metric-line">
          <span className="muted">{t.optimistic}</span>
          <strong>{Math.round(plot.roi * 1.25)}% annualized</strong>
        </div>
        <p className="muted">{t.assumptions}</p>
      </div>

      <div className={tab === "roadmap" ? "tab-pane active" : "tab-pane"}>
        <h3 className="card-title">{t.milestones}</h3>
        <ul>
          {plot.timeline.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="section" style={{ marginTop: 16 }}>
        <h3 className="card-title">{t.media}</h3>
        {plot.mediaUrls?.length ? (
          <div className="uploaded-media-grid">
            {plot.mediaUrls.map((url, index) => (
              <div className="uploaded-media-item" key={`${url}-${index}`}>
                <div className="uploaded-media-preview">
                  {isVideoUrl(url) ? (
                    <video src={url} controls preload="metadata" />
                  ) : (
                    <img src={url} alt={`plot-media-${index + 1}`} />
                  )}
                </div>
                <div className="uploaded-media-actions">
                  <a href={url} target="_blank" rel="noreferrer" className="btn btn-ghost">
                    {t.openMedia}
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">{t.noMedia}</p>
        )}
      </div>
    </section>
  );
}
