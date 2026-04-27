import "server-only";

import { Role } from "@prisma/client";
import {
  createApplication,
  createBusinessProject,
  createOwnerPlot,
  getBusinessProjectById,
  getPlotById,
  listAdminQueue,
  listApplications,
  listBusinessProjects,
  listPlots,
  updateBusinessProject,
  updateBusinessProjectStatus,
  updateOwnerPlot,
  updatePlotStatus,
} from "@/lib/mock-db";
import {
  Application,
  AuditLogItem,
  BusinessProject,
  BusinessProjectStatus,
  NotificationItem,
  OwnerDraftPlotInput,
  PlotStatus,
} from "@/lib/types";

type MockAuthUser = {
  id: string;
  email: string;
  name: string;
  password: string;
  role: Role;
  emailVerifiedAt: string | null;
};

type MockApplicationRecord = Application & {
  userId?: string;
};

type MockBusinessProjectRecord = BusinessProject & {
  userId?: string;
};

const mockUsers: MockAuthUser[] = [
  {
    id: "mock-admin",
    email: "admin@alatau.city",
    name: "Admin User",
    password: "Admin#2026",
    role: "ADMIN",
    emailVerifiedAt: new Date().toISOString(),
  },
  {
    id: "mock-investor",
    email: "investor@alatau.city",
    name: "Investor User",
    password: "Investor#2026",
    role: "INVESTOR",
    emailVerifiedAt: new Date().toISOString(),
  },
  {
    id: "mock-owner",
    email: "owner@alatau.city",
    name: "Owner User",
    password: "Owner#2026",
    role: "OWNER",
    emailVerifiedAt: new Date().toISOString(),
  },
  {
    id: "mock-moderator",
    email: "moderator@alatau.city",
    name: "Moderator User",
    password: "Moderator#2026",
    role: "MODERATOR",
    emailVerifiedAt: new Date().toISOString(),
  },
];

const applicationOwners = new Map<string, string>();
const businessProjectOwners = new Map<string, string>([
  ["BIZ-101", "mock-owner"],
  ["BIZ-102", "mock-investor"],
]);
const favoritesByUser = new Map<string, Set<string>>();
const notificationsByUser = new Map<string, NotificationItem[]>();
const emailVerificationTokens = new Map<string, { email: string; expiresAt: string }>();
let auditLogs: AuditLogItem[] = [];

function nowIso() {
  return new Date().toISOString();
}

function nextId(prefix: string) {
  return `${prefix}-${Math.floor(Math.random() * 900000 + 100000)}`;
}

function applicationRecords() {
  return listApplications() as MockApplicationRecord[];
}

function ensureFavoriteSet(userId: string) {
  const existing = favoritesByUser.get(userId);
  if (existing) return existing;
  const created = new Set<string>();
  favoritesByUser.set(userId, created);
  return created;
}

function ensureNotificationList(userId: string) {
  const existing = notificationsByUser.get(userId);
  if (existing) return existing;
  const created: NotificationItem[] = [];
  notificationsByUser.set(userId, created);
  return created;
}

export function listMockUsers() {
  return mockUsers.map((user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    emailVerifiedAt: user.emailVerifiedAt,
  }));
}

