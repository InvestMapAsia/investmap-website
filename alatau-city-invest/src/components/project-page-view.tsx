"use client";

import Link from "next/link";
import { ListingQrCode } from "@/components/listing-qr-code";
import { pickLang } from "@/lib/i18n";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { currency } from "@/lib/ui";
import { BusinessProject, BusinessProjectStatus } from "@/lib/types";
import { hasBusinessProjectTranslation, localizeBusinessProject } from "@/lib/i18n-content";

const statusStyles: Record<BusinessProjectStatus, { bg: string; color: string }> = {
  submitted: { bg: "#E9F2FF", color: "#0A58B5" },
  under_review: { bg: "#FFF4D9", color: "#946500" },
  needs_revision: { bg: "#FFF0E5", color: "#A54B00" },
  approved: { bg: "#E7F7E7", color: "#1F7A39" },
  rejected: { bg: "#FDEBEC", color: "#B4232C" },
};

export function ProjectPageView({ project }: { project: BusinessProject }) {
  const { lang } = useCurrentLanguage();

  const t = pickLang(lang, {
    EN: {
      back: "Back to projects",
      invest: "Invest in this project",
      share: "Share",
      shareSuccess: "Project link copied.",
      shareFail: "Could not share project link.",
      requested: "Requested amount",
      minTicket: "Minimum ticket",
      founder: "Founder",
      market: "Market",
      city: "City",
      website: "Website",
      overview: "Business overview",
      model: "Business model",
      traction: "Prototype / first results",
      legal: "Legal readiness",
      forecast: "Financial forecasts",
      terms: "Investment terms",
      media: "Media",
      contacts: "Founder contacts",
      submitted: "Submitted",
      underReview: "Under review",
      needsRevision: "Needs revision",
      approved: "Approved",
      rejected: "Rejected",
    },
    RU: {
      back: "Назад к проектам",
      invest: "Инвестировать в проект",
      share: "Поделиться",
      shareSuccess: "Ссылка на проект скопирована.",
      shareFail: "Не удалось поделиться ссылкой на проект.",
      requested: "Запрос инвестиций",
      minTicket: "Минимальный билет",
      founder: "Основатель",
      market: "Рынок",
      city: "Город",
      website: "Сайт",
      overview: "О чем бизнес",
      model: "Бизнес-модель",
      traction: "Прототип / первые результаты",
      legal: "Юридическая готовность",
      forecast: "Финансовые прогнозы",
      terms: "Условия инвестирования",
      media: "Медиа",
      contacts: "Контакты основателя",
      submitted: "Подан",
      underReview: "На модерации",
      needsRevision: "Нужны правки",
      approved: "Одобрен",
      rejected: "Отклонен",
    },
    KZ: {
      back: "Жобаларға қайту",
      invest: "Жобаға инвестициялау",
      share: "Бөлісу",
      shareSuccess: "Жоба сілтемесі көшірілді.",
      shareFail: "Жоба сілтемесін бөлісу мүмкін болмады.",
      requested: "Сұралған инвестиция",
      minTicket: "Минималды билет",
      founder: "Құрушы",
      market: "Нарық",
      city: "Қала",
      website: "Сайт",
      overview: "Бизнес сипаттамасы",
      model: "Бизнес-модель",
      traction: "Прототип / алғашқы нәтижелер",
      legal: "Заңдық дайындық",
      forecast: "Қаржылық болжамдар",
      terms: "Инвестиция шарттары",
      media: "Медиа",
      contacts: "Құрушы байланыстары",
      submitted: "Жіберілді",
      underReview: "Модерацияда",
      needsRevision: "Түзету керек",
      approved: "Мақұлданды",
      rejected: "Қабылданбады",
    },
    CN: {
      back: "返回项目",
      invest: "投资此项目",
      share: "分享",
      shareSuccess: "项目链接已复制。",
      shareFail: "无法分享项目链接。",
      requested: "融资需求",
      minTicket: "最低投资额",
      founder: "创始人",
      market: "市场",
      city: "城市",
      website: "网站",
      overview: "业务概览",
      model: "商业模式",
      traction: "原型 / 初步成果",
      legal: "法律准备度",
      forecast: "财务预测",
      terms: "投资条款",
      media: "媒体",
      contacts: "创始人联系方式",
      submitted: "已提交",
      underReview: "审核中",
      needsRevision: "需要修改",
      approved: "已批准",
      rejected: "已拒绝",
    },
  });

  const statusLabels: Record<BusinessProjectStatus, string> = {
    submitted: t.submitted,
    under_review: t.underReview,
    needs_revision: t.needsRevision,
    approved: t.approved,
    rejected: t.rejected,
  };

  const displayProject = localizeBusinessProject(lang, project);
  const translated = lang !== "EN" && hasBusinessProjectTranslation(lang, project);
  const originalLabel = pickLang(lang, {
    EN: "Original data",
    RU: "Оригинальные данные",
    KZ: "Бастапқы дерек",
    CN: "原始数据",
  });
  const projectUrl = `/projects/${project.id}`;
  const contactHref = `/contacts?project=${encodeURIComponent(project.id)}#contact-form`;

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${projectUrl}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: displayProject.companyName,
          text: displayProject.businessOverview,
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      window.alert(t.shareSuccess);
    } catch {
      window.alert(t.shareFail);
    }
  };

  const tone = statusStyles[project.status];

  return (
    <div className="container">
      <section className="split project-detail-layout">
        <article className="card project-detail-main">
          <div className="plot-top">
            <div>
              <div className="plot-id">{project.id}</div>
              <h1 style={{ margin: "6px 0 10px" }}>{displayProject.companyName}</h1>
              <span
                className="badge"
                style={{ background: tone.bg, color: tone.color, border: "1px solid transparent" }}
              >
                {statusLabels[project.status]}
              </span>
            </div>
            <div className="plot-price">
              {project.requestedAmount ? currency(project.requestedAmount) : "-"}
            </div>
          </div>

          <p className="project-lead">{displayProject.businessOverview}</p>

          {translated ? (
            <p className="project-original-note">
              <strong>{originalLabel}:</strong> {project.businessOverview}
            </p>
          ) : null}

          <div className="grid grid-3 project-metrics">
            <div className="kpi">
              <span className="muted">{t.requested}</span>
              <strong>{project.requestedAmount ? currency(project.requestedAmount) : "-"}</strong>
            </div>
            <div className="kpi">
              <span className="muted">{t.minTicket}</span>
              <strong>{project.minimumTicket ? currency(project.minimumTicket) : "-"}</strong>
            </div>
            <div className="kpi">
              <span className="muted">{t.market}</span>
              <strong>{displayProject.market}</strong>
            </div>
          </div>

          <div className="project-detail-section">
            <h2>{t.model}</h2>
            <p>{displayProject.businessModel}</p>
          </div>
          <div className="project-detail-section">
            <h2>{t.traction}</h2>
            <p>{displayProject.traction}</p>
          </div>
          <div className="project-detail-section">
            <h2>{t.legal}</h2>
            <p>{displayProject.legalReadiness}</p>
          </div>
          <div className="project-detail-section">
            <h2>{t.forecast}</h2>
            <p>{displayProject.financialForecasts}</p>
          </div>
          <div className="project-detail-section">
            <h2>{t.terms}</h2>
            <p>{displayProject.investmentTerms}</p>
          </div>

          {project.mediaUrls?.length ? (
            <div className="project-detail-section">
              <h2>{t.media}</h2>
              <div className="project-media-list">
                {project.mediaUrls.map((url) => (
                  <a key={url} href={url} target="_blank" rel="noreferrer">
                    {url}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </article>

        <aside className="card project-detail-aside">
          <div className="metric-line">
            <span className="muted">{t.founder}</span>
            <strong>{project.founderName}</strong>
          </div>
          <div className="metric-line">
            <span className="muted">{t.city}</span>
            <strong>{displayProject.city || "-"}</strong>
          </div>
          <div className="metric-line">
            <span className="muted">{t.website}</span>
            <strong>{project.website || "-"}</strong>
          </div>

          <div className="project-contact-box">
            <h3 className="card-title">{t.contacts}</h3>
            <p className="muted">{project.founderEmail}</p>
            <p className="muted">{project.founderPhone}</p>
          </div>

          <div className="plot-actions">
            <Link className="btn btn-accent" href={contactHref}>
              {t.invest}
            </Link>
            <button className="btn btn-ghost" type="button" onClick={() => void handleShare()}>
              {t.share}
            </button>
            <Link className="btn btn-ghost" href="/projects">
              {t.back}
            </Link>
          </div>

          <ListingQrCode title={displayProject.companyName} path={projectUrl} kind="project" />
        </aside>
      </section>
    </div>
  );
}
