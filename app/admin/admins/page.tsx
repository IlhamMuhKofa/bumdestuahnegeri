import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import ClientPage from "./client";

export default async function AdminsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const admins = await prisma.anggota.findMany({
    where: {
      role: "admin",
    },
    select: {
      id: true,
      nama: true,
      username: true,
      email: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <ClientPage
      admins={admins}
      currentAdminId={Number((session.user as any).id)}
    />
  );
}
