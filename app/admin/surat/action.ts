"use server";

import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

const SURAT_KODE = "SP2K_PENCAIRAN";
const SURAT_FILE_NAME = "SP2K Pencairan.pdf";
const MAX_FILE_SIZE = 2 * 1024 * 1024;

function isPdfFile(file: File) {
  return (
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf")
  );
}

async function savePdfFile(file: File) {
  if (!file || file.size === 0) {
    throw new Error("File PDF wajib dipilih");
  }

  if (!isPdfFile(file)) {
    throw new Error("Format file harus PDF");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Ukuran file maksimal 2MB");
  }

  const uploadDir = path.join(
    process.cwd(),
    "public/uploads/surat"
  );

  await mkdir(uploadDir, { recursive: true });

  const fileName = SURAT_FILE_NAME;
  const filePath = path.join(uploadDir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, buffer);

  return {
    fileName,
    fileUrl: `/uploads/surat/${fileName}`,
  };
}

async function deletePhysicalFile(fileUrl: string | null | undefined) {
  if (!fileUrl) return;

  try {
    await unlink(
      path.join(process.cwd(), "public", fileUrl)
    );
  } catch {
    console.log("File surat tidak ditemukan, lanjutkan proses");
  }
}

export async function createSurat(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const existingSurat =
      await prisma.suratTemplate.findUnique({
        where: {
          kode: SURAT_KODE,
        },
      });

    if (existingSurat?.file_url) {
      await deletePhysicalFile(existingSurat.file_url);
    }

    const savedFile = await savePdfFile(file);

    await prisma.suratTemplate.upsert({
      where: {
        kode: SURAT_KODE,
      },
      update: {
        nama_file: savedFile.fileName,
        file_url: savedFile.fileUrl,
      },
      create: {
        kode: SURAT_KODE,
        nama_file: savedFile.fileName,
        file_url: savedFile.fileUrl,
      },
    });

    return {
      success: true,
      message: "SP2K Pencairan berhasil disimpan",
    };
  } catch (error: any) {
    console.error("ERROR UPLOAD SURAT:", error);

    return {
      success: false,
      message: error.message || "Terjadi kesalahan",
    };
  }
}

export async function updateSurat(
  id_surat: number,
  formData: FormData
) {
  try {
    const surat =
      await prisma.suratTemplate.findUnique({
        where: {
          id_surat,
        },
      });

    if (!surat) {
      throw new Error("SP2K Pencairan tidak ditemukan");
    }

    await deletePhysicalFile(surat.file_url);

    const file = formData.get("file") as File;
    const savedFile = await savePdfFile(file);

    await prisma.suratTemplate.update({
      where: {
        id_surat,
      },
      data: {
        kode: SURAT_KODE,
        nama_file: savedFile.fileName,
        file_url: savedFile.fileUrl,
      },
    });

    return {
      success: true,
      message: "SP2K Pencairan berhasil diperbarui",
    };
  } catch (error: any) {
    console.error("ERROR UPDATE SURAT:", error);

    return {
      success: false,
      message: error.message || "Gagal memperbarui surat",
    };
  }
}

export async function deleteSurat(id_surat: number) {
  try {
    const surat =
      await prisma.suratTemplate.findUnique({
        where: {
          id_surat,
        },
      });

    if (!surat) {
      throw new Error("SP2K Pencairan tidak ditemukan");
    }

    await deletePhysicalFile(surat.file_url);

    await prisma.suratTemplate.delete({
      where: {
        id_surat,
      },
    });

    return {
      success: true,
      message: "SP2K Pencairan berhasil dihapus",
    };
  } catch (error: any) {
    console.error("ERROR DELETE SURAT:", error);

    return {
      success: false,
      message: error.message || "Gagal menghapus surat",
    };
  }
}
