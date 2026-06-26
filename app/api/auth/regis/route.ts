import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { createNotifikasi } from "@/lib/notifikasi";

const DEFAULT_STATUS = "active"; // ✅ agar bisa login langsung
const DEFAULT_ROLE = "nasabah";

const RegisterSchema = z.object({
  // Tahap 1
  nama: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .transform((v) => v.trim()),

  alamat: z
    .string()
    .min(5, "Alamat minimal 5 karakter")
    .transform((v) => v.trim()),

  pekerjaan: z
    .string()
    .min(2, "Pekerjaan minimal 2 karakter")
    .transform((v) => v.trim()),

  no_hp: z
    .string()
    .optional()
    .transform((v) => (v ?? "").replace(/\s+/g, "").trim())
    .refine((val) => val === "" || /^[0-9]{8,15}$/.test(val), {
      message: "No HP tidak valid (8-15 digit angka)",
    }),

  jenis_kelamin: z.enum(["Laki-laki", "Perempuan"], {
    message: "Jenis kelamin wajib dipilih",
  }),

  tanggal_lahir: z
    .string()
    .min(1, "Tanggal lahir wajib diisi")
    .refine((v) => !Number.isNaN(Date.parse(v)), {
      message: "Tanggal lahir tidak valid",
    }),

  // Tahap 2
  email: z
    .string()
    .email("Email tidak valid")
    .transform((v) => v.toLowerCase().trim()),

  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .max(72, "Password terlalu panjang (maks 72 karakter)"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Input tidak valid", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const email = parsed.data.email;

    const existing = await prisma.anggota.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json({ message: "Email sudah terdaftar" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(parsed.data.password, 10);

    const user = await prisma.anggota.create({
      data: {
        nama: parsed.data.nama,
        alamat: parsed.data.alamat,
        pekerjaan: parsed.data.pekerjaan,
        no_hp: parsed.data.no_hp || null,
        jenis_kelamin: parsed.data.jenis_kelamin,
        tanggal_lahir: new Date(parsed.data.tanggal_lahir),

        email,
        password: hashed,
        role: DEFAULT_ROLE,
        status: DEFAULT_STATUS,

        // ✅ profil lanjutan nanti
        isProfileComplete: false,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        role: true,
        status: true,
        isProfileComplete: true,
        createdAt: true,
      },
    });

    await createNotifikasi({
      role_tujuan: "admin",
      isi: `Nasabah baru mendaftar: ${user.nama}`,
      jenis: "REGISTRASI_NASABAH",
      url: `/admin/data_nasabah/${user.id}`,
    });

    return NextResponse.json(
      { message: "Registrasi berhasil. Silakan login dan lengkapi profil.", user },
      { status: 201 }
    );
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      err.code === "P2002"
    ) {
      return NextResponse.json({ message: "Email sudah terdaftar" }, { status: 409 });
    }

    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
