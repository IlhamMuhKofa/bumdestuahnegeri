"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { editAdmin, hapusAdmin, resetPasswordAdmin, tambahAdmin } from "./action";

type Admin = {
  id: number;
  nama: string | null;
  username: string | null;
  email: string;
  createdAt: Date | string;
};

type Props = {
  admins: Admin[];
  currentAdminId: number;
};

export default function ClientPage({
  admins,
  currentAdminId,
}: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState<Admin | null>(null);
  const [resetting, setResetting] = useState<Admin | null>(null);

  const runAction = async (action: () => Promise<void>) => {
    try {
      await action();
      router.refresh();
      setEditing(null);
      setResetting(null);
    } catch (error: any) {
      alert(error.message || "Aksi gagal");
    }
  };

  const handleDelete = async (admin: Admin) => {
    if (admin.id === currentAdminId) {
      alert("Admin yang sedang login tidak bisa menghapus akunnya sendiri");
      return;
    }

    const ok = confirm(`Hapus admin ${admin.nama || admin.username}?`);
    if (!ok) return;

    await runAction(() => hapusAdmin(admin.id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-5 md:p-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Akun Admin</h1>
        <p className="mt-1 text-sm text-gray-500">
          Tambah, edit, reset password, dan hapus akun administrator
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <form
          action={(formData) => runAction(() => tambahAdmin(formData))}
          className="rounded-2xl border bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-bold text-gray-800">Tambah Admin</h2>
          <Field name="nama" label="Nama" />
          <Field name="username" label="Username" />
          <Field name="password" label="Password" type="password" />
          <button className="mt-5 w-full rounded-xl bg-green-700 py-3 text-sm font-semibold text-white hover:bg-green-800">
            Tambah Admin
          </button>
        </form>

        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-bold text-gray-800">List Admin</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-gray-50 text-left text-gray-600">
                <tr>
                  <th className="px-5 py-4">Nama</th>
                  <th className="px-5 py-4">Username</th>
                  <th className="px-5 py-4">Tanggal Dibuat</th>
                  <th className="px-5 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} className="border-t">
                    <td className="px-5 py-4 font-medium text-gray-800">
                      {admin.nama || "-"}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {admin.username || admin.email}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {new Date(admin.createdAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setEditing(admin)}
                          className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setResetting(admin)}
                          className="rounded-lg bg-yellow-50 px-3 py-2 text-xs font-semibold text-yellow-700"
                        >
                          Reset Password
                        </button>
                        <button
                          onClick={() => handleDelete(admin)}
                          className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editing && (
        <Modal title="Edit Admin" onClose={() => setEditing(null)}>
          <form action={(formData) => runAction(() => editAdmin(formData))}>
            <input type="hidden" name="id" value={editing.id} />
            <Field name="nama" label="Nama" defaultValue={editing.nama || ""} />
            <Field
              name="username"
              label="Username"
              defaultValue={editing.username || editing.email}
            />
            <button className="mt-5 w-full rounded-xl bg-green-700 py-3 text-sm font-semibold text-white">
              Simpan Perubahan
            </button>
          </form>
        </Modal>
      )}

      {resetting && (
        <Modal title="Reset Password" onClose={() => setResetting(null)}>
          <form action={(formData) => runAction(() => resetPasswordAdmin(formData))}>
            <input type="hidden" name="id" value={resetting.id} />
            <Field name="password" label="Password Baru" type="password" />
            <button className="mt-5 w-full rounded-xl bg-green-700 py-3 text-sm font-semibold text-white">
              Reset Password
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  defaultValue,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string;
}) {
  return (
    <label className="mt-4 block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500"
      />
    </label>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="rounded-lg px-3 py-1 text-gray-500 hover:bg-gray-100">
            Tutup
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
