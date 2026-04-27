"use client";

import { AIAssistantPanel } from "@/components/ai-assistant-panel";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";

export default function AIAssistantPage() {
  const { lang } = useCurrentLanguage();
  const t = pickLang(lang, {
    EN: {
      title: "AI assistant",
      sub: "Get recommendations for ROI, risk profile, legal readiness and owner flow.",
    },
    RU: {
      title: "AI-ассистент",
      sub: "Получайте рекомендации по ROI, профилю риска, юридической готовности и сценарию собственника.",
    },
    KZ: {
      title: "AI-ассистент",
      sub: "ROI, тәуекел профилі, заңдық дайындық және жер иесі сценарийі бойынша ұсыныстар алыңыз.",
    },
    CN: {
      title: "AI 助手",
      sub: "获取关于 ROI、风险画像、法律准备度和业主流程的建议。",
    },
  });

  return (
    <div className="container" style={{ maxWidth: 980 }}>
      <div className="section-title">
        <h2>{t.title}</h2>
        <p>{t.sub}</p>
      </div>
      <AIAssistantPanel />
    </div>
  );
}
