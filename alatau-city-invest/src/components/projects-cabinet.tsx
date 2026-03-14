"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { pickLang } from "@/lib/i18n";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { currency } from "@/lib/ui";
import { BusinessProject, BusinessProjectStatus } from "@/lib/types";

type ProjectStatusFilter = BusinessProjectStatus | "all";

const statusStyles: Record<BusinessProjectStatus, { bg: string; color: string }> = {
  submitted: { bg: "#E9F2FF", color: "#0A58B5" },
  under_review: { bg: "#FFF4D9", color: "#946500" },
  needs_revision: { bg: "#FFF0E5", color: "#A54B00" },
  approved: { bg: "#E7F7E7", color: "#1F7A39" },
  rejected: { bg: "#FDEBEC", color: "#B4232C" },
};

export function ProjectsCabinet() {
  const { lang } = useCurrentLanguage();
  const { status } = useSession();
  const [rows, setRows] = useState<BusinessProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ProjectStatusFilter>("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const t = pickLang(lang, {
    EN: {
      unauthorized: "Sign in to see your project cabinet.",
      title: "My project submissions",
      sub: "History of submitted projects, moderation statuses and reviewer notes.",
      total: "Total submissions",
      onReview: "On review",
      approved: "Approved",
      revisions: "Needs revision",
      requested: "Requested volume",
      all: "All statuses",
      submitted: "Submitted",
      underReview: "Under review",
      needsRevision: "Needs revision",
      rejected: "Rejected",
      searchPlaceholder: "Search by company or market",
      search: "Search",
      reset: "Reset",
      submitProject: "Submit new project",
      openMarketplace: "Open projects marketplace",
      projectList: "Submission list",
      noData: "No projects yet. Submit your first project to start moderation.",
      id: "ID",
      company: "Company",
      market: "Market",
      amount: "Requested",
      status: "Status",
      created: "Created",
      details: "Project details",
      founder: "Founder",
      minTicket: "Minimum ticket",
      website: "Website",
      city: "City",
      businessOverview: "Business overview",
      businessModel: "Business model",
      traction: "Prototype / first results",
      legalReadiness: "Legal readiness",
      financialForecasts: "Financial forecasts",
      investmentTerms: "Investment terms",
      moderationNote: "Moderator note",
      noModerationNote: "No note from moderator yet.",
      timeline: "Status timeline",
      submittedEvent: "Project submitted",
      reviewedEvent: "Latest moderation update",
      emptyRight: "Select a project from the list.",
      viewProjectsBoard: "View projects board",
    },
    RU: {
      unauthorized: "Войдите, чтобы увидеть кабинет проектов.",
      title: "Мои проектные заявки",
      sub: "История отправленных проектов, статусы модерации и комментарии проверяющего.",
      total: "Всего заявок",
      onReview: "На проверке",
      approved: "Одобрено",
      revisions: "Нужны правки",
      requested: "Объем запроса",
      all: "Все статусы",
      submitted: "Подан",
      underReview: "На модерации",
      needsRevision: "Нужны правки",
      rejected: "Отклонен",
      searchPlaceholder: "Поиск по компании или рынку",
      search: "Найти",
      reset: "Сброс",
      submitProject: "Подать новый проект",
      openMarketplace: "Открыть витрину проектов",
      projectList: "Список заявок",
      noData: "Пока нет проектов. Отправьте первую заявку на модерацию.",
      id: "ID",
      company: "Компания",
      market: "Рынок",
      amount: "Запрос",
      status: "Статус",
      created: "Создан",
      details: "Детали проекта",
      founder: "Основатель",
      minTicket: "Минимальный билет",
      website: "Сайт",
      city: "Город",
      businessOverview: "О чем бизнес",
      businessModel: "Бизнес-модель",
      traction: "Прототип / первые результаты",
      legalReadiness: "Юридическая готовность",
      financialForecasts: "Финансовые прогнозы",
      investmentTerms: "Условия инвестирования",
      moderationNote: "Комментарий модератора",
      noModerationNote: "Пока нет комментария модератора.",
      timeline: "История статуса",
      submittedEvent: "Проект отправлен",
      reviewedEvent: "Последнее обновление модерации",
      emptyRight: "Выберите проект из списка.",
      viewProjectsBoard: "Смотреть витрину проектов",
    },
    KZ: {
      unauthorized: "Жоба кабинетін көру үшін жүйеге кіріңіз.",
      title: "Менің жоба өтінімдерім",
      sub: "Жіберілген жобалар тарихы, модерация статустары және тексеруші түсіндірмелері.",
      total: "Өтінімдер саны",
      onReview: "Қаралуда",
      approved: "Мақұлданған",
      revisions: "Түзету қажет",
      requested: "Сұралған көлем",
      all: "Барлық статустар",
      submitted: "Жіберілді",
      underReview: "Модерацияда",
      needsRevision: "Түзету керек",
      rejected: "Қабылданбады",
      searchPlaceholder: "Компания немесе нарық бойынша іздеу",
      search: "Іздеу",
      reset: "Қалпына келтіру",
      submitProject: "Жаңа жоба жіберу",
      openMarketplace: "Жобалар витринасын ашу",
      projectList: "Өтінім тізімі",
      noData: "Әзірге жоба жоқ. Алғашқы өтініміңізді жіберіңіз.",
      id: "ID",
      company: "Компания",
      market: "Нарық",
      amount: "Сұраныс",
      status: "Статус",
      created: "Құрылған",
      details: "Жоба деректері",
      founder: "Құрушы",
      minTicket: "Минималды билет",
      website: "Сайт",
      city: "Қала",
      businessOverview: "Бизнес сипаттамасы",
      businessModel: "Бизнес-модель",
      traction: "Прототип / алғашқы нәтижелер",
      legalReadiness: "Заңдық дайындық",
      financialForecasts: "Қаржылық болжамдар",
      investmentTerms: "Инвестиция шарттары",
      moderationNote: "Модератор пікірі",
      noModerationNote: "Модератор пікірі әлі жоқ.",
      timeline: "Статус тарихы",
      submittedEvent: "Жоба жіберілді",
      reviewedEvent: "Соңғы модерация жаңартуы",
      emptyRight: "Тізімнен жобаны таңдаңыз.",
      viewProjectsBoard: "Жобалар витринасын қарау",
    },
  });

  const locale = lang === "RU" ? "ru-RU" : lang === "KZ" ? "kk-KZ" : "en-US";

  const statusLabels: Record<BusinessProjectStatus, string> = {
    submitted: t.submitted,
    under_review: t.underReview,
    needs_revision: t.needsRevision,
    approved: t.approved,
    rejected: t.rejected,
  };

  useEffect(() => {
    if (status !== "authenticated") {
      setRows([]);
      setSelectedId(null);
      return;
    }

    let ignore = false;

    const load = async () => {
      setLoading(true);
      const params = new URLSearchParams({
        scope: "mine",
        status: statusFilter,
        search,
      });

      const response = await fetch(`/api/projects?${params.toString()}`, { cache: "no-store" });
      if (!response.ok) {
        if (!ignore) {
          setRows([]);
          setSelectedId(null);
        }
        setLoading(false);
        return;
      }

      const payload = (await response.json()) as { data?: BusinessProject[] };
      const nextRows = payload.data ?? [];

      if (!ignore) {
        setRows(nextRows);
        setSelectedId((prev) => {
          if (prev && nextRows.some((item) => item.id === prev)) {
            return prev;
          }
          return nextRows[0]?.id ?? null;
        });
      }

      setLoading(false);
    };

    void load();

    return () => {
      ignore = true;
    };
  }, [search, status, statusFilter]);

  const metrics = useMemo(() => {
    return {
      total: rows.length,
      onReview: rows.filter((item) => item.status === "submitted" || item.status === "under_review")
        .length,
      approved: rows.filter((item) => item.status === "approved").length,
      revisions: rows.filter((item) => item.status === "needs_revision").length,
      requested: rows.reduce((sum, item) => sum + Number(item.requestedAmount ?? 0), 0),
    };
  }, [rows]);

  const selected = useMemo(
    () => rows.find((item) => item.id === selectedId) ?? null,
    [rows, selectedId]
  );

  if (status !== "authenticated") {
    return <section className="card empty-state">{t.unauthorized}</section>;
  }

  return (
    <>
      <section className="grid grid-4">
        <div className="kpi">
          <span className="muted">{t.total}</span>
          <strong>{metrics.total}</strong>
        </div>
        <div className="kpi">
          <span className="muted">{t.onReview}</span>
          <strong>{metrics.onReview}</strong>
        </div>
        <div className="kpi">
          <span className="muted">{t.approved}</span>
          <strong>{metrics.approved}</strong>
        </div>
        <div className="kpi">
          <span className="muted">{t.requested}</span>
          <strong>{currency(metrics.requested)}</strong>
        </div>
      </section>

      <section className="section card">
        <div className="section-title">
          <div>
            <h2>{t.title}</h2>
            <p>{t.sub}</p>
          </div>
          <div className="plot-actions">
            <Link className="btn btn-primary" href="/projects/submit">
              {t.submitProject}
            </Link>
            <Link className="btn btn-ghost" href="/projects">
              {t.openMarketplace}
            </Link>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label>{t.company}</label>
            <input
              placeholder={t.searchPlaceholder}
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </div>
          <div className="form-field">
            <label>{t.status}</label>
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
            {t.search}
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
            {t.reset}
          </button>
        </div>
      </section>

      <section className="section split" style={{ alignItems: "start" }}>
        <article className="card">
          <h3 className="card-title">{t.projectList}</h3>

          <div className="table-wrap" style={{ marginTop: 8 }}>
            <table>
              <thead>
                <tr>
                  <th>{t.id}</th>
                  <th>{t.company}</th>
                  <th>{t.market}</th>
                  <th>{t.amount}</th>
                  <th>{t.status}</th>
                  <th>{t.created}</th>
                </tr>
              </thead>
              <tbody>
                {!loading && rows.length === 0 ? (
                  <tr>
                    <td colSpan={6}>{t.noData}</td>
                  </tr>
                ) : (
                  rows.map((item) => (
                    <tr
                      key={item.id}
                      style={{
                        background: item.id === selectedId ? "#f7fbff" : "transparent",
                        cursor: "pointer",
                      }}
                      onClick={() => setSelectedId(item.id)}
                    >
                      <td>{item.id}</td>
                      <td>{item.companyName}</td>
                      <td>{item.market}</td>
                      <td>{item.requestedAmount ? currency(item.requestedAmount) : "-"}</td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            background: statusStyles[item.status].bg,
                            color: statusStyles[item.status].color,
                            border: "1px solid transparent",
                          }}
                        >
                          {statusLabels[item.status]}
                        </span>
                      </td>
                      <td>{new Date(item.createdAt).toLocaleDateString(locale)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className="card">
          {selected ? (
            <>
              <h3 className="card-title">{t.details}</h3>
              <div className="metric-line">
                <span className="muted">{t.company}</span>
                <strong>{selected.companyName}</strong>
              </div>
              <div className="metric-line">
                <span className="muted">{t.founder}</span>
                <strong>{selected.founderName}</strong>
              </div>
              <div className="metric-line">
                <span className="muted">{t.amount}</span>
                <strong>{selected.requestedAmount ? currency(selected.requestedAmount) : "-"}</strong>
              </div>
              <div className="metric-line">
                <span className="muted">{t.minTicket}</span>
                <strong>{selected.minimumTicket ? currency(selected.minimumTicket) : "-"}</strong>
              </div>
              <div className="metric-line">
                <span className="muted">{t.city}</span>
                <strong>{selected.city || "-"}</strong>
              </div>
              <div className="metric-line">
                <span className="muted">{t.website}</span>
                <strong>{selected.website || "-"}</strong>
              </div>

              <div style={{ marginTop: 10 }}>
                <p>
                  <strong>{t.businessOverview}:</strong> {selected.businessOverview}
                </p>
                <p>
                  <strong>{t.businessModel}:</strong> {selected.businessModel}
                </p>
                <p>
                  <strong>{t.traction}:</strong> {selected.traction}
                </p>
                <p>
                  <strong>{t.legalReadiness}:</strong> {selected.legalReadiness}
                </p>
                <p>
                  <strong>{t.financialForecasts}:</strong> {selected.financialForecasts}
                </p>
                <p>
                  <strong>{t.investmentTerms}:</strong> {selected.investmentTerms}
                </p>
              </div>

              <h4 style={{ marginTop: 12 }}>{t.moderationNote}</h4>
              <div className="notice" style={{ marginTop: 8 }}>
                {selected.moderationNote || t.noModerationNote}
              </div>

              <h4 style={{ marginTop: 12 }}>{t.timeline}</h4>
              <div className="roadmap" style={{ marginTop: 8 }}>
                <div className="road-step">
                  <span>{new Date(selected.createdAt).toLocaleDateString(locale)}</span>
                  <p>{t.submittedEvent}</p>
                </div>
                <div className="road-step">
                  <span>{new Date(selected.updatedAt ?? selected.createdAt).toLocaleDateString(locale)}</span>
                  <p>
                    {t.reviewedEvent}: {statusLabels[selected.status]}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">{t.emptyRight}</div>
          )}

          <div className="plot-actions" style={{ marginTop: 12 }}>
            <Link className="btn btn-ghost" href="/projects">
              {t.viewProjectsBoard}
            </Link>
          </div>
        </article>
      </section>
    </>
  );
}

