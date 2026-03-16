import {
  Application,
  BusinessProject,
  BusinessProjectStatus,
  FaqItem,
  NewsItem,
  OwnerDraftPlotInput,
  Plot,
  PlotStatus,
  PricingPlan,
} from "@/lib/types";

const todayIso = new Date().toISOString().slice(0, 10);

const basePlots: Plot[] = [
  {
    id: "AC-101",
    slug: "ac-101-river-gate",
    title: "River Gate Commerce Zone",
    district: "North Gateway",
    purpose: "Commercial",
    area: 2.4,
    price: 420000,
    currency: "USD",
    roi: 18.2,
    irr: 21.1,
    riskScore: 28,
    legalGrade: "a_plus",
    status: "available",
    x: 22,
    y: 58,
    distanceCenterKm: 8.4,
    utilities: ["Electricity", "Water", "Gas"],
    tags: ["Top ROI", "Full verification"],
    ownerType: "Company",
    updatedAt: "2026-03-11",
    docs: ["Ownership certificate", "Cadastral plan", "No encumbrance certificate"],
    timeline: ["2026 Q2: Interchange upgrade", "2026 Q4: Main gas connection"],
    source: "platform",
  },
  {
    id: "AC-102",
    slug: "ac-102-tech-valley",
    title: "Tech Valley Mixed Use",
    district: "Innovation Belt",
    purpose: "Mixed-use",
    area: 1.8,
    price: 335000,
    currency: "USD",
    roi: 15.7,
    irr: 19.3,
    riskScore: 34,
    legalGrade: "a",
    status: "reserved",
    x: 41,
    y: 42,
    distanceCenterKm: 6.1,
    utilities: ["Electricity", "Water"],
    tags: ["Urgent sale"],
    ownerType: "Individual",
    updatedAt: "2026-03-10",
    docs: ["Ownership certificate", "Cadastral plan"],
    timeline: ["2026 Q3: Business incubator launch"],
    source: "platform",
  },
  {
    id: "AC-103",
    slug: "ac-103-logistics-yard",
    title: "Logistics Yard East",
    district: "Eastern Cargo Line",
    purpose: "Logistics",
    area: 4.2,
    price: 510000,
    currency: "USD",
    roi: 12.8,
    irr: 16,
    riskScore: 41,
    legalGrade: "b",
    status: "available",
    x: 68,
    y: 64,
    distanceCenterKm: 11.3,
    utilities: ["Electricity"],
    tags: ["Large lot"],
    ownerType: "Company",
    updatedAt: "2026-03-12",
    docs: ["Ownership certificate", "Cadastral plan"],
    timeline: ["2027 Q1: Rail node"],
    source: "platform",
  },
  {
    id: "AC-104",
    slug: "ac-104-residence-garden",
    title: "Residence Garden Block",
    district: "Green Spine",
    purpose: "Residential",
    area: 1.1,
    price: 198000,
    currency: "USD",
    roi: 13.6,
    irr: 17.2,
    riskScore: 30,
    legalGrade: "a",
    status: "deal",
    x: 34,
    y: 73,
    distanceCenterKm: 9.2,
    utilities: ["Electricity", "Water", "Gas"],
    tags: ["Family cluster"],
    ownerType: "Individual",
    updatedAt: "2026-03-09",
    docs: ["Ownership certificate", "Cadastral plan", "Technical conditions"],
    timeline: ["2026 Q4: School and kindergarten"],
    source: "platform",
  },
  {
    id: "AC-105",
    slug: "ac-105-lake-front",
    title: "Lake Front Hospitality",
    district: "Blue Crescent",
    purpose: "Hospitality",
    area: 3.6,
    price: 690000,
    currency: "USD",
    roi: 19.9,
    irr: 24.5,
    riskScore: 37,
    legalGrade: "a_plus",
    status: "available",
    x: 56,
    y: 27,
    distanceCenterKm: 5.8,
    utilities: ["Electricity", "Water", "Gas", "Fiber"],
    tags: ["Premium", "Growth leader"],
    ownerType: "Company",
    updatedAt: "2026-03-13",
    docs: [
      "Ownership certificate",
      "Cadastral plan",
      "No encumbrance certificate",
      "Environmental conclusion",
    ],
    timeline: ["2026 Q2: Waterfront", "2027 Q2: Convention center"],
    source: "platform",
  },
  {
    id: "AC-106",
    slug: "ac-106-solar-hub",
    title: "Solar Hub Industrial Plot",
    district: "Energy Ring",
    purpose: "Industrial",
    area: 5.8,
    price: 740000,
    currency: "USD",
    roi: 11.3,
    irr: 14.4,
    riskScore: 44,
    legalGrade: "b",
    status: "moderation",
    x: 79,
    y: 34,
    distanceCenterKm: 13.8,
    utilities: ["Electricity", "Water"],
    tags: ["Energy cluster"],
    ownerType: "Company",
    updatedAt: "2026-03-08",
    docs: ["Ownership certificate"],
    timeline: ["2027 Q1: 220kV substation"],
    source: "platform",
  },
  {
    id: "AC-107",
    slug: "ac-107-medical-campus",
    title: "Medical Campus Plot",
    district: "Health Quarter",
    purpose: "Social infrastructure",
    area: 2.9,
    price: 390000,
    currency: "USD",
    roi: 14.9,
    irr: 18.8,
    riskScore: 31,
    legalGrade: "a",
    status: "available",
    x: 47,
    y: 55,
    distanceCenterKm: 7.3,
    utilities: ["Electricity", "Water", "Gas", "Fiber"],
    tags: ["Stable demand"],
    ownerType: "PPP",
    updatedAt: "2026-03-06",
    docs: ["Ownership certificate", "Cadastral plan", "Planning terms"],
    timeline: ["2026 Q3: Clinic phase 1"],
    source: "platform",
  },
  {
    id: "AC-108",
    slug: "ac-108-retail-corridor",
    title: "Retail Corridor Central",
    district: "Central Arc",
    purpose: "Retail",
    area: 1.3,
    price: 280000,
    currency: "USD",
    roi: 16.4,
    irr: 20.1,
    riskScore: 29,
    legalGrade: "a_plus",
    status: "sold",
    x: 25,
    y: 35,
    distanceCenterKm: 4.2,
    utilities: ["Electricity", "Water", "Gas"],
    tags: ["High traffic"],
    ownerType: "Company",
    updatedAt: "2026-03-03",
    docs: ["Ownership certificate", "Cadastral plan", "No encumbrance certificate"],
    timeline: ["2026 Q2: Mall phase 1"],
    source: "platform",
  },
  {
    id: "AC-109",
    slug: "ac-109-aviation-belt",
    title: "Aviation Belt Parcel",
    district: "Airport Link",
    purpose: "Logistics",
    area: 6.2,
    price: 880000,
    currency: "USD",
    roi: 17.1,
    irr: 22,
    riskScore: 53,
    legalGrade: "c",
    status: "legal_issue",
    x: 90,
    y: 49,
    distanceCenterKm: 18.4,
    utilities: ["Electricity"],
    tags: ["High potential"],
    ownerType: "Company",
    updatedAt: "2026-03-04",
    docs: ["Ownership certificate"],
    timeline: ["2027 Q3: Cargo terminal"],
    source: "platform",
  },
  {
    id: "AC-110",
    slug: "ac-110-education-park",
    title: "Education Park Campus",
    district: "Knowledge Loop",
    purpose: "Education",
    area: 2.2,
    price: 360000,
    currency: "USD",
    roi: 13.9,
    irr: 17.5,
    riskScore: 33,
    legalGrade: "a",
    status: "available",
    x: 61,
    y: 71,
    distanceCenterKm: 10.1,
    utilities: ["Electricity", "Water", "Gas", "Fiber"],
    tags: ["Long-term horizon"],
    ownerType: "PPP",
    updatedAt: "2026-03-05",
    docs: ["Ownership certificate", "Cadastral plan", "Technical conditions"],
    timeline: ["2026 Q4: University block"],
    source: "platform",
  },
];

