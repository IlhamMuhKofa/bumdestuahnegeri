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

  const handleSubmit = async (e: FormEvent) => {
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

    if (form.password !== form.konfirmasiPassword) {
      toast.error("Konfirmasi password tidak sama.");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password minimal 6 karakter.");
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

      toast.success("Nasabah berhasil ditambahkan.");

      router.push("/admin/data_nasabah");
      router.refresh();
    } catch (err) {
      toast.error("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-4 inline-flex h-9 items-center gap-2 rounded-lg px-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#2553d8]"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
              <UserPlus className="h-5 w-5 text-[#2553d8]" />
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[30px]">
                Tambah Nasabah
              </h1>

              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                Tambahkan data anggota baru.
              </p>
            </div>
          </div>
        </div>

        {/* FORM CARD */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          {/* SECTION HEADER */}
          <div className="mb-5 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Informasi Nasabah
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Lengkapi informasi nasabah dengan data yang benar.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

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

            {/* JENIS KELAMIN */}
            <div>
              <label
                htmlFor="jenis_kelamin"
                className="text-sm font-semibold text-slate-700"
              >
                Jenis Kelamin
              </label>

              <select
                id="jenis_kelamin"
                name="jenis_kelamin"
                value={form.jenis_kelamin}
                onChange={handleChange}
                className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition-all focus:border-[#2553d8] focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            {/* TANGGAL LAHIR */}
            <div>
              <label
                htmlFor="tanggal_lahir"
                className="text-sm font-semibold text-slate-700"
              >
                Tanggal Lahir
              </label>

              <input
                id="tanggal_lahir"
                type="date"
                name="tanggal_lahir"
                value={form.tanggal_lahir}
                onChange={handleChange}
                className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition-all focus:border-[#2553d8] focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* ALAMAT */}
            <div className="md:col-span-2">
              <label
                htmlFor="alamat"
                className="text-sm font-semibold text-slate-700"
              >
                Alamat
              </label>

              <textarea
                id="alamat"
                rows={4}
                name="alamat"
                value={form.alamat}
                onChange={handleChange}
                className="mt-2 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#2553d8] focus:ring-2 focus:ring-blue-100"
                placeholder="Masukkan alamat lengkap nasabah"
              />
            </div>

            {/* PASSWORD */}
            <PasswordInput
              label="Password *"
              name="password"
              value={form.password}
              onChange={handleChange}
              showPassword={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
            />

            {/* KONFIRMASI PASSWORD */}
            <PasswordInput
              label="Konfirmasi Password *"
              name="konfirmasiPassword"
              value={form.konfirmasiPassword}
              onChange={handleChange}
              showPassword={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
            />
          </div>

          {/* ACTION */}
          <div className="mt-6 flex flex-col-reverse gap-2.5 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-[#2553d8] px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#1f46b8] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan Nasabah"}
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
  onChange: (
    e: ChangeEvent<HTMLInputElement>
  ) => void;
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
      <label
        htmlFor={name}
        className="text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#2553d8] focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

type PasswordInputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: ChangeEvent<HTMLInputElement>
  ) => void;
  showPassword: boolean;
  onToggle: () => void;
};

function PasswordInput({
  label,
  name,
  value,
  onChange,
  showPassword,
  onToggle,
}: PasswordInputProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <div className="relative mt-2">
        <input
          id={name}
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 pr-11 text-sm text-slate-800 outline-none transition-all focus:border-[#2553d8] focus:ring-2 focus:ring-blue-100"
        />

        <button
          type="button"
          aria-label={
            showPassword
              ? "Sembunyikan password"
              : "Tampilkan password"
          }
          onClick={onToggle}
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}