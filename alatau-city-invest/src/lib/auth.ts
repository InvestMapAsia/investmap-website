import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { isMockMode } from "@/lib/data-mode";
import { getMockEmailVerificationStatus, validateMockCredentials } from "@/lib/mock-store";
import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function getAuthSecret() {
  const secret = process.env.NEXTAUTH_SECRET;
  const unsafe =
    !secret ||
    secret === "change-this-to-a-long-random-secret" ||
    secret.length < 32;

  if (
    unsafe &&
    (process.env.VERCEL_ENV === "production" || process.env.ENFORCE_STRONG_AUTH_SECRET === "true")
  ) {
    throw new Error("A strong NEXTAUTH_SECRET is required in production.");
  }

  return secret;
}

export const authOptions: NextAuthOptions = {
  secret: getAuthSecret(),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;

        if (isMockMode()) {
          const mockUser = validateMockCredentials(email, password);
          if (!mockUser) {
            return null;
          }

          const verification = getMockEmailVerificationStatus(email);
          if (!verification.verified) {
            throw new Error("EMAIL_NOT_VERIFIED");
          }

          return mockUser;
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user?.passwordHash) {
          return null;
        }

        const matches = await bcrypt.compare(password, user.passwordHash);
        if (!matches) {
          return null;
        }

        if (!user.emailVerifiedAt) {
          throw new Error("EMAIL_NOT_VERIFIED");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user && token.id && token.role) {
        session.user.id = token.id;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
};
