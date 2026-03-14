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
      applicationsTotal: "Р’СЃРµРіРѕ Р·Р°СЏРІРѕРє",
      submittedNow: "РџРѕРґР°РЅРѕ СЃРµР№С‡Р°СЃ",
      pipelineAmount: "РЎСѓРјРјР° РїР°Р№РїР»Р°Р№РЅР°",
      favorites: "РР·Р±СЂР°РЅРЅРѕРµ",
      compliance: "РљРѕРјРїР»Р°РµРЅСЃ",
      complianceSub: "Р—Р°РїСѓСЃС‚РёС‚Рµ KYC РїРµСЂРµРґ С„РёРЅР°Р»СЊРЅС‹Рј РѕС„РѕСЂРјР»РµРЅРёРµРј СЃРґРµР»РєРё.",
      startKyc: "Р—Р°РїСѓСЃС‚РёС‚СЊ KYC",
      starting: "Р—Р°РїСѓСЃРє...",
      noProfile: "РЎРЅР°С‡Р°Р»Р° РІРѕР№РґРёС‚Рµ СЃ Р·Р°РїРѕР»РЅРµРЅРЅС‹Рј РїСЂРѕС„РёР»РµРј.",
      startKycFailed: "РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РїСѓСЃС‚РёС‚СЊ KYC-СЃРµСЃСЃРёСЋ.",
      kycStarted: "KYC-СЃРµСЃСЃРёСЏ Р·Р°РїСѓС‰РµРЅР°.",
      provider: "РџСЂРѕРІР°Р№РґРµСЂ",
      session: "РЎРµСЃСЃРёСЏ",
      notificationsTitle: "РЈРІРµРґРѕРјР»РµРЅРёСЏ Рё email-С€Р°Р±Р»РѕРЅС‹",
      notificationsSub: "Р’РЅСѓС‚СЂРµРЅРЅРёРµ СѓРІРµРґРѕРјР»РµРЅРёСЏ Рё СЃРіРµРЅРµСЂРёСЂРѕРІР°РЅРЅС‹Рµ РїРёСЃСЊРјР° РґР»СЏ РІР°Р¶РЅС‹С… СЌС‚Р°РїРѕРІ РїСЂРѕС†РµСЃСЃР°.",
      previewEmail: "РџСЂРµРґРїСЂРѕСЃРјРѕС‚СЂ РїРёСЃСЊРјР°",
      noNotifications: "РџРѕРєР° РЅРµС‚ СѓРІРµРґРѕРјР»РµРЅРёР№.",
      emailPreview: "РџСЂРµРґРїСЂРѕСЃРјРѕС‚СЂ email-С€Р°Р±Р»РѕРЅР°",
      close: "Р—Р°РєСЂС‹С‚СЊ",
      appHistory: "РСЃС‚РѕСЂРёСЏ Р·Р°СЏРІРѕРє",
      appHistorySub: "РўР°Р№РјР»Р°Р№РЅ СЃС‚Р°С‚СѓСЃРѕРІ РѕС‚ РїРѕРґР°С‡Рё РґРѕ Р·Р°РІРµСЂС€РµРЅРёСЏ.",
      date: "Р”Р°С‚Р°",
      amount: "РЎСѓРјРјР°",
      plot: "РЈС‡Р°СЃС‚РѕРє",
      investorType: "РўРёРї РёРЅРІРµСЃС‚РѕСЂР°",
      status: "РЎС‚Р°С‚СѓСЃ",
      noApplications: "РџРѕРєР° РЅРµС‚ Р·Р°СЏРІРѕРє.",
      favoritePlots: "РР·Р±СЂР°РЅРЅС‹Рµ СѓС‡Р°СЃС‚РєРё",
      favoriteSub: "РЎРѕС…СЂР°РЅС‘РЅРЅС‹Р№ С€РѕСЂС‚-Р»РёСЃС‚ РґР»СЏ Р±С‹СЃС‚СЂРѕРіРѕ СЃСЂР°РІРЅРµРЅРёСЏ Рё РёРЅРІРµСЃС‚РёСЂРѕРІР°РЅРёСЏ.",
      noFavorites: "РџРѕРєР° РЅРµС‚ РёР·Р±СЂР°РЅРЅС‹С… СѓС‡Р°СЃС‚РєРѕРІ.",
      statusDraft: "Р§РµСЂРЅРѕРІРёРє",
      statusSubmitted: "РџРѕРґР°РЅР°",
      statusKyc: "KYC/AML",
      statusLegal: "Р®СЂ. РїСЂРѕРІРµСЂРєР°",
      statusApproved: "РћРґРѕР±СЂРµРЅР°",
      statusRejected: "РћС‚РєР»РѕРЅРµРЅР°",
      typeIndividual: "Р¤РёР·Р»РёС†Рѕ",
      typeCompany: "РљРѕРјРїР°РЅРёСЏ",
      typeFund: "Р¤РѕРЅРґ",
    },
    KZ: {
      applicationsTotal: "УЁС‚С–РЅС–РјРґРµСЂ СЃР°РЅС‹",
      submittedNow: "ТљР°Р·С–СЂ Р¶С–Р±РµСЂС–Р»РіРµРЅ",
      pipelineAmount: "РџР°Р№РїР»Р°Р№РЅ СЃРѕРјР°СЃС‹",
      favorites: "РўР°ТЈРґР°СѓР»С‹Р»Р°СЂ",
      compliance: "РљРѕРјРїР»Р°РµРЅСЃ",
      complianceSub: "РњУ™РјС–Р»Рµ Р°Р»РґС‹РЅРґР° KYC СЃРµСЃСЃРёСЏСЃС‹РЅ Р±Р°СЃС‚Р°ТЈС‹Р·.",
      startKyc: "KYC Р±Р°СЃС‚Р°Сѓ",
      starting: "Р‘Р°СЃС‚Р°Р»СѓРґР°...",
      noProfile: "РђР»РґС‹РјРµРЅ С‚РѕР»С‹Т› РїСЂРѕС„РёР»РјРµРЅ РєС–СЂС–ТЈС–Р·.",
      startKycFailed: "KYC СЃРµСЃСЃРёСЏСЃС‹РЅ Р±Р°СЃС‚Р°Сѓ СЃУ™С‚СЃС–Р· Р°СЏТ›С‚Р°Р»РґС‹.",
      kycStarted: "KYC СЃРµСЃСЃРёСЏСЃС‹ Р±Р°СЃС‚Р°Р»РґС‹.",
      provider: "РџСЂРѕРІР°Р№РґРµСЂ",
      session: "РЎРµСЃСЃРёСЏ",
      notificationsTitle: "РҐР°Р±Р°СЂР»Р°РјР°Р»Р°СЂ Р¶У™РЅРµ email ТЇР»РіС–Р»РµСЂС–",
      notificationsSub: "РњР°ТЈС‹Р·РґС‹ РєРµР·РµТЈРґРµСЂ ТЇС€С–РЅ С–С€РєС– С…Р°Р±Р°СЂР»Р°РјР°Р»Р°СЂ Р¶У™РЅРµ Р¶Р°СЃР°Р»Т“Р°РЅ email РјУ™С‚С–РЅРґРµСЂС–.",
      previewEmail: "Email Р°Р»РґС‹РЅ Р°Р»Р° РєУ©СЂСѓ",
      noNotifications: "УР·С–СЂРіРµ С…Р°Р±Р°СЂР»Р°РјР°Р»Р°СЂ Р¶РѕТ›.",
      emailPreview: "Email ТЇР»РіС–СЃС–РЅ Р°Р»РґС‹РЅ Р°Р»Р° РєУ©СЂСѓ",
      close: "Р–Р°Р±Сѓ",
      appHistory: "УЁС‚С–РЅС–Рј С‚Р°СЂРёС…С‹",
      appHistorySub: "Р–С–Р±РµСЂСѓРґРµРЅ Р¶Р°Р±СѓТ“Р° РґРµР№С–РЅРіС– СЃС‚Р°С‚СѓСЃ С‚Р°Р№РјР»Р°Р№РЅС‹.",
      date: "РљТЇРЅС–",
      amount: "РЎРѕРјР°",
      plot: "РЈС‡Р°СЃРєРµ",
      investorType: "РРЅРІРµСЃС‚РѕСЂ С‚ТЇСЂС–",
      status: "РЎС‚Р°С‚СѓСЃ",
      noApplications: "УР·С–СЂРіРµ У©С‚С–РЅС–РјРґРµСЂ Р¶РѕТ›.",
      favoritePlots: "РўР°ТЈРґР°СѓР»С‹ СѓС‡Р°СЃРєРµР»РµСЂ",
      favoriteSub: "Р–С‹Р»РґР°Рј СЃР°Р»С‹СЃС‚С‹СЂСѓ Р¶У™РЅРµ РёРЅРІРµСЃС‚РёС†РёСЏР»Р°Сѓ ТЇС€С–РЅ СЃР°Т›С‚Р°Р»Т“Р°РЅ С‚С–Р·С–Рј.",
      noFavorites: "УР·С–СЂРіРµ С‚Р°ТЈРґР°СѓР»С‹ СѓС‡Р°СЃРєРµР»РµСЂ Р¶РѕТ›.",
      statusDraft: "Р§РµСЂРЅРѕРІРёРє",
      statusSubmitted: "Р–С–Р±РµСЂС–Р»РґС–",
      statusKyc: "KYC/AML",
      statusLegal: "Р—Р°ТЈ С‚РµРєСЃРµСЂС–СЃС–",
      statusApproved: "РњР°Т›Т±Р»РґР°РЅРґС‹",
      statusRejected: "ТљР°Р±С‹Р»РґР°РЅР±Р°РґС‹",
      typeIndividual: "Р–РµРєРµ С‚Т±Р»Т“Р°",
      typeCompany: "РљРѕРјРїР°РЅРёСЏ",
      typeFund: "ТљРѕСЂ",
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
            {lang === "RU" ? "РљР°Р±РёРЅРµС‚ РїСЂРѕРµРєС‚РѕРІ" : lang === "KZ" ? "Р–РѕР±Р° РєР°Р±РёРЅРµС‚С–" : "Project cabinet"}
          </Link>
          <Link className="btn btn-ghost" href="/projects/submit">
            {lang === "RU" ? "РџРѕРґР°С‚СЊ РїСЂРѕРµРєС‚" : lang === "KZ" ? "Р–РѕР±Р° Р¶С–Р±РµСЂСѓ" : "Submit project"}
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

