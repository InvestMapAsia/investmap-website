import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isMockMode } from "@/lib/data-mode";
import { normalizePlot } from "@/lib/db-mappers";
import { listMockAdminQueue } from "@/lib/mock-store";
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
    return NextResponse.json({ data: listMockAdminQueue() });
  }

  const queue = await prisma.plot.findMany({
    where: { OR: [{ status: "moderation" }, { status: "legal_issue" }] },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ data: queue.map(normalizePlot) });
}
