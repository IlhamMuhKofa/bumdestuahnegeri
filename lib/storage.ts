import { createClient } from "@supabase/supabase-js";

export const supabaseStorage = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET = "uploads";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB
const MAX_PDF_SIZE = 5 * 1024 * 1024; // 5 MB

/* =====================================================
   UPLOAD IMAGE
===================================================== */

export async function uploadImage(
  file: File,
  folder: string
) {
  if (!file) {
    throw new Error("File tidak ditemukan.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("File harus berupa gambar.");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Ukuran gambar maksimal 2 MB.");
  }

  const ext = file.name.split(".").pop();

  const fileName =
    `${folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const buffer = Buffer.from(
    await file.arrayBuffer()
  );

  const { error } =
    await supabaseStorage.storage
      .from(BUCKET)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

  if (error) {
    throw error;
  }

  const { data } =
    supabaseStorage.storage
      .from(BUCKET)
      .getPublicUrl(fileName);

  return data.publicUrl;
}

/* =====================================================
   UPLOAD PDF
===================================================== */

export async function uploadPdf(
  file: File,
  folder: string
) {
  if (!file) {
    throw new Error("File PDF tidak ditemukan.");
  }

  if (
    file.type !== "application/pdf" &&
    !file.name.toLowerCase().endsWith(".pdf")
  ) {
    throw new Error("File harus berupa PDF.");
  }

  if (file.size > MAX_PDF_SIZE) {
    throw new Error("Ukuran PDF maksimal 5 MB.");
  }

  const fileName =
    `${folder}/${Date.now()}-${crypto.randomUUID()}.pdf`;

  const buffer = Buffer.from(
    await file.arrayBuffer()
  );

  const { error } =
    await supabaseStorage.storage
      .from(BUCKET)
      .upload(fileName, buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

  if (error) {
    throw error;
  }

  const { data } =
    supabaseStorage.storage
      .from(BUCKET)
      .getPublicUrl(fileName);

  return data.publicUrl;
}

/* =====================================================
   EXTRACT STORAGE PATH
===================================================== */

export function extractStoragePath(
  publicUrl: string
) {
  const marker = `/storage/v1/object/public/${BUCKET}/`;

  const index =
    publicUrl.indexOf(marker);

  if (index === -1) {
    return null;
  }

  return publicUrl.substring(
    index + marker.length
  );
}

/* =====================================================
   DELETE FILE
===================================================== */

export async function deleteFile(
  publicUrl: string
) {
  const storagePath =
    extractStoragePath(publicUrl);

  if (!storagePath) return;

  const { error } =
    await supabaseStorage.storage
      .from(BUCKET)
      .remove([storagePath]);

  if (error) {
    console.error(
      "DELETE STORAGE:",
      error
    );
  }
}