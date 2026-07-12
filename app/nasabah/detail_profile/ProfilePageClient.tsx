"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Pencil, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { signOut } from "next-auth/react";

type User = {
  id: number;
  nama: string | null;
  email: string;
  alamat: string | null;
  no_hp: string | null;
  pekerjaan: string | null;
  jenis_kelamin: string | null;
  tanggal_lahir: Date | string | null;
  nik: string | null;
  foto_diri: string | null;
  // jenis_agunan: string | null;
  isProfileComplete: boolean;
};

function calcProgress(u: User) {
  // Yang dianggap wajib untuk bisa ajukan pinjaman:
  const fields = [
    { key: "nama", label: "Nama" },
    { key: "alamat", label: "Alamat" },
    { key: "no_hp", label: "No. HP" },
    { key: "pekerjaan", label: "Pekerjaan" },
    { key: "jenis_kelamin", label: "Jenis kelamin" },
    { key: "tanggal_lahir", label: "Tanggal lahir" },
    { key: "nik", label: "NIK" },
    { key: "foto_diri", label: "Foto diri" },
    // { key: "jenis_agunan", label: "Jenis agunan" },
  ] as const;

  const missing = fields.filter((f) => {
    const v = (u as any)[f.key];
    return v === null || v === undefined || v === "";
  });

  const total = fields.length;
  const filled = total - missing.length;
  const pct = Math.round((filled / total) * 100);

  return { pct, missing: missing.map((m) => m.label), filled, total };
}

function ProgressRing({ pct }: { pct: number }) {
  const radius = 44;
  const stroke = 10;
  const c = 2 * Math.PI * radius;
  const offset = c - (pct / 100) * c;

  return (
    <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center">
      <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90 h-full w-full">
        <circle
          cx="60"
          cy="60"
          r={radius}
          strokeWidth={stroke}
          className="fill-none stroke-slate-200"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="fill-none stroke-emerald-600"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-lg sm:text-xl font-bold text-slate-900">{pct}%</div>
        <div className="text-[11px] sm:text-xs font-medium text-slate-500">Complete</div>
      </div>
    </div>
  );
}

