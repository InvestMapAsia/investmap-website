import crypto from "node:crypto";
import { Role } from "@prisma/client";
import { isMockMode } from "@/lib/data-mode";
import {
  consumeMockEmailVerificationToken,
  createMockEmailVerificationToken,
} from "@/lib/mock-store";
import { prisma } from "@/lib/prisma";

const DEFAULT_TTL_HOURS = 24;

function getTtlHours() {
  const raw = Number(process.env.EMAIL_VERIFICATION_TTL_HOURS);
  if (!Number.isFinite(raw) || raw <= 0) return DEFAULT_TTL_HOURS;
  return raw;
}

function resolveOrigin(origin?: string) {
  const base = process.env.NEXTAUTH_URL || origin || "http://localhost:3000";
  return base.replace(/\/+$/, "");
}

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function issueEmailVerificationToken(payload: {
  email: string;
  origin?: string;
}) {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + getTtlHours() * 60 * 60 * 1000);

  if (isMockMode()) {
    createMockEmailVerificationToken({
      email: payload.email,
      token: tokenHash,
      expiresAt,
    });
  } else {
    await prisma.verificationToken.deleteMany({
      where: { identifier: payload.email },
    });
    await prisma.verificationToken.create({
      data: {
        identifier: payload.email,
        token: tokenHash,
        expires: expiresAt,
      },
    });
  }

  const verificationUrl = `${resolveOrigin(payload.origin)}/api/auth/verify-email?token=${encodeURIComponent(token)}`;

  return {
    token,
    expiresAt,
    verificationUrl,
  };
}

export async function consumeEmailVerificationToken(token: string) {
  if (!token) {
    return { ok: false as const, reason: "missing" as const };
  }

  const tokenHash = hashToken(token);

  if (isMockMode()) {
    const result = consumeMockEmailVerificationToken(tokenHash);
    if (result.status !== "verified" || !result.user) {
      return { ok: false as const, reason: result.status };
    }

    return {
      ok: true as const,
      email: result.user.email,
      userId: result.user.id,
      role: result.user.role,
    };
  }

  const tokenRow = await prisma.verificationToken.findUnique({
    where: { token: tokenHash },
  });

  if (!tokenRow) {
    return { ok: false as const, reason: "invalid" as const };
  }

  if (tokenRow.expires < new Date()) {
    await prisma.verificationToken.deleteMany({
      where: { token: tokenHash },
    });
    return { ok: false as const, reason: "expired" as const };
  }

  const user = await prisma.user.findUnique({
    where: { email: tokenRow.identifier },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    await prisma.verificationToken.deleteMany({
      where: { token },
    });
    return { ok: false as const, reason: "invalid" as const };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { emailVerifiedAt: new Date() },
    }),
    prisma.verificationToken.deleteMany({
      where: { identifier: tokenRow.identifier },
    }),
  ]);

  return {
    ok: true as const,
    email: user.email,
    userId: user.id,
    role: user.role as Role,
  };
}
