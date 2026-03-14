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
      title: "Запущен обновлённый стандарт юридической верификации",
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
};

export const pricingPageText: Record<Lang, { title: string; sub: string }> = {
  EN: {
    title: "Placement pricing",
    sub: "Transparent monetization for owner listings and promotion packages.",
  },
  RU: {
    title: "Тарифы размещения",
    sub: "Прозрачная монетизация для листингов собственников и пакетов продвижения.",
  },
  KZ: {
    title: "Орналастыру тарифтері",
    sub: "Жер иесі листингтері мен ілгерілету пакеттеріне арналған ашық монетизация.",
  },
};

export const pricingPlanOverridesByLang: Record<Lang, PlanOverride> = {
  EN: {},
  RU: {
    base: {
      name: "Базовый",
      features: ["1 активный участок", "Стандартная модерация", "Базовая аналитика"],
    },
    premium: {
      name: "Премиум",
      features: [
        "До 5 участков",
        "Приоритет в каталоге",
        "AI-подсказки по качеству",
        "Аналитика лидов",
      ],
    },
    corporate: {
      name: "Корпоративный",
      features: [
        "До 20 участков",
        "Персональный менеджер",
        "API-экспорт",
        "Приоритетная юр. проверка",
      ],
    },
  },
  KZ: {
    base: {
      name: "Базалық",
      features: ["1 белсенді учаске", "Стандартты модерация", "Базалық аналитика"],
    },
    premium: {
      name: "Премиум",
      features: [
        "5 учаскеге дейін",
        "Каталогта басым көрсету",
        "Сапа бойынша AI-кеңестер",
        "Лид аналитикасы",
      ],
    },
    corporate: {
      name: "Корпоративтік",
      features: ["20 учаскеге дейін", "Жеке менеджер", "API экспорты", "Басым заң тексерісі"],
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
};

export const pricingSelectorText: Record<
  Lang,
  {
    days: string;
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
    checkout: "Plan checkout",
    selected: "Selected:",
    planWord: "Plan",
    payer: "Payer type",
    individual: "Individual",
    company: "Company",
    invoice: "Email for invoice",
    tax: "Tax ID / BIN",
    promo: "Promo code",
    activate: "Activate plan",
    activated: "activated until",
  },
  RU: {
    days: "дней",
    checkout: "Оформление тарифа",
    selected: "Выбрано:",
    planWord: "Тариф",
    payer: "Тип плательщика",
    individual: "Физлицо",
    company: "Компания",
    invoice: "Email для счета",
    tax: "ИИН / БИН",
    promo: "Промокод",
    activate: "Активировать тариф",
    activated: "активирован до",
  },
  KZ: {
    days: "күн",
    checkout: "Тарифті рәсімдеу",
    selected: "Таңдалды:",
    planWord: "Тариф",
    payer: "Төлеуші түрі",
    individual: "Жеке тұлға",
    company: "Компания",
    invoice: "Шотқа арналған Email",
    tax: "ЖСН / БСН",
    promo: "Промокод",
    activate: "Тарифті іске қосу",
    activated: "келесі күнге дейін іске қосылды",
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
  return "en-US";
}
