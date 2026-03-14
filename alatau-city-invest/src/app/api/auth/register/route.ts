import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { writeAuditLog } from "@/lib/audit";
import { isMockMode } from "@/lib/data-mode";
import { sendEmail } from "@/lib/email/sender";
import { buildEmailVerificationTemplate } from "@/lib/email/templates";
import { issueEmailVerificationToken } from "@/lib/email/verification";
import { registerMockUser } from "@/lib/mock-store";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  role: z.enum(["INVESTOR", "OWNER"]),
});

export async function POST(request: NextRequest) {
  const body = (await request.json()) as unknown;
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { name, email, password, role } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();
  const allowPreviewLink = process.env.NODE_ENV !== "production";

  if (isMockMode()) {
    const user = registerMockUser({
      name,
      email: normalizedEmail,
      password,
      role,
    });

    if (!user) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    await writeAuditLog({
      action: "USER_REGISTERED",
      entityType: "User",
      entityId: user.id,
      actorUserId: user.id,
      actorRole: user.role,
      details: {
        email: user.email,
      },
    });

    const verification = await issueEmailVerificationToken({
      email: user.email,
      origin: request.nextUrl.origin,
    });

    const emailHtml = buildEmailVerificationTemplate({
      name: user.name,
      verificationUrl: verification.verificationUrl,
    });

    const emailResult = await sendEmail({
      to: user.email,
      subject: "Confirm your email - Alatau City Invest",
      html: emailHtml,
    });

    await writeAuditLog({
      action: "USER_EMAIL_VERIFICATION_ISSUED",
      entityType: "User",
      entityId: user.id,
      actorUserId: user.id,
      actorRole: user.role,
      details: {
        email: user.email,
        provider: emailResult.provider,
        sent: emailResult.sent,
        error: emailResult.error ?? null,
        expiresAt: verification.expiresAt.toISOString(),
      },
    });

    return NextResponse.json(
      {
        data: user,
        verification: {
          required: true,
          sent: emailResult.sent,
          provider: emailResult.provider,
          error: emailResult.error ?? null,
          expiresAt: verification.expiresAt.toISOString(),
          previewUrl:
            !emailResult.sent && allowPreviewLink ? verification.verificationUrl : null,
        },
      },
      { status: 201 }
    );
  }

  const exists = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (exists) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      passwordHash,
      role: role as Role,
    },
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
      emailVerifiedAt: true,
    },
  });

  await writeAuditLog({
    action: "USER_REGISTERED",
    entityType: "User",
    entityId: user.id,
    actorUserId: user.id,
    actorRole: user.role,
    details: {
      email: user.email,
    },
  });

  const verification = await issueEmailVerificationToken({
    email: user.email,
    origin: request.nextUrl.origin,
  });

  const emailHtml = buildEmailVerificationTemplate({
    name: user.name,
    verificationUrl: verification.verificationUrl,
  });

  const emailResult = await sendEmail({
    to: user.email,
    subject: "Confirm your email - Alatau City Invest",
    html: emailHtml,
  });

  await writeAuditLog({
    action: "USER_EMAIL_VERIFICATION_ISSUED",
    entityType: "User",
    entityId: user.id,
    actorUserId: user.id,
    actorRole: user.role,
    details: {
      email: user.email,
      provider: emailResult.provider,
      sent: emailResult.sent,
      error: emailResult.error ?? null,
      expiresAt: verification.expiresAt.toISOString(),
    },
  });

  return NextResponse.json(
    {
      data: user,
      verification: {
        required: true,
        sent: emailResult.sent,
        provider: emailResult.provider,
        error: emailResult.error ?? null,
        expiresAt: verification.expiresAt.toISOString(),
        previewUrl:
          !emailResult.sent && allowPreviewLink ? verification.verificationUrl : null,
      },
    },
    { status: 201 }
  );
}
