"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { pickLang } from "@/lib/i18n";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { currency } from "@/lib/ui";
import { BusinessProject, BusinessProjectStatus } from "@/lib/types";

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

export function ProjectsMarketplace() {
  const { lang } = useCurrentLanguage();
  const { status: sessionStatus } = useSession();
  const [rows, setRows] = useState<ProjectRow[]>([]);
  const [statusFilter, setStatusFilter] = useState<ProjectStatusFilter>("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const t = pickLang(lang, {
    EN: {
      title: "Small business projects",
      sub: "Add and discover ordinary small projects that need investment: from idea to first traction.",
      create: "Submit a project",
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
    },
    RU: {
      title: "Малые бизнес-проекты",
      sub: "Размещайте и изучайте обычные небольшие проекты для инвестиций: от идеи до первых результатов.",
      create: "Подать проект",
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
    },
    KZ: {
      title: "Ша?ын бизнес жобалары",
      sub: "Инвестиция?а арнал?ан к?дімгі ша?ын жобаларды орналастыры?ыз ж?не ?ара?ыз: идеядан ал?аш?ы н?тижеге дейін.",
      create: "Жобаны жіберу",
      loginToSubmit: "Жіберу ?шін кіру",
      searchPlaceholder: "Компания, нары? немесе идея бойынша іздеу",
      all: "Барлы? статустар",
      submitted: "Жіберілді",
      underReview: "Модерацияда",
      needsRevision: "Т?зету керек",
      approved: "Ма??лданды",
      rejected: "?абылданбады",
      total: "Жобалар саны",
      approvedCount: "Ма??лдан?ан",
      reviewCount: "Модерацияда?ы",
      requested: "С?рал?ан инвестиция",
      minTicket: "Минималды билет",
      founder: "??рушы",
      market: "Нары?",
      model: "Бизнес-модель",
      traction: "Прототип / ал?аш?ы н?тиже",
      legal: "За?ды? дайынды?",
      forecast: "?аржылы? болжамдар",
      terms: "Инвестиция шарттары",
      noData: "Та?дал?ан с?згі бойынша жоба табылмады.",
      loadError: "Жобаларды ж?ктеу м?мкін болмады.",
      openSubmit: "Жіберу формасын ашу",
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

      const response = await fetch(`/api/projects?${params.toString()}`, { cache: "no-store" });
      if (!response.ok) {
        if (!ignore) {
          setRows([]);
          window.alert(t.loadError);
        }
        setLoading(false);
        return;
      }

      const payload = (await response.json()) as { data?: ProjectRow[] };
      if (!ignore) {
        setRows(payload.data ?? []);
      }
      setLoading(false);
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

  return (
    <>
      <section className="card">
        <div className="section-title">
          <div>
            <h2>{t.title}</h2>
            <p>{t.sub}</p>
          </div>
          <div className="plot-actions">
            <Link href="/projects/submit" className="btn btn-primary">
              {sessionStatus === "authenticated" ? t.create : t.loginToSubmit}
            </Link>
          </div>
        </div>

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
            Search
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
            Reset
          </button>
          <Link href="/projects/submit" className="btn btn-primary">
            {t.openSubmit}
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="grid grid-3">
          {!loading && rows.length === 0 ? <div className="empty-state">{t.noData}</div> : null}
          {rows.map((project) => {
            const tone = statusStyles[project.status];
            return (
              <article className="card plot-card" key={project.id}>
                <div className="plot-top">
                  <div>
                    <div className="plot-id">{project.id}</div>
                    <h3 className="card-title">{project.companyName}</h3>
                  </div>
                  <span
                    className="badge"
                    style={{ background: tone.bg, color: tone.color, border: "1px solid transparent" }}
                  >
                    {statusLabels[project.status]}
                  </span>
                </div>

                <div className="metric-line">
                  <span className="muted">{t.requested}</span>
                  <strong>{project.requestedAmount ? currency(project.requestedAmount) : "-"}</strong>
                </div>
                <div className="metric-line">
                  <span className="muted">{t.minTicket}</span>
                  <strong>{project.minimumTicket ? currency(project.minimumTicket) : "-"}</strong>
                </div>
                <div className="metric-line">
                  <span className="muted">{t.founder}</span>
                  <strong>{project.founderName}</strong>
                </div>

                <p>
                  <strong>{t.market}:</strong> {project.market}
                </p>
                <p>
                  <strong>{t.model}:</strong> {project.businessModel}
                </p>
                <p>
                  <strong>{t.traction}:</strong> {project.traction}
                </p>
                <p>
                  <strong>{t.legal}:</strong> {project.legalReadiness}
                </p>
                <p>
                  <strong>{t.forecast}:</strong> {project.financialForecasts}
                </p>
                <p>
                  <strong>{t.terms}:</strong> {project.investmentTerms}
                </p>

                {project.moderationNote ? <div className="notice">{project.moderationNote}</div> : null}
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
