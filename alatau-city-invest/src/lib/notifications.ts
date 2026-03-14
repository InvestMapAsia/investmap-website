import { ApplicationStatus } from "@prisma/client";
import { isMockMode } from "@/lib/data-mode";
import { buildApplicationStatusEmailTemplate } from "@/lib/email/templates";
import { createMockNotification } from "@/lib/mock-store";
import { prisma } from "@/lib/prisma";

export async function createInAppNotification(payload: {
  userId: string;
  title: string;
  message: string;
  type: string;
  metadata?: unknown;
  emailHtml?: string;
}) {
  if (isMockMode()) {
    return createMockNotification(payload);
  }

  return prisma.notification.create({
    data: {
      userId: payload.userId,
      title: payload.title,
      message: payload.message,
      type: payload.type,
      metadata: payload.metadata ? (payload.metadata as object) : undefined,
      emailHtml: payload.emailHtml,
    },
  });
}

export async function createApplicationStatusNotifications(payload: {
  userId: string;
  investorName: string;
  applicationId: string;
  plotId: string;
  status: ApplicationStatus;
  reviewNote?: string | null;
}) {
  const statusMessage = `Application ${payload.applicationId} changed to ${payload.status}.`;

  const emailHtml = buildApplicationStatusEmailTemplate({
    investorName: payload.investorName,
    applicationId: payload.applicationId,
    plotId: payload.plotId,
    status: payload.status,
    reviewNote: payload.reviewNote,
  });

  return createInAppNotification({
    userId: payload.userId,
    title: "Application status updated",
    message: statusMessage,
    type: "application_status",
    metadata: {
      applicationId: payload.applicationId,
      plotId: payload.plotId,
      status: payload.status,
    },
    emailHtml,
  });
}