const news: NewsItem[] = [
  {
    id: "N-1",
    category: "Infrastructure",
    title: "New transport node approved for Alatau City",
    date: "2026-03-12",
    excerpt:
      "The new node cuts travel time to the center by 18 minutes and boosts commercial attractiveness of the north cluster.",
  },
  {
    id: "N-2",
    category: "Investment",
    title: "Demand for commercial plots grew by 22% this quarter",
    date: "2026-03-10",
    excerpt:
      "Platform analytics show growing investor activity in retail and mixed-use segments.",
  },
  {
    id: "N-3",
    category: "Legal",
    title: "Updated legal verification standard launched",
    date: "2026-03-08",
    excerpt:
      "A new stage was added for cadastral verification and encumbrance history checks.",
  },
];

const faqs: FaqItem[] = [
  {
    question: "How do I verify plot legal purity?",
    answer:
      "Each plot card contains a legal block with verification level, last verification date, and document set.",
  },
  {
    question: "Can I invest as a company?",
    answer:
      "Yes. The platform supports applications from both individuals and legal entities.",
  },
  {
    question: "How long does owner moderation take?",
    answer:
      "Standard moderation SLA is 24-72 hours depending on data quality and document completeness.",
  },
  {
    question: "How does AI risk analysis work?",
    answer:
      "AI evaluates legal, infrastructure, and market parameters and returns explainable risk notes.",
  },
];

