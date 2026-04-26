import { Role } from "@prisma/client";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { ProjectPageView } from "@/components/project-page-view";
import { authOptions } from "@/lib/auth";
import { isMockMode } from "@/lib/data-mode";
import { normalizeBusinessProject } from "@/lib/db-mappers";
import { getMockBusinessProjectById, getMockBusinessProjectUser } from "@/lib/mock-store";
import { prisma } from "@/lib/prisma";
import { BusinessProject, BusinessProjectStatus } from "@/lib/types";

function canViewProject(payload: {
  status: BusinessProjectStatus;
  ownerId?: string | null;
  userId?: string;
  role?: Role;
}) {
  if (payload.status === "approved") return true;
  if (payload.role === "ADMIN" || payload.role === "MODERATOR") return true;
  return Boolean(payload.userId && payload.ownerId && payload.userId === payload.ownerId);
}

async function loadProject(id: string): Promise<BusinessProject | null> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const role = (session?.user?.role as Role | undefined) ?? undefined;

  if (isMockMode()) {
    const project = getMockBusinessProjectById(id);
    if (!project) return null;

    const owner = getMockBusinessProjectUser(id);
    if (!canViewProject({ status: project.status, ownerId: owner?.id, userId, role })) {
      return null;
    }

    return project;
  }

  try {
    const row = await prisma.businessProject.findUnique({
      where: { id },
    });

    if (row) {
      if (!canViewProject({ status: row.status, ownerId: row.userId, userId, role })) {
        return null;
      }

      return normalizeBusinessProject(row);
    }
  } catch {
    // Fallback to mock data below.
  }

  const fallback = getMockBusinessProjectById(id);
  if (!fallback) return null;

  const owner = getMockBusinessProjectUser(id);
  if (!canViewProject({ status: fallback.status, ownerId: owner?.id, userId, role })) {
    return null;
  }

  return fallback;
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await loadProject(id);

  if (!project) {
    notFound();
  }

  return <ProjectPageView project={project} />;
}
