"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";
import { listPlots } from "@/lib/mock-db";
import { currency } from "@/lib/ui";

type RailItem = {
  title: string;
  label: string;
  href: string;
  meta: string;
};

export default function HomePage() {
  const { lang } = useCurrentLanguage();
  const { status: sessionStatus } = useSession();
  const plots = listPlots({ sort: "roi_desc" });
  const availablePlots = plots.filter((plot) => plot.status === "available");
  const topLand = availablePlots.slice(0, 3);
  const avgRoi = Math.round(plots.reduce((sum, plot) => sum + plot.roi, 0) / Math.max(plots.length, 1));

  const t = pickLang(lang, {
    EN: {
      heroKicker: "InvestMap for founders and investors",
      heroTitle: "A brighter way to find capital and invest in real businesses",
      heroText:
        "InvestMap connects business owners who need external investment with investors looking for transparent opportunities, legal clarity, and AI-supported decisions.",
      primaryCta: "Start your journey",
      secondaryCta: "Explore Alatau City",
      ownerCta: "List your business",
      investorCta: "Browse opportunities",
      activeProjects: "Active opportunities",
      verifiedPipeline: "Verified pipeline",
      averageRoi: "Average land ROI",
      whatTitle: "What is InvestMap?",
      whatLead: "Finding investment into your business is easier than ever.",
      whatText:
        "The platform helps companies present their business, prepare investor-ready information, and meet people who can finance the next stage of growth.",
      ownerTitle: "For business owners",
      ownerText:
        "We are your key to opening the door to external investments: shape the story, prepare legal checkpoints, publish a clear offer, and start investor conversations from one platform.",
      whyTitle: "Why us?",
      whyItems: [
        "Transparency from project profile to investment request",
        "Legal support and document readiness before publication",
        "AI helper for risk, ROI, and next-step questions",
        "Projects, land plots, founder data, and investor flows in one place",
      ],
      showcaseTitle: "Biggest projects on InvestMap",
      showcaseSub: "A moving strip of flagship opportunities. Open each one in its own page.",
      aiTitle: "AI helper for both sides of the deal",
      aiText:
        "Ask the assistant to compare ROI, explain legal risk, prepare a shortlist, or help business owners improve their investor profile before publication.",
      aiCta: "Open AI helper",
      partnersTitle: "Partners and platform overview",
      partnersText:
        "InvestMap is built around a partner layer that supports verification, legal readiness, analytics, and investor confidence.",
      partnerItems: ["Legal advisors", "Financial analysts", "KYC/AML providers", "City and infrastructure data"],
      tutorialTitle: "How our platform works",
      ownersFlow: "Business owners",
      investorsFlow: "Investors",
      ownerSteps: ["Sign up", "Set up your business", "Find investments"],
      investorSteps: ["Sign up", "Find a business you like", "Invest"],
      importanceTitle: "Why is it important and necessary to find investors?",
      importanceText:
        "External investment can unlock inventory, hiring, marketing, equipment, technology, and faster expansion. A strong investor is not only money; it is trust, discipline, connections, and a clearer path from local business to scalable company.",
      finalCta: "Start your investment journey now!",
      finalText:
        "Create a profile, explore verified opportunities, or open the Alatau City project page to see how InvestMap turns complex investment decisions into a clear digital flow.",
      legalSupport: "Legal readiness",
      transparency: "Transparency",
      aiSupport: "AI guidance",
      ownerReady: "Owner ready",
    },
    RU: {
      heroKicker: "InvestMap для предпринимателей и инвесторов",
      heroTitle: "Яркая платформа, где бизнес находит капитал, а инвесторы находят возможности",
      heroText:
        "InvestMap соединяет владельцев бизнеса, которым нужны внешние инвестиции, с инвесторами, которым важны прозрачность, юридическая ясность и решения с поддержкой AI.",
      primaryCta: "Начать путь",
      secondaryCta: "Открыть Alatau City",
      ownerCta: "Разместить бизнес",
      investorCta: "Смотреть возможности",
      activeProjects: "Активные возможности",
      verifiedPipeline: "Проверенный pipeline",
      averageRoi: "Средний ROI земли",
      whatTitle: "Что такое InvestMap?",
      whatLead: "Finding investment into your business is easier than ever.",
      whatText:
        "Платформа помогает компаниям красиво представить бизнес, подготовить информацию для инвесторов и встретить людей, которые могут профинансировать следующий этап роста.",
      ownerTitle: "Для владельцев бизнеса",
      ownerText:
        "Мы ваш ключ к открытию двери во внешние инвестиции: помогаем оформить историю, подготовить юридические чекпоинты, опубликовать понятное предложение и начать диалог с инвесторами.",
      whyTitle: "Почему мы?",
      whyItems: [
        "Прозрачность от профиля проекта до инвестиционной заявки",
        "Поддержка юридической части и подготовка документов",
        "AI-помощник по рискам, ROI и следующим шагам",
        "Проекты, участки, данные основателей и инвесторские сценарии в одном месте",
      ],
      showcaseTitle: "Крупнейшие проекты на InvestMap",
      showcaseSub: "Длинная движущаяся витрина флагманских возможностей. Каждый проект ведет на свою страницу.",
      aiTitle: "AI-помощник для обеих сторон сделки",
      aiText:
        "Попросите ассистента сравнить ROI, объяснить юридические риски, собрать shortlist или помочь владельцу бизнеса усилить профиль перед публикацией.",
      aiCta: "Открыть AI",
      partnersTitle: "Партнеры и обзор платформы",
      partnersText:
        "InvestMap строится вокруг партнерской сети, которая усиливает проверку, юридическую готовность, аналитику и доверие инвесторов.",
      partnerItems: ["Юридические консультанты", "Финансовые аналитики", "KYC/AML провайдеры", "Городские и инфраструктурные данные"],
      tutorialTitle: "Как работает наша платформа",
      ownersFlow: "Владельцы бизнеса",
      investorsFlow: "Инвесторы",
      ownerSteps: ["Регистрация", "Настройте бизнес", "Найдите инвестиции"],
      investorSteps: ["Регистрация", "Найдите бизнес", "Инвестируйте"],
      importanceTitle: "Почему важно и необходимо искать инвесторов?",
      importanceText:
        "Внешние инвестиции помогают открыть запасы, найм, маркетинг, оборудование, технологии и более быстрый рост. Сильный инвестор - это не только деньги, но и доверие, дисциплина, связи и понятный путь от локального бизнеса к масштабируемой компании.",
      finalCta: "Start your investment journey now!",
      finalText:
        "Создайте профиль, изучите проверенные возможности или откройте страницу Alatau City, чтобы увидеть, как InvestMap превращает сложные инвестиционные решения в понятный цифровой процесс.",
      legalSupport: "Юр. готовность",
      transparency: "Прозрачность",
      aiSupport: "AI поддержка",
      ownerReady: "Готово для владельца",
    },
    KZ: {
      heroKicker: "InvestMap кәсіпкерлер мен инвесторларға",
      heroTitle: "Бизнес капитал табатын, инвестор мүмкіндік табатын жарқын платформа",
      heroText:
        "InvestMap сыртқы инвестиция іздеген бизнес иелерін ашықтық, заңдық айқындық және AI қолдауы бар мүмкіндіктер іздеген инвесторлармен байланыстырады.",
      primaryCta: "Бастау",
      secondaryCta: "Alatau City ашу",
      ownerCta: "Бизнесті қосу",
      investorCta: "Мүмкіндіктерді көру",
      activeProjects: "Белсенді мүмкіндіктер",
      verifiedPipeline: "Тексерілген pipeline",
      averageRoi: "Жер бойынша орташа ROI",
      whatTitle: "InvestMap деген не?",
      whatLead: "Finding investment into your business is easier than ever.",
      whatText:
        "Платформа компанияларға бизнесін таныстыруға, инвесторға дайын ақпарат дайындауға және келесі өсу кезеңін қаржыландыра алатын адамдармен байланысуға көмектеседі.",
      ownerTitle: "Бизнес иелеріне",
      ownerText:
        "Біз сыртқы инвестицияға есік ашатын кілтпіз: тарихыңызды құрастырып, заңдық чекпоинттерді дайындап, нақты ұсыныс жариялап, инвестормен сөйлесуді бастайсыз.",
      whyTitle: "Неге біз?",
      whyItems: [
        "Жоба профилінен инвестициялық өтінімге дейін ашықтық",
        "Заңдық қолдау және құжаттарды жариялауға дайындау",
        "Тәуекел, ROI және келесі қадамдар бойынша AI көмекші",
        "Жобалар, жер учаскелері, негізін қалаушы деректері және инвестор жолдары бір жерде",
      ],
      showcaseTitle: "InvestMap-тағы ең үлкен жобалар",
      showcaseSub: "Флагман мүмкіндіктердің қозғалыстағы ұзын витринасы. Әр жоба өз бетіне ашады.",
      aiTitle: "Мәміленің екі жағына арналған AI көмекші",
      aiText:
        "Ассистенттен ROI салыстыруды, заңдық тәуекелді түсіндіруді, shortlist құруды немесе жариялау алдында бизнес профилін күшейтуді сұраңыз.",
      aiCta: "AI ашу",
      partnersTitle: "Серіктестер және платформа шолуы",
      partnersText:
        "InvestMap тексеру, заңдық дайындық, аналитика және инвестор сенімін күшейтетін серіктес қабатымен жұмыс істейді.",
      partnerItems: ["Заң кеңесшілері", "Қаржы аналитиктері", "KYC/AML провайдерлері", "Қала және инфрақұрылым деректері"],
      tutorialTitle: "Платформа қалай жұмыс істейді",
      ownersFlow: "Бизнес иелері",
      investorsFlow: "Инвесторлар",
      ownerSteps: ["Тіркелу", "Бизнесті баптау", "Инвестиция табу"],
      investorSteps: ["Тіркелу", "Ұнаған бизнесті табу", "Инвестициялау"],
      importanceTitle: "Инвестор табу неге маңызды?",
      importanceText:
        "Сыртқы инвестиция тауар қорын, жалдауды, маркетингті, жабдықты, технологияны және жылдам өсуді ашады. Мықты инвестор - тек ақша емес, ол сенім, тәртіп, байланыс және бизнесті масштабтаудың анығырақ жолы.",
      finalCta: "Start your investment journey now!",
      finalText:
        "Профиль құрыңыз, тексерілген мүмкіндіктерді көріңіз немесе Alatau City бетін ашып, InvestMap күрделі инвестициялық шешімді қалай түсінікті цифрлық ағынға айналдыратынын қараңыз.",
      legalSupport: "Заңдық дайындық",
      transparency: "Ашықтық",
      aiSupport: "AI қолдау",
      ownerReady: "Иеге дайын",
    },
  });

  const land = pickLang(lang, {
    EN: {
      kicker: "Land opportunities",
      title: "Verified land can become the foundation of the next big business",
      text:
        "InvestMap is not only about business projects. Investors can explore land plots by ROI, legal grade, infrastructure momentum and risk. Owners can register land separately and pass moderation before it appears in the catalog.",
      browse: "Explore land catalog",
      register: "Register your land",
      loginRegister: "Sign in to register land",
      map: "Open Alatau City map",
      available: "Available land plots",
      legal: "Legal checks",
      roi: "Average ROI",
      featured: "Featured land",
    },
    RU: {
      kicker: "Земельные возможности",
      title: "Проверенная земля может стать фундаментом следующего большого бизнеса",
      text:
        "InvestMap - это не только бизнес-проекты. Инвесторы изучают участки по ROI, юридическому статусу, инфраструктурному росту и риску. Владельцы могут отдельно зарегистрировать землю и пройти модерацию перед публикацией в каталоге.",
      browse: "Открыть каталог земель",
      register: "Зарегистрировать землю",
      loginRegister: "Войти для регистрации земли",
      map: "Открыть карту Alatau City",
      available: "Доступные участки",
      legal: "Юридические проверки",
      roi: "Средний ROI",
      featured: "Избранные участки",
    },
    KZ: {
      kicker: "Жер мүмкіндіктері",
      title: "Тексерілген жер келесі үлкен бизнестің негізі бола алады",
      text:
        "InvestMap тек бизнес-жобалар туралы емес. Инвесторлар жерді ROI, заңдық статус, инфрақұрылым өсімі және тәуекел бойынша қарайды. Иелер жерді бөлек тіркеп, каталогқа шықпас бұрын модерациядан өтеді.",
      browse: "Жер каталогын ашу",
      register: "Жерді тіркеу",
      loginRegister: "Жер тіркеу үшін кіру",
      map: "Alatau City картасын ашу",
      available: "Қолжетімді учаскелер",
      legal: "Заңдық тексеріс",
      roi: "Орташа ROI",
      featured: "Таңдаулы учаскелер",
    },
  });

  const projectSubmitHref =
    sessionStatus === "authenticated" ? "/projects/submit" : "/login?callbackUrl=/projects/submit";
  const landSubmitHref =
    sessionStatus === "authenticated" ? "/owner/add-plot" : "/login?callbackUrl=/owner/add-plot";
  const landSubmitLabel = sessionStatus === "authenticated" ? land.register : land.loginRegister;

  const showcaseItems: RailItem[] = [
    {
      title: "Alatau City",
      label: t.verifiedPipeline,
      href: "/alatau-city",
      meta: `${availablePlots.length} available land opportunities`,
    },
    {
      title: "GreenBox Local Foods",
      label: t.ownerReady,
      href: "/projects",
      meta: "Retail growth round, founder profile, monthly reporting",
    },
    {
      title: "QuickFix Home Service",
      label: t.activeProjects,
      href: "/projects",
      meta: "Service marketplace, traction, SAFE-style raise",
    },
    {
      title: "InvestMap AI",
      label: t.aiSupport,
      href: "/ai-assistant",
      meta: "Risk notes, ROI prompts, owner readiness review",
    },
  ];

  const duplicatedShowcase = [...showcaseItems, ...showcaseItems];

  return (
    <div className="invest-landing">
      <section className="container landing-hero">
        <div className="landing-hero-copy">
          <span className="landing-kicker">{t.heroKicker}</span>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroText}</p>
          <div className="inline-actions">
            <Link className="btn btn-accent" href="/projects">
              {t.primaryCta}
            </Link>
            <Link className="btn btn-ghost on-dark" href="/alatau-city">
              {t.secondaryCta}
            </Link>
            <Link className="btn btn-primary" href="/catalog">
              {land.browse}
            </Link>
          </div>
        </div>
        <div className="landing-hero-proof" aria-label="InvestMap metrics">
          <div>
            <span>{t.activeProjects}</span>
            <strong>{availablePlots.length + 2}</strong>
          </div>
          <div>
            <span>{t.verifiedPipeline}</span>
            <strong>81%</strong>
          </div>
          <div>
            <span>{t.averageRoi}</span>
            <strong>{avgRoi}%</strong>
          </div>
        </div>
      </section>

      <section className="container intro-grid">
        <div className="image-statement">
          <div>
            <span className="landing-kicker">{t.whatTitle}</span>
            <h2>{t.whatLead}</h2>
            <p>{t.whatText}</p>
          </div>
        </div>

        <div className="owner-door">
          <span className="landing-kicker">{t.ownerTitle}</span>
          <p>{t.ownerText}</p>
          <div className="inline-actions">
            <Link className="btn btn-primary" href={projectSubmitHref}>
              {t.ownerCta}
            </Link>
            <Link className="btn btn-ghost" href="/projects">
              {t.investorCta}
            </Link>
            <Link className="btn btn-accent" href={landSubmitHref}>
              {landSubmitLabel}
            </Link>
          </div>
        </div>
      </section>

      <section className="container land-signal">
        <div className="land-copy">
          <span className="landing-kicker">{land.kicker}</span>
          <h2>{land.title}</h2>
          <p>{land.text}</p>
          <div className="inline-actions">
            <Link className="btn btn-accent" href="/catalog">
              {land.browse}
            </Link>
            <Link className="btn btn-primary" href={landSubmitHref}>
              {landSubmitLabel}
            </Link>
            <Link className="btn btn-ghost on-dark" href="/alatau-city#alatau-map">
              {land.map}
            </Link>
          </div>
        </div>

        <div className="land-dashboard">
          <div className="land-metrics">
            <div>
              <span>{land.available}</span>
              <strong>{availablePlots.length}</strong>
            </div>
            <div>
              <span>{land.legal}</span>
              <strong>81%</strong>
            </div>
            <div>
              <span>{land.roi}</span>
              <strong>{avgRoi}%</strong>
            </div>
          </div>
          <div className="land-list">
            <span className="landing-kicker">{land.featured}</span>
            {topLand.map((plot) => (
              <Link className="land-mini-card" href={`/plots/${plot.id}`} key={plot.id}>
                <span>{plot.id}</span>
                <strong>{plot.title}</strong>
                <small>
                  {currency(plot.price, plot.currency)} / ROI {plot.roi}%
                </small>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container why-band">
        <div className="section-title">
          <h2>{t.whyTitle}</h2>
          <p>{t.partnersText}</p>
        </div>
        <ul className="why-list">
          {t.whyItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="container showcase-section" aria-label={t.showcaseTitle}>
        <div className="section-title">
          <h2>{t.showcaseTitle}</h2>
          <p>{t.showcaseSub}</p>
        </div>
        <div className="feature-rail">
          <div className="feature-track">
            {duplicatedShowcase.map((item, index) => (
              <Link className="feature-pill" href={item.href} key={`${item.title}-${index}`}>
                <span>{item.label}</span>
                <strong>{item.title}</strong>
                <small>{item.meta}</small>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container ai-partner-grid">
        <Link className="ai-strip" href="/ai-assistant">
          <span className="landing-kicker">{t.aiTitle}</span>
          <p>{t.aiText}</p>
          <strong>{t.aiCta}</strong>
        </Link>

        <div className="partners-overview">
          <span className="landing-kicker">{t.partnersTitle}</span>
          <p>{t.partnersText}</p>
          <div className="partner-tags">
            {t.partnerItems.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="container tutorial-section">
        <div className="section-title">
          <h2>{t.tutorialTitle}</h2>
          <p>{t.whatText}</p>
        </div>
        <div className="journey-grid">
          <div className="journey-panel owner-journey">
            <h3>{t.ownersFlow}</h3>
            <div className="journey-steps">
              {t.ownerSteps.map((step, index) => (
                <div className="journey-step" key={step}>
                  <span>{index + 1}</span>
                  <strong>{step}</strong>
                  {index < t.ownerSteps.length - 1 ? <em aria-hidden="true">-&gt;</em> : null}
                </div>
              ))}
            </div>
          </div>

          <div className="journey-panel investor-journey">
            <h3>{t.investorsFlow}</h3>
            <div className="journey-steps">
              {t.investorSteps.map((step, index) => (
                <div className="journey-step" key={step}>
                  <span>{index + 1}</span>
                  <strong>{step}</strong>
                  {index < t.investorSteps.length - 1 ? <em aria-hidden="true">-&gt;</em> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container importance-band">
        <div>
          <span className="landing-kicker">{t.importanceTitle}</span>
          <p>{t.importanceText}</p>
        </div>
      </section>

      <section className="container final-cta">
        <div>
          <h2>{t.finalCta}</h2>
          <p>{t.finalText}</p>
        </div>
        <div className="inline-actions">
          <Link className="btn btn-accent" href={projectSubmitHref}>
            {t.ownerCta}
          </Link>
          <Link className="btn btn-primary" href="/projects">
            {t.investorCta}
          </Link>
          <Link className="btn btn-ghost on-dark" href={landSubmitHref}>
            {landSubmitLabel}
          </Link>
        </div>
      </section>
    </div>
  );
}