export function findMockUserByEmail(email: string) {
  return mockUsers.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function validateMockCredentials(email: string, password: string) {
  const user = findMockUserByEmail(email);
  if (!user) return null;
  if (user.password !== password) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export function registerMockUser(payload: {
  name: string;
  email: string;
  password: string;
  role: "INVESTOR" | "OWNER";
}) {
  if (findMockUserByEmail(payload.email)) {
    return null;
  }

  const user: MockAuthUser = {
    id: nextId("USR"),
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role: payload.role,
    emailVerifiedAt: null,
  };

  mockUsers.push(user);
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    emailVerifiedAt: user.emailVerifiedAt,
  };
}

export function getMockEmailVerificationStatus(email: string) {
  const user = findMockUserByEmail(email);
  return {
    exists: Boolean(user),
    verified: Boolean(user?.emailVerifiedAt),
  };
}

export function createMockEmailVerificationToken(payload: {
  email: string;
  token: string;
  expiresAt: Date;
}) {
  for (const [token, row] of emailVerificationTokens.entries()) {
    if (row.email.toLowerCase() === payload.email.toLowerCase()) {
      emailVerificationTokens.delete(token);
    }
  }

  emailVerificationTokens.set(payload.token, {
    email: payload.email,
    expiresAt: payload.expiresAt.toISOString(),
  });
}

export function consumeMockEmailVerificationToken(token: string) {
  const row = emailVerificationTokens.get(token);
  if (!row) {
    return { status: "invalid" as const, user: null };
  }

  if (new Date(row.expiresAt) < new Date()) {
    emailVerificationTokens.delete(token);
    return { status: "expired" as const, user: null };
  }

  const user = findMockUserByEmail(row.email);
  if (!user) {
    emailVerificationTokens.delete(token);
    return { status: "invalid" as const, user: null };
  }

  user.emailVerifiedAt = nowIso();
  emailVerificationTokens.delete(token);
  return { status: "verified" as const, user };
}

export function listMockPlots(filters?: {
  purpose?: string;
  status?: PlotStatus | "all";
  risk?: "all" | "low" | "medium" | "high";
  price?: "all" | "lt300" | "300to600" | "gt600";
  sort?: "roi_desc" | "price_asc" | "price_desc" | "risk_asc";
}) {
  return listPlots(filters);
}

export function getMockPlotById(id: string) {
  return getPlotById(id);
}

export function updateMockPlotStatus(id: string, status: PlotStatus) {
  return updatePlotStatus(id, status);
}

export function updateMockOwnerPlot(payload: {
  id: string;
  ownerId?: string;
  data: OwnerDraftPlotInput;
}) {
  return updateOwnerPlot(payload.id, payload.data, payload.ownerId);
}

export function listMockAdminQueue() {
  return listAdminQueue();
}

export function listMockOwnerPlots(payload: { userId: string; role: Role }) {
  const ownerPlots = listPlots().filter((plot) => plot.source === "owner");
  if (payload.role === "ADMIN" || payload.role === "MODERATOR") {
    return ownerPlots;
  }
  return ownerPlots.filter((plot) => plot.ownerId === payload.userId);
}

export function createMockOwnerPlot(payload: OwnerDraftPlotInput, ownerId: string) {
  return createOwnerPlot(payload, ownerId);
}

export function listMockApplications(payload: { userId?: string; role: Role }) {
  const rows = applicationRecords();
  if (payload.role === "ADMIN" || payload.role === "MODERATOR") {
    return [...rows];
  }
  if (!payload.userId) {
    return [];
  }
  return rows.filter((row) => applicationOwners.get(row.id) === payload.userId);
}

export function createMockApplication(
  payload: Omit<Application, "id" | "createdAt" | "status"> & { userId?: string }
) {
  const created = createApplication({
    plotId: payload.plotId,
    investorName: payload.investorName,
    investorType: payload.investorType,
    amount: payload.amount,
    phone: payload.phone,
    email: payload.email,
    sourceOfFunds: payload.sourceOfFunds,
  }) as MockApplicationRecord;

  created.updatedAt = created.createdAt;
  created.reviewNote = null;

  if (payload.userId) {
    applicationOwners.set(created.id, payload.userId);
  }

  return created;
}

export function getMockApplicationById(id: string) {
  return applicationRecords().find((row) => row.id === id) ?? null;
}

export function getMockApplicationUser(id: string) {
  const userId = applicationOwners.get(id);
  if (!userId) return null;
  return mockUsers.find((user) => user.id === userId) ?? null;
}

export function updateMockApplicationStatus(payload: {
  id: string;
  status: Application["status"];
  reviewNote?: string | null;
}) {
  const row = applicationRecords().find((item) => item.id === payload.id);
  if (!row) return null;

  const previousStatus = row.status;
  row.status = payload.status;
  row.reviewNote = payload.reviewNote ?? null;
  row.updatedAt = nowIso();

  return {
    updated: row,
    previousStatus,
  };
}

export function listMockAdminApplications() {
  return applicationRecords().map((row) => {
    const plot = getPlotById(row.plotId);
    const user = getMockApplicationUser(row.id);

    return {
      ...row,
      plotTitle: plot?.title ?? "Unknown plot",
      userEmail: user?.email ?? row.email,
      userName: user?.name ?? row.investorName,
      userId: user?.id ?? null,
    };
  });
}

export function listMockBusinessProjects(payload: {
  userId?: string;
  role?: Role;
  status?: BusinessProjectStatus | "all";
  search?: string;
  scope?: "market" | "mine";
}) {
  const rows = listBusinessProjects({
    status: payload.status ?? "all",
    search: payload.search,
  }) as MockBusinessProjectRecord[];

  if (payload.scope === "mine") {
    if (!payload.userId) {
      return [];
    }
    return rows.filter((row) => businessProjectOwners.get(row.id) === payload.userId);
  }

  if (payload.role === "ADMIN" || payload.role === "MODERATOR") {
    return rows;
  }

  if (!payload.userId) {
    return rows.filter((row) => row.status === "approved");
  }

  return rows.filter(
    (row) => row.status === "approved" || businessProjectOwners.get(row.id) === payload.userId
  );
}

export function createMockBusinessProject(
  payload: Omit<
    BusinessProject,
    "id" | "createdAt" | "updatedAt" | "status" | "moderationNote"
  > & {
    userId?: string;
  }
) {
  const created = createBusinessProject({
    companyName: payload.companyName,
    businessOverview: payload.businessOverview,
    market: payload.market,
    businessModel: payload.businessModel,
    traction: payload.traction,
    legalReadiness: payload.legalReadiness,
    financialForecasts: payload.financialForecasts,
    investmentTerms: payload.investmentTerms,
    founderName: payload.founderName,
    founderEmail: payload.founderEmail,
    founderPhone: payload.founderPhone,
    city: payload.city,
    website: payload.website,
    requestedAmount: payload.requestedAmount,
    minimumTicket: payload.minimumTicket,
    mediaUrls: payload.mediaUrls,
    mapAddress: payload.mapAddress,
    mapLat: payload.mapLat,
    mapLng: payload.mapLng,
  }) as MockBusinessProjectRecord;

  if (payload.userId) {
    businessProjectOwners.set(created.id, payload.userId);
  }

  return created;
}

export function getMockBusinessProjectById(id: string) {
  return getBusinessProjectById(id) as MockBusinessProjectRecord | null;
}

export function getMockBusinessProjectUser(id: string) {
  const userId = businessProjectOwners.get(id);
  if (!userId) return null;
  return mockUsers.find((user) => user.id === userId) ?? null;
}

export function updateMockBusinessProjectStatus(payload: {
  id: string;
  status: BusinessProjectStatus;
  moderationNote?: string | null;
}) {
  return updateBusinessProjectStatus({
    id: payload.id,
    status: payload.status,
    moderationNote: payload.moderationNote ?? null,
  });
}

export function updateMockBusinessProject(
  payload: Omit<
    BusinessProject,
    "id" | "createdAt" | "updatedAt" | "status" | "moderationNote"
  > & {
    id: string;
  }
) {
  return updateBusinessProject(payload.id, {
    companyName: payload.companyName,
    businessOverview: payload.businessOverview,
    market: payload.market,
    businessModel: payload.businessModel,
    traction: payload.traction,
    legalReadiness: payload.legalReadiness,
    financialForecasts: payload.financialForecasts,
    investmentTerms: payload.investmentTerms,
    founderName: payload.founderName,
    founderEmail: payload.founderEmail,
    founderPhone: payload.founderPhone,
    city: payload.city,
    website: payload.website,
    requestedAmount: payload.requestedAmount,
    minimumTicket: payload.minimumTicket,
    mediaUrls: payload.mediaUrls,
    mapAddress: payload.mapAddress,
    mapLat: payload.mapLat,
    mapLng: payload.mapLng,
  });
}

export function listMockAdminBusinessProjects(payload?: {
  status?: BusinessProjectStatus | "all";
  search?: string;
}) {
  const rows = listBusinessProjects({
    status: payload?.status ?? "all",
    search: payload?.search,
  }) as MockBusinessProjectRecord[];

  return rows.map((row) => {
    const user = getMockBusinessProjectUser(row.id);
    return {
      ...row,
      userId: user?.id ?? null,
      userEmail: user?.email ?? row.founderEmail,
      userName: user?.name ?? row.founderName,
    };
  });
}

export function listMockFavoriteIds(userId: string) {
  return Array.from(favoritesByUser.get(userId) ?? []);
}

export function addMockFavorite(payload: { userId: string; plotId: string }) {
  if (!getPlotById(payload.plotId)) {
    return false;
  }
  ensureFavoriteSet(payload.userId).add(payload.plotId);
  return true;
}

export function removeMockFavorite(payload: { userId: string; plotId: string }) {
  ensureFavoriteSet(payload.userId).delete(payload.plotId);
}

export function createMockNotification(payload: {
  userId: string;
  title: string;
  message: string;
  type: string;
  metadata?: unknown;
  emailHtml?: string;
}) {
  const next: NotificationItem = {
    id: nextId("NTF"),
    createdAt: nowIso(),
    readAt: null,
    title: payload.title,
    message: payload.message,
    type: payload.type,
    metadata: payload.metadata,
    emailHtml: payload.emailHtml ?? null,
  };

  const userNotifications = ensureNotificationList(payload.userId);
  userNotifications.unshift(next);
  return next;
}

export function listMockNotifications(userId: string) {
  return [...ensureNotificationList(userId)];
}

export function markMockNotificationRead(payload: { userId: string; id: string }) {
  const rows = ensureNotificationList(payload.userId);
  let updated = 0;

  rows.forEach((item) => {
    if (item.id === payload.id && !item.readAt) {
      item.readAt = nowIso();
      updated += 1;
    }
  });

  return updated;
}

export function createMockAuditLog(payload: {
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: unknown;
  actorUserId?: string | null;
  actorRole?: Role | null;
}) {
  const next: AuditLogItem = {
    id: nextId("AUD"),
    createdAt: nowIso(),
    action: payload.action,
    entityType: payload.entityType,
    entityId: payload.entityId ?? null,
    details: payload.details ?? null,
    actorRole: payload.actorRole ?? null,
    actorUserId: payload.actorUserId ?? null,
  };

  auditLogs = [next, ...auditLogs];
  return next;
}

export function listMockAuditLogs(limit = 100) {
  return auditLogs.slice(0, limit);
}

