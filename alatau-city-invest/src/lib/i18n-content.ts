import { Lang } from "@/lib/i18n";
import { BusinessProject, FaqItem, Plot } from "@/lib/types";

type NewsOverride = Record<string, { category?: string; title?: string; excerpt?: string }>;
type PlanOverride = Record<string, { name?: string; features?: string[] }>;
type ProjectOverride = Partial<
  Pick<
    BusinessProject,
    | "companyName"
    | "businessOverview"
    | "market"
    | "businessModel"
    | "traction"
    | "legalReadiness"
    | "financialForecasts"
    | "investmentTerms"
    | "city"
  >
> & { moderationNote?: string | null };
type PlotOverride = Partial<Pick<Plot, "title" | "district">>;

export const newsPageText: Record<
  Lang,
  { title: string; sub: string; related: string; locale: string }
> = {
  EN: {
    title: "News and market briefs",
    sub: "Infrastructure, investment and legal updates supporting market trust.",
    related: "View related plots",
    locale: "en-US",
  },
  RU: {
    title: "Новости и рыночные обзоры",
    sub: "Инфраструктурные, инвестиционные и юридические обновления для повышения прозрачности рынка.",
    related: "Открыть связанные участки",
    locale: "ru-RU",
  },
  KZ: {
    title: "Жаңалықтар және нарық шолуы",
    sub: "Нарық сенімін арттыратын инфрақұрылым, инвестиция және заң жаңартулары.",
    related: "Байланысты учаскелерді ашу",
    locale: "kk-KZ",
  },
  CN: {
    title: "新闻与市场简报",
    sub: "基础设施、投资和法律更新，帮助提升市场透明度。",
    related: "查看相关地块",
    locale: "zh-CN",
  },
};

export const newsLocalizedByLang: Record<Lang, NewsOverride> = {
  EN: {},
  RU: {
    "N-1": {
      category: "Инфраструктура",
      title: "Для Alatau City одобрен новый транспортный узел",
      excerpt:
        "Новый узел сокращает время до центра на 18 минут и повышает инвестиционную привлекательность северного кластера.",
    },
    "N-2": {
      category: "Инвестиции",
      title: "Спрос на коммерческие участки вырос на 22% за квартал",
      excerpt:
        "Аналитика платформы показывает рост активности инвесторов в сегментах retail и mixed-use.",
    },
    "N-3": {
      category: "Юридическое",
      title: "Запущен обновленный стандарт юридической верификации",
      excerpt:
        "В процесс добавлен дополнительный этап проверки кадастровых данных и истории обременений.",
    },
  },
  KZ: {
    "N-1": {
      category: "Инфрақұрылым",
      title: "Alatau City үшін жаңа көлік торабы мақұлданды",
      excerpt:
        "Жаңа торап орталыққа жету уақытын 18 минутқа қысқартып, солтүстік кластердің коммерциялық тартымдылығын арттырады.",
    },
    "N-2": {
      category: "Инвестиция",
      title: "Коммерциялық учаскелерге сұраныс тоқсанда 22% өсті",
      excerpt:
        "Платформа аналитикасы retail және mixed-use сегменттерінде инвестор белсенділігі артқанын көрсетеді.",
    },
    "N-3": {
      category: "Заң",
      title: "Заңдық верификацияның жаңартылған стандарты іске қосылды",
      excerpt:
        "Кадастр деректерін және ауыртпалықтар тарихын тексеруге арналған қосымша кезең енгізілді.",
    },
  },
  CN: {
    "N-1": {
      category: "基础设施",
      title: "Alatau City 新交通枢纽已获批",
      excerpt:
        "新枢纽将前往中心区域的时间缩短 18 分钟，并提升北部集群的商业吸引力。",
    },
    "N-2": {
      category: "投资",
      title: "商业地块需求本季度增长 22%",
      excerpt:
        "平台分析显示，投资者在零售和混合用途板块的活跃度持续上升。",
    },
    "N-3": {
      category: "法律",
      title: "新版法律核验标准上线",
      excerpt:
        "流程新增了地籍数据核查和权利负担历史检查阶段。",
    },
  },
};

