"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { PlotCard } from "@/components/plot-card";
import { FAVORITES_CHANGE_EVENT } from "@/lib/client-events";
import { pickLang } from "@/lib/i18n";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { currency } from "@/lib/ui";
import { Application, NotificationItem, Plot } from "@/lib/types";

export function InvestorDashboard() {
  const { lang } = useCurrentLanguage();
  const { data: session } = useSession();
  const [applications, setApplications] = useState<Application[]>([]);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [kycMessage, setKycMessage] = useState<string | null>(null);
  const [kycLoading, setKycLoading] = useState(false);
  const [emailPreview, setEmailPreview] = useState<string | null>(null);

  const t = pickLang(lang, {
    EN: {
      applicationsTotal: "Applications total",
      submittedNow: "Submitted now",
      pipelineAmount: "Pipeline amount",
      favorites: "Favorites",
      compliance: "Compliance",
      complianceSub: "Start KYC session before final deal execution.",
      startKyc: "Start KYC",
      starting: "Starting...",
      noProfile: "Please sign in with a complete profile first.",
      startKycFailed: "Failed to start KYC session.",
      kycStarted: "KYC session started.",
      provider: "Provider",
      session: "Session",
      notificationsTitle: "Notifications and email templates",
      notificationsSub: "In-app alerts with generated email body for critical workflow updates.",
      previewEmail: "Preview email",
      noNotifications: "No notifications yet.",
      emailPreview: "Email template preview",
      close: "Close",
      appHistory: "Application history",
      appHistorySub: "Status timeline from submission to closure.",
      date: "Date",
      amount: "Amount",
      plot: "Plot",
      investorType: "Investor type",
      status: "Status",
      noApplications: "No applications yet.",
      favoritePlots: "Favorite plots",
      favoriteSub: "Saved shortlist for quick compare and invest.",
      noFavorites: "No favorite plots yet.",
      statusDraft: "Draft",
      statusSubmitted: "Submitted",
      statusKyc: "KYC/AML",
      statusLegal: "Legal review",
      statusApproved: "Approved",
      statusRejected: "Rejected",
      typeIndividual: "Individual",
      typeCompany: "Company",
      typeFund: "Fund",
    },
    RU: {
      applicationsTotal: "Всего заявок",
      submittedNow: "Подано сейчас",
      pipelineAmount: "Сумма пайплайна",
      favorites: "Избранное",
      compliance: "Комплаенс",
      complianceSub: "Запустите KYC перед финальным оформлением сделки.",
      startKyc: "Запустить KYC",
      starting: "Запуск...",
      noProfile: "Сначала войдите с заполненным профилем.",
      startKycFailed: "Не удалось запустить KYC-сессию.",
      kycStarted: "KYC-сессия запущена.",
      provider: "Провайдер",
      session: "Сессия",
      notificationsTitle: "Уведомления и email-шаблоны",
      notificationsSub:
        "Внутренние уведомления и сгенерированные письма для важных этапов процесса.",
      previewEmail: "Предпросмотр письма",
      noNotifications: "Пока нет уведомлений.",
      emailPreview: "Предпросмотр email-шаблона",
      close: "Закрыть",
      appHistory: "История заявок",
      appHistorySub: "Таймлайн статусов от подачи до завершения.",
      date: "Дата",
      amount: "Сумма",
      plot: "Участок",
      investorType: "Тип инвестора",
      status: "Статус",
      noApplications: "Пока нет заявок.",
      favoritePlots: "Избранные участки",
      favoriteSub: "Сохраненный шорт-лист для быстрого сравнения и инвестирования.",
      noFavorites: "Пока нет избранных участков.",
      statusDraft: "Черновик",
      statusSubmitted: "Подана",
      statusKyc: "KYC/AML",
      statusLegal: "Юр. проверка",
      statusApproved: "Одобрена",
      statusRejected: "Отклонена",
      typeIndividual: "Физлицо",
      typeCompany: "Компания",
      typeFund: "Фонд",
    },
    KZ: {
      applicationsTotal: "Өтінімдер саны",
      submittedNow: "Қазір жіберілген",
      pipelineAmount: "Пайплайн сомасы",
      favorites: "Таңдаулылар",
      compliance: "Комплаенс",
      complianceSub: "Мәміле алдында KYC сессиясын бастаңыз.",
      startKyc: "KYC бастау",
      starting: "Басталуда...",
      noProfile: "Алдымен толық профиліңізбен кіріңіз.",
      startKycFailed: "KYC сессиясын бастау сәтсіз аяқталды.",
      kycStarted: "KYC сессиясы басталды.",
      provider: "Провайдер",
      session: "Сессия",
      notificationsTitle: "Хабарламалар және email үлгілері",
      notificationsSub: "Маңызды кезеңдер үшін ішкі хабарламалар және жасалған email мәтіндері.",
      previewEmail: "Email алдын ала көру",
      noNotifications: "Әзірге хабарламалар жоқ.",
      emailPreview: "Email үлгісін алдын ала көру",
      close: "Жабу",
      appHistory: "Өтінім тарихы",
      appHistorySub: "Жіберуден жабуға дейінгі статус таймлайны.",
      date: "Күні",
      amount: "Сома",
      plot: "Учаске",
      investorType: "Инвестор түрі",
      status: "Статус",
      noApplications: "Әзірге өтінімдер жоқ.",
      favoritePlots: "Таңдаулы учаскелер",
      favoriteSub: "Жылдам салыстыру және инвестициялау үшін сақталған тізім.",
      noFavorites: "Әзірге таңдаулы учаскелер жоқ.",
      statusDraft: "Бастапқы нұсқа",
      statusSubmitted: "Жіберілді",
      statusKyc: "KYC/AML",
      statusLegal: "Заң тексерісі",
      statusApproved: "Мақұлданды",
      statusRejected: "Қабылданбады",
      typeIndividual: "Жеке тұлға",
      typeCompany: "Компания",
      typeFund: "Қор",
    },
  });

  const locale = lang === "RU" ? "ru-RU" : lang === "KZ" ? "kk-KZ" : "en-US";

  const appStatusLabel: Record<Application["status"], string> = {
    draft: t.statusDraft,
    submitted: t.statusSubmitted,
    kyc_aml: t.statusKyc,
    legal_review: t.statusLegal,
    approved: t.statusApproved,
    rejected: t.statusRejected,
  };

  const investorTypeLabel: Record<Application["investorType"], string> = {
    individual: t.typeIndividual,
    company: t.typeCompany,
    fund: t.typeFund,
  };

  useEffect(() => {
    async function load() {
      const [applicationsRes, plotsRes] = await Promise.all([
        fetch("/api/applications", { cache: "no-store" }),
        fetch("/api/plots?purpose=all&status=all&risk=all&price=all&sort=roi_desc"),
      ]);

      const applicationsPayload = (await applicationsRes.json()) as {
        data?: Application[];
        error?: string;
      };
      const plotsPayload = (await plotsRes.json()) as { data: Plot[] };

      setApplications(applicationsPayload.data ?? []);
      setPlots(plotsPayload.data);

      if (session?.user?.id) {
        const [favoriteRes, notificationRes] = await Promise.all([
          fetch("/api/favorites", { cache: "no-store" }),
          fetch("/api/notifications", { cache: "no-store" }),
        ]);

        if (favoriteRes.ok) {
          const favoritePayload = (await favoriteRes.json()) as { data: string[] };
          setFavoriteIds(favoritePayload.data);
        } else {
          setFavoriteIds([]);
        }

        if (notificationRes.ok) {
          const notificationPayload = (await notificationRes.json()) as {
            data: NotificationItem[];
          };
          setNotifications(notificationPayload.data);
        } else {
          setNotifications([]);
        }
      } else {
        setFavoriteIds(JSON.parse(localStorage.getItem("aci_favorites") ?? "[]") as string[]);
        setNotifications([]);
      }
    }

    void load();
  }, [session?.user?.id]);

  useEffect(() => {
    const syncFavorites = async () => {
      if (session?.user?.id) {
        const response = await fetch("/api/favorites", { cache: "no-store" });
        if (!response.ok) return;
        const payload = (await response.json()) as { data: string[] };
        setFavoriteIds(payload.data);
        return;
      }

      setFavoriteIds(JSON.parse(localStorage.getItem("aci_favorites") ?? "[]") as string[]);
    };

    const onFavoriteChange = () => {
      void syncFavorites();
    };

    window.addEventListener(FAVORITES_CHANGE_EVENT, onFavoriteChange);
    window.addEventListener("storage", onFavoriteChange);

    return () => {
      window.removeEventListener(FAVORITES_CHANGE_EVENT, onFavoriteChange);
      window.removeEventListener("storage", onFavoriteChange);
    };
  }, [session?.user?.id]);

  const totalAmount = useMemo(
    () => applications.reduce((sum, app) => sum + Number(app.amount), 0),
    [applications]
  );

  const favorites = useMemo(
    () => plots.filter((plot) => favoriteIds.includes(plot.id)),
    [plots, favoriteIds]
  );

  const startKyc = async () => {
    if (!session?.user?.name) {
      setKycMessage(t.noProfile);
      return;
    }

    setKycLoading(true);

    const response = await fetch("/api/integrations/kyc/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: session.user.name }),
    });

    setKycLoading(false);

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setKycMessage(payload?.error || t.startKycFailed);
      return;
    }

    const payload = (await response.json()) as {
      data: { provider: string; sessionId: string; redirectUrl: string; status: string };
    };

    setKycMessage(
      `${t.kycStarted} ${t.provider}: ${payload.data.provider}, ${t.session}: ${payload.data.sessionId}.`
    );
  };

  return (
    <>
      <section className="grid grid-4">
        <div className="kpi">
          <span className="muted">{t.applicationsTotal}</span>
          <strong>{applications.length}</strong>
        </div>
        <div className="kpi">
          <span className="muted">{t.submittedNow}</span>
          <strong>{applications.filter((item) => item.status === "submitted").length}</strong>
        </div>
        <div className="kpi">
          <span className="muted">{t.pipelineAmount}</span>
          <strong>{currency(totalAmount)}</strong>
        </div>
        <div className="kpi">
          <span className="muted">{t.favorites}</span>
          <strong>{favoriteIds.length}</strong>
        </div>
      </section>

      <section className="section card">
        <div className="section-title">
          <h2>{t.compliance}</h2>
          <p>{t.complianceSub}</p>
        </div>
        <div className="plot-actions">
          <button className="btn btn-primary" type="button" onClick={() => void startKyc()}>
            {kycLoading ? t.starting : t.startKyc}
          </button>
          <Link className="btn btn-ghost" href="/cabinet/projects">
            {lang === "RU" ? "Кабинет проектов" : lang === "KZ" ? "Жоба кабинеті" : "Project cabinet"}
          </Link>
          <Link className="btn btn-ghost" href="/projects/submit">
            {lang === "RU" ? "Подать проект" : lang === "KZ" ? "Жоба жіберу" : "Submit project"}
          </Link>
        </div>
        {kycMessage ? (
          <p className="muted" style={{ marginTop: 10 }}>
            {kycMessage}
          </p>
        ) : null}
      </section>

      <section className="section card">
        <div className="section-title">
          <h2>{t.notificationsTitle}</h2>
          <p>{t.notificationsSub}</p>
        </div>

        {notifications.length ? (
          <div className="grid" style={{ gap: 10 }}>
            {notifications.slice(0, 10).map((item) => (
              <article className="card" key={item.id}>
                <strong>{item.title}</strong>
                <p className="muted" style={{ marginTop: 4 }}>
                  {item.message}
                </p>
                <div className="plot-actions" style={{ marginTop: 8 }}>
                  <span className="muted" style={{ fontSize: "0.78rem" }}>
                    {new Date(item.createdAt).toLocaleString(locale)}
                  </span>
                  {item.emailHtml ? (
                    <button
                      className="btn btn-ghost"
                      type="button"
                      onClick={() => setEmailPreview(item.emailHtml ?? null)}
                    >
                      {t.previewEmail}
                    </button>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">{t.noNotifications}</div>
        )}
      </section>

      {emailPreview ? (
        <section className="section card">
          <div className="section-title">
            <h2>{t.emailPreview}</h2>
            <button className="btn btn-ghost" type="button" onClick={() => setEmailPreview(null)}>
              {t.close}
            </button>
          </div>
          <div
            style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}
            dangerouslySetInnerHTML={{ __html: emailPreview }}
          />
        </section>
      ) : null}

      <section className="section card">
        <div className="section-title">
          <h2>{t.appHistory}</h2>
          <p>{t.appHistorySub}</p>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>{t.plot}</th>
                <th>{t.investorType}</th>
                <th>{t.amount}</th>
                <th>{t.status}</th>
                <th>{t.date}</th>
              </tr>
            </thead>
            <tbody>
              {applications.length ? (
                applications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.id}</td>
                    <td>{app.plotId}</td>
                    <td>{investorTypeLabel[app.investorType]}</td>
                    <td>{currency(app.amount)}</td>
                    <td>{appStatusLabel[app.status]}</td>
                    <td>{new Date(app.createdAt).toLocaleDateString(locale)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>{t.noApplications}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <h2>{t.favoritePlots}</h2>
          <p>{t.favoriteSub}</p>
        </div>
        <div className="grid grid-3">
          {favorites.length ? (
            favorites.map((plot) => <PlotCard key={plot.id} plot={plot} />)
          ) : (
            <div className="empty-state">{t.noFavorites}</div>
          )}
        </div>
      </section>
    </>
  );
}

