"use client";

import { useEffect, useMemo, useState } from "react";
import { pickLang } from "@/lib/i18n";
import { useCurrentLanguage } from "@/lib/i18n-client";
import {
  Application,
  AuditLogItem,
  BusinessProject,
  BusinessProjectStatus,
  Plot,
  PlotStatus,
} from "@/lib/types";

const plotStatuses: PlotStatus[] = ["moderation", "available", "reserved", "legal_issue", "sold"];
const appStatuses: Application["status"][] = [
  "draft",
  "submitted",
  "kyc_aml",
  "legal_review",
  "approved",
  "rejected",
];
const projectStatuses: BusinessProjectStatus[] = [
  "submitted",
  "under_review",
  "needs_revision",
  "approved",
  "rejected",
];

type AdminApplicationRow = Application & {
  plotTitle: string;
  userEmail: string;
  userName: string;
  userId: string | null;
};

type AdminBusinessProjectRow = BusinessProject & {
  userEmail: string;
  userName: string;
  userId: string | null;
};

export function AdminQueuePanel() {
  const { lang } = useCurrentLanguage();
  const [queue, setQueue] = useState<Plot[]>([]);
  const [allPlots, setAllPlots] = useState<Plot[]>([]);
  const [applications, setApplications] = useState<AdminApplicationRow[]>([]);
  const [projects, setProjects] = useState<AdminBusinessProjectRow[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [projectNotes, setProjectNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const t = pickLang(lang, {
    EN: {
      moderationQueue: "Moderation queue",
      ownerListings: "Owner listings",
      appQueue: "Application queue",
      projectQueue: "Projects queue",
      auditEvents: "Audit events",
      queueTitle: "Plot moderation queue",
      queueSub: "Admin workflow for owner and platform listings.",
      id: "ID",
      plot: "Plot",
      ownerType: "Owner type",
      status: "Status",
      updated: "Updated",
      newStatus: "New status",
      queueEmpty: "Moderation queue is empty.",
      appTitle: "Application moderation",
      appSub: "Update application statuses and attach review notes for investor notifications.",
      investor: "Investor",
      amount: "Amount",
      reviewNote: "Review note",
      update: "Update",
      optionalNote: "Optional note",
      noApplications: "No applications to moderate.",
      projectTitle: "Projects moderation",
      projectSub: "Review business projects, update status and provide moderation notes.",
      company: "Company",
      market: "Market",
      requested: "Requested",
      founder: "Founder",
      moderationNote: "Moderation note",
      noProjects: "No projects yet.",
      auditTitle: "Audit log",
      auditSub: "Immutable operational trail for investor, owner and admin actions.",
      loadingAudit: "Loading audit data...",
      time: "Time",
      action: "Action",
      entity: "Entity",
      actorRole: "Actor role",
      actorUser: "Actor user",
      noAudit: "No audit events yet.",
      updatePlotError: "Failed to update plot status.",
      updateAppError: "Failed to update application status.",
      updateProjectError: "Failed to update project status.",
      statusDraft: "Draft",
      statusSubmitted: "Submitted",
      statusKyc: "KYC/AML",
      statusLegal: "Legal review",
      statusApproved: "Approved",
      statusRejected: "Rejected",
      plotAvailable: "Available",
      plotReserved: "Reserved",
      plotDeal: "In deal",
      plotModeration: "Moderation",
      plotSold: "Sold",
      plotLegalIssue: "Legal issue",
      projectSubmitted: "Submitted",
      projectUnderReview: "Under review",
      projectNeedsRevision: "Needs revision",
      projectApproved: "Approved",
      projectRejected: "Rejected",
    },
    RU: {
      moderationQueue: "Очередь модерации",
      ownerListings: "Листинги собственников",
      appQueue: "Очередь заявок",
      projectQueue: "Очередь проектов",
      auditEvents: "События аудита",
      queueTitle: "Модерация участков",
      queueSub: "Админ-процесс для листингов собственников и платформы.",
      id: "ID",
      plot: "Участок",
      ownerType: "Тип владельца",
      status: "Статус",
      updated: "Обновлено",
      newStatus: "Новый статус",
      queueEmpty: "Очередь модерации пуста.",
      appTitle: "Модерация заявок",
      appSub: "Обновляйте статусы заявок и добавляйте заметки для уведомлений инвестора.",
      investor: "Инвестор",
      amount: "Сумма",
      reviewNote: "Комментарий",
      update: "Обновление",
      optionalNote: "Необязательная заметка",
      noApplications: "Нет заявок для модерации.",
      projectTitle: "Модерация проектов",
      projectSub: "Проверяйте бизнес-проекты, меняйте статус и оставляйте комментарий модератора.",
      company: "Компания",
      market: "Рынок",
      requested: "Запрос",
      founder: "Основатель",
      moderationNote: "Комментарий модерации",
      noProjects: "Пока нет проектов.",
      auditTitle: "Журнал аудита",
      auditSub: "Неизменяемый операционный журнал действий инвесторов, владельцев и админов.",
      loadingAudit: "Загрузка данных аудита...",
      time: "Время",
      action: "Действие",
      entity: "Сущность",
      actorRole: "Роль",
      actorUser: "Пользователь",
      noAudit: "Событий аудита пока нет.",
      updatePlotError: "Не удалось обновить статус участка.",
      updateAppError: "Не удалось обновить статус заявки.",
      updateProjectError: "Не удалось обновить статус проекта.",
      statusDraft: "Черновик",
      statusSubmitted: "Подана",
      statusKyc: "KYC/AML",
      statusLegal: "Юр. проверка",
      statusApproved: "Одобрена",
      statusRejected: "Отклонена",
      plotAvailable: "Доступен",
      plotReserved: "Резерв",
      plotDeal: "В сделке",
      plotModeration: "Модерация",
      plotSold: "Продан",
      plotLegalIssue: "Юр. проблема",
      projectSubmitted: "Подан",
      projectUnderReview: "На проверке",
      projectNeedsRevision: "Нужны правки",
      projectApproved: "Одобрен",
      projectRejected: "Отклонен",
    },
    KZ: {
      moderationQueue: "Модерация кезегі",
      ownerListings: "Жер иесі листингтері",
      appQueue: "Өтінім кезегі",
      projectQueue: "Жобалар кезегі",
      auditEvents: "Аудит оқиғалары",
      queueTitle: "Учаскелер модерациясы",
      queueSub: "Жер иелері мен платформа листингтеріне арналған әкімші үдерісі.",
      id: "ID",
      plot: "Учаске",
      ownerType: "Иесі түрі",
      status: "Статус",
      updated: "Жаңартылды",
      newStatus: "Жаңа статус",
      queueEmpty: "Модерация кезегі бос.",
      appTitle: "Өтінім модерациясы",
      appSub: "Өтінім статустарын жаңартып, инвесторға ескертпе қалдырыңыз.",
      investor: "Инвестор",
      amount: "Сома",
      reviewNote: "Ескертпе",
      update: "Жаңарту",
      optionalNote: "Қосымша ескертпе",
      noApplications: "Модерацияға өтінім жоқ.",
      projectTitle: "Жобалар модерациясы",
      projectSub:
        "Кәдімгі бизнес-жобаларды қарап, статусын өзгертіп, модератор түсіндірмесін беріңіз.",
      company: "Компания",
      market: "Нарық",
      requested: "Сұраныс",
      founder: "Құрушы",
      moderationNote: "Модерация ескертпесі",
      noProjects: "Әзірге жобалар жоқ.",
      auditTitle: "Аудит журналы",
      auditSub: "Инвестор, жер иесі және әкімші әрекеттерінің өзгермейтін журналы.",
      loadingAudit: "Аудит деректері жүктелуде...",
      time: "Уақыт",
      action: "Әрекет",
      entity: "Нысан",
      actorRole: "Рөл",
      actorUser: "Пайдаланушы",
      noAudit: "Әзірге аудит оқиғалары жоқ.",
      updatePlotError: "Учаске статусын жаңарту сәтсіз.",
      updateAppError: "Өтінім статусын жаңарту сәтсіз.",
      updateProjectError: "Жоба статусын жаңарту сәтсіз.",
      statusDraft: "Бастапқы нұсқа",
      statusSubmitted: "Жіберілді",
      statusKyc: "KYC/AML",
      statusLegal: "Заң тексерісі",
      statusApproved: "Мақұлданды",
      statusRejected: "Қабылданбады",
      plotAvailable: "Қолжетімді",
      plotReserved: "Резерв",
      plotDeal: "Мәміледе",
      plotModeration: "Модерация",
      plotSold: "Сатылған",
      plotLegalIssue: "Заңдық мәселе",
      projectSubmitted: "Жіберілді",
      projectUnderReview: "Қаралуда",
      projectNeedsRevision: "Түзету керек",
      projectApproved: "Мақұлданды",
      projectRejected: "Қабылданбады",
    },
    CN: {
      moderationQueue: "审核队列",
      ownerListings: "业主 listing",
      appQueue: "申请队列",
      projectQueue: "项目队列",
      auditEvents: "审计事件",
      queueTitle: "地块审核队列",
      queueSub: "面向业主和平台 listing 的管理员流程。",
      id: "ID",
      plot: "地块",
      ownerType: "业主类型",
      status: "状态",
      updated: "更新时间",
      newStatus: "新状态",
      queueEmpty: "审核队列为空。",
      appTitle: "申请审核",
      appSub: "更新申请状态并添加审核备注，用于投资人通知。",
      investor: "投资人",
      amount: "金额",
      reviewNote: "审核备注",
      update: "更新",
      optionalNote: "可选备注",
      noApplications: "没有待审核申请。",
      projectTitle: "项目审核",
      projectSub: "审核商业项目、更新状态并提供审核备注。",
      company: "公司",
      market: "市场",
      requested: "融资需求",
      founder: "创始人",
      moderationNote: "审核备注",
      noProjects: "暂无项目。",
      auditTitle: "审计日志",
      auditSub: "投资人、业主和管理员操作的不可变记录。",
      loadingAudit: "审计数据加载中...",
      time: "时间",
      action: "操作",
      entity: "实体",
      actorRole: "角色",
      actorUser: "用户",
      noAudit: "暂无审计事件。",
      updatePlotError: "更新地块状态失败。",
      updateAppError: "更新申请状态失败。",
      updateProjectError: "更新项目状态失败。",
      statusDraft: "草稿",
      statusSubmitted: "已提交",
      statusKyc: "KYC/AML",
      statusLegal: "法律审核",
      statusApproved: "已批准",
      statusRejected: "已拒绝",
      plotAvailable: "可用",
      plotReserved: "已预留",
      plotDeal: "交易中",
      plotModeration: "审核中",
      plotSold: "已售出",
      plotLegalIssue: "法律问题",
      projectSubmitted: "已提交",
      projectUnderReview: "审核中",
      projectNeedsRevision: "需要修改",
      projectApproved: "已批准",
      projectRejected: "已拒绝",
    },
  });

  const locale = lang === "RU" ? "ru-RU" : lang === "KZ" ? "kk-KZ" : lang === "CN" ? "zh-CN" : "en-US";

  const plotStatusLabels: Record<PlotStatus, string> = {
    available: t.plotAvailable,
    reserved: t.plotReserved,
    deal: t.plotDeal,
    moderation: t.plotModeration,
    sold: t.plotSold,
    legal_issue: t.plotLegalIssue,
  };

  const appStatusLabels: Record<Application["status"], string> = {
    draft: t.statusDraft,
    submitted: t.statusSubmitted,
    kyc_aml: t.statusKyc,
    legal_review: t.statusLegal,
    approved: t.statusApproved,
    rejected: t.statusRejected,
  };

  const projectStatusLabels: Record<BusinessProjectStatus, string> = {
    submitted: t.projectSubmitted,
    under_review: t.projectUnderReview,
    needs_revision: t.projectNeedsRevision,
    approved: t.projectApproved,
    rejected: t.projectRejected,
  };

  const load = async () => {
    setLoading(true);
    const [queueRes, allRes, appRes, projectRes, auditRes] = await Promise.all([
      fetch("/api/admin/queue", { cache: "no-store" }),
      fetch("/api/plots?purpose=all&status=all&risk=all&price=all", { cache: "no-store" }),
      fetch("/api/admin/applications", { cache: "no-store" }),
      fetch("/api/admin/projects", { cache: "no-store" }),
      fetch("/api/admin/audit-logs", { cache: "no-store" }),
    ]);

    const queuePayload = (await queueRes.json()) as { data?: Plot[] };
    const allPayload = (await allRes.json()) as { data?: Plot[] };
    const appPayload = (await appRes.json()) as { data?: AdminApplicationRow[] };
    const projectPayload = (await projectRes.json()) as { data?: AdminBusinessProjectRow[] };
    const auditPayload = (await auditRes.json()) as { data?: AuditLogItem[] };

    setQueue(queuePayload.data ?? []);
    setAllPlots(allPayload.data ?? []);
    setApplications(appPayload.data ?? []);
    setProjects(projectPayload.data ?? []);
    setAuditLogs(auditPayload.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const metrics = useMemo(() => {
    return {
      moderation: queue.length,
      owner: allPlots.filter((plot) => plot.source === "owner").length,
      applicationsPending: applications.filter((item) =>
        ["submitted", "kyc_aml", "legal_review"].includes(item.status)
      ).length,
      projectsPending: projects.filter((item) =>
        ["submitted", "under_review", "needs_revision"].includes(item.status)
      ).length,
      auditEvents: auditLogs.length,
    };
  }, [allPlots, applications, auditLogs, projects, queue]);

  const updatePlotStatus = async (id: string, status: PlotStatus) => {
    const res = await fetch(`/api/plots/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      window.alert(t.updatePlotError);
      return;
    }

    await load();
  };

  const updateApplicationStatus = async (id: string, status: Application["status"]) => {
    const reviewNote = reviewNotes[id] ?? "";

    const res = await fetch(`/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, reviewNote }),
    });

    if (!res.ok) {
      const payload = (await res.json().catch(() => null)) as { error?: string } | null;
      window.alert(payload?.error || t.updateAppError);
      return;
    }

    await load();
  };

  const updateProjectStatus = async (id: string, status: BusinessProjectStatus) => {
    const moderationNote = projectNotes[id] ?? "";

    const res = await fetch(`/api/admin/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, moderationNote }),
    });

    if (!res.ok) {
      const payload = (await res.json().catch(() => null)) as { error?: string } | null;
      window.alert(payload?.error || t.updateProjectError);
      return;
    }

    await load();
  };

  return (
    <>
      <section
        className="grid"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", marginBottom: 8 }}
      >
        <div className="kpi">
          <span className="muted">{t.moderationQueue}</span>
          <strong>{metrics.moderation}</strong>
        </div>
        <div className="kpi">
          <span className="muted">{t.ownerListings}</span>
          <strong>{metrics.owner}</strong>
        </div>
        <div className="kpi">
          <span className="muted">{t.appQueue}</span>
          <strong>{metrics.applicationsPending}</strong>
        </div>
        <div className="kpi">
          <span className="muted">{t.projectQueue}</span>
          <strong>{metrics.projectsPending}</strong>
        </div>
        <div className="kpi">
          <span className="muted">{t.auditEvents}</span>
          <strong>{metrics.auditEvents}</strong>
        </div>
      </section>

      <section className="section card">
        <div className="section-title">
          <h2>{t.queueTitle}</h2>
          <p>{t.queueSub}</p>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t.id}</th>
                <th>{t.plot}</th>
                <th>{t.ownerType}</th>
                <th>{t.status}</th>
                <th>{t.updated}</th>
                <th>{t.newStatus}</th>
              </tr>
            </thead>
            <tbody>
              {queue.length ? (
                queue.map((plot) => (
                  <tr key={plot.id}>
                    <td>{plot.id}</td>
                    <td>{plot.title}</td>
                    <td>{plot.ownerType}</td>
                    <td>{plotStatusLabels[plot.status]}</td>
                    <td>{plot.updatedAt}</td>
                    <td>
                      <select
                        defaultValue={plot.status}
                        onChange={(event) =>
                          void updatePlotStatus(plot.id, event.target.value as PlotStatus)
                        }
                      >
                        {plotStatuses.map((status) => (
                          <option key={status} value={status}>
                            {plotStatusLabels[status]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>{t.queueEmpty}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section card">
        <div className="section-title">
          <h2>{t.appTitle}</h2>
          <p>{t.appSub}</p>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t.id}</th>
                <th>{t.plot}</th>
                <th>{t.investor}</th>
                <th>{t.amount}</th>
                <th>{t.status}</th>
                <th>{t.reviewNote}</th>
                <th>{t.update}</th>
              </tr>
            </thead>
            <tbody>
              {applications.length ? (
                applications.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                      {item.plotId} - {item.plotTitle}
                    </td>
                    <td>{item.userName || item.userEmail}</td>
                    <td>{item.amount}</td>
                    <td>{appStatusLabels[item.status]}</td>
                    <td>
                      <input
                        style={{ minWidth: 220 }}
                        value={reviewNotes[item.id] ?? item.reviewNote ?? ""}
                        onChange={(event) =>
                          setReviewNotes((prev) => ({ ...prev, [item.id]: event.target.value }))
                        }
                        placeholder={t.optionalNote}
                      />
                    </td>
                    <td>
                      <select
                        defaultValue={item.status}
                        onChange={(event) =>
                          void updateApplicationStatus(item.id, event.target.value as Application["status"])
                        }
                      >
                        {appStatuses.map((status) => (
                          <option key={status} value={status}>
                            {appStatusLabels[status]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>{t.noApplications}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section card">
        <div className="section-title">
          <h2>{t.projectTitle}</h2>
          <p>{t.projectSub}</p>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t.id}</th>
                <th>{t.company}</th>
                <th>{t.market}</th>
                <th>{t.requested}</th>
                <th>{t.founder}</th>
                <th>{t.status}</th>
                <th>{t.moderationNote}</th>
                <th>{t.update}</th>
              </tr>
            </thead>
            <tbody>
              {projects.length ? (
                projects.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.companyName}</td>
                    <td>{item.market}</td>
                    <td>{item.requestedAmount ?? "-"}</td>
                    <td>{item.userName || item.founderName}</td>
                    <td>{projectStatusLabels[item.status]}</td>
                    <td>
                      <input
                        style={{ minWidth: 220 }}
                        value={projectNotes[item.id] ?? item.moderationNote ?? ""}
                        onChange={(event) =>
                          setProjectNotes((prev) => ({ ...prev, [item.id]: event.target.value }))
                        }
                        placeholder={t.optionalNote}
                      />
                    </td>
                    <td>
                      <select
                        defaultValue={item.status}
                        onChange={(event) =>
                          void updateProjectStatus(item.id, event.target.value as BusinessProjectStatus)
                        }
                      >
                        {projectStatuses.map((status) => (
                          <option key={status} value={status}>
                            {projectStatusLabels[status]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8}>{t.noProjects}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section card">
        <div className="section-title">
          <h2>{t.auditTitle}</h2>
          <p>{t.auditSub}</p>
        </div>

        {loading ? (
          <div className="empty-state">{t.loadingAudit}</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{t.time}</th>
                  <th>{t.action}</th>
                  <th>{t.entity}</th>
                  <th>{t.actorRole}</th>
                  <th>{t.actorUser}</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.length ? (
                  auditLogs.slice(0, 40).map((log) => (
                    <tr key={log.id}>
                      <td>{new Date(log.createdAt).toLocaleString(locale)}</td>
                      <td>{log.action}</td>
                      <td>
                        {log.entityType}
                        {log.entityId ? ` - ${log.entityId}` : ""}
                      </td>
                      <td>{log.actorRole ?? "-"}</td>
                      <td>{log.actorUserId ?? "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>{t.noAudit}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
