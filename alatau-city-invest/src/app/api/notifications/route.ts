import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isMockMode } from "@/lib/data-mode";
import { normalizeNotification } from "@/lib/db-mappers";
import { listMockNotifications } from "@/lib/mock-store";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isMockMode()) {
    const rows = listMockNotifications(session.user.id);
    return NextResponse.json({
      data: rows,
      unreadCount: rows.filter((item) => !item.readAt).length,
    });
  }

  const rows = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({
    data: rows.map(normalizeNotification),
    unreadCount: rows.filter((item) => !item.readAt).length,
  });
}
