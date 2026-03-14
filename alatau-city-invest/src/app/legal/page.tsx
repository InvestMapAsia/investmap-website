"use client";

import { LegalAcceptPanel } from "@/components/legal-accept-panel";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";

export default function LegalPage() {
  const { lang } = useCurrentLanguage();
  const t = pickLang(lang, {
    EN: {
      title: "Legal framework",
      sub: "Transparent policy stack: user agreement, privacy, AML/KYC controls and investment risk disclosure.",
      ua: "User agreement",
      uaText:
        "Defines platform roles, listing and application rules, moderation mechanics and transaction boundaries.",
      privacy: "Privacy policy",
      privacyText:
        "Explains personal data handling, retention periods, legal basis and user rights.",
      aml: "AML/KYC policy",
      amlText:
        "Mandatory investor identity verification and source-of-funds controls before deal closure.",
      risk: "Investment risk disclosure",
      riskText: "Land investments carry legal, market and infrastructure execution risk.",
    },
    RU: {
      title: "Правовая база",
      sub: "Прозрачный набор политик: пользовательское соглашение, приватность, AML/KYC и раскрытие инвестиционных рисков.",
      ua: "Пользовательское соглашение",
      uaText:
        "Определяет роли на платформе, правила листинга и заявок, механику модерации и границы сделок.",
      privacy: "Политика конфиденциальности",
      privacyText: "Описывает обработку персональных данных, сроки хранения, правовые основания и права пользователя.",
      aml: "Политика AML/KYC",
      amlText: "Обязательная идентификация инвестора и проверка источника средств до закрытия сделки.",
      risk: "Раскрытие инвестиционных рисков",
      riskText: "Инвестиции в землю несут юридические, рыночные и инфраструктурные риски исполнения.",
    },
    KZ: {
      title: "Құқықтық негіз",
      sub: "Ашық саясаттар жиынтығы: пайдаланушы келісімі, құпиялылық, AML/KYC бақылауы және инвестициялық тәуекелдер.",
      ua: "Пайдаланушы келісімі",
      uaText: "Платформа рөлдерін, листинг және өтінім ережелерін, модерация механизмін және мәміле шектерін анықтайды.",
      privacy: "Құпиялылық саясаты",
      privacyText: "Жеке деректерді өңдеу, сақтау мерзімі, құқықтық негіздер және пайдаланушы құқықтарын түсіндіреді.",
      aml: "AML/KYC саясаты",
      amlText: "Мәміле жабылғанға дейін инвесторды міндетті сәйкестендіру және қаражат көзін тексеру.",
      risk: "Инвестициялық тәуекелдер",
      riskText: "Жерге инвестициялау құқықтық, нарықтық және инфрақұрылымдық тәуекелдермен байланысты.",
    },
  });

  return (
    <div className="container" style={{ maxWidth: 1020 }}>
      <div className="section-title">
        <h2>{t.title}</h2>
        <p>{t.sub}</p>
      </div>

      <section className="card">
        <h3 className="card-title">{t.ua}</h3>
        <p className="muted">{t.uaText}</p>

        <h3 className="card-title" style={{ marginTop: 14 }}>
          {t.privacy}
        </h3>
        <p className="muted">{t.privacyText}</p>

        <h3 className="card-title" style={{ marginTop: 14 }}>
          {t.aml}
        </h3>
        <p className="muted">{t.amlText}</p>

        <h3 className="card-title" style={{ marginTop: 14 }}>
          {t.risk}
        </h3>
        <p className="muted">{t.riskText}</p>
      </section>

      <LegalAcceptPanel />
    </div>
  );
}
