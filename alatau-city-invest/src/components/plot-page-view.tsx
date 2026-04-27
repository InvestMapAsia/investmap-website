"use client";

import Link from "next/link";
import { useState } from "react";
import { ListingQrCode } from "@/components/listing-qr-code";
import { PlotCard } from "@/components/plot-card";
import { PlotDetailTabs } from "@/components/plot-detail-tabs";
import { StatusBadge } from "@/components/status-badge";
import { pickLang } from "@/lib/i18n";
import { localizePlot, translatePurpose } from "@/lib/i18n-content";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { getPlotCoverUrl } from "@/lib/plot-media";
import { currency } from "@/lib/ui";
import { Plot } from "@/lib/types";

export function PlotPageView({ plot, similar }: { plot: Plot; similar: Plot[] }) {
  const { lang } = useCurrentLanguage();
  const [baiduZoom, setBaiduZoom] = useState(15);

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
    CN: {
      price: "价格",
      area: "面积",
      riskScore: "风险评分",
      distanceToCenter: "到中心距离",
      invest: "投资此地块",
      openAi: "打开 AI 分析",
      backToCatalog: "返回目录",
      aiRiskSummary: "AI 风险摘要",
      similarOpportunities: "相似机会",
      similarSub: "基于用途和投资画像匹配推荐。",
      noSimilar: "未找到相似地块。",
      legalAPlus: "A+ 完整核验",
      legalA: "A 已核验",
      legalB: "B 部分核验",
      legalC: "C 业主声明",
      riskLow: "低风险画像，法律和基础设施匹配度较强。",
      riskMedium: "中等风险。签署最终条款前请复核基础设施计划和法律假设。",
      riskHigh: "高风险画像。建议扩大法律尽调并进行情景压力测试。",
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
    CN: {
      share: "分享",
      shareSuccess: "链接已复制，可以发送。",
      shareFail: "无法分享此页面。",
    },
  });

  const mapT = pickLang(lang, {
    EN: {
      locationMap: "Location on map",
      openInGoogle: "Open in Google Maps",
      openInBaidu: "Open in Baidu Maps (百度地图)",
      baiduMiniWindow: "Baidu Maps (百度地图)",
      noLocation: "Coordinates are not available for this plot.",
    },
    RU: {
      locationMap: "Точка на карте",
      openInGoogle: "Открыть в Google Maps",
      openInBaidu: "Открыть в Baidu Maps (百度地图)",
      baiduMiniWindow: "Baidu Maps (百度地图)",
      noLocation: "Для этого участка пока нет координат.",
    },
    KZ: {
      locationMap: "Картадағы нүкте",
      openInGoogle: "Google Maps-те ашу",
      openInBaidu: "Baidu Maps (百度地图)-те ашу",
      baiduMiniWindow: "Baidu Maps (百度地图)",
      noLocation: "Бұл учаске үшін координаттар әлі енгізілмеген.",
    },
    CN: {
      locationMap: "地图位置",
      openInGoogle: "在 Google Maps 中打开",
      openInBaidu: "在 Baidu Maps (百度地图) 中打开",
      baiduMiniWindow: "Baidu Maps (百度地图)",
      noLocation: "该地块暂未提供坐标。",
    },
  });

  const projectionT = pickLang(lang, {
    EN: {
      title: "ROI projection",
      expectedIrr: "Expected IRR",
      breakEven: "Break-even",
      year: "Year",
      cumulative: "Cumulative ROI",
      years: "Years",
    },
    RU: {
      title: "График доходности (ROI projection)",
      expectedIrr: "Ожидаемый IRR",
      breakEven: "Точка окупаемости",
      year: "Год",
      cumulative: "Накопительный ROI",
      years: "Годы",
    },
    KZ: {
      title: "Табыстылық графигі (ROI projection)",
      expectedIrr: "Күтілетін IRR",
      breakEven: "Өтелу нүктесі",
      year: "Жыл",
      cumulative: "Жинақталған ROI",
      years: "Жылдар",
    },
    CN: {
      title: "收益率图表 (ROI projection)",
      expectedIrr: "预期 IRR",
      breakEven: "盈亏平衡点",
      year: "年份",
      cumulative: "累计 ROI",
      years: "年",
    },
  });

  const legalGradeLabel = {
    a_plus: t.legalAPlus,
    a: t.legalA,
    b: t.legalB,
    c: t.legalC,
  };
  const displayPlot = localizePlot(lang, plot);
  const coverUrl = getPlotCoverUrl(plot);

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
  const baiduOpenUrl = hasCoordinates
    ? `https://api.map.baidu.com/marker?location=${plot.mapLat},${plot.mapLng}&title=${encodeURIComponent(displayPlot.title)}&content=${encodeURIComponent(plot.mapAddress?.trim() || displayPlot.title)}&output=html&coord_type=wgs84&src=webapp.investmap.website`
    : plot.mapAddress?.trim()
      ? `https://api.map.baidu.com/geocoder?address=${encodeURIComponent(plot.mapAddress.trim())}&output=html&src=webapp.investmap.website`
      : null;
  const baiduStaticCenter = hasCoordinates
    ? `${plot.mapLng},${plot.mapLat}`
    : plot.mapAddress?.trim()
      ? plot.mapAddress.trim()
      : null;
  const baiduStaticMapUrl = baiduStaticCenter
    ? `https://api.map.baidu.com/staticimage?center=${encodeURIComponent(baiduStaticCenter)}&width=512&height=170&zoom=${baiduZoom}`
    : null;
  const breakEvenYear = 3;
  const roiProjection = [
    { year: 1, value: -10 },
    { year: 2, value: -4 },
    { year: 3, value: 0 },
    { year: 4, value: Math.round(plot.irr * 0.85) },
    { year: 5, value: Math.round(plot.irr * 1.75) },
    { year: 6, value: Math.round(plot.irr * 2.5) },
    { year: 7, value: Math.round(plot.irr * 3.4) },
    { year: 8, value: Math.round(plot.irr * 4.35) },
    { year: 9, value: Math.round(plot.irr * 5.2) },
    { year: 10, value: Math.round(plot.irr * 6.2) },
  ];
  const chart = {
    left: 54,
    right: 736,
    top: 34,
    bottom: 226,
    min: -20,
    max: Math.max(80, Math.ceil(Math.max(...roiProjection.map((item) => item.value)) / 10) * 10),
  };
  const getChartX = (year: number) =>
    chart.left + ((year - 1) / 9) * (chart.right - chart.left);
  const getChartY = (value: number) =>
    chart.bottom - ((value - chart.min) / (chart.max - chart.min)) * (chart.bottom - chart.top);
  const projectionPoints = roiProjection
    .map((point) => `${getChartX(point.year)},${getChartY(point.value)}`)
    .join(" ");
  const zeroY = getChartY(0);
  const projectionArea = `M ${getChartX(1)} ${zeroY} L ${projectionPoints} L ${getChartX(10)} ${zeroY} Z`;
  const yTicks = [chart.max, Math.round(chart.max / 2), 0, chart.min];
  const milestoneYears = [1, 3, 5];

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: displayPlot.title,
          text: `${displayPlot.title} (${plot.id})`,
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
            {plot.id} · {displayPlot.district} · {translatePurpose(lang, plot.purpose)}
          </p>
          <h1 style={{ margin: "6px 0 10px" }}>{displayPlot.title}</h1>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <StatusBadge status={plot.status} />
            <span className="badge">{legalGradeLabel[plot.legalGrade]}</span>
          </div>

          <div className="plot-detail-summary">
            <div className="plot-cover-frame">
              <img src={coverUrl} alt={displayPlot.title} />
            </div>
            <div className="plot-detail-metrics">
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

          <div className="roi-projection-panel">
            <div className="roi-projection-head">
              <div>
                <h2>{projectionT.title}</h2>
                <p>
                  {projectionT.expectedIrr}: <strong>{plot.irr}%</strong>
                </p>
                <p>
                  {projectionT.breakEven}: {projectionT.year} {breakEvenYear}
                </p>
              </div>
              <span className="roi-projection-mode">{projectionT.cumulative}</span>
            </div>

            <div className="roi-chart-wrap">
              <svg className="roi-chart" viewBox="0 0 780 270" role="img" aria-label={projectionT.title}>
                <defs>
                  <linearGradient id={`roiFill-${plot.id}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#B0DA2A" stopOpacity="0.34" />
                    <stop offset="100%" stopColor="#B0DA2A" stopOpacity="0.03" />
                  </linearGradient>
                </defs>

                {yTicks.map((tick) => {
                  const y = getChartY(tick);
                  return (
                    <g key={tick}>
                      <line
                        className={tick === 0 ? "roi-zero-line" : "roi-grid-line"}
                        x1={chart.left}
                        x2={chart.right}
                        y1={y}
                        y2={y}
                      />
                      <text className="roi-axis-label" x={16} y={y + 4}>
                        {tick}%
                      </text>
                    </g>
                  );
                })}

                <path className="roi-area" d={projectionArea} fill={`url(#roiFill-${plot.id})`} />
                <polyline className="roi-line" points={projectionPoints} />

                {roiProjection.map((point) => {
                  const x = getChartX(point.year);
                  const y = getChartY(point.value);
                  return (
                    <g key={point.year}>
                      <circle className="roi-dot" cx={x} cy={y} r={4.5} />
                      <text className="roi-point-label" x={x} y={y - 10} textAnchor="middle">
                        {point.value > 0 ? "+" : ""}
                        {point.value}%
                      </text>
                      <text className="roi-axis-label" x={x} y={250} textAnchor="middle">
                        {point.year}
                      </text>
                    </g>
                  );
                })}

                <text className="roi-axis-label" x={(chart.left + chart.right) / 2} y={266} textAnchor="middle">
                  {projectionT.years}
                </text>
              </svg>
            </div>

            <div className="roi-milestones">
              {milestoneYears.map((year) => {
                const point = roiProjection.find((item) => item.year === year);
                return (
                  <div className="roi-milestone" key={year}>
                    <span>
                      {projectionT.year} {year}
                    </span>
                    <strong>
                      {(point?.value ?? 0) > 0 ? "+" : ""}
                      {point?.value ?? 0}%
                    </strong>
                  </div>
                );
              })}
            </div>
          </div>
        </article>

        <aside className="card">
          <h3 className="card-title">{t.aiRiskSummary}</h3>
          <p className="muted">{riskNote}</p>
          <div className="plot-mini-map-wrap">
            <h4 className="plot-mini-map-title">{mapT.locationMap}</h4>
            {mapEmbedUrl ? (
              <>
                <iframe
                  className="plot-mini-map-frame"
                  src={mapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${displayPlot.title} map`}
                />
                {baiduStaticMapUrl ? (
                  <div className="plot-baidu-window">
                    <div className="plot-baidu-window-label">{mapT.baiduMiniWindow}</div>
                    <div className="plot-baidu-map-shell">
                      <div
                        className="plot-mini-map-frame plot-baidu-static-map"
                        role="img"
                        aria-label={`${displayPlot.title} Baidu Maps`}
                        style={{ backgroundImage: `url("${baiduStaticMapUrl}")` }}
                      />
                      <div className="plot-baidu-center-pin" aria-hidden="true" />
                      <div className="plot-baidu-zoom" aria-label="Baidu map zoom">
                        <button
                          type="button"
                          aria-label="Zoom in Baidu map"
                          onClick={() => setBaiduZoom((current) => Math.min(18, current + 1))}
                        >
                          +
                        </button>
                        <button
                          type="button"
                          aria-label="Zoom out Baidu map"
                          onClick={() => setBaiduZoom((current) => Math.max(3, current - 1))}
                        >
                          -
                        </button>
                        <button
                          type="button"
                          aria-label="Reset Baidu map to listing location"
                          onClick={() => setBaiduZoom(15)}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Zm0-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
                <div className="plot-mini-map-actions">
                  {mapOpenUrl ? (
                    <a className="btn btn-ghost" href={mapOpenUrl} target="_blank" rel="noreferrer">
                      {mapT.openInGoogle}
                    </a>
                  ) : null}
                  {baiduOpenUrl ? (
                    <a className="btn btn-ghost" href={baiduOpenUrl} target="_blank" rel="noreferrer">
                      {mapT.openInBaidu}
                    </a>
                  ) : null}
                </div>
              </>
            ) : (
              <p className="muted">{mapT.noLocation}</p>
            )}
          </div>
          <ListingQrCode title={displayPlot.title} path={`/plots/${plot.id}`} kind="plot" />
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
