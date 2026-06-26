import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ message: "File tidak ditemukan" }, { status: 400 });
  }

  // validasi tipe
  const okType = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
  if (!okType) {
    return NextResponse.json({ message: "Format harus JPG/PNG/WEBP" }, { status: 400 });
  }

  // validasi ukuran (mis. 2MB)
  const max = 2 * 1024 * 1024;
  if (file.size > max) {
    return NextResponse.json({ message: "Ukuran maksimal 2MB" }, { status: 400 });
  }

  const userId = Number((session.user as any).id);
  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
      ? "webp"
      : "jpg";

  const filename = `avatar-${userId}-${Date.now()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
  await mkdir(uploadDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filepath = path.join(uploadDir, filename);
  await writeFile(filepath, buffer);

  const url = `/uploads/avatars/${filename}`;

  await prisma.anggota.update({
    where: { id: userId },
    data: { foto_diri: url },
  });

  return NextResponse.json({ url });
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = Number((session.user as any).id);

  await prisma.anggota.update({
    where: { id: userId },
    data: { foto_diri: null },
  });

  return NextResponse.json({ ok: true });
}