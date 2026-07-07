"use client";

import { useState, ReactNode } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";

export default function AddAdminModal({
  trigger,
}: {
  trigger: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = await Swal.fire({
  title: "Tambah Admin?",
  text: "Apakah Anda yakin ingin menambahkan admin baru?",
  icon: "question",
  showCancelButton: true,
  confirmButtonText: "Ya, Simpan",
  cancelButtonText: "Batal",
  reverseButtons: true,
  confirmButtonColor: "#1a3c2e",
  cancelButtonColor: "#6b7280",
  heightAuto: false,
});

if (!result.isConfirmed) return;

    try {
      setLoading(true);

      const res = await fetch("/api/admin/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

  setOpen(false);

toast.success("Admin berhasil ditambahkan.");

setTimeout(() => {
    window.location.reload();
}, 500);
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* TRIGGER */}
      <div onClick={() => setOpen(true)}>
        {trigger}
      </div>

      {/* MODAL */}
      {open && (
<div
  className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
  onClick={() => {
    if (!loading) setOpen(false);
  }}
>
          <div
            className="bg-white rounded-3xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-6">
              Tambah Admin
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Nama"
                value={form.nama}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nama: e.target.value,
                  })
                }
                className="w-full border rounded-xl px-4 py-3"
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="w-full border rounded-xl px-4 py-3"
                required
              />

<div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={form.password}
    onChange={(e) =>
      setForm({
        ...form,
        password: e.target.value,
      })
    }
    className="w-full rounded-xl border px-4 py-3 pr-12"
    required
  />

  <button
    type="button"
    onClick={() =>
      setShowPassword(!showPassword)
    }
    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-[#1a3c2e]"
  >
    {showPassword ? (
      <EyeOff size={20} />
    ) : (
      <Eye size={20} />
    )}
  </button>
</div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-xl border"
                >
                  Batal
                </button>

<button
  type="submit"
  disabled={loading}
  className={`px-4 py-2 rounded-xl bg-blue-800 text-white flex items-center gap-2
    ${
      loading
        ? "opacity-70 cursor-not-allowed"
        : "hover:bg-blue-900"
    }`}
>
  {loading ? (
    <>
      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      Menyimpan...
    </>
  ) : (
    "Simpan"
  )}
</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}