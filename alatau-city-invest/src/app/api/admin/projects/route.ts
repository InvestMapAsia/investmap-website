import { BusinessProjectStatus, Prisma, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isMockMode } from "@/lib/data-mode";
import { normalizeBusinessProject } from "@/lib/db-mappers";
import { sanitizeOptionalText } from "@/lib/input-security";
import { listMockAdminBusinessProjects } from "@/lib/mock-store";
import { prisma } from "@/lib/prisma";

const businessProjectStatuses = new Set<BusinessProjectStatus>([
  "submitted",
  "under_review",
  "needs_revision",
  "approved",
  "rejected",
]);

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = session.user.role as Role;
  if (role !== "ADMIN" && role !== "MODERATOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const searchParams = request.nextUrl.searchParams;
  const status =
    (searchParams.get("status") as BusinessProjectStatus | "all" | null) ?? "all";
  const search = sanitizeOptionalText(searchParams.get("search"), 120);

  if (status !== "all" && !businessProjectStatuses.has(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  if (isMockMode()) {
    return NextResponse.json({
      data: listMockAdminBusinessProjects({ status, search }),
    });
  }

  const where: Prisma.BusinessProjectWhereInput = {};

  if (status !== "all") {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { companyName: { contains: search, mode: "insensitive" } },
      { market: { contains: search, mode: "insensitive" } },
      { founderName: { contains: search, mode: "insensitive" } },
      { founderEmail: { contains: search, mode: "insensitive" } },
    ];
  }

  const rows = await prisma.businessProject.findMany({
    where,
    include: {
      user: { select: { id: true, email: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    data: rows.map((row) => ({
      ...normalizeBusinessProject(row),
      userId: row.user?.id ?? null,
      userEmail: row.user?.email ?? row.founderEmail,
      userName: row.user?.name ?? row.founderName,
    })),
  });
}