export const pricingPageText: Record<Lang, { title: string; sub: string }> = {
  EN: {
    title: "One clear placement fee",
    sub: "Pay once for each project or land listing submitted for publication.",
  },
  RU: {
    title: "Один понятный тариф за размещение",
    sub: "Разовая оплата за каждое размещение проекта или земельного листинга.",
  },
  KZ: {
    title: "Орналастыруға арналған бір нақты тариф",
    sub: "Әр жоба немесе жер листингі үшін бір реттік төлем.",
  },
  CN: {
    title: "清晰的一次性发布费用",
    sub: "每提交一个项目或土地挂牌，仅需支付一次发布费用。",
  },
};

export const pricingPlanOverridesByLang: Record<Lang, PlanOverride> = {
  EN: {},
  RU: {
    placement: {
      name: "Одно размещение",
      features: [
        "1 проект или земельный листинг",
        "Проверка модерацией",
        "Чеклист юридической готовности",
        "Публикация после одобрения",
      ],
    },
  },
  KZ: {
    placement: {
      name: "Бір орналастыру",
      features: ["1 жоба немесе жер листингі", "Модерация тексерісі", "Заңдық дайындық чеклисті", "Мақұлданғаннан кейін жариялау"],
    },
  },
  CN: {
    placement: {
      name: "单次发布",
      features: [
        "1 个项目或土地挂牌",
        "审核流程",
        "法律准备清单",
        "批准后发布",
      ],
    },
  },
};

export const faqPageText: Record<
  Lang,
  { title: string; sub: string; help: string; helpSub: string; contact: string; openAi: string }
> = {
  EN: {
    title: "FAQ",
    sub: "Common questions on investment flow, legal checks and owner listing.",
    help: "Still need help?",
    helpSub: "Contact support or use AI assistant for quick guidance.",
    contact: "Contact support",
    openAi: "Open AI assistant",
  },
  RU: {
    title: "FAQ",
    sub: "Частые вопросы по инвестиционному процессу, юридическим проверкам и листингам собственников.",
    help: "Нужна помощь?",
    helpSub: "Свяжитесь с поддержкой или используйте AI-ассистента для быстрого ответа.",
    contact: "Связаться с поддержкой",
    openAi: "Открыть AI-ассистента",
  },
  KZ: {
    title: "FAQ",
    sub: "Инвестиция ағыны, заңдық тексеріс және жер иесі листингтері туралы жиі сұрақтар.",
    help: "Көмек керек пе?",
    helpSub: "Қолдауға жазыңыз немесе жылдам нұсқаулық үшін AI-ассистентті қолданыңыз.",
    contact: "Қолдауға жазу",
    openAi: "AI-ассистентті ашу",
  },
  CN: {
    title: "FAQ",
    sub: "关于投资流程、法律核查和业主挂牌的常见问题。",
    help: "还需要帮助？",
    helpSub: "联系支持团队，或使用 AI 助手获得快速指引。",
    contact: "联系支持",
    openAi: "打开 AI 助手",
  },
};

export const faqItemsByLang: Record<Lang, FaqItem[] | null> = {
  EN: null,
  RU: [
    {
      question: "Как проверить юридическую чистоту участка?",
      answer:
        "В карточке каждого участка есть юридический блок: уровень верификации, дата последней проверки и перечень документов.",
    },
    {
      question: "Можно инвестировать как компания?",
      answer: "Да. Платформа принимает заявки как от физических, так и от юридических лиц.",
    },
    {
      question: "Сколько длится модерация участка собственника?",
      answer:
        "Стандартный SLA модерации составляет 24-72 часа в зависимости от качества данных и полноты документов.",
    },
    {
      question: "Как работает AI-анализ рисков?",
      answer:
        "AI оценивает юридические, инфраструктурные и рыночные параметры и формирует объяснимые риск-заметки.",
    },
  ],
  KZ: [
    {
      question: "Учаскенің заңдық тазалығын қалай тексеремін?",
      answer:
        "Әр учаске карточкасында заң блогы бар: верификация деңгейі, соңғы тексеру күні және құжаттар жиынтығы.",
    },
    {
      question: "Компания ретінде инвестициялауға бола ма?",
      answer: "Иә. Платформа жеке тұлғалардан да, заңды тұлғалардан да өтінім қабылдайды.",
    },
    {
      question: "Жер иесі учаскесінің модерациясы қанша уақыт алады?",
      answer:
        "Дерек сапасы мен құжат толықтығына қарай модерацияның стандартты SLA мерзімі 24-72 сағат.",
    },
    {
      question: "AI тәуекел талдауы қалай жұмыс істейді?",
      answer:
        "AI заңдық, инфрақұрылымдық және нарықтық параметрлерді бағалап, түсіндірмелі тәуекел қорытындысын береді.",
    },
  ],
  CN: [
    {
      question: "如何核查地块的法律清晰度？",
      answer:
        "每个地块卡片都包含法律信息：核验等级、最近核验日期和文件清单。",
    },
    {
      question: "可以以公司身份投资吗？",
      answer: "可以。平台支持自然人和法人主体提交投资申请。",
    },
    {
      question: "业主地块审核需要多久？",
      answer:
        "标准审核 SLA 为 24-72 小时，具体取决于数据质量和文件完整度。",
    },
    {
      question: "AI 风险分析如何工作？",
      answer:
        "AI 会评估法律、基础设施和市场参数，并生成可解释的风险提示。",
    },
  ],
};

export const pricingSelectorText: Record<
  Lang,
  {
    days: string;
    perPlacement: string;
    checkout: string;
    selected: string;
    planWord: string;
    payer: string;
    individual: string;
    company: string;
    invoice: string;
    tax: string;
    promo: string;
    activate: string;
    activated: string;
  }
> = {
  EN: {
    days: "days",
    perPlacement: "per placement",
    checkout: "Placement checkout",
    selected: "Selected:",
    planWord: "Placement",
    payer: "Payer type",
    individual: "Individual",
    company: "Company",
    invoice: "Email for invoice",
    tax: "Tax ID / BIN",
    promo: "Promo code",
    activate: "Activate placement",
    activated: "activated",
  },
  RU: {
    days: "дней",
    perPlacement: "за одно размещение",
    checkout: "Оформление размещения",
    selected: "Выбрано:",
    planWord: "Размещение",
    payer: "Тип плательщика",
    individual: "Физлицо",
    company: "Компания",
    invoice: "Email для счета",
    tax: "ИИН / БИН",
    promo: "Промокод",
    activate: "Активировать размещение",
    activated: "активировано",
  },
  KZ: {
    days: "күн",
    perPlacement: "бір орналастыру үшін",
    checkout: "Орналастыруды рәсімдеу",
    selected: "Таңдалды:",
    planWord: "Орналастыру",
    payer: "Төлеуші түрі",
    individual: "Жеке тұлға",
    company: "Компания",
    invoice: "Шотқа арналған Email",
    tax: "ЖСН / БСН",
    promo: "Промокод",
    activate: "Орналастыруды іске қосу",
    activated: "іске қосылды",
  },
  CN: {
    days: "天",
    perPlacement: "每次发布",
    checkout: "发布结算",
    selected: "已选择：",
    planWord: "发布",
    payer: "付款方类型",
    individual: "个人",
    company: "公司",
    invoice: "发票邮箱",
    tax: "税号 / BIN",
    promo: "优惠码",
    activate: "激活发布",
    activated: "已激活",
  },
};

const plotTextByLang: Record<Lang, Record<string, PlotOverride>> = {
  EN: {},
  RU: {
    "AC-101": { title: "Коммерческая зона River Gate", district: "Северные ворота" },
    "AC-102": { title: "Многофункциональный квартал Tech Valley", district: "Инновационный пояс" },
    "AC-103": { title: "Восточная логистическая площадка", district: "Восточная грузовая линия" },
    "AC-104": { title: "Жилой квартал Residence Garden", district: "Зеленая ось" },
    "AC-105": { title: "Гостиничный участок у озера", district: "Голубой полумесяц" },
    "AC-106": { title: "Индустриальный участок Solar Hub", district: "Энергетическое кольцо" },
    "AC-107": { title: "Участок медицинского кампуса", district: "Квартал здоровья" },
    "AC-108": { title: "Центральный торговый коридор", district: "Центральная дуга" },
    "AC-109": { title: "Участок авиационного пояса", district: "Связь с аэропортом" },
    "AC-110": { title: "Кампус образовательного парка", district: "Петля знаний" },
  },
  KZ: {
    "AC-101": { title: "River Gate коммерциялық аймағы", district: "Солтүстік қақпа" },
    "AC-102": { title: "Tech Valley аралас мақсаттағы кварталы", district: "Инновациялық белдеу" },
    "AC-103": { title: "Шығыс логистикалық алаң", district: "Шығыс жүк желісі" },
    "AC-104": { title: "Residence Garden тұрғын кварталы", district: "Жасыл ось" },
    "AC-105": { title: "Көл жағасындағы қонақүй учаскесі", district: "Көк жарты ай" },
    "AC-106": { title: "Solar Hub өнеркәсіптік учаскесі", district: "Энергия сақинасы" },
    "AC-107": { title: "Медициналық кампус учаскесі", district: "Денсаулық кварталы" },
    "AC-108": { title: "Орталық сауда дәлізі", district: "Орталық доға" },
    "AC-109": { title: "Авиациялық белдеу учаскесі", district: "Әуежай байланысы" },
    "AC-110": { title: "Білім паркі кампусы", district: "Білім ілмегі" },
  },
  CN: {
    "AC-101": { title: "River Gate 商业区", district: "北部门户" },
    "AC-102": { title: "Tech Valley 综合用地", district: "创新带" },
    "AC-103": { title: "东部物流场地", district: "东部货运线" },
    "AC-104": { title: "Residence Garden 住宅地块", district: "绿色脊轴" },
    "AC-105": { title: "湖滨酒店用地", district: "蓝色新月" },
    "AC-106": { title: "Solar Hub 工业地块", district: "能源环" },
    "AC-107": { title: "医疗校园地块", district: "健康片区" },
    "AC-108": { title: "中央零售走廊", district: "中央弧线" },
    "AC-109": { title: "航空带地块", district: "机场连接带" },
    "AC-110": { title: "教育园区校园", district: "知识环线" },
  },
};

const businessProjectTextByLang: Record<Lang, Record<string, ProjectOverride>> = {
  EN: {},
  RU: {
    "BIZ-101": {
      companyName: "GreenBox Local Foods",
      businessOverview:
        "Сеть районных мини-маркетов с быстрой доставкой ежедневных продуктов по районам Alatau City.",
      market: "Городской формат продуктовых магазинов у дома в Alatau City",
      businessModel:
        "Маржа с продаж, подписка на доставку в тот же день и платные полочные места партнеров.",
      traction:
        "Пилотная точка работает 4 месяца: в среднем 210 заказов в день, повторные покупки 48%, положительная юнит-экономика.",
      legalReadiness:
        "ТОО зарегистрировано, договоры аренды подписаны, налоговый и бухгалтерский контур настроен.",
      financialForecasts:
        "Цель по выручке: 420k USD в первый год и 710k USD во второй год, целевая EBITDA 14% к 18 месяцу.",
      investmentTerms:
        "Запрос 120k USD за 15% доли, ежемесячная отчетность инвестору и право наблюдателя в совете.",
      moderationNote: "Опубликовано в разделе проектов.",
    },
    "BIZ-102": {
      companyName: "QuickFix Home Service",
      businessOverview:
        "Мобильная платформа для срочного мелкого ремонта дома: электрика, сантехника и ремонт техники.",
      market: "Сервис срочного ремонта для квартир и небольших офисов",
      businessModel:
        "Комиссия с каждого заказа плюс подписка подрядчиков за приоритетные заявки.",
      traction:
        "MVP-приложение запущено: 320 выполненных работ, NPS 69, 140 активных платящих клиентов.",
      legalReadiness:
        "ИП активно, шаблон сервисного договора утвержден юридическим консультантом.",
      financialForecasts:
        "Прогноз GMV 260k USD за 12 месяцев; выход в break-even ожидается на 10 месяце при 1,100 заказах в месяц.",
      investmentTerms:
        "Привлечение 60k USD через SAFE note с valuation cap 2.8M USD и 20% discount на следующем раунде.",
    },
  },
  KZ: {
    "BIZ-101": {
      companyName: "GreenBox Local Foods",
      businessOverview:
        "Alatau City аудандарында күнделікті азық-түлікті жылдам жеткізетін аудандық мини-маркеттер желісі.",
      market: "Alatau City-дегі күнделікті азық-түлік дүкендері нарығы",
      businessModel:
        "Тауар сатылымынан маржа, сол күні жеткізуге жазылым және серіктестерге ақылы сөре орындары.",
      traction:
        "Пилоттық нүкте 4 ай жұмыс істеп тұр: күніне орташа 210 тапсырыс, қайталама сатып алу 48%, юнит-экономика оң.",
      legalReadiness:
        "ЖШС тіркелген, жалға алу шарттары қол қойылған, салық және бухгалтерлік есеп жолға қойылған.",
      financialForecasts:
        "Түсім мақсаты: 1-жылы 420k USD, 2-жылы 710k USD, EBITDA маржасы 18-айға қарай 14%.",
      investmentTerms:
        "120k USD инвестицияға 15% үлес ұсынылады, ай сайын есеп беру және кеңесте бақылаушы құқығы бар.",
      moderationNote: "Жобалар бөлімінде жарияланды.",
    },
    "BIZ-102": {
      companyName: "QuickFix Home Service",
      businessOverview:
        "Шұғыл үй жөндеу микросервистеріне арналған мобильді платформа: электрик, сантехника және техника жөндеу.",
      market: "Пәтерлер мен шағын кеңселерге арналған сұраныс бойынша үй жөндеу қызметтері",
      businessModel:
        "Әр тапсырыстан комиссия және мердігерлерге premium лид басымдығы үшін жазылым.",
      traction:
        "MVP қосымшасы іске қосылды: 320 жұмыс аяқталды, NPS 69, 140 белсенді төлеуші клиент.",
      legalReadiness:
        "Жеке кәсіпкерлік белсенді, қызмет көрсету келісімшартының үлгісін заң кеңесшісі бекіткен.",
      financialForecasts:
        "12 айда болжамды GMV 260k USD; break-even 10-айда, айына 1,100 тапсырыс кезінде күтіледі.",
      investmentTerms:
        "Келесі раундта 2.8M USD valuation cap және 20% discount бар SAFE note арқылы 60k USD тарту.",
    },
  },
  CN: {
    "BIZ-101": {
      companyName: "GreenBox Local Foods",
      businessOverview: "面向 Alatau City 各区的社区迷你商店连锁，提供日常食品快速配送。",
      market: "Alatau City 城区日常食品便利零售市场",
      businessModel: "商品销售利润、当日配送订阅以及合作品牌付费货架展示。",
      traction: "试点门店运营 4 个月，日均 210 单，复购率 48%，单位经济模型为正。",
      legalReadiness: "LLP 已注册，租赁协议已签署，税务和会计流程已完成。",
      financialForecasts:
        "收入目标：第 1 年 420k USD，第 2 年 710k USD，18 个月内 EBITDA 目标 14%。",
      investmentTerms:
        "寻求 120k USD 换取 15% 股权，月度投资人报告，并包含董事会观察员权利。",
      moderationNote: "已发布在项目板块。",
    },
    "BIZ-102": {
      companyName: "QuickFix Home Service",
      businessOverview: "紧急家庭维修微服务移动平台：电工、水管维修和家电维修。",
      market: "面向公寓和小型办公室的按需家庭维修服务",
      businessModel: "每单佣金，以及承包商为优先获得高质量线索支付订阅费。",
      traction: "MVP 应用已上线，完成 320 个订单，NPS 69，活跃付费客户 140 人。",
      legalReadiness: "个体经营主体已启用，服务合同模板已由法律顾问批准。",
      financialForecasts:
        "预计 12 个月 GMV 为 260k USD；预计第 10 个月、月订单 1,100 单时达到盈亏平衡。",
      investmentTerms:
        "通过 SAFE note 融资 60k USD，估值上限 2.8M USD，下一轮享 20% 折扣。",
    },
  },
};

const plotDetailTextByLang: Record<Lang, Record<string, string>> = {
  EN: {},
  RU: {
    "Ownership certificate": "Свидетельство о праве собственности",
    "Cadastral plan": "Кадастровый план",
    "No encumbrance certificate": "Справка об отсутствии обременений",
    "Technical conditions": "Технические условия",
    "Environmental conclusion": "Экологическое заключение",
    "Planning terms": "Условия планирования",
    "Owner provided package": "Пакет документов от владельца",
    "2026 Q2: Interchange upgrade": "2026 Q2: модернизация транспортной развязки",
    "2026 Q4: Main gas connection": "2026 Q4: подключение к магистральному газу",
    "2026 Q3: Business incubator launch": "2026 Q3: запуск бизнес-инкубатора",
    "2027 Q1: Rail node": "2027 Q1: железнодорожный узел",
    "2026 Q4: School and kindergarten": "2026 Q4: школа и детский сад",
    "2026 Q2: Waterfront": "2026 Q2: набережная",
    "2027 Q2: Convention center": "2027 Q2: конгресс-центр",
    "2027 Q1: 220kV substation": "2027 Q1: подстанция 220 кВ",
    "2026 Q3: Clinic phase 1": "2026 Q3: первая очередь клиники",
    "2026 Q2: Mall phase 1": "2026 Q2: первая очередь торгового центра",
    "2027 Q3: Cargo terminal": "2027 Q3: грузовой терминал",
    "2026 Q4: University block": "2026 Q4: университетский блок",
    "Moderation pending": "Ожидает модерации",
    "Owner edits submitted for moderation": "Правки владельца отправлены на модерацию",
  },
  KZ: {
    "Ownership certificate": "Меншік құқығы туралы куәлік",
    "Cadastral plan": "Кадастрлық жоспар",
    "No encumbrance certificate": "Ауыртпалық жоқтығы туралы анықтама",
    "Technical conditions": "Техникалық шарттар",
    "Environmental conclusion": "Экологиялық қорытынды",
    "Planning terms": "Жоспарлау шарттары",
    "Owner provided package": "Иесі ұсынған құжаттар пакеті",
    "2026 Q2: Interchange upgrade": "2026 Q2: көлік айрығын жаңарту",
    "2026 Q4: Main gas connection": "2026 Q4: магистральдық газға қосылу",
    "2026 Q3: Business incubator launch": "2026 Q3: бизнес-инкубаторды іске қосу",
    "2027 Q1: Rail node": "2027 Q1: теміржол торабы",
    "2026 Q4: School and kindergarten": "2026 Q4: мектеп және балабақша",
    "2026 Q2: Waterfront": "2026 Q2: жағалау аймағы",
    "2027 Q2: Convention center": "2027 Q2: конгресс-орталық",
    "2027 Q1: 220kV substation": "2027 Q1: 220 кВ қосалқы станция",
    "2026 Q3: Clinic phase 1": "2026 Q3: клиниканың бірінші кезеңі",
    "2026 Q2: Mall phase 1": "2026 Q2: сауда орталығының бірінші кезеңі",
    "2027 Q3: Cargo terminal": "2027 Q3: жүк терминалы",
    "2026 Q4: University block": "2026 Q4: университет блогы",
    "Moderation pending": "Модерация күтілуде",
    "Owner edits submitted for moderation": "Иесінің түзетулері модерацияға жіберілді",
  },
  CN: {
    "Ownership certificate": "所有权证明",
    "Cadastral plan": "地籍图",
    "No encumbrance certificate": "无产权负担证明",
    "Technical conditions": "技术条件",
    "Environmental conclusion": "环境评估结论",
    "Planning terms": "规划条件",
    "Owner provided package": "业主提供的文件包",
    "2026 Q2: Interchange upgrade": "2026 年 Q2：交通枢纽升级",
    "2026 Q4: Main gas connection": "2026 年 Q4：主燃气管线接入",
    "2026 Q3: Business incubator launch": "2026 年 Q3：商业孵化器启动",
    "2027 Q1: Rail node": "2027 年 Q1：铁路节点",
    "2026 Q4: School and kindergarten": "2026 年 Q4：学校和幼儿园",
    "2026 Q2: Waterfront": "2026 年 Q2：滨水区",
    "2027 Q2: Convention center": "2027 年 Q2：会议中心",
    "2027 Q1: 220kV substation": "2027 年 Q1：220kV 变电站",
    "2026 Q3: Clinic phase 1": "2026 年 Q3：诊所一期",
    "2026 Q2: Mall phase 1": "2026 年 Q2：购物中心一期",
    "2027 Q3: Cargo terminal": "2027 年 Q3：货运站",
    "2026 Q4: University block": "2026 年 Q4：大学片区",
    "Moderation pending": "等待审核",
    "Owner edits submitted for moderation": "业主修改已提交审核",
  },
};

const purposeLabelByLang: Record<Lang, Record<string, string>> = {
  EN: {},
  RU: {
    Commercial: "Коммерческое",
    "Mixed-use": "Смешанное",
    Residential: "Жилое",
    Logistics: "Логистика",
    Industrial: "Промышленное",
    Hospitality: "Гостиничное",
    Retail: "Ритейл",
    Education: "Образование",
    "Social infrastructure": "Социальная инфраструктура",
  },
  KZ: {
    Commercial: "Коммерциялық",
    "Mixed-use": "Аралас",
    Residential: "Тұрғын",
    Logistics: "Логистика",
    Industrial: "Өнеркәсіптік",
    Hospitality: "Қонақүй бағыты",
    Retail: "Ритейл",
    Education: "Білім беру",
    "Social infrastructure": "Әлеуметтік инфрақұрылым",
  },
  CN: {
    Commercial: "商业",
    "Mixed-use": "混合用途",
    Residential: "住宅",
    Logistics: "物流",
    Industrial: "工业",
    Hospitality: "酒店及文旅",
    Retail: "零售",
    Education: "教育",
    "Social infrastructure": "社会基础设施",
  },
};

const plotTagByLang: Record<Lang, Record<string, string>> = {
  EN: {},
  RU: {
    "Top ROI": "Высокий ROI",
    "Full verification": "Полная проверка",
    "Urgent sale": "Срочная продажа",
    "Large lot": "Большой участок",
    "Family cluster": "Семейный кластер",
    Premium: "Премиум",
    "Growth leader": "Лидер роста",
    "Energy cluster": "Энергетический кластер",
    "Stable demand": "Стабильный спрос",
    "High traffic": "Высокий трафик",
    "High potential": "Высокий потенциал",
    "Long-term horizon": "Долгий горизонт",
    "Self-service": "Саморазмещение",
  },
  KZ: {
    "Top ROI": "ROI жоғары",
    "Full verification": "Толық тексеріс",
    "Urgent sale": "Шұғыл сату",
    "Large lot": "Ірі учаске",
    "Family cluster": "Отбасылық кластер",
    Premium: "Премиум",
    "Growth leader": "Өсу көшбасшысы",
    "Energy cluster": "Энергетика кластері",
    "Stable demand": "Тұрақты сұраныс",
    "High traffic": "Жоғары трафик",
    "High potential": "Жоғары әлеует",
    "Long-term horizon": "Ұзақ мерзімді горизонт",
    "Self-service": "Өзіндік орналастыру",
  },
  CN: {
    "Top ROI": "高 ROI",
    "Full verification": "完整核验",
    "Urgent sale": "急售",
    "Large lot": "大面积地块",
    "Family cluster": "家庭生活集群",
    Premium: "高端",
    "Growth leader": "增长领先",
    "Energy cluster": "能源集群",
    "Stable demand": "需求稳定",
    "High traffic": "高客流",
    "High potential": "高潜力",
    "Long-term horizon": "长期周期",
    "Self-service": "自助发布",
  },
};

const pricePresetLabelByLang: Record<Lang, Record<string, string>> = {
  EN: {
    all: "Any",
    lt300: "Under 300k USD",
    "300to600": "300k - 600k USD",
    gt600: "Over 600k USD",
  },
  RU: {
    all: "Любая",
    lt300: "До 300k USD",
    "300to600": "300k - 600k USD",
    gt600: "Свыше 600k USD",
  },
  KZ: {
    all: "Кез келген",
    lt300: "300k USD дейін",
    "300to600": "300k - 600k USD",
    gt600: "600k USD жоғары",
  },
  CN: {
    all: "不限",
    lt300: "低于 300k USD",
    "300to600": "300k - 600k USD",
    gt600: "高于 600k USD",
  },
};

export function translatePurpose(lang: Lang, purpose: string) {
  return purposeLabelByLang[lang][purpose] ?? purpose;
}

export function localizePlot(lang: Lang, plot: Plot): Plot {
  const override = plotTextByLang[lang][plot.id];
  return override ? { ...plot, ...override } : plot;
}

export function hasPlotTranslation(lang: Lang, plot: Plot) {
  return Boolean(plotTextByLang[lang][plot.id]);
}

export function localizeBusinessProject(lang: Lang, project: BusinessProject): BusinessProject {
  const override = businessProjectTextByLang[lang][project.id];
  return override ? { ...project, ...override } : project;
}

export function hasBusinessProjectTranslation(lang: Lang, project: BusinessProject) {
  return Boolean(businessProjectTextByLang[lang][project.id]);
}

export function translatePlotDetailText(lang: Lang, text: string) {
  return plotDetailTextByLang[lang][text] ?? text;
}

export function translatePlotTag(lang: Lang, tag: string) {
  return plotTagByLang[lang][tag] ?? tag;
}

export function localizePricePresetLabel(lang: Lang, key: string, fallback: string) {
  return pricePresetLabelByLang[lang][key] ?? fallback;
}

export function localeByLang(lang: Lang) {
  if (lang === "RU") return "ru-RU";
  if (lang === "KZ") return "kk-KZ";
  if (lang === "CN") return "zh-CN";
  return "en-US";
}
