"use client";

import Link from "next/link";
import { PlotCard } from "@/components/plot-card";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";
import { listPlots } from "@/lib/mock-db";

export default function HomePage() {
  const { lang } = useCurrentLanguage();
  const all = listPlots({ sort: "roi_desc" });
  const available = all.filter((plot) => plot.status === "available");
  const topPlots = available.slice(0, 3);
  const avgRoi = Math.round(all.reduce((sum, plot) => sum + plot.roi, 0) / Math.max(all.length, 1));

  const t = pickLang(lang, {
    EN: {
      title: "Invest in Alatau City land with transparent legal verification and premium analytics",
      subtitle:
        "A commercial-grade platform with map intelligence, AI risk guidance, owner self-listing, investor workflows, and admin moderation.",
      openMap: "Open map",
      browseCatalog: "Browse catalog",
      addLand: "Add your land",
      smallProjects: "Projects",
      legallyVerified: "Legally verified lots",
      moderationSla: "Moderation SLA",
      averageForecastRoi: "Average forecast ROI",
      partners: "Partner institutions",
      coreIndicators: "Core platform indicators",
      coreIndicatorsSub: "Live summary for inventory, opportunity quality and deal flow.",
      availableLots: "Available lots",
      totalInventory: "Total inventory",
      avgRoiLabel: "Average ROI",
      pipelineApplications: "Pipeline applications",
      realtimeCabinet: "Real-time via cabinet",
      topPlots: "Top plots this week",
      topPlotsSub: "Selected by ROI, legal profile, and infrastructure momentum.",
      roadmap: "Territory roadmap",
      road1: "Transport interchange and logistics acceleration phase.",
      road2: "Main utility backbone expansion for gas and water.",
      road3: "Education and healthcare anchor projects.",
      road4: "International cargo link and commercial core extension.",
      trust: "Trust architecture",
      kyc: "KYC/AML policy",
      mandatory: "Mandatory",
      auditTrail: "Audit trail",
      immutableLog: "Immutable log",
      feeDisclosure: "Fee disclosure",
      transparent: "Transparent",
      notice:
        "Legal and financial due diligence checkpoints are embedded directly in plot cards and application flow.",
      openAi: "Open AI assistant",
      startInvest: "Start investment",
    },
    RU: {
      title: "Инвестируйте в землю Alatau City с прозрачной юридической проверкой и премиальной аналитикой",
      subtitle:
        "Платформа коммерческого уровня с картой, AI-анализом рисков, самостоятельным размещением участков, кабинетами инвестора и модерацией.",
      openMap: "Открыть карту",
      browseCatalog: "Открыть каталог",
      addLand: "Добавить участок",
      smallProjects: "Проекты",
      legallyVerified: "Юридически проверенные участки",
      moderationSla: "SLA модерации",
      averageForecastRoi: "Средний прогноз ROI",
      partners: "Партнерские организации",
      coreIndicators: "Ключевые показатели платформы",
      coreIndicatorsSub: "Сводка по инвентарю, качеству объектов и потоку сделок.",
      availableLots: "Доступные участки",
      totalInventory: "Всего участков",
      avgRoiLabel: "Средний ROI",
      pipelineApplications: "Заявки в работе",
      realtimeCabinet: "В реальном времени в кабинете",
      topPlots: "Лучшие участки недели",
      topPlotsSub: "Отобраны по ROI, юридическому профилю и инфраструктурному потенциалу.",
      roadmap: "Дорожная карта территории",
      road1: "Фаза транспортной развязки и логистического ускорения.",
      road2: "Расширение магистральных сетей газа и воды.",
      road3: "Якорные проекты образования и здравоохранения.",
      road4: "Международный грузовой коридор и расширение делового ядра.",
      trust: "Архитектура доверия",
      kyc: "Политика KYC/AML",
      mandatory: "Обязательно",
      auditTrail: "Аудит-дорожка",
      immutableLog: "Неизменяемый лог",
      feeDisclosure: "Раскрытие комиссий",
      transparent: "Прозрачно",
      notice:
        "Юридические и финансовые этапы due diligence встроены прямо в карточки участков и процесс подачи заявки.",
      openAi: "Открыть AI-ассистента",
      startInvest: "Начать инвестирование",
    },
    KZ: {
      title: "Alatau City жеріне ашық заңдық тексеру және премиум аналитикамен инвестициялаңыз",
      subtitle:
        "Коммерциялық деңгейдегі платформа: карта, AI тәуекел талдауы, жерді өз бетінше орналастыру, инвестор кабинеті және модерация.",
      openMap: "Картаны ашу",
      browseCatalog: "Каталогты ашу",
      addLand: "Учаске қосу",
      smallProjects: "Жобалар",
      legallyVerified: "Заңды тексерілген учаскелер",
      moderationSla: "Модерация SLA",
      averageForecastRoi: "Орташа болжам ROI",
      partners: "Серіктес ұйымдар",
      coreIndicators: "Платформаның негізгі көрсеткіштері",
      coreIndicatorsSub: "Қор, объект сапасы және мәміле ағыны бойынша жедел шолу.",
      availableLots: "Қолжетімді учаскелер",
      totalInventory: "Жалпы инвентарь",
      avgRoiLabel: "Орташа ROI",
      pipelineApplications: "Қаралудағы өтінімдер",
      realtimeCabinet: "Кабинетте нақты уақытта",
      topPlots: "Аптаның үздік учаскелері",
      topPlotsSub: "ROI, заңдық профиль және инфрақұрылым серпіні бойынша таңдалған.",
      roadmap: "Аумақтың жол картасы",
      road1: "Көлік торабы мен логистика жеделдету кезеңі.",
      road2: "Газ және су магистральдық желілерін кеңейту.",
      road3: "Білім және денсаулық сақтау якорь жобалары.",
      road4: "Халықаралық жүк дәлізі және коммерциялық ядроны кеңейту.",
      trust: "Сенім архитектурасы",
      kyc: "KYC/AML саясаты",
      mandatory: "Міндетті",
      auditTrail: "Аудит ізі",
      immutableLog: "Өзгермейтін журнал",
      feeDisclosure: "Комиссия айқындығы",
      transparent: "Ашық",
      notice:
        "Заңдық және қаржылық due diligence кезеңдері учаске карточкалары мен өтінім беру ағынына тікелей енгізілген.",
      openAi: "AI-ассистентті ашу",
      startInvest: "Инвестицияны бастау",
    },
  });

  return (
    <div className="container">
      <section className="hero">
        <div className="hero-grid">
          <div>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
            <div className="inline-actions">
              <Link className="btn btn-primary" href="/map">
                {t.openMap}
              </Link>
              <Link className="btn btn-ghost" href="/catalog">
                {t.browseCatalog}
              </Link>
              <Link className="btn btn-accent" href="/owner/add-plot">
                {t.addLand}
              </Link>
              <Link className="btn btn-ghost" href="/projects">
                {t.smallProjects}
              </Link>
            </div>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <span>{t.legallyVerified}</span>
              <strong>81%</strong>
            </div>
            <div className="hero-stat">
              <span>{t.moderationSla}</span>
              <strong>24-72h</strong>
            </div>
            <div className="hero-stat">
              <span>{t.averageForecastRoi}</span>
              <strong>{avgRoi}%</strong>
            </div>
            <div className="hero-stat">
              <span>{t.partners}</span>
              <strong>24</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <h2>{t.coreIndicators}</h2>
          <p>{t.coreIndicatorsSub}</p>
        </div>

        <div className="grid grid-4">
          <div className="kpi">
            <span className="muted">{t.availableLots}</span>
            <strong>{available.length}</strong>
          </div>
          <div className="kpi">
            <span className="muted">{t.totalInventory}</span>
            <strong>{all.length}</strong>
          </div>
          <div className="kpi">
            <span className="muted">{t.avgRoiLabel}</span>
            <strong>{avgRoi}%</strong>
          </div>
          <div className="kpi">
            <span className="muted">{t.pipelineApplications}</span>
            <strong>{t.realtimeCabinet}</strong>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <h2>{t.topPlots}</h2>
          <p>{t.topPlotsSub}</p>
        </div>
        <div className="grid grid-3">
          {topPlots.map((plot) => (
            <PlotCard key={plot.id} plot={plot} />
          ))}
        </div>
      </section>

      <section className="section split">
        <div className="card">
          <h3 className="card-title">{t.roadmap}</h3>
          <div className="roadmap">
            <div className="road-step">
              <span>2026 Q2</span>
              <p>{t.road1}</p>
            </div>
            <div className="road-step">
              <span>2026 Q4</span>
              <p>{t.road2}</p>
            </div>
            <div className="road-step">
              <span>2027 Q1</span>
              <p>{t.road3}</p>
            </div>
            <div className="road-step">
              <span>2027 Q3</span>
              <p>{t.road4}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">{t.trust}</h3>
          <div className="metric-line">
            <span className="muted">{t.kyc}</span>
            <strong>{t.mandatory}</strong>
          </div>
          <div className="metric-line">
            <span className="muted">{t.auditTrail}</span>
            <strong>{t.immutableLog}</strong>
          </div>
          <div className="metric-line">
            <span className="muted">{t.feeDisclosure}</span>
            <strong>{t.transparent}</strong>
          </div>
          <div className="notice" style={{ marginTop: 12 }}>
            {t.notice}
          </div>
          <div className="plot-actions" style={{ marginTop: 12 }}>
            <Link className="btn btn-primary" href="/ai-assistant">
              {t.openAi}
            </Link>
            <Link className="btn btn-ghost" href="/invest">
              {t.startInvest}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

