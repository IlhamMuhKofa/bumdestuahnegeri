import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import ProfilePageClient from "@/app/nasabah/detail_profile/page";

export default async function ProfilNasabahPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !((session.user as any).id)) redirect("/auth/login");

  const user = await prisma.anggota.findUnique({
    where: { id: Number((session.user as any).id) },
    select: {
      id: true,
      nama: true,
      email: true,
      alamat: true,
      no_hp: true,
      pekerjaan: true,
      jenis_kelamin: true,
      tanggal_lahir: true,
      nik: true,
      foto_diri: true,
      isProfileComplete: true,
    },
  });

  if (!user) redirect("/auth/login");

  return (
    <div className="mx-auto w-full max-w-6xl p-4 md:p-6">
      <ProfilePageClient initialUser={user} />
    </div>
  );
}