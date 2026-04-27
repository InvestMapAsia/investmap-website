import { Lang } from "@/lib/i18n";
import { FaqItem } from "@/lib/types";

type NewsOverride = Record<string, { category?: string; title?: string; excerpt?: string }>;
type PlanOverride = Record<string, { name?: string; features?: string[] }>;

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
