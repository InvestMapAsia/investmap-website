"use client";

import { useEffect, useMemo, useState } from "react";
import { pickLang } from "@/lib/i18n";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { Application, AuditLogItem, Plot, PlotStatus } from "@/lib/types";

const plotStatuses: PlotStatus[] = ["moderation", "available", "reserved", "legal_issue", "sold"];
const appStatuses: Application["status"][] = [
  "draft",
  "submitted",
  "kyc_aml",
  "legal_review",
  "approved",
  "rejected",
];

type AdminApplicationRow = Application & {
  plotTitle: string;
  userEmail: string;
  userName: string;
  userId: string | null;
};

export function AdminQueuePanel() {
  const { lang } = useCurrentLanguage();
  const [queue, setQueue] = useState<Plot[]>([]);
  const [allPlots, setAllPlots] = useState<Plot[]>([]);
  const [applications, setApplications] = useState<AdminApplicationRow[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const t = pickLang(lang, {
    EN: {
      moderationQueue: "Moderation queue",
      ownerListings: "Owner listings",
      appQueue: "Application queue",
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
    },
    RU: {
      moderationQueue: "Очередь модерации",
      ownerListings: "Листинги собственников",
      appQueue: "Очередь заявок",
      auditEvents: "События аудита",
      queueTitle: "Модерация участков",
      queueSub: "Админ-процесс для листингов собственников и платформы.",
      id: "ID",
      plot: "Участок",
      ownerType: "Тип владельца",
      status: "Статус",
      updated: "Обновлён",
      newStatus: "Новый статус",
      queueEmpty: "Очередь модерации пуста.",
      appTitle: "Модерация заявок",
      appSub: "Обновляйте статусы заявок и добавляйте заметки для уведомления инвесторов.",
      investor: "Инвестор",
      amount: "Сумма",
      reviewNote: "Комментарий",
      update: "Обновление",
      optionalNote: "Необязательная заметка",
      noApplications: "Нет заявок для модерации.",
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
    },
    KZ: {
      moderationQueue: "Модерация кезегі",
      ownerListings: "Жер иелері листингтері",
      appQueue: "Өтінім кезегі",
      auditEvents: "Аудит оқиғалары",
      queueTitle: "Учаскелер модерациясы",
      queueSub: "Жер иелері және платформа листингтеріне арналған әкімші процесі.",
      id: "ID",
      plot: "Учаске",
      ownerType: "Иесі түрі",
      status: "Статус",
      updated: "Жаңартылды",
      newStatus: "Жаңа статус",
      queueEmpty: "Модерация кезегі бос.",
      appTitle: "Өтінім модерациясы",
      appSub: "Өтінім статустарын жаңартып, инвестор хабарламалары үшін ескертпе қосыңыз.",
      investor: "Инвестор",
      amount: "Сома",
      reviewNote: "Тексеру ескертпесі",
      update: "Жаңарту",
      optionalNote: "Қосымша ескертпе",
      noApplications: "Модерацияланатын өтінім жоқ.",
      auditTitle: "Аудит журналы",
      auditSub: "Инвестор, жер иесі және әкімші әрекеттерінің өзгермейтін журналы.",
      loadingAudit: "Аудит деректері жүктелуде...",
      time: "Уақыты",
      action: "Әрекет",
      entity: "Нысан",
      actorRole: "Рөл",
      actorUser: "Пайдаланушы",
      noAudit: "Әзірге аудит оқиғалары жоқ.",
      updatePlotError: "Учаске статусын жаңарту сәтсіз.",
      updateAppError: "Өтінім статусын жаңарту сәтсіз.",
      statusDraft: "Черновик",
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
    },
  });

  const locale = lang === "RU" ? "ru-RU" : lang === "KZ" ? "kk-KZ" : "en-US";

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

  const load = async () => {
    setLoading(true);
    const [queueRes, allRes, appRes, auditRes] = await Promise.all([
      fetch("/api/admin/queue", { cache: "no-store" }),
      fetch("/api/plots?purpose=all&status=all&risk=all&price=all", { cache: "no-store" }),
      fetch("/api/admin/applications", { cache: "no-store" }),
      fetch("/api/admin/audit-logs", { cache: "no-store" }),
    ]);

    const queuePayload = (await queueRes.json()) as { data?: Plot[] };
    const allPayload = (await allRes.json()) as { data?: Plot[] };
    const appPayload = (await appRes.json()) as { data?: AdminApplicationRow[] };
    const auditPayload = (await auditRes.json()) as { data?: AuditLogItem[] };

    setQueue(queuePayload.data ?? []);
    setAllPlots(allPayload.data ?? []);
    setApplications(appPayload.data ?? []);
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
      auditEvents: auditLogs.length,
    };
  }, [allPlots, applications, auditLogs, queue]);

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

  return (
    <>
      <section className="grid grid-4">
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
                      {item.plotId} · {item.plotTitle}
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
                          void updateApplicationStatus(
                            item.id,
                            event.target.value as Application["status"]
                          )
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
                        {log.entityId ? ` · ${log.entityId}` : ""}
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
