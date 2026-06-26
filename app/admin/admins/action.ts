"use server";

import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function normalizeUsername(username: string) {
  return username.toLowerCase().trim();
}

export async function tambahAdmin(formData: FormData) {
  const nama = String(formData.get("nama") || "").trim();
  const username = normalizeUsername(String(formData.get("username") || ""));
  const password = String(formData.get("password") || "");

  if (!nama || !username || password.length < 6) {
    throw new Error("Nama, username, dan password minimal 6 karakter wajib diisi");
  }

  const existing = await prisma.anggota.findFirst({
    where: {
      OR: [
        { username },
        { email: `${username}@admin.local` },
      ],
    },
  });

  if (existing) {
    throw new Error("Username sudah digunakan");
  }

  await prisma.anggota.create({
    data: {
      nama,
      username,
      email: `${username}@admin.local`,
      password: await bcrypt.hash(password, 10),
      role: "admin",
      status: "active",
      isProfileComplete: true,
    },
  });

  revalidatePath("/admin/admins");
}

export async function editAdmin(formData: FormData) {
  const id = Number(formData.get("id"));
  const nama = String(formData.get("nama") || "").trim();
  const username = normalizeUsername(String(formData.get("username") || ""));

  if (!id || !nama || !username) {
    throw new Error("Data admin tidak lengkap");
  }

  const existing = await prisma.anggota.findFirst({
    where: {
      username,
      NOT: {
        id,
      },
    },
  });

  if (existing) {
    throw new Error("Username sudah digunakan");
  }

  await prisma.anggota.update({
    where: { id },
    data: {
      nama,
      username,
      email: `${username}@admin.local`,
    },
  });

  revalidatePath("/admin/admins");
}

export async function resetPasswordAdmin(formData: FormData) {
  const id = Number(formData.get("id"));
  const password = String(formData.get("password") || "");

  if (!id || password.length < 6) {
    throw new Error("Password minimal 6 karakter");
  }

  await prisma.anggota.update({
    where: { id },
    data: {
      password: await bcrypt.hash(password, 10),
    },
  });

  revalidatePath("/admin/admins");
}

export async function hapusAdmin(id: number) {
  if (!id) {
    throw new Error("Admin tidak valid");
  }

  await prisma.anggota.delete({
    where: { id },
  });

  revalidatePath("/admin/admins");
}
