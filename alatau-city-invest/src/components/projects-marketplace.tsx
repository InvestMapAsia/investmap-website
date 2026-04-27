"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { pickLang } from "@/lib/i18n";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { currency } from "@/lib/ui";
import { BusinessProject, BusinessProjectStatus } from "@/lib/types";
import { hasBusinessProjectTranslation, localizeBusinessProject } from "@/lib/i18n-content";

type ProjectStatusFilter = BusinessProjectStatus | "all";

type ProjectRow = BusinessProject & {
  userId?: string | null;
  userEmail?: string;
  userName?: string;
};

const statusStyles: Record<BusinessProjectStatus, { bg: string; color: string }> = {
  submitted: { bg: "#E9F2FF", color: "#0A58B5" },
  under_review: { bg: "#FFF4D9", color: "#946500" },
  needs_revision: { bg: "#FFF0E5", color: "#A54B00" },
  approved: { bg: "#E7F7E7", color: "#1F7A39" },
  rejected: { bg: "#FDEBEC", color: "#B4232C" },
};

const projectCoverFallbacks: Record<string, string> = {
  "BIZ-101": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
  "BIZ-102": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
};

function getProjectCoverUrl(project: ProjectRow) {
  return (
    project.mediaUrls?.find((url) => /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(url) || url.includes("images.unsplash.com")) ??
    projectCoverFallbacks[project.id] ??
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80"
  );
}

function ProjectSkeletonGrid() {
  return (
    <div className="grid grid-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <article className="card skeleton-card" key={`project-skeleton-${index}`}>
          <div className="skeleton-cover" />
          <div className="skeleton-body">
            <div className="skeleton-line short" />
            <div className="skeleton-line medium" />
            <div className="skeleton-line" />
            <div className="project-card-metrics">
              <div className="skeleton-kpi" />
              <div className="skeleton-kpi" />
            </div>
            <div className="skeleton-line medium" />
          </div>
        </article>
      ))}
    </div>
  );
}

export function ProjectsMarketplace() {
  const { lang } = useCurrentLanguage();
  const { status: sessionStatus } = useSession();
  const [rows, setRows] = useState<ProjectRow[]>([]);
  const [statusFilter, setStatusFilter] = useState<ProjectStatusFilter>("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const t = pickLang(lang, {
    EN: {
      title: "Projects",
      sub: "Add and discover projects that need investment: from idea to first traction.",
      create: "Submit a project",
      cabinet: "Project cabinet",
      loginToSubmit: "Sign in to submit",
      searchPlaceholder: "Search by company, market or business idea",
      all: "All statuses",
      submitted: "Submitted",
      underReview: "Under review",
      needsRevision: "Needs revision",
      approved: "Approved",
      rejected: "Rejected",
      total: "Total projects",
      approvedCount: "Approved",
      reviewCount: "In moderation",
      requested: "Requested amount",
      minTicket: "Minimum ticket",
      founder: "Founder",
      market: "Market",
      model: "Business model",
      traction: "Prototype / first results",
      legal: "Legal readiness",
      forecast: "Financial forecasts",
      terms: "Investment terms",
      noData: "No projects found for selected filters.",
      loadError: "Failed to load projects.",
      openSubmit: "Open submit form",
      details: "Details",
      invest: "Invest",
      searchBtn: "Search",
      resetBtn: "Reset",
      share: "Share",
      shareSuccess: "Project link copied.",
      shareFail: "Could not share project link.",
      media: "Media",
      linksWord: "links",
      original: "Original",
    },
    RU: {
      title: "Проекты",
      sub: "Размещайте и изучайте проекты для инвестиций: от идеи до первых результатов.",
      create: "Подать проект",
      cabinet: "Кабинет проектов",
      loginToSubmit: "Войти для подачи",
      searchPlaceholder: "Поиск по компании, рынку или идее",
      all: "Все статусы",
      submitted: "Подан",
      underReview: "На модерации",
      needsRevision: "Нужны правки",
      approved: "Одобрен",
      rejected: "Отклонен",
      total: "Всего проектов",
      approvedCount: "Одобрено",
      reviewCount: "На модерации",
      requested: "Запрос инвестиций",
      minTicket: "Минимальный билет",
      founder: "Основатель",
      market: "Рынок",
      model: "Бизнес-модель",
      traction: "Прототип / первые результаты",
      legal: "Юридическая готовность",
      forecast: "Финансовые прогнозы",
      terms: "Условия инвестирования",
      noData: "По выбранным фильтрам проектов не найдено.",
      loadError: "Не удалось загрузить проекты.",
      openSubmit: "Открыть форму подачи",
      details: "Детали",
      invest: "Инвестировать",
      searchBtn: "Поиск",
      resetBtn: "Сброс",
      share: "Поделиться",
      shareSuccess: "Ссылка на проект скопирована.",
      shareFail: "Не удалось поделиться ссылкой.",
      media: "Медиа",
      linksWord: "ссылок",
      original: "Оригинал",
    },
    KZ: {
      title: "Жобалар",
      sub: "Инвестицияға арналған жобаларды орналастырып, идеядан алғашқы нәтижеге дейін бақылаңыз.",
      create: "Жобаны жіберу",
      cabinet: "Жоба кабинеті",
      loginToSubmit: "Жіберу үшін кіру",
      searchPlaceholder: "Компания, нарық немесе идея бойынша іздеу",
      all: "Барлық статустар",
      submitted: "Жіберілді",
      underReview: "Модерацияда",
      needsRevision: "Түзету керек",
      approved: "Мақұлданды",
      rejected: "Қабылданбады",
      total: "Жобалар саны",
      approvedCount: "Мақұлданған",
      reviewCount: "Модерациядағы",
      requested: "Сұралған инвестиция",
      minTicket: "Минималды билет",
      founder: "Құрушы",
      market: "Нарық",
      model: "Бизнес-модель",
      traction: "Прототип / алғашқы нәтиже",
      legal: "Заңдық дайындық",
      forecast: "Қаржылық болжамдар",
      terms: "Инвестиция шарттары",
      noData: "Таңдалған сүзгі бойынша жоба табылмады.",
      loadError: "Жобаларды жүктеу мүмкін болмады.",
      openSubmit: "Жіберу формасын ашу",
      details: "Толығырақ",
      invest: "Инвестициялау",
      searchBtn: "Іздеу",
      resetBtn: "Тазарту",
      share: "Бөлісу",
      shareSuccess: "Жоба сілтемесі көшірілді.",
      shareFail: "Сілтемені бөлісу мүмкін болмады.",
      media: "Медиа",
      linksWord: "сілтеме",
      original: "Түпнұсқа",
    },
    CN: {
      title: "项目",
      sub: "发布并发现需要投资的项目：从想法到早期增长。",
      create: "提交项目",
      cabinet: "项目柜台",
      loginToSubmit: "登录后提交",
      searchPlaceholder: "按公司、市场或商业想法搜索",
      all: "全部状态",
      submitted: "已提交",
      underReview: "审核中",
      needsRevision: "需要修改",
      approved: "已批准",
      rejected: "已拒绝",
      total: "项目总数",
      approvedCount: "已批准",
      reviewCount: "审核中",
      requested: "融资需求",
      minTicket: "最低投资额",
      founder: "创始人",
      market: "市场",
      model: "商业模式",
      traction: "原型 / 初步成果",
      legal: "法律准备度",
      forecast: "财务预测",
      terms: "投资条款",
      noData: "当前筛选条件下没有项目。",
      loadError: "项目加载失败。",
      openSubmit: "打开提交表单",
      details: "详情",
      invest: "投资",
      searchBtn: "搜索",
      resetBtn: "重置",
      share: "分享",
      shareSuccess: "项目链接已复制。",
      shareFail: "无法分享项目链接。",
      media: "媒体",
      linksWord: "个链接",
      original: "原文",
    },
  });

  const statusLabels: Record<BusinessProjectStatus, string> = {
    submitted: t.submitted,
    under_review: t.underReview,
    needs_revision: t.needsRevision,
    approved: t.approved,
    rejected: t.rejected,
  };

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setLoading(true);
      const params = new URLSearchParams({
        status: statusFilter,
        search,
      });

      try {
        const response = await fetch(`/api/projects?${params.toString()}`, { cache: "no-store" });
        if (!response.ok) {
          if (!ignore) {
            setRows([]);
            window.alert(t.loadError);
          }
          return;
        }

        const payload = (await response.json()) as { data?: ProjectRow[] };
        if (!ignore) {
          setRows(payload.data ?? []);
        }
      } catch {
        if (!ignore) {
          setRows([]);
          window.alert(t.loadError);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      ignore = true;
    };
  }, [search, statusFilter, t.loadError]);

  const metrics = useMemo(() => {
    return {
      total: rows.length,
      approved: rows.filter((item) => item.status === "approved").length,
      moderation: rows.filter((item) => item.status === "submitted" || item.status === "under_review")
        .length,
      requested: rows.reduce((sum, item) => sum + Number(item.requestedAmount ?? 0), 0),
    };
  }, [rows]);
  const submitHref =
    sessionStatus === "authenticated" ? "/projects/submit" : "/login?callbackUrl=/projects/submit";

  const handleShare = async (project: ProjectRow) => {
    const shareUrl = `${window.location.origin}/projects/${project.id}`;
    const shareData = {
      title: project.companyName,
      text: project.businessOverview,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      window.alert(t.shareSuccess);
    } catch {
      window.alert(t.shareFail);
    }
  };

  return (
    <>
      <section className="card project-marketplace-card">
        <div className="section-title">
          <div>
            <h2>{t.title}</h2>
            <p>{t.sub}</p>
          </div>
          <div className="plot-actions project-submit-actions">
            <Link href={submitHref} className="btn btn-primary">
              {sessionStatus === "authenticated" ? t.create : t.loginToSubmit}
            </Link>
            {sessionStatus === "authenticated" ? (
              <Link href="/cabinet/projects" className="btn btn-ghost">
                {t.cabinet}
              </Link>
            ) : null}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-4" style={{ marginTop: 12 }}>
            {Array.from({ length: 4 }).map((_, index) => (
              <div className="skeleton-kpi" key={`project-metric-skeleton-${index}`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-4" style={{ marginTop: 12 }}>
            <div className="kpi">
              <span className="muted">{t.total}</span>
              <strong>{metrics.total}</strong>
            </div>
            <div className="kpi">
              <span className="muted">{t.approvedCount}</span>
              <strong>{metrics.approved}</strong>
            </div>
            <div className="kpi">
              <span className="muted">{t.reviewCount}</span>
              <strong>{metrics.moderation}</strong>
            </div>
            <div className="kpi">
              <span className="muted">{t.requested}</span>
              <strong>{currency(metrics.requested)}</strong>
            </div>
          </div>
        )}
      </section>

      <section className="section card">
        <div className="form-grid">
          <div className="form-field">
            <label>{t.market}</label>
            <input
              value={searchInput}
              placeholder={t.searchPlaceholder}
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </div>
          <div className="form-field">
            <label>{t.all}</label>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as ProjectStatusFilter)}
            >
              <option value="all">{t.all}</option>
              <option value="submitted">{t.submitted}</option>
              <option value="under_review">{t.underReview}</option>
              <option value="needs_revision">{t.needsRevision}</option>
              <option value="approved">{t.approved}</option>
              <option value="rejected">{t.rejected}</option>
            </select>
          </div>
        </div>

        <div className="plot-actions" style={{ marginTop: 12 }}>
          <button className="btn btn-ghost" type="button" onClick={() => setSearch(searchInput.trim())}>
            {t.searchBtn}
          </button>
          <button
            className="btn btn-ghost"
            type="button"
            onClick={() => {
              setSearchInput("");
              setSearch("");
              setStatusFilter("all");
            }}
          >
            {t.resetBtn}
          </button>
          <Link href={submitHref} className="btn btn-primary">
            {t.openSubmit}
          </Link>
        </div>
      </section>

      <section className="section">
        {loading ? (
          <ProjectSkeletonGrid />
        ) : (
          <div className="grid grid-3">
            {rows.length === 0 ? <div className="empty-state">{t.noData}</div> : null}
            {rows.map((project) => {
              const displayProject = localizeBusinessProject(lang, project);
              const tone = statusStyles[project.status];
              const coverUrl = getProjectCoverUrl(project);
              const translated = lang !== "EN" && hasBusinessProjectTranslation(lang, project);

              return (
                <article className="card project-card" key={project.id} id={`project-${project.id}`}>
                  <Link className="project-card-cover" href={`/projects/${project.id}`}>
                    <img src={coverUrl} alt={displayProject.companyName} loading="lazy" />
                    <span
                      className="badge project-card-status"
                      style={{ background: tone.bg, color: tone.color, border: "1px solid transparent" }}
                    >
                      {statusLabels[project.status]}
                    </span>
                  </Link>

                  <div className="project-card-body">
                    <div className="project-card-head">
                      <div className="project-card-title-row">
                        <div>
                          <div className="plot-id">{project.id}</div>
                          <h3 className="card-title">{displayProject.companyName}</h3>
                        </div>
                      </div>
                      <p className="project-card-pitch">{displayProject.businessOverview}</p>
                    </div>

                    <div className="project-card-tags">
                      <span>{displayProject.market}</span>
                      {displayProject.city ? <span>{displayProject.city}</span> : null}
                    </div>

                    <div className="project-card-metrics">
                      <div className="project-card-metric">
                        <span>{t.requested}</span>
                        <strong>
                          {displayProject.requestedAmount ? currency(displayProject.requestedAmount) : "-"}
                        </strong>
                      </div>
                      <div className="project-card-metric">
                        <span>{t.minTicket}</span>
                        <strong>
                          {displayProject.minimumTicket ? currency(displayProject.minimumTicket) : "-"}
                        </strong>
                      </div>
                    </div>

                    <p className="project-card-meta">
                      <strong>{t.traction}:</strong> {displayProject.traction}
                    </p>

                    {translated ? (
                      <p className="project-original-note">
                        <strong>{t.original}:</strong> {project.businessOverview}
                      </p>
                    ) : null}

                    {displayProject.moderationNote ? (
                      <div className="notice">{displayProject.moderationNote}</div>
                    ) : null}

                    <div className="plot-actions" style={{ marginTop: 4 }}>
                      <Link className="btn btn-primary" href={`/projects/${project.id}`}>
                        {t.details}
                      </Link>
                      <Link
                        className="btn btn-accent"
                        href={`/contacts?project=${encodeURIComponent(project.id)}#contact-form`}
                      >
                        {t.invest}
                      </Link>
                      <button
                        className="btn btn-ghost"
                        type="button"
                        onClick={() => void handleShare(displayProject)}
                      >
                        {t.share}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}