const pricingPlans: PricingPlan[] = [
  {
    id: "base",
    name: "Base",
    priceUsd: 89,
    durationDays: 30,
    features: ["1 active plot", "Standard moderation", "Basic analytics"],
  },
  {
    id: "premium",
    name: "Premium",
    priceUsd: 219,
    durationDays: 30,
    features: ["Up to 5 plots", "Priority listing", "AI quality hints", "Lead analytics"],
  },
  {
    id: "corporate",
    name: "Corporate",
    priceUsd: 590,
    durationDays: 30,
    features: ["Up to 20 plots", "Personal manager", "API exports", "Priority legal review"],
  },
];

const baseBusinessProjects: BusinessProject[] = [
  {
    id: "BIZ-101",
    createdAt: "2026-03-12T09:20:00.000Z",
    updatedAt: "2026-03-12T09:20:00.000Z",
    status: "approved",
    moderationNote: "Published in projects section.",
    companyName: "GreenBox Local Foods",
    businessOverview:
      "Neighborhood mini-store chain with fast delivery for daily groceries in Alatau City districts.",
    market: "Urban grocery convenience retail in Alatau City",
    businessModel:
      "Margin on product sales plus subscription for same-day delivery and partner shelf placements.",
    traction:
      "Pilot point is operating 4 months. Average 210 orders/day, repeat rate 48%, positive unit economics.",
    legalReadiness: "LLP registered, lease agreements signed, tax and accounting setup complete.",
    financialForecasts:
      "Revenue target: 420k USD year 1 and 710k USD year 2, EBITDA margin goal 14% by month 18.",
    investmentTerms:
      "Seeking 120k USD for 15% equity, investor reporting monthly, board observer right included.",
    founderName: "Ayan Sadykov",
    founderEmail: "founder@greenbox.kz",
    founderPhone: "+7 700 555 1010",
    city: "Alatau City",
    website: "https://greenbox.example",
    requestedAmount: 120000,
    minimumTicket: 15000,
  },
  {
    id: "BIZ-102",
    createdAt: "2026-03-13T14:50:00.000Z",
    updatedAt: "2026-03-13T14:50:00.000Z",
    status: "under_review",
    moderationNote: null,
    companyName: "QuickFix Home Service",
    businessOverview:
      "Mobile platform for urgent home repair micro-services: electrician, plumbing, appliance fixes.",
    market: "On-demand home repair services for apartments and small offices",
    businessModel:
      "Commission from each order plus contractor subscription for premium lead priority.",
    traction:
      "MVP app launched, 320 completed jobs, NPS 69, 140 active paying customers.",
    legalReadiness: "Sole proprietorship active, service contracts template approved by legal advisor.",
    financialForecasts:
      "Projected GMV 260k USD in 12 months; break-even expected in month 10 at 1,100 orders/month.",
    investmentTerms:
      "Raising 60k USD via SAFE note with 2.8M USD valuation cap and 20% discount at next round.",
    founderName: "Timur Nurpeisov",
    founderEmail: "timur@quickfix.kz",
    founderPhone: "+7 701 111 2233",
    city: "Alatau City",
    website: null,
    requestedAmount: 60000,
    minimumTicket: 5000,
  },
];

let plots: Plot[] = [...basePlots];
let applications: Application[] = [];
let businessProjects: BusinessProject[] = [...baseBusinessProjects];

