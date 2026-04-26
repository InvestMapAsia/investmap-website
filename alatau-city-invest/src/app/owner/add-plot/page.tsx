"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { OwnerAddPlotForm } from "@/components/owner-add-plot-form";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";

export default function OwnerAddPlotPage() {
  const { lang } = useCurrentLanguage();
  const { status } = useSession();
  const t = pickLang(lang, {
    EN: {
      title: "Self-service plot placement",
      sub: "Owner onboarding flow with quality scoring, legal data and moderation submission.",
      loginTitle: "Sign in to register land",
      loginText:
        "Land registration is available only after login so the listing can be attached to the owner account, reviewed, and tracked in the cabinet.",
      login: "Login",
      back: "Back to catalog",
      loading: "Checking session...",
    },
    RU: {
      title: "Самостоятельное размещение участка",
      sub: "Сценарий для собственников: оценка качества, юридические данные и отправка на модерацию.",
      loginTitle: "Войдите, чтобы зарегистрировать землю",
      loginText:
        "Регистрация земли доступна только после входа, чтобы листинг был привязан к аккаунту владельца, прошел проверку и отслеживался в кабинете.",
      login: "Войти",
      back: "К каталогу",
      loading: "Проверяем сессию...",
    },
    KZ: {
      title: "Учаскені өз бетінше орналастыру",
      sub: "Жер иелеріне арналған ағын: сапа бағасы, заңдық деректер және модерацияға жіберу.",
      loginTitle: "Жерді тіркеу үшін кіріңіз",
      loginText:
        "Жер тіркеу тек кіргеннен кейін қолжетімді, сонда листинг иесінің аккаунтына байланып, тексеріліп, кабинетте бақыланады.",
      login: "Кіру",
      back: "Каталогқа оралу",
      loading: "Сессия тексерілуде...",
    },
  });

  if (status === "loading") {
    return (
      <div className="container" style={{ maxWidth: 980 }}>
        <div className="empty-state">{t.loading}</div>
      </div>
    );
  }

  if (status !== "authenticated") {
    return (
      <div className="container" style={{ maxWidth: 980 }}>
        <section className="auth-gate land-auth-gate">
          <span className="landing-kicker">{t.title}</span>
          <h2>{t.loginTitle}</h2>
          <p>{t.loginText}</p>
          <div className="inline-actions">
            <Link className="btn btn-primary" href="/login?callbackUrl=/owner/add-plot">
              {t.login}
            </Link>
            <Link className="btn btn-ghost" href="/catalog">
              {t.back}
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 980 }}>
      <div className="section-title">
        <h2>{t.title}</h2>
        <p>{t.sub}</p>
      </div>
      <OwnerAddPlotForm />
    </div>
  );
}
