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
      title: "Account access",
      sub: "Role-based authentication for investor, owner and administrator zones.",
    },
    KZ: {
      title: "Account access",
      sub: "Role-based authentication for investor, owner and administrator zones.",
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
