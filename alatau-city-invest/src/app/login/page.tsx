"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { LoginPanel } from "@/components/login-panel";
import { pickLang } from "@/lib/i18n";
import { useCurrentLanguage } from "@/lib/i18n-client";

function LoginPanelWithSearchParams() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? undefined;
  return <LoginPanel callbackUrl={callbackUrl} />;
}

export default function LoginPage() {
  const { lang } = useCurrentLanguage();
  const t = pickLang(lang, {
    EN: {
      title: "Account access",
      sub: "Role-based authentication for investor, owner and administrator zones.",
    },
    RU: {
      title: "Доступ к аккаунту",
      sub: "Ролевая аутентификация для зон инвестора, собственника и администратора.",
    },
    KZ: {
      title: "Аккаунтқа кіру",
      sub: "Инвестор, жер иесі және әкімші аймақтарына рөлдік аутентификация.",
    },
  });

  return (
    <div className="container" style={{ maxWidth: 760 }}>
      <div className="section-title">
        <h2>{t.title}</h2>
        <p>{t.sub}</p>
      </div>
      <Suspense fallback={null}>
        <LoginPanelWithSearchParams />
      </Suspense>
    </div>
  );
}
