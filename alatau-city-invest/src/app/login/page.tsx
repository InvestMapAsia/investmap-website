"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { LoginPanel } from "@/components/login-panel";
import { pickLang } from "@/lib/i18n";
import { useCurrentLanguage } from "@/lib/i18n-client";

function LoginPanelWithSearchParams() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? undefined;
  const verificationStatus = params.get("verified");
  const verificationReason = params.get("reason");

  return (
    <LoginPanel
      callbackUrl={callbackUrl}
      verificationStatus={verificationStatus === "1" || verificationStatus === "0" ? verificationStatus : null}
      verificationReason={verificationReason}
    />
  );
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
      sub: "Инвестор, жер иесі және әкімші аймақтарына арналған рөлдік аутентификация.",
    },
    CN: {
      title: "账户访问",
      sub: "面向投资者、业主和管理员区域的角色化认证。",
    },
  });

  return (
    <div className="container" style={{ maxWidth: 760 }}>
      <div
        className="section-title"
        style={{ textAlign: "center", flexDirection: "column", alignItems: "center", gap: 8 }}
      >
        <h2>{t.title}</h2>
        <p>{t.sub}</p>
      </div>
      <Suspense fallback={null}>
        <LoginPanelWithSearchParams />
      </Suspense>
    </div>
  );
}
