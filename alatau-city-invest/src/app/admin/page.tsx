"use client";

import { AdminQueuePanel } from "@/components/admin-queue-panel";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";

export default function AdminPage() {
  const { lang } = useCurrentLanguage();
  const t = pickLang(lang, {
    EN: {
      title: "Administrative panel",
      sub: "Moderation, legal incidents, owner listings, projects and inventory control in one workspace.",
      sla: "Operational SLA",
      firstResponse: "Application first response",
      in2h: "Within 2 hours",
      kycReview: "KYC/AML review",
      in24h: "Within 24 hours",
      legalModeration: "Legal moderation",
      in2472h: "24-72 hours",
      controls: "Risk controls",
      controlsText:
        "Duplicate cadastral checks, price anomaly detection, suspicious application patterns and document inconsistency flags.",
    },
    RU: {
      title: "Административная панель",
      sub: "Модерация, юридические инциденты, листинги собственников, проекты и контроль инвентаря в одном окне.",
      sla: "Операционный SLA",
      firstResponse: "Первичный ответ по заявке",
      in2h: "В течение 2 часов",
      kycReview: "Проверка KYC/AML",
      in24h: "В течение 24 часов",
      legalModeration: "Юридическая модерация",
      in2472h: "24-72 часа",
      controls: "Контроль рисков",
      controlsText:
        "Проверка дублей кадастров, выявление ценовых аномалий, подозрительных паттернов заявок и несоответствий документов.",
    },
    KZ: {
      title: "Әкімшілік панель",
      sub: "Модерация, заңдық инциденттер, жер иелері листингтері, жобалар және инвентарь бақылауы бір кеңістікте.",
      sla: "Операциялық SLA",
      firstResponse: "Өтінімге алғашқы жауап",
      in2h: "2 сағат ішінде",
      kycReview: "KYC/AML тексерісі",
      in24h: "24 сағат ішінде",
      legalModeration: "Заңдық модерация",
      in2472h: "24-72 сағат",
      controls: "Тәуекел бақылауы",
      controlsText:
        "Кадастр қайталануын тексеру, баға аномалияларын анықтау, күмәнді өтінім үлгілері және құжат сәйкессіздіктері.",
    },
  });

  return (
    <div className="container">
      <div className="section-title">
        <h2>{t.title}</h2>
        <p>{t.sub}</p>
      </div>
      <AdminQueuePanel />

      <section className="section split">
        <article className="card">
          <h3 className="card-title">{t.sla}</h3>
          <div className="metric-line">
            <span className="muted">{t.firstResponse}</span>
            <strong>{t.in2h}</strong>
          </div>
          <div className="metric-line">
            <span className="muted">{t.kycReview}</span>
            <strong>{t.in24h}</strong>
          </div>
          <div className="metric-line">
            <span className="muted">{t.legalModeration}</span>
            <strong>{t.in2472h}</strong>
          </div>
        </article>

        <article className="card">
          <h3 className="card-title">{t.controls}</h3>
          <p className="muted">{t.controlsText}</p>
        </article>
      </section>
    </div>
  );
}

