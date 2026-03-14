import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isMockMode } from "@/lib/data-mode";
import { normalizeApplication } from "@/lib/db-mappers";
import { listMockAdminApplications } from "@/lib/mock-store";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = session.user.role as Role;
  if (role !== "ADMIN" && role !== "MODERATOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (isMockMode()) {
    return NextResponse.json({ data: listMockAdminApplications() });
  }

  const rows = await prisma.application.findMany({
    include: {
      plot: { select: { title: true, id: true } },
      user: { select: { id: true, email: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    data: rows.map((row) => ({
      ...normalizeApplication(row),
      plotTitle: row.plot.title,
      userEmail: row.user?.email ?? row.email,
      userName: row.user?.name ?? row.investorName,
      userId: row.user?.id ?? null,
    })),
  });
}
