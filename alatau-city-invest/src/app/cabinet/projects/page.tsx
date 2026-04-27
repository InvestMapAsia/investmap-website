"use client";

import { ProjectsCabinet } from "@/components/projects-cabinet";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";

export default function ProjectsCabinetPage() {
  const { lang } = useCurrentLanguage();
  const t = pickLang(lang, {
    EN: {
      title: "Project cabinet",
      sub: "A single place for your submissions, moderation statuses and reviewer comments.",
    },
    RU: {
      title: "Кабинет проектов",
      sub: "Единое место для ваших заявок, статусов модерации и комментариев проверяющего.",
    },
    KZ: {
      title: "Жоба кабинеті",
      sub: "Өтінімдеріңіз, модерация статустары және тексеруші пікірлері бір жерде.",
    },
    CN: {
      title: "项目柜台",
      sub: "集中查看您的提交、审核状态和审核意见。",
    },
  });

  return (
    <div className="container">
      <div className="section-title">
        <h2>{t.title}</h2>
        <p>{t.sub}</p>
      </div>
      <ProjectsCabinet />
    </div>
  );
}

