"use client";

import Link from "next/link";
import { PlotCard } from "@/components/plot-card";
import { PlotDetailTabs } from "@/components/plot-detail-tabs";
import { StatusBadge } from "@/components/status-badge";
import { pickLang } from "@/lib/i18n";
import { translatePurpose } from "@/lib/i18n-content";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { currency } from "@/lib/ui";
import { Plot } from "@/lib/types";

export function PlotPageView({ plot, similar }: { plot: Plot; similar: Plot[] }) {
  const { lang } = useCurrentLanguage();

  const t = pickLang(lang, {
    EN: {
      price: "Price",
      area: "Area",
      riskScore: "Risk score",
      distanceToCenter: "Distance to center",
      invest: "Invest in this plot",
      openAi: "Open AI analysis",
      backToCatalog: "Back to catalog",
      aiRiskSummary: "AI risk summary",
      aiNotice: "AI output is assistive only and does not replace legal and financial advice.",
      similarOpportunities: "Similar opportunities",
      similarSub: "Based on matching purpose and investment profile.",
      noSimilar: "No similar plots found.",
      legalAPlus: "A+ Full verification",
      legalA: "A Verified",
      legalB: "B Partial",
      legalC: "C Owner declared",
      riskLow: "Low risk profile with strong legal and infrastructure alignment.",
      riskMedium:
        "Medium risk. Review infrastructure schedule and legal assumptions before final term sheet.",
      riskHigh:
        "High risk profile. Expanded legal due diligence and stress testing are recommended.",
    },
    RU: {
      price: "Цена",
      area: "Площадь",
      riskScore: "Скоринг риска",
      distanceToCenter: "Расстояние до центра",
      invest: "Инвестировать в участок",
      openAi: "Открыть AI-анализ",
      backToCatalog: "Назад в каталог",
      aiRiskSummary: "AI-сводка рисков",
      aiNotice:
        "AI-выводы носят вспомогательный характер и не заменяют юридическую и финансовую консультацию.",
      similarOpportunities: "Похожие возможности",
      similarSub: "Подбор на основе совпадения назначения и инвестиционного профиля.",
      noSimilar: "Похожие участки не найдены.",
      legalAPlus: "A+ Полная проверка",
      legalA: "A Проверен",
      legalB: "B Частично",
      legalC: "C По данным владельца",
      riskLow: "Низкий риск с сильной юридической и инфраструктурной базой.",
      riskMedium:
        "Средний риск. Перед финальным term sheet проверьте инфраструктурный график и юридические допущения.",
      riskHigh:
        "Высокий риск. Рекомендуются расширенная юридическая проверка и стресс-тестирование сценариев.",
    },
    KZ: {
      price: "Бағасы",
      area: "Аумағы",
      riskScore: "Тәуекел скорингі",
      distanceToCenter: "Орталыққа дейінгі қашықтық",
      invest: "Осы учаскеге инвестициялау",
      openAi: "AI талдауын ашу",
      backToCatalog: "Каталогқа қайту",
      aiRiskSummary: "AI тәуекел қорытындысы",
      aiNotice:
        "AI нәтижелері тек көмекші сипатта және заңдық не қаржылық кеңесті алмастырмайды.",
      similarOpportunities: "Ұқсас мүмкіндіктер",
      similarSub: "Мақсаты мен инвестициялық профилі ұқсас учаскелер негізінде.",
      noSimilar: "Ұқсас учаскелер табылмады.",
      legalAPlus: "A+ Толық тексерілген",
      legalA: "A Тексерілген",
      legalB: "B Жартылай",
      legalC: "C Иесінің мәліметі",
      riskLow: "Төмен тәуекел, заңдық және инфрақұрылымдық сәйкестік жоғары.",
      riskMedium:
        "Орташа тәуекел. Финалдық term sheet алдында инфрақұрылым кестесі мен заңдық болжамдарды тексеріңіз.",
      riskHigh:
        "Жоғары тәуекел. Кеңейтілген заңдық due diligence және стресс-тестілеу ұсынылады.",
    },
  });

  const shareT = pickLang(lang, {
    EN: {
      share: "Share",
      shareSuccess: "Link copied. You can now share it.",
      shareFail: "Could not share this page.",
    },
    RU: {
      share: "Поделиться",
      shareSuccess: "Ссылка скопирована. Можно отправлять.",
      shareFail: "Не удалось поделиться этой страницей.",
    },
    KZ: {
      share: "Бөлісу",
      shareSuccess: "Сілтеме көшірілді. Енді жіберуге болады.",
      shareFail: "Бұл бетті бөлісу мүмкін болмады.",
    },
  });

  const mapT = pickLang(lang, {
    EN: {
      locationMap: "Location on map",
      openInGoogle: "Open in Google Maps",
      noLocation: "Coordinates are not available for this plot.",
    },
    RU: {
      locationMap: "Точка на карте",
      openInGoogle: "Открыть в Google Maps",
      noLocation: "Для этого участка пока нет координат.",
    },
    KZ: {
      locationMap: "Картадағы нүкте",
      openInGoogle: "Google Maps-те ашу",
      noLocation: "Бұл учаске үшін координаттар әлі енгізілмеген.",
    },
  });

  const legalGradeLabel = {
    a_plus: t.legalAPlus,
    a: t.legalA,
    b: t.legalB,
    c: t.legalC,
  };

  let riskNote = t.riskMedium;
  if (plot.riskScore <= 30) {
    riskNote = t.riskLow;
  }
  if (plot.riskScore > 45) {
    riskNote = t.riskHigh;
  }

  const hasCoordinates = Number.isFinite(plot.mapLat) && Number.isFinite(plot.mapLng);
  const mapQuery = hasCoordinates
    ? `${plot.mapLat},${plot.mapLng}`
    : plot.mapAddress?.trim()
      ? plot.mapAddress.trim()
      : null;
  const mapEmbedUrl = mapQuery
    ? `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`
    : null;
  const mapOpenUrl = mapQuery
    ? `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}`
    : null;

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: plot.title,
          text: `${plot.title} (${plot.id})`,
          url: shareUrl,
        });
        return;
      }

      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        if (typeof window !== "undefined") {
          window.alert(shareT.shareSuccess);
        }
        return;
      }

      throw new Error("No available share method");
    } catch {
      if (typeof window !== "undefined") {
        window.alert(shareT.shareFail);
      }
    }
  };

  return (
    <div className="container">
      <section className="split">
        <article className="card">
          <p className="muted">
            {plot.id} · {plot.district} · {translatePurpose(lang, plot.purpose)}
          </p>
          <h1 style={{ margin: "6px 0 10px" }}>{plot.title}</h1>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <StatusBadge status={plot.status} />
            <span className="badge">{legalGradeLabel[plot.legalGrade]}</span>
          </div>

          <div className="section">
            <div className="metric-line">
              <span className="muted">{t.price}</span>
              <strong>{currency(plot.price)}</strong>
            </div>
            <div className="metric-line">
              <span className="muted">{t.area}</span>
              <strong>{plot.area} ha</strong>
            </div>
            <div className="metric-line">
              <span className="muted">ROI</span>
              <strong>{plot.roi}%</strong>
            </div>
            <div className="metric-line">
              <span className="muted">IRR</span>
              <strong>{plot.irr}%</strong>
            </div>
            <div className="metric-line">
              <span className="muted">{t.riskScore}</span>
              <strong>{plot.riskScore}/100</strong>
            </div>
            <div className="metric-line">
              <span className="muted">{t.distanceToCenter}</span>
              <strong>{plot.distanceCenterKm} km</strong>
            </div>
          </div>

          <div className="plot-actions" style={{ marginTop: 14 }}>
            <Link className="btn btn-accent" href={`/invest?plot=${plot.id}`}>
              {t.invest}
            </Link>
            <button className="btn btn-ghost" type="button" onClick={handleShare}>
              {shareT.share}
            </button>
            <Link className="btn btn-ghost" href="/ai-assistant">
              {t.openAi}
            </Link>
            <Link className="btn btn-ghost" href="/catalog">
              {t.backToCatalog}
            </Link>
          </div>
        </article>

        <aside className="card">
          <h3 className="card-title">{t.aiRiskSummary}</h3>
          <p className="muted">{riskNote}</p>
          <div className="notice" style={{ marginTop: 12 }}>
            {t.aiNotice}
          </div>
          <div className="plot-mini-map-wrap">
            <h4 className="plot-mini-map-title">{mapT.locationMap}</h4>
            {mapEmbedUrl ? (
              <>
                <iframe
                  className="plot-mini-map-frame"
                  src={mapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${plot.title} map`}
                />
                {mapOpenUrl ? (
                  <a className="btn btn-ghost" href={mapOpenUrl} target="_blank" rel="noreferrer">
                    {mapT.openInGoogle}
                  </a>
                ) : null}
              </>
            ) : (
              <p className="muted">{mapT.noLocation}</p>
            )}
          </div>
        </aside>
      </section>

      <PlotDetailTabs plot={plot} />

      <section className="section">
        <div className="section-title">
          <h2>{t.similarOpportunities}</h2>
          <p>{t.similarSub}</p>
        </div>
        <div className="grid grid-3">
          {similar.length ? (
            similar.map((item) => <PlotCard key={item.id} plot={item} />)
          ) : (
            <div className="empty-state">{t.noSimilar}</div>
          )}
        </div>
      </section>
    </div>
  );
}
