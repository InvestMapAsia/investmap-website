"use client";

import { LegalAcceptPanel } from "@/components/legal-accept-panel";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";

export default function LegalPage() {
  const { lang } = useCurrentLanguage();
  const t = pickLang(lang, {
    EN: {
      title: "InvestMap Platform Policy",
      sub:
        "These rules explain how accounts, listings, personal data, moderation, payments and investment risk work on InvestMap.",
      sections: [
        {
          title: "1. Account and role responsibility",
          text:
            "When creating an account, the user confirms that the provided name, email, role and contact details are accurate. Investors are responsible for their investment decisions. Owners are responsible for the truthfulness of project, land, financial and legal information submitted to the platform.",
        },
        {
          title: "2. Listings and moderation",
          text:
            "Business projects and land listings may be reviewed before publication. InvestMap may request corrections, reject incomplete materials, hide risky listings or remove content that appears false, misleading, duplicated, illegal or not investor-ready.",
        },
        {
          title: "3. Personal data and privacy",
          text:
            "InvestMap processes account data, contact details, listing information, uploaded media and platform activity to provide authentication, moderation, investor-owner communication, notifications, analytics, security and support. Data is kept only as long as needed for platform operation, legal obligations, audit history and dispute handling.",
        },
        {
          title: "4. Payments and placement fee",
          text:
            "Placement is paid per published listing. Payment does not guarantee investor funding, investment return, moderation approval or deal closure. Refunds, if any, are handled according to the payment provider and platform support decision for the specific case.",
        },
        {
          title: "5. KYC, AML and verification",
          text:
            "Before a deal closes, users may be asked to pass identity, company, source-of-funds or ownership checks. InvestMap may restrict access when verification is missing, inconsistent or legally required.",
        },
        {
          title: "6. Investment risk notice",
          text:
            "Investments in businesses and land carry risk: loss of capital, market changes, legal title issues, infrastructure delays, liquidity limits and inaccurate forecasts. InvestMap provides a digital platform and analytical tools, but does not provide guaranteed financial advice.",
        },
      ],
    },
    RU: {
      title: "Политика платформы InvestMap",
      sub:
        "Эти правила объясняют, как на InvestMap работают аккаунты, размещения, персональные данные, модерация, оплата и инвестиционные риски.",
      sections: [
        {
          title: "1. Аккаунт и ответственность роли",
          text:
            "При создании аккаунта пользователь подтверждает, что имя, email, роль и контактные данные указаны корректно. Инвестор самостоятельно отвечает за инвестиционные решения. Владелец отвечает за достоверность данных о проекте, земле, финансах и юридическом статусе, переданных на платформу.",
        },
        {
          title: "2. Размещения и модерация",
          text:
            "Бизнес-проекты и земельные листинги могут проходить проверку перед публикацией. InvestMap может запросить исправления, отклонить неполные материалы, скрыть рискованные листинги или удалить контент, который выглядит ложным, вводящим в заблуждение, дублирующимся, незаконным или неготовым для инвесторов.",
        },
        {
          title: "3. Персональные данные и конфиденциальность",
          text:
            "InvestMap обрабатывает данные аккаунта, контакты, информацию листингов, загруженные медиа и действия на платформе для входа, модерации, связи инвестора и владельца, уведомлений, аналитики, безопасности и поддержки. Данные хранятся только столько, сколько нужно для работы платформы, юридических обязанностей, аудита и разрешения спорных ситуаций.",
        },
        {
          title: "4. Оплата и стоимость размещения",
          text:
            "Размещение оплачивается за каждый опубликованный листинг. Оплата не гарантирует привлечение инвестора, доходность, одобрение модерации или закрытие сделки. Возвраты, если применимо, рассматриваются по правилам платежного провайдера и решению поддержки платформы для конкретного случая.",
        },
        {
          title: "5. KYC, AML и проверки",
          text:
            "До закрытия сделки пользователю может потребоваться проверка личности, компании, источника средств или права собственности. InvestMap может ограничить доступ, если проверка отсутствует, противоречива или требуется законом.",
        },
        {
          title: "6. Уведомление об инвестиционных рисках",
          text:
            "Инвестиции в бизнес и землю несут риски: потеря капитала, изменение рынка, проблемы с правом собственности, задержки инфраструктуры, низкая ликвидность и неточные прогнозы. InvestMap предоставляет цифровую платформу и аналитические инструменты, но не гарантирует финансовый результат.",
        },
      ],
    },
    KZ: {
      title: "InvestMap платформа саясаты",
      sub:
        "Бұл ережелер InvestMap-та аккаунт, орналастыру, жеке деректер, модерация, төлем және инвестициялық тәуекел қалай жұмыс істейтінін түсіндіреді.",
      sections: [
        {
          title: "1. Аккаунт және рөл жауапкершілігі",
          text:
            "Аккаунт ашқанда пайдаланушы аты, email, рөл және байланыс деректері дұрыс екенін растайды. Инвестор инвестициялық шешіміне өзі жауап береді. Иесі платформаға жіберілген жоба, жер, қаржы және заңдық деректердің дұрыстығына жауап береді.",
        },
        {
          title: "2. Орналастыру және модерация",
          text:
            "Бизнес-жобалар мен жер листингтері жарияланар алдында тексерілуі мүмкін. InvestMap түзету сұрауы, толық емес материалды қабылдамауы, тәуекелі жоғары листингті жасыруы немесе жалған, шатастыратын, қайталанған, заңсыз не инвесторға дайын емес контентті алып тастауы мүмкін.",
        },
        {
          title: "3. Жеке деректер және құпиялылық",
          text:
            "InvestMap аккаунт деректерін, байланыс ақпаратын, листинг мәліметтерін, жүктелген медианы және платформадағы әрекеттерді кіру, модерация, инвестор мен иенің байланысы, хабарлама, аналитика, қауіпсіздік және қолдау үшін өңдейді. Деректер платформа жұмысына, заңдық міндеттерге, аудитке және дауларды шешуге қажет мерзімде ғана сақталады.",
        },
        {
          title: "4. Төлем және орналастыру құны",
          text:
            "Орналастыру әр жарияланған листинг үшін бөлек төленеді. Төлем инвестор тартуға, табысқа, модерация мақұлдауына немесе мәміле жабылуына кепілдік бермейді. Қайтарым болса, төлем провайдері ережесі және нақты жағдай бойынша платформа қолдауының шешімімен қаралады.",
        },
        {
          title: "5. KYC, AML және тексеріс",
          text:
            "Мәміле жабылар алдында пайдаланушыдан жеке басын, компанияны, қаражат көзін немесе меншік құқығын тексеру сұралуы мүмкін. Тексеріс жоқ, сәйкес емес немесе заң бойынша қажет болса, InvestMap қолжетімділікті шектеуі мүмкін.",
        },
        {
          title: "6. Инвестициялық тәуекел туралы ескерту",
          text:
            "Бизнес пен жерге инвестиция тәуекелді: капитал жоғалуы, нарық өзгеруі, меншік құқығы мәселелері, инфрақұрылым кешігуі, өтімділік шектеуі және болжам қателігі болуы мүмкін. InvestMap цифрлық платформа және аналитикалық құралдар береді, бірақ қаржылық нәтижеге кепілдік бермейді.",
        },
      ],
    },
  });

  return (
    <div className="container" style={{ maxWidth: 1020 }}>
      <div className="section-title">
        <h2>{t.title}</h2>
        <p>{t.sub}</p>
      </div>

      <section className="card policy-card">
        {t.sections.map((section) => (
          <div className="policy-section" key={section.title}>
            <h3 className="card-title">{section.title}</h3>
            <p className="muted">{section.text}</p>
          </div>
        ))}
      </section>

      <LegalAcceptPanel />
    </div>
  );
}
