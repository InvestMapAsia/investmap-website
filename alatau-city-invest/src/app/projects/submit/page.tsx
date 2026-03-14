"use client";

import { ProjectSubmitForm } from "@/components/project-submit-form";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";

export default function ProjectSubmitPage() {
  const { lang } = useCurrentLanguage();
  const t = pickLang(lang, {
    EN: {
      title: "Submit a small project",
      sub: "Complete all criteria so investors can quickly evaluate business quality, legal readiness and terms.",
    },
    RU: {
      title: "Подача малого проекта",
      sub: "Заполните все критерии, чтобы инвесторы быстро оценили качество бизнеса, юридическую готовность и условия.",
    },
    KZ: {
      title: "Ша?ын жобаны жіберу",
      sub: "Инвесторлар жоба сапасын, за?ды? дайынды?ын ж?не шарттарын тез ба?алауы ?шін барлы? критерийді толтыры?ыз.",
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
