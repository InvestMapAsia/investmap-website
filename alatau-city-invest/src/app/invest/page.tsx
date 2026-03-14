"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { InvestForm } from "@/components/invest-form";
import { pickLang } from "@/lib/i18n";
import { useCurrentLanguage } from "@/lib/i18n-client";

function InvestFormWithSearchParams() {
  const searchParams = useSearchParams();
  const plot = searchParams.get("plot") ?? undefined;
  return <InvestForm plotId={plot} />;
}

export default function InvestPage() {
  const { lang } = useCurrentLanguage();
  const t = pickLang(lang, {
    EN: {
      title: "Investment application",
      sub: "Step-based workflow with legal confirmations and KYC/AML data capture.",
    },
    RU: {
      title: "Инвестиционная заявка",
      sub: "Пошаговый процесс с юридическими подтверждениями и сбором данных KYC/AML.",
    },
    KZ: {
      title: "Инвестициялық өтінім",
      sub: "Заңдық растаулар мен KYC/AML деректерін жинайтын қадамдық процесс.",
    },
  });

  return (
    <div className="container" style={{ maxWidth: 900 }}>
      <div className="section-title">
        <h2>{t.title}</h2>
        <p>{t.sub}</p>
      </div>
      <Suspense fallback={null}>
        <InvestFormWithSearchParams />
      </Suspense>
    </div>
  );
}
