"use server";

import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";

// ======================================================
// KONFIGURASI
// ======================================================

const SURAT_KODE = "SP2K_PENCAIRAN";
const SURAT_FILE_NAME = "SP2K Pencairan.pdf";
const MAX_FILE_SIZE = 2 * 1024 * 1024;

// Nama bucket Supabase Storage
const STORAGE_BUCKET = "uploads";

// ======================================================
// SUPABASE ADMIN CLIENT
// ======================================================
//
// Gunakan SERVICE ROLE KEY hanya di server.
// JANGAN menggunakan NEXT_PUBLIC_ untuk service role key.
//

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ======================================================
// VALIDASI PDF
// ======================================================

function isPdfFile(file: File) {
  return (
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf")
  );
}

// ======================================================
// UPLOAD PDF KE SUPABASE STORAGE
// ======================================================

async function savePdfFile(file: File) {
  // Validasi file
  if (!file || file.size === 0) {
    throw new Error("File PDF wajib dipilih");
  }

  // Validasi format
  if (!isPdfFile(file)) {
    throw new Error("Format file harus PDF");
  }

  // Validasi ukuran
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Ukuran file maksimal 2MB");
  }

  // Lokasi file di Supabase Storage
  const filePath = `surat/${SURAT_FILE_NAME}`;

  // Ubah File menjadi Buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  console.log("=== UPLOAD SURAT KE SUPABASE ===");
  console.log({
    bucket: STORAGE_BUCKET,
    filePath,
    fileName: file.name,
    size: file.size,
  });

  // Upload
  // upsert: true = jika file sudah ada, timpa dengan file baru
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, buffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (error) {
    console.error(
      "SUPABASE STORAGE UPLOAD ERROR:",
      error
    );

    throw new Error(
      `Gagal menyimpan file surat: ${error.message}`
    );
  }

  // Ambil URL public
  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  if (!data?.publicUrl) {
    throw new Error(
      "URL file surat tidak berhasil dibuat"
    );
  }

  console.log(
    "FILE SURAT BERHASIL DIUPLOAD:",
    data.publicUrl
  );

  return {
    fileName: SURAT_FILE_NAME,
    fileUrl: data.publicUrl,
    storagePath: filePath,
  };
}

// ======================================================
// HAPUS FILE DARI SUPABASE STORAGE
// ======================================================

async function deletePhysicalFile(
  fileUrl: string | null | undefined
) {
  if (!fileUrl) return;

  try {
    // URL Supabase biasanya seperti:
    //
    // https://xxxxx.supabase.co/storage/v1/object/public/uploads/surat/SP2K%20Pencairan.pdf
    //
    // Kita ambil bagian setelah:
    // /storage/v1/object/public/uploads/

    const marker =
      `/storage/v1/object/public/${STORAGE_BUCKET}/`;

    const index = fileUrl.indexOf(marker);

    if (index === -1) {
      console.log(
        "Path file Supabase tidak ditemukan:",
        fileUrl
      );

      return;
    }

    const storagePath = decodeURIComponent(
      fileUrl.substring(
        index + marker.length
      )
    );

    console.log(
      "Menghapus file Storage:",
      storagePath
    );

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([storagePath]);

    if (error) {
      console.error(
        "SUPABASE STORAGE DELETE ERROR:",
        error
      );

      // Jangan menggagalkan proses utama
      // hanya karena file lama tidak bisa dihapus.
      return;
    }

    console.log(
      "File surat berhasil dihapus dari Storage"
    );
  } catch (error) {
    console.error(
      "ERROR DELETE FILE SURAT:",
      error
    );
  }
}

// ======================================================
// CREATE SURAT
// ======================================================

export async function createSurat(
  formData: FormData
) {
  try {
    console.log(
      "=== MULAI UPLOAD SURAT ==="
    );

    // Ambil file
    const file = formData.get(
      "file"
    ) as File | null;

    if (!file) {
      throw new Error(
        "File PDF wajib dipilih"
      );
    }

    // Cari template yang sudah ada
    const existingSurat =
      await prisma.surattemplate.findUnique({
        where: {
          kode: SURAT_KODE,
        },
      });

    // ==================================================
    // UPLOAD FILE BARU
    // ==================================================

    const savedFile =
      await savePdfFile(file);

    // ==================================================
    // SIMPAN URL KE DATABASE
    // ==================================================

    await prisma.surattemplate.upsert({
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

    console.log(
      "SURAT BERHASIL DISIMPAN"
    );

    return {
      success: true,
      message:
        "SP2K Pencairan berhasil disimpan",
    };
  } catch (error: any) {
    console.error(
      "ERROR UPLOAD SURAT:",
      error
    );

    return {
      success: false,
      message:
        error?.message ||
        "Terjadi kesalahan saat menyimpan surat",
    };
  }
}

// ======================================================
// UPDATE SURAT
// ======================================================

export async function updateSurat(
  id_surat: number,
  formData: FormData
) {
  try {
    console.log(
      "=== MULAI UPDATE SURAT ==="
    );

    // Cari surat berdasarkan ID
    const surat =
      await prisma.surattemplate.findUnique({
        where: {
          id_surat,
        },
      });

    if (!surat) {
      throw new Error(
        "SP2K Pencairan tidak ditemukan"
      );
    }

    // Ambil file baru
    const file = formData.get(
      "file"
    ) as File | null;

    if (!file) {
      throw new Error(
        "File PDF wajib dipilih"
      );
    }

    // ==================================================
    // UPLOAD FILE BARU
    // ==================================================

    const savedFile =
      await savePdfFile(file);

    // ==================================================
    // UPDATE DATABASE
    // ==================================================

    await prisma.surattemplate.update({
      where: {
        id_surat,
      },

      data: {
        kode: SURAT_KODE,
        nama_file: savedFile.fileName,
        file_url: savedFile.fileUrl,
      },
    });

    console.log(
      "SURAT BERHASIL DIPERBARUI"
    );

    return {
      success: true,
      message:
        "SP2K Pencairan berhasil diperbarui",
    };
  } catch (error: any) {
    console.error(
      "ERROR UPDATE SURAT:",
      error
    );

    return {
      success: false,
      message:
        error?.message ||
        "Gagal memperbarui surat",
    };
  }
}

// ======================================================
// DELETE SURAT
// ======================================================

export async function deleteSurat(
  id_surat: number
) {
  try {
    console.log(
      "=== MULAI DELETE SURAT ==="
    );

    // Cari surat
    const surat =
      await prisma.surattemplate.findUnique({
        where: {
          id_surat,
        },
      });

    if (!surat) {
      throw new Error(
        "SP2K Pencairan tidak ditemukan"
      );
    }

    // ==================================================
    // HAPUS FILE DARI SUPABASE STORAGE
    // ==================================================

    await deletePhysicalFile(
      surat.file_url
    );

    // ==================================================
    // HAPUS DATA DATABASE
    // ==================================================

    await prisma.surattemplate.delete({
      where: {
        id_surat,
      },
    });

    console.log(
      "SURAT BERHASIL DIHAPUS"
    );

    return {
      success: true,
      message:
        "SP2K Pencairan berhasil dihapus",
    };
  } catch (error: any) {
    console.error(
      "ERROR DELETE SURAT:",
      error
    );

    return {
      success: false,
      message:
        error?.message ||
        "Gagal menghapus surat",
    };
  }
}