function genId(prefix: string) {
  return `${prefix}-${Math.floor(Math.random() * 90000 + 10000)}`;
}

export function listPlots(filters?: {
  purpose?: string;
  status?: PlotStatus | "all";
  risk?: "all" | "low" | "medium" | "high";
  price?: "all" | "lt300" | "300to600" | "gt600";
  sort?: "roi_desc" | "price_asc" | "price_desc" | "risk_asc";
}) {
  let result = [...plots];

  if (filters?.purpose && filters.purpose !== "all") {
    const purpose = filters.purpose.toLowerCase();
    result = result.filter((item) => item.purpose.toLowerCase() === purpose);
  }

  if (filters?.status && filters.status !== "all") {
    result = result.filter((item) => item.status === filters.status);
  }

  if (filters?.risk && filters.risk !== "all") {
    if (filters.risk === "low") result = result.filter((item) => item.riskScore <= 30);
    if (filters.risk === "medium")
      result = result.filter((item) => item.riskScore > 30 && item.riskScore <= 45);
    if (filters.risk === "high") result = result.filter((item) => item.riskScore > 45);
  }

  if (filters?.price && filters.price !== "all") {
    if (filters.price === "lt300") result = result.filter((item) => item.price < 300000);
    if (filters.price === "300to600")
      result = result.filter((item) => item.price >= 300000 && item.price <= 600000);
    if (filters.price === "gt600") result = result.filter((item) => item.price > 600000);
  }

  if (filters?.sort) {
    if (filters.sort === "roi_desc") result.sort((a, b) => b.roi - a.roi);
    if (filters.sort === "price_asc") result.sort((a, b) => a.price - b.price);
    if (filters.sort === "price_desc") result.sort((a, b) => b.price - a.price);
    if (filters.sort === "risk_asc") result.sort((a, b) => a.riskScore - b.riskScore);
  }

  return result;
}

export function getPlotById(id: string) {
  return plots.find((plot) => plot.id === id);
}

export function listPurposes() {
  return Array.from(new Set(plots.map((plot) => plot.purpose)));
}

export function listNews() {
  return news;
}

export function listFaqs() {
  return faqs;
}

export function listPricingPlans() {
  return pricingPlans;
}

export function listApplications() {
  return applications;
}

export function listBusinessProjects(filters?: {
  status?: BusinessProjectStatus | "all";
  search?: string;
}) {
  let result = [...businessProjects];

  if (filters?.status && filters.status !== "all") {
    result = result.filter((item) => item.status === filters.status);
  }

  if (filters?.search) {
    const query = filters.search.toLowerCase();
    result = result.filter(
      (item) =>
        item.companyName.toLowerCase().includes(query) ||
        item.market.toLowerCase().includes(query) ||
        item.businessOverview.toLowerCase().includes(query)
    );
  }

  result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return result;
}

export function getBusinessProjectById(id: string) {
  return businessProjects.find((item) => item.id === id) ?? null;
}

export function createBusinessProject(
  payload: Omit<
    BusinessProject,
    "id" | "createdAt" | "updatedAt" | "status" | "moderationNote"
  >
) {
  const now = new Date().toISOString();
  const next: BusinessProject = {
    ...payload,
    id: genId("BIZ"),
    createdAt: now,
    updatedAt: now,
    status: "submitted",
    moderationNote: null,
  };

  businessProjects = [next, ...businessProjects];
  return next;
}

export function updateBusinessProjectStatus(payload: {
  id: string;
  status: BusinessProjectStatus;
  moderationNote?: string | null;
}) {
  const current = businessProjects.find((item) => item.id === payload.id);
  if (!current) {
    return null;
  }

  const updated: BusinessProject = {
    ...current,
    status: payload.status,
    moderationNote: payload.moderationNote ?? null,
    updatedAt: new Date().toISOString(),
  };

  businessProjects = businessProjects.map((item) => (item.id === payload.id ? updated : item));

  return {
    updated,
    previousStatus: current.status,
  };
}

export function createApplication(
  payload: Omit<Application, "id" | "createdAt" | "status">
): Application {
  const next: Application = {
    ...payload,
    id: genId("APP"),
    createdAt: new Date().toISOString(),
    status: "submitted",
  };
  applications = [next, ...applications];
  return next;
}