export default function ProfilePageClient({ initialUser }: { initialUser: User }) {
  const [user, setUser] = useState<User>(initialUser);
  const [openEdit, setOpenEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  const progress = useMemo(() => calcProgress(user), [user]);
  const { update } = useSession(); // penting untuk refresh session (avatar navbar)

  const [form, setForm] = useState({
    nama: user.nama ?? "",
    alamat: user.alamat ?? "",
    no_hp: user.no_hp ?? "",
    pekerjaan: user.pekerjaan ?? "",
    jenis_kelamin: user.jenis_kelamin ?? "",
    tanggal_lahir: user.tanggal_lahir
      ? new Date(user.tanggal_lahir).toISOString().slice(0, 10)
      : "",
    nik: user.nik ?? "",
    email: user.email,
    // jenis_agunan: user.jenis_agunan ?? "",
  });

  function openModal() {
    setForm({
      nama: user.nama ?? "",
      alamat: user.alamat ?? "",
      no_hp: user.no_hp ?? "",
      pekerjaan: user.pekerjaan ?? "",
      jenis_kelamin: user.jenis_kelamin ?? "",
      tanggal_lahir: user.tanggal_lahir
        ? new Date(user.tanggal_lahir).toISOString().slice(0, 10)
        : "",
      nik: user.nik ?? "",
      email: user.email,
      // jenis_agunan: user.jenis_agunan ?? "",
    });
    setOpenEdit(true);
  }

  async function saveProfile() {
    try {
      setSaving(true);
      const res = await fetch("/api/upload/image", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data?.message || "Gagal menyimpan");

      setUser(data.user);
      setOpenEdit(false);

      // ✅ TOAST SUCCESS
      toast.success("Profil berhasil disimpan.", {
        position: "top-right",
        autoClose: 3500,
      });

      await update(); // optional refresh session
    } catch (e: any) {
      // ✅ TOAST ERROR (ganti alert)
      toast.error(e?.message || "Gagal menyimpan.", {
        position: "top-right",
        autoClose: 3500
      });
    } finally {
      setSaving(false);
    }
  }

  async function onUploadPhoto(file: File) {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/upload/image", {
      method: "POST",
      body: fd,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(data?.message || "Gagal upload foto profil.", {
        position: "top-right",
        autoClose: 3500,
      });
      return;
    }

    setUser((prev) => ({ ...prev, foto_diri: data.url }));

    toast.success("Foto profil berhasil diunggah.", {
      position: "top-right",
      autoClose: 3500,
    });

    await update({ image: data.url }); // navbar ikut berubah
  }

  async function removePhoto() {
    const res = await fetch("/api/nasabah/profile/photo", {
      method: "DELETE",
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      toast.error(data?.message || "Gagal hapus foto profil.", {
        position: "top-right",
        autoClose: 3500,
      });
      return;
    }

    setUser((prev) => ({ ...prev, foto_diri: null }));

    toast.success("Foto profil berhasil dihapus.", {
      position: "top-right",
      autoClose: 3500,
    });

    await update({ image: null });
  }

  async function handleLogout() {
    const result = await Swal.fire({
      title: "Keluar?",
      text: "Apakah Anda yakin ingin keluar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, keluar",
      cancelButtonText: "Batal",
      
    });

    if (!result.isConfirmed) return;

    toast.info("Sedang keluar...");

    setTimeout(() => {
      signOut({ callbackUrl: "/" });
    }, 800);
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-lg sm:text-xl font-bold text-slate-900">Edit Profile</h1>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-3.5 py-2 sm:px-4 text-xs sm:text-sm font-semibold text-white hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-5">
          {/* Photo card */}
          <div className="rounded-2xl border bg-white p-4 sm:p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-full border bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.foto_diri || "/default-avatar.png"}
                    alt="Foto profil"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                    {user.nama || "Nasabah"}
                  </div>
                  <div className="truncate text-xs sm:text-sm text-slate-500">{user.email}</div>
                  <div className="mt-1 text-[11px] sm:text-xs text-slate-400">
                    Rekomendasi minimal 800×800 • JPG/PNG
                  </div>
                </div>
              </div>

              {/* Upload / Ganti + Hapus */}
              <div className="flex flex-col xs:flex-row gap-2 sm:shrink-0">
                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  <Camera className="h-4 w-4 shrink-0" />
                  {user.foto_diri ? "Ganti foto" : "Upload foto"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) onUploadPhoto(f);
                      e.currentTarget.value = ""; // biar bisa upload file yang sama lagi
                    }}
                  />
                </label>

                {/* Hapus */}
                {user.foto_diri && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (!confirm("Hapus foto profil dan kembali ke default?")) return;
                      await removePhoto();
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-xs sm:text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Hapus foto
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Personal info */}
          <div className="rounded-2xl border bg-white p-4 sm:p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm sm:text-base font-bold text-slate-900">Data Pribadi</div>
                <div className="text-xs sm:text-sm text-slate-500">
                  Pastikan data benar agar pengajuan lancar.
                </div>
              </div>

              <button
                onClick={openModal}
                className="inline-flex w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-emerald-800"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
            </div>

            <div className="mt-4 sm:mt-5 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
              <Info label="Nama" value={user.nama} />
              <Info label="No. HP" value={user.no_hp} />
              <Info label="Alamat" value={user.alamat} />
              <Info label="Pekerjaan" value={user.pekerjaan} />
              <Info label="Jenis kelamin" value={user.jenis_kelamin} />
              <Info
                label="Tanggal lahir"
                value={
                  user.tanggal_lahir
                    ? new Date(user.tanggal_lahir).toLocaleDateString("id-ID")
                    : null
                }
              />
              <Info label="NIK" value={user.nik} />
              <Info label="Email" value={user.email} />
              {/* <Info label="Jenis agunan" value={user.jenis_agunan} /> */}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border bg-white p-4 sm:p-5 shadow-sm">
            <div className="text-sm sm:text-base font-bold text-slate-900">
              Complete your profile
            </div>

            <div className="mt-4 flex items-center justify-center">
              <ProgressRing pct={progress.pct} />
            </div>

            <div className="mt-4 space-y-2 text-xs sm:text-sm">
              <div className="font-semibold text-slate-900">
                Terisi {progress.filled}/{progress.total}
              </div>
              <div className="text-slate-500">
                Lengkapi data agar bisa mengajukan pinjaman.
              </div>

              {progress.missing.length > 0 && (
                <div className="mt-3 rounded-xl bg-slate-50 p-3">
                  <div className="text-xs font-semibold text-slate-700">
                    Yang belum terisi:
                  </div>
                  <ul className="mt-2 list-disc pl-5 text-xs text-slate-600 space-y-1">
                    {progress.missing.slice(0, 6).map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                    {progress.missing.length > 6 && (
                      <li>+{progress.missing.length - 6} lainnya</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL EDIT (background blur, tidak pindah halaman) */}
      <AnimatePresence>
        {openEdit && (
          <motion.div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4"
            style={{ position: "fixed" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}


          >
            {/* overlay blur */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setOpenEdit(false)}
            />

            <motion.div
              className="relative flex w-full max-w-2xl max-h-[90vh] flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
              initial={{ y: 16, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 16, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              {/* HEADER - fixed, tidak ikut scroll */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-4 sm:p-5 shrink-0">
                <div className="min-w-0">
                  <div className="text-base sm:text-lg font-bold text-slate-900">
                    Edit Data Pribadi
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500">
                    Data yang sudah ada akan terisi otomatis.
                  </div>
                </div>
                <button
                  onClick={() => setOpenEdit(false)}
                  className="shrink-0 rounded-xl border p-2 hover:bg-slate-50"
                  aria-label="Tutup"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>

              {/* BODY - scrollable */}
              <div className="overflow-y-auto p-4 sm:p-5">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Field label="Nama" value={form.nama} onChange={(v) => setForm((p) => ({ ...p, nama: v }))} />
                  <Field label="No. HP" value={form.no_hp} onChange={(v) => setForm((p) => ({ ...p, no_hp: v }))} />
                  <Field label="Alamat" value={form.alamat} onChange={(v) => setForm((p) => ({ ...p, alamat: v }))} />
                  <Field label="Pekerjaan" value={form.pekerjaan} onChange={(v) => setForm((p) => ({ ...p, pekerjaan: v }))} />
                  <SelectField
                    label="Jenis kelamin"
                    value={form.jenis_kelamin}
                    onChange={(v) => setForm((p) => ({ ...p, jenis_kelamin: v }))}
                    options={["", "Laki-laki", "Perempuan"]}
                  />
                  <DateField
                    label="Tanggal lahir"
                    value={form.tanggal_lahir}
                    onChange={(v) => setForm((p) => ({ ...p, tanggal_lahir: v }))}
                  />
                  <Field label="NIK" value={form.nik} onChange={(v) => setForm((p) => ({ ...p, nik: v }))} />
                  <Field label="Email" value={form.email} onChange={(v) => setForm((p) => ({ ...p, email: v }))} />
                  {/* <Field
                    label="Jenis agunan"
                    value={form.jenis_agunan}
                    onChange={(v) => setForm((p) => ({ ...p, jenis_agunan: v }))}
                    placeholder="Contoh: BPKB / Sertifikat / dll"
                  /> */}
                </div>
              </div>

              {/* FOOTER - fixed, tidak ikut scroll */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 border-t border-slate-100 p-4 sm:p-5 shrink-0">
                <button
                  onClick={() => setOpenEdit(false)}
                  className="w-full sm:w-auto rounded-xl border px-4 py-2.5 sm:py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="w-full sm:w-auto rounded-xl bg-emerald-700 px-4 py-2.5 sm:py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
                >
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  const empty = value === null || value === undefined || value === "";
  return (
    <div className="rounded-xl border p-3.5 sm:p-4">
      <div className="text-xs font-semibold text-slate-500">{label}</div>
      <div className={`mt-1 text-sm font-semibold break-words ${empty ? "text-slate-400" : "text-slate-900"}`}>
        {empty ? "Belum diisi" : String(value)}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <div className="text-sm font-semibold text-slate-700">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border px-3 py-2.5 sm:py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-600"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <div className="text-sm font-semibold text-slate-700">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border px-3 py-2.5 sm:py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-600"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o === "" ? "Pilih" : o}
          </option>
        ))}
      </select>
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="text-sm font-semibold text-slate-700">{label}</div>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border px-3 py-2.5 sm:py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-600"
      />
    </div>
  );
}