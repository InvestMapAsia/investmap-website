"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";
import { listPlots } from "@/lib/mock-db";
import { localizePlot } from "@/lib/i18n-content";
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
    CN: {
      heroKicker: "面向创业者与投资者的 InvestMap",
      heroTitle: "让企业找到资本，让投资者发现机会的明亮平台",
      heroText:
        "InvestMap 连接需要外部投资的企业主，以及重视透明度、法律清晰度和 AI 辅助决策的投资者。",
      primaryCta: "开始旅程",
      secondaryCta: "查看 Alatau City",
      ownerCta: "发布企业",
      investorCta: "浏览机会",
      activeProjects: "活跃机会",
      verifiedPipeline: "已核验流程",
      averageRoi: "土地平均 ROI",
      whatTitle: "什么是 InvestMap？",
      whatLead: "为你的企业寻找投资，比以往更简单。",
      whatText:
        "平台帮助企业展示业务、准备面向投资者的信息，并连接能够支持下一阶段增长的人。",
      ownerTitle: "面向企业主",
      ownerText:
        "我们是你打开外部投资之门的钥匙：梳理商业故事、准备法律检查点、发布清晰的投资提案，并在一个平台上开启投资者对话。",
      whyTitle: "为什么选择我们？",
      whyItems: [
        "从项目资料到投资申请的全流程透明",
        "发布前的法律支持与文件准备",
        "用于风险、ROI 和下一步问题的 AI 助手",
        "项目、土地、创始人数据和投资者流程集中在一处",
      ],
      showcaseTitle: "InvestMap 上的重点项目",
      showcaseSub: "旗舰机会的动态展示栏。每个项目都可打开独立页面。",
      aiTitle: "服务交易双方的 AI 助手",
      aiText:
        "让助手比较 ROI、解释法律风险、准备候选清单，或帮助企业主在发布前提升投资者资料。",
      aiCta: "打开 AI",
      partnersTitle: "合作伙伴与平台概览",
      partnersText:
        "InvestMap 围绕合作伙伴网络构建，支持核验、法律准备、分析和投资者信任。",
      partnerItems: ["法律顾问", "财务分析师", "KYC/AML 服务商", "城市与基础设施数据"],
      tutorialTitle: "平台如何运作",
      ownersFlow: "企业主",
      investorsFlow: "投资者",
      ownerSteps: ["注册", "完善企业资料", "寻找投资"],
      investorSteps: ["注册", "寻找感兴趣的企业", "投资"],
      importanceTitle: "为什么寻找投资者很重要？",
      importanceText:
        "外部投资可以释放库存、招聘、营销、设备、技术和更快扩张的能力。优秀投资者不仅带来资金，也带来信任、纪律、资源连接，以及从本地企业走向可规模化公司的清晰路径。",
      finalCta: "现在开始你的投资旅程！",
      finalText:
        "创建资料、探索已核验机会，或打开 Alatau City 页面，了解 InvestMap 如何把复杂的投资决策变成清晰的数字流程。",
      legalSupport: "法律准备",
      transparency: "透明度",
      aiSupport: "AI 支持",
      ownerReady: "业主就绪",
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
    CN: {
      kicker: "土地机会",
      title: "已核验土地可以成为下一个大生意的基础",
      text:
        "InvestMap 不只服务商业项目。投资者可以按 ROI、法律等级、基础设施动能和风险筛选土地；业主也可以单独登记土地，并在进入目录前通过审核。",
      browse: "浏览土地目录",
      register: "登记土地",
      loginRegister: "登录后登记土地",
      map: "打开 Alatau City 地图",
      available: "可投资地块",
      legal: "法律核查",
      roi: "平均 ROI",
      featured: "精选土地",
    },
  });

  const showcaseMeta = pickLang(lang, {
    EN: {
      land: `${availablePlots.length} available land opportunities`,
      greenbox: "Retail growth round, founder profile, monthly reporting",
      quickfix: "Service marketplace, traction, SAFE-style raise",
      ai: "Risk notes, ROI prompts, owner readiness review",
    },
    RU: {
      land: `${availablePlots.length} доступных земельных возможностей`,
      greenbox: "Раунд роста retail, профиль основателя, ежемесячная отчетность",
      quickfix: "Сервисный маркетплейс, traction, SAFE-формат раунда",
      ai: "Заметки по рискам, ROI-запросы, проверка готовности владельца",
    },
    KZ: {
      land: `${availablePlots.length} қолжетімді жер мүмкіндігі`,
      greenbox: "Retail өсу раунды, құрылтайшы профилі, ай сайынғы есеп",
      quickfix: "Сервистік маркетплейс, алғашқы traction, SAFE форматындағы раунд",
      ai: "Тәуекел ескертпелері, ROI сұрақтары, иенің дайындық тексерісі",
    },
    CN: {
      land: `${availablePlots.length} 个可投资土地机会`,
      greenbox: "零售增长轮、创始人资料、月度报告",
      quickfix: "服务型平台、业务牵引、SAFE 式融资",
      ai: "风险提示、ROI 提问、业主准备度检查",
    },
  });

  const partner = pickLang(lang, {
    EN: {
      kicker: "Platform network",
      title: "Our Partners",
      subtitle: "Trusted by professionals worldwide",
      mediaBadge: "Strategic Partner",
      eyebrow: "Investment network",
      companyName: "Global Venture Partners",
      description:
        "A cross-border investment group helping founders structure capital rounds and connect with verified private investors.",
      statsLabel: "Partner statistics",
      credibilityLabel: "Partner credibility badges",
      portfolio: "Portfolio",
      activeCountries: "Active countries",
      investments: "Successful investments",
      dueDiligence: "Due diligence",
      investorNetwork: "Investor network",
      marketAccess: "Market access",
    },
    RU: {
      kicker: "Партнерская сеть",
      title: "Наши партнеры",
      subtitle: "Нам доверяют профессионалы по всему миру",
      mediaBadge: "Стратегический партнер",
      eyebrow: "Инвестиционная сеть",
      companyName: "Global Venture Partners",
      description:
        "Международная инвестиционная группа помогает основателям структурировать раунды капитала и выходить на проверенных частных инвесторов.",
      statsLabel: "Статистика партнера",
      credibilityLabel: "Преимущества партнера",
      portfolio: "Портфель",
      activeCountries: "Активные страны",
      investments: "Успешных инвестиций",
      dueDiligence: "Проверка сделки",
      investorNetwork: "Сеть инвесторов",
      marketAccess: "Доступ к рынкам",
    },
    KZ: {
      kicker: "Серіктестік желі",
      title: "Біздің серіктестер",
      subtitle: "Әлем бойынша кәсіби мамандар сенеді",
      mediaBadge: "Стратегиялық серіктес",
      eyebrow: "Инвестициялық желі",
      companyName: "Global Venture Partners",
      description:
        "Халықаралық инвестициялық топ құрылтайшыларға капитал раундтарын құрылымдап, тексерілген жеке инвесторлармен байланысуға көмектеседі.",
      statsLabel: "Серіктес статистикасы",
      credibilityLabel: "Серіктес артықшылықтары",
      portfolio: "Портфель",
      activeCountries: "Белсенді елдер",
      investments: "Сәтті инвестициялар",
      dueDiligence: "Мәмілені тексеру",
      investorNetwork: "Инвесторлар желісі",
      marketAccess: "Нарыққа шығу",
    },
    CN: {
      kicker: "合作网络",
      title: "我们的合作伙伴",
      subtitle: "受到全球专业人士信任",
      mediaBadge: "战略合作伙伴",
      eyebrow: "投资网络",
      companyName: "Global Venture Partners",
      description: "跨境投资集团帮助创始人设计融资轮次，并连接经过验证的私人投资者。",
      statsLabel: "合作伙伴数据",
      credibilityLabel: "合作伙伴优势",
      portfolio: "投资组合",
      activeCountries: "活跃国家",
      investments: "成功投资",
      dueDiligence: "尽职调查",
      investorNetwork: "投资者网络",
      marketAccess: "市场准入",
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
      meta: showcaseMeta.land,
    },
    {
      title: "GreenBox Local Foods",
      label: t.ownerReady,
      href: "/projects",
      meta: showcaseMeta.greenbox,
    },
    {
      title: "QuickFix Home Service",
      label: t.activeProjects,
      href: "/projects",
      meta: showcaseMeta.quickfix,
    },
    {
      title: "InvestMap AI",
      label: t.aiSupport,
      href: "/ai-assistant",
      meta: showcaseMeta.ai,
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
            {topLand.map((plot) => {
              const localizedPlot = localizePlot(lang, plot);

              return (
                <Link className="land-mini-card" href={`/plots/${plot.id}`} key={plot.id}>
                  <span>{plot.id}</span>
                  <strong>{localizedPlot.title}</strong>
                  <small>
                    {currency(plot.price, plot.currency)} / ROI {plot.roi}%
                  </small>
                </Link>
              );
            })}
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

        <section className="partners-section" aria-labelledby="partners-title">
          <div className="partners-heading">
            <span className="landing-kicker">{partner.kicker}</span>
            <h2 id="partners-title">{partner.title}</h2>
            <p>{partner.subtitle}</p>
          </div>

          <div className="partners-grid">
            <article className="partner-card">
              <div className="partner-card-media">
                <span>{partner.mediaBadge}</span>
              </div>
              <div className="partner-card-body">
                <div>
                  <span className="partner-eyebrow">{partner.eyebrow}</span>
                  <h3>{partner.companyName}</h3>
                  <p>{partner.description}</p>
                </div>

                <div className="partner-stats" aria-label={partner.statsLabel}>
                  <div>
                    <strong>$10M+</strong>
                    <span>{partner.portfolio}</span>
                  </div>
                  <div>
                    <strong>10+</strong>
                    <span>{partner.activeCountries}</span>
                  </div>
                  <div>
                    <strong>50+</strong>
                    <span>{partner.investments}</span>
                  </div>
                </div>

                <div className="partner-badges" aria-label={partner.credibilityLabel}>
                  <span>{partner.dueDiligence}</span>
                  <span>{partner.investorNetwork}</span>
                  <span>{partner.marketAccess}</span>
                </div>
              </div>
            </article>
          </div>
        </section>
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
