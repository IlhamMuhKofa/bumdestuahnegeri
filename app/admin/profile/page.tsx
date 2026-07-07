import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import AddAdminModal from "./AddModal";

import {
  Shield,
  User,
  Mail,
  Calendar,
  Users,
  UserPlus,
} from "lucide-react";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const currentAdmin = await prisma.anggota.findUnique({
    where: {
      email: session.user.email,
    },
  });

  const admins = await prisma.anggota.findMany({
    where: {
      role: "admin",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalAdmin = admins.length;

  const activeAdmin = admins.filter(
    (a) => a.status === "active"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Profile Admin
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Kelola profile dan akun administrator sistem
          </p>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white rounded-3xl border shadow-sm p-8">

          <div className="flex items-center gap-4 mb-8">

            <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-700">
              {currentAdmin?.nama?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {currentAdmin?.nama}
              </h2>

              <p className="text-sm text-gray-500">
                Administrator Sistem
              </p>
            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-5">

            <div className="rounded-2xl bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">
                    Nama
                  </p>
                  <p className="font-semibold">
                    {currentAdmin?.nama}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">
                    Email
                  </p>
                  <p className="font-semibold">
                    {currentAdmin?.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">
                    Role
                  </p>
                  <p className="font-semibold">
                    {currentAdmin?.role}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">
                    Bergabung
                  </p>
                  <p className="font-semibold">
                    {currentAdmin?.createdAt
                      ? new Date(
                          currentAdmin.createdAt
                        ).toLocaleDateString("id-ID")
                      : "-"}
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* TABLE ADMIN */}
        <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">

          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="font-bold text-gray-800">
                Kelola Admin
              </h2>

              <p className="text-sm text-gray-500">
                Daftar seluruh akun administrator
              </p>
            </div>

            {/* BONUS: tombol ini juga buka modal */}
            <AddAdminModal
              trigger={
                <button className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-xl text-sm font-semibold">
                  + Tambah Admin
                </button>
              }
            />

          </div>

          <table className="w-full text-sm">

            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="px-6 py-4 text-left">
                  Nama
                </th>
                <th className="px-6 py-4 text-left">
                  Email
                </th>
                <th className="px-6 py-4 text-center">
                  Status
                </th>
                <th className="px-6 py-4 text-center">
                  Role
                </th>
                <th className="px-6 py-4 text-center">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {admins.map((admin) => (
                <tr
                  key={admin.id}
                  className="border-t"
                >
                  <td className="px-6 py-4">
                    {admin.nama}
                  </td>

                  <td className="px-6 py-4">
                    {admin.email}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {admin.status === "active" ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                        Aktif
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">
                        Nonaktif
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {admin.role}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button className="text-red-600 hover:text-red-700 text-xs font-semibold">
                      Nonaktifkan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
}