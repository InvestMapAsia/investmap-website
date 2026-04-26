"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ProjectSubmitForm } from "@/components/project-submit-form";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";

export default function ProjectSubmitPage() {
  const { lang } = useCurrentLanguage();
  const { status } = useSession();
  const t = pickLang(lang, {
    EN: {
      title: "Submit a project",
      sub: "Complete all criteria so investors can quickly evaluate business quality, legal readiness and terms.",
      loginTitle: "Sign in to submit your project",
      loginText:
        "Project creation is available only after login so every offer is connected to a verified account and moderation history.",
      login: "Login",
      back: "Back to projects",
      loading: "Checking session...",
    },
    RU: {
      title: "Подача проекта",
      sub: "Заполните все критерии, чтобы инвесторы быстро оценили качество бизнеса, юридическую готовность и условия.",
      loginTitle: "Войдите, чтобы подать проект",
      loginText:
        "Создание проекта доступно только после входа, чтобы каждое предложение было связано с проверенным аккаунтом и историей модерации.",
      login: "Войти",
      back: "К проектам",
      loading: "Проверяем сессию...",
    },
    KZ: {
      title: "Жобаны жіберу",
      sub: "Инвесторлар жоба сапасын, заңдық дайындығын және шарттарын тез бағалауы үшін барлық критерийді толтырыңыз.",
      loginTitle: "Жобаны жіберу үшін кіріңіз",
      loginText:
        "Жоба құру тек кіргеннен кейін қолжетімді, сонда әр ұсыныс тексерілген аккаунтпен және модерация тарихымен байланысады.",
      login: "Кіру",
      back: "Жобаларға оралу",
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
        <section className="auth-gate">
          <span className="landing-kicker">{t.title}</span>
          <h2>{t.loginTitle}</h2>
          <p>{t.loginText}</p>
          <div className="inline-actions">
            <Link className="btn btn-primary" href="/login?callbackUrl=/projects/submit">
              {t.login}
            </Link>
            <Link className="btn btn-ghost" href="/projects">
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
      <ProjectSubmitForm />
    </div>
  );
}