export function createOwnerPlot(payload: OwnerDraftPlotInput, ownerId = "owner-demo"): Plot {
  const qualityScore = calculateOwnerPlotQualityScore(payload);
  const id = `OWN-${Math.floor(Math.random() * 9000 + 1000)}`;

  const plot: Plot = {
    id,
    slug: id.toLowerCase(),
    title: payload.title,
    district: payload.district,
    purpose: payload.purpose,
    area: payload.area,
    price: payload.price,
    currency: "USD",
    roi: payload.roi ?? 12,
    irr: payload.irr ?? 15,
    riskScore: qualityScore >= 80 ? 34 : 47,
    legalGrade: qualityScore >= 80 ? "b" : "c",
    status: "moderation",
    x: Math.floor(Math.random() * 70 + 15),
    y: Math.floor(Math.random() * 70 + 15),
    distanceCenterKm: payload.distanceCenterKm ?? 9,
    utilities: payload.hasUtilities ? ["Electricity", "Water"] : ["Not verified"],
    tags: ["Self-service"],
    ownerType: payload.legalOwnerType,
    updatedAt: todayIso,
    docs: ["Owner provided package"],
    timeline: ["Moderation pending"],
    ownerId,
    source: "owner",
  };

  plots = [plot, ...plots];
  return plot;
}

export function updatePlotStatus(id: string, status: PlotStatus) {
  let updated: Plot | undefined;
  plots = plots.map((plot) => {
    if (plot.id === id) {
      updated = { ...plot, status, updatedAt: new Date().toISOString().slice(0, 10) };
      return updated;
    }
    return plot;
  });
  return updated;
}

export function listAdminQueue() {
  return plots.filter((plot) => plot.status === "moderation" || plot.status === "legal_issue");
}

export function calculateOwnerPlotQualityScore(payload: OwnerDraftPlotInput) {
  let score = 0;
  if (payload.title.trim().length > 3) score += 10;
  if (payload.cadastral.trim().length >= 6) score += 10;
  if (payload.district.trim().length > 1) score += 10;
  if (payload.purpose.trim().length > 1) score += 10;
  if (payload.area > 0) score += 10;
  if (payload.price >= 10000) score += 10;
  if (payload.legalOwnerType.trim().length > 1) score += 10;
  if (payload.hasUtilities) score += 10;
  if (payload.description.trim().length > 120) score += 20;
  return Math.min(100, score);
}

export function aiAnalyze(prompt: string) {
  const question = prompt.toLowerCase();

  if (question.includes("roi") || question.includes("income") || question.includes("\u0434\u043e\u0445\u043e\u0434")) {
    const top = [...plots]
      .filter((plot) => plot.status === "available")
      .sort((a, b) => b.roi - a.roi)
      .slice(0, 3)
      .map((plot) => `${plot.id} (${plot.roi}%)`)
      .join(", ");

    return top
      ? `Top ROI plots currently: ${top}. Compare legal grade and risk before final decision.`
      : "No available plots now for ROI ranking.";
  }

  if (question.includes("risk") || question.includes("\u0440\u0438\u0441\u043a")) {
    const lowRisk = plots
      .filter((plot) => plot.status === "available" && plot.riskScore <= 30)
      .slice(0, 3)
      .map((plot) => plot.id)
      .join(", ");

    return lowRisk
      ? `Lower-risk options: ${lowRisk}. Recommend verifying A/A+ legal profile and document update date.`
      : "Lower-risk options are temporarily limited. Consider medium risk with enhanced due diligence.";
  }

  if (question.includes("logistics") || question.includes("\u043b\u043e\u0433\u0438\u0441\u0442")) {
    const logistics = plots
      .filter((plot) => plot.purpose.toLowerCase().includes("logistics"))
      .map((plot) => `${plot.id} (${plot.price} USD)`)
      .join(", ");

    return logistics
      ? `Logistics-oriented plots: ${logistics}`
      : "No logistics plots currently matched your request.";
  }

  if (question.includes("owner") || question.includes("\u0434\u043e\u0431\u0430\u0432") || question.includes("\u0440\u0430\u0437\u043c\u0435\u0441\u0442")) {
    return "Owner flow: sign up -> add cadastral and commercial data -> upload documents -> choose pricing plan -> moderation -> publication.";
  }

  return "Please share your budget, risk tolerance, and time horizon. I can return a tailored shortlist with legal and ROI filters.";
}
