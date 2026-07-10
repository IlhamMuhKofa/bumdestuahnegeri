"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserPlus, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

export default function TambahNasabah() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nama: "",
    nik: "",
    email: "",
    no_hp: "",
    jenis_kelamin: "",
    tanggal_lahir: "",
    alamat: "",
    password: "",
    konfirmasiPassword: "",
  });

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (
    e: FormEvent
  ) => {

    e.preventDefault();

    if (loading) return;

    if (
      !form.nama ||
      !form.email ||
      !form.no_hp ||
      !form.password ||
      !form.konfirmasiPassword
    ) {
      toast.error("Lengkapi seluruh data wajib.");
      return;
    }

    if (
      form.password !==
      form.konfirmasiPassword
    ) {
      toast.error("Konfirmasi password tidak sama.");
      return;
    }

    if (
      form.password.length < 6
    ) {
      toast.error(
        "Password minimal 6 karakter."
      );
      return;
    }

    setLoading(true);

    try {

      const res = await fetch("/api/admin/data_nasabah", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    nama: form.nama,
    nik: form.nik,
    email: form.email,
    no_hp: form.no_hp,
    alamat: form.alamat,
    jenis_kelamin: form.jenis_kelamin,
    tanggal_lahir: form.tanggal_lahir,
    password: form.password,
  }),
});

const result = await res.json();

if (!res.ok) {
  toast.error(result.error);
  return;
}

      toast.success(
        "Nasabah berhasil ditambahkan."
      );

      router.push(
        "/admin/data_nasabah"
      );

      router.refresh();

    } catch (err) {

      toast.error(
        "Terjadi kesalahan."
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      <div className="mx-auto max-w-5xl">

        {/* HEADER */}

        <button
          onClick={() => router.back()}
          className="mb-5 flex items-center gap-2 text-sm text-gray-500 hover:text-green-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </button>

        <div className="mb-8">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-green-100 p-3">

              <UserPlus className="h-6 w-6 text-green-700" />

            </div>

            <div>

              <h1 className="text-3xl font-bold text-gray-800">
                Tambah Nasabah
              </h1>

              <p className="text-sm text-gray-500">
                Tambahkan data anggota baru.
              </p>

            </div>

          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white border shadow-sm p-8"
        >

          <div className="grid gap-6 md:grid-cols-2">

            <Input
              label="Nama Lengkap *"
              name="nama"
              value={form.nama}
              onChange={handleChange}
            />



            <Input
              label="NIK"
              name="nik"
              value={form.nik}
              onChange={handleChange}
            />

            <Input
              label="Email *"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />

            <Input
              label="No Handphone *"
              name="no_hp"
              value={form.no_hp}
              onChange={handleChange}
            />

            <div>

              <label className="text-sm font-medium text-gray-700">
                Jenis Kelamin
              </label>

              <select
                name="jenis_kelamin"
                value={form.jenis_kelamin}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              >

                <option value="">
                  Pilih Jenis Kelamin
                </option>

                <option value="Laki-laki">
                  Laki-laki
                </option>

                <option value="Perempuan">
                  Perempuan
                </option>

              </select>

            </div>

            <div>

              <label className="text-sm font-medium text-gray-700">
                Tanggal Lahir
              </label>

              <input
                type="date"
                name="tanggal_lahir"
                value={form.tanggal_lahir}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />

            </div>

            <div />

            <div className="md:col-span-2">

              <label className="text-sm font-medium text-gray-700">
                Alamat
              </label>

              <textarea
                rows={4}
                name="alamat"
                value={form.alamat}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border px-4 py-3 resize-none"
              />

            </div>

<div>
  <label className="text-sm font-medium text-gray-700">
    Password *
  </label>

  <div className="relative mt-2">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      value={form.password}
      onChange={handleChange}
      className="w-full rounded-xl border px-4 py-3 pr-12 outline-none focus:border-green-600"
    />

    <button
      type="button"
      onClick={() =>
        setShowPassword(!showPassword)
      }
      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
    >
      {showPassword ? (
        <EyeOff className="h-5 w-5" />
      ) : (
        <Eye className="h-5 w-5" />
      )}
    </button>
  </div>
</div>

<div>
  <label className="text-sm font-medium text-gray-700">
    Konfirmasi Password *
  </label>

  <div className="relative mt-2">
    <input
      type={
        showPassword
          ? "text"
          : "password"
      }
      name="konfirmasiPassword"
      value={form.konfirmasiPassword}
      onChange={handleChange}
      className="w-full rounded-xl border px-4 py-3 pr-12 outline-none focus:border-green-600"
    />

    <button
      type="button"
      onClick={() =>
        setShowPassword(
          !showPassword
        )
      }
      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
    >
      {showPassword ? (
        <EyeOff className="h-5 w-5" />
      ) : (
        <Eye className="h-5 w-5" />
      )}
    </button>
  </div>
</div>

          </div>

          <div className="mt-10 flex justify-end gap-3">

            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl border px-6 py-3 hover:bg-gray-100"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#1a3c2e] px-8 py-3 text-white hover:bg-[#143126] disabled:opacity-50"
            >
              {loading
                ? "Menyimpan..."
                : "Simpan Nasabah"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

type InputProps = {
  label: string;
  name: string;
  value: string;
  onChange: any;
  type?: string;
};

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
}: InputProps) {

  return (
    <div>

      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-2 w-full rounded-xl border px-4 py-3 outline-none transition focus:border-green-600"
      />

    </div>
  );

}