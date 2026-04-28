import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AdminPageClient } from "@/components/admin-page-client";
import { authOptions } from "@/lib/auth";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role as Role | undefined;

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin");
  }

  if (role !== "ADMIN" && role !== "MODERATOR") {
    redirect("/");
  }

  return <AdminPageClient />;
}
