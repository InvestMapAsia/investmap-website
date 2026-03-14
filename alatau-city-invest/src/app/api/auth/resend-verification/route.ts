import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { writeAuditLog } from "@/lib/audit";
import { isMockMode } from "@/lib/data-mode";
import { sendEmail } from "@/lib/email/sender";
import { buildEmailVerificationTemplate } from "@/lib/email/templates";
import { issueEmailVerificationToken } from "@/lib/email/verification";
import { findMockUserByEmail, getMockEmailVerificationStatus } from "@/lib/mock-store";
import { prisma } from "@/lib/prisma";

const resendSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  const body = (await request.json()) as unknown;
  const parsed = resendSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const allowPreviewLink = process.env.NODE_ENV !== "production";

  if (isMockMode()) {
    const status = getMockEmailVerificationStatus(email);
    if (!status.exists) {
      return NextResponse.json({
        ok: true,
        sent: false,
        provider: "console",
        previewUrl: null,
      });
    }

    if (status.verified) {
      return NextResponse.json({
        ok: true,
        alreadyVerified: true,
        sent: false,
        provider: "console",
        previewUrl: null,
      });
    }

    const user = findMockUserByEmail(email);
    if (!user) {
      return NextResponse.json({
        ok: true,
        sent: false,
        provider: "console",
        previewUrl: null,
      });
    }

    const verification = await issueEmailVerificationToken({
      email: user.email,
      origin: request.nextUrl.origin,
    });

    const html = buildEmailVerificationTemplate({
      name: user.name,
      verificationUrl: verification.verificationUrl,
    });

    const sendResult = await sendEmail({
      to: user.email,
      subject: "Confirm your email - Alatau City Invest",
      html,
    });

    await writeAuditLog({
      action: "USER_EMAIL_VERIFICATION_RESENT",
      entityType: "User",
      entityId: user.id,
      actorUserId: user.id,
      actorRole: user.role,
      details: {
        email: user.email,
        provider: sendResult.provider,
        sent: sendResult.sent,
        expiresAt: verification.expiresAt.toISOString(),
      },
    });

    return NextResponse.json({
      ok: true,
      sent: sendResult.sent,
      provider: sendResult.provider,
      previewUrl: !sendResult.sent && allowPreviewLink ? verification.verificationUrl : null,
    });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      emailVerifiedAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({
      ok: true,
      sent: false,
      provider: "console",
      previewUrl: null,
    });
  }

  if (user.emailVerifiedAt) {
    return NextResponse.json({
      ok: true,
      alreadyVerified: true,
      sent: false,
      provider: "console",
      previewUrl: null,
    });
  }

  const verification = await issueEmailVerificationToken({
    email: user.email,
    origin: request.nextUrl.origin,
  });

  const html = buildEmailVerificationTemplate({
    name: user.name,
    verificationUrl: verification.verificationUrl,
  });

  const sendResult = await sendEmail({
    to: user.email,
    subject: "Confirm your email - Alatau City Invest",
    html,
  });

  await writeAuditLog({
    action: "USER_EMAIL_VERIFICATION_RESENT",
    entityType: "User",
    entityId: user.id,
    actorUserId: user.id,
    actorRole: user.role,
    details: {
      email: user.email,
      provider: sendResult.provider,
      sent: sendResult.sent,
      expiresAt: verification.expiresAt.toISOString(),
    },
  });

  return NextResponse.json({
    ok: true,
    sent: sendResult.sent,
    provider: sendResult.provider,
    previewUrl: !sendResult.sent && allowPreviewLink ? verification.verificationUrl : null,
  });
}
