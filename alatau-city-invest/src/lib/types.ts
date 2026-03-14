export type PlotStatus =
  | "available"
  | "reserved"
  | "deal"
  | "moderation"
  | "sold"
  | "legal_issue";

export type LegalGrade = "a_plus" | "a" | "b" | "c";

export type UserRole = "guest" | "investor" | "owner" | "moderator" | "admin";

export interface Plot {
  id: string;
  slug: string;
  title: string;
  district: string;
  purpose: string;
  area: number;
  price: number;
  currency: "USD";
  roi: number;
  irr: number;
  riskScore: number;
  legalGrade: LegalGrade;
  status: PlotStatus;
  x: number;
  y: number;
  distanceCenterKm: number;
  utilities: string[];
  tags: string[];
  ownerType: string;
  updatedAt: string;
  docs: string[];
  timeline: string[];
  ownerId?: string;
  source?: "platform" | "owner";
}

export interface Application {
  id: string;
  createdAt: string;
  updatedAt?: string;
  status:
    | "draft"
    | "submitted"
    | "kyc_aml"
    | "legal_review"
    | "approved"
    | "rejected";
  reviewNote?: string | null;
  plotId: string;
  investorName: string;
  investorType: "individual" | "company" | "fund";
  amount: number;
  phone: string;
  email: string;
  sourceOfFunds: string;
}

export type BusinessProjectStatus =
  | "submitted"
  | "under_review"
  | "needs_revision"
  | "approved"
  | "rejected";

export interface BusinessProject {
  id: string;
  createdAt: string;
  updatedAt?: string;
  status: BusinessProjectStatus;
  moderationNote?: string | null;
  companyName: string;
  businessOverview: string;
  market: string;
  businessModel: string;
  traction: string;
  legalReadiness: string;
  financialForecasts: string;
  investmentTerms: string;
  founderName: string;
  founderEmail: string;
  founderPhone: string;
  city?: string;
  website?: string | null;
  requestedAmount?: number | null;
  minimumTicket?: number | null;
}

export interface NotificationItem {
  id: string;
  createdAt: string;
  readAt?: string | null;
  title: string;
  message: string;
  type: string;
  emailHtml?: string | null;
  metadata?: unknown;
}

export interface AuditLogItem {
  id: string;
  createdAt: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  actorRole?: "INVESTOR" | "OWNER" | "MODERATOR" | "ADMIN" | null;
  actorUserId?: string | null;
  details?: unknown;
}

export interface OwnerDraftPlotInput {
  title: string;
  cadastral: string;
  district: string;
  purpose: string;
  area: number;
  price: number;
  roi?: number;
  irr?: number;
  distanceCenterKm?: number;
  legalOwnerType: string;
  hasUtilities: boolean;
  description: string;
}

export interface NewsItem {
  id: string;
  category: string;
  title: string;
  date: string;
  excerpt: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  priceUsd: number;
  durationDays: number;
  features: string[];
}
