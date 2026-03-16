"use client";

import { ProjectSubmitForm } from "@/components/project-submit-form";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";

export default function ProjectSubmitPage() {
  const { lang } = useCurrentLanguage();
  const t = pickLang(lang, {
    EN: {
      title: "Submit a project",
      sub: "Complete all criteria so investors can quickly evaluate business quality, legal readiness and terms.",
    },
    RU: {
      title: "Подача проекта",
      sub: "Заполните все критерии, чтобы инвесторы быстро оценили качество бизнеса, юридическую готовность и условия.",
    },
    KZ: {
      title: "Жобаны жіберу",
      sub: "Инвесторлар жоба сапасын, заңдық дайындығын және шарттарын тез бағалауы үшін барлық критерийді толтырыңыз.",
    },
  });

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

