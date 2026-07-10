import { NextResponse } from "next/server";
import { supabaseStorage } from "@/lib/storage";

const MAX_SIZE = 2 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "File tidak ditemukan." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Format file harus PNG, JPG, JPEG, atau WEBP.",
        },
        {
          status: 400,
        }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          error:
            "Ukuran file maksimal 2 MB.",
        },
        {
          status: 400,
        }
      );
    }

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    const ext =
      file.name.split(".").pop();

const folder =
  (formData.get("folder") as string) ||
  "general";

const fileName =
  `${folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

    const { error } =
      await supabaseStorage.storage
        .from("uploads")
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: false,
        });

    if (error) {
      console.error(
        "SUPABASE STORAGE ERROR:",
        error
      );

      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    const { data } =
      supabaseStorage.storage
        .from("uploads")
        .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      url: data.publicUrl,
    });

  } catch (err) {
    console.error(
      "UPLOAD IMAGE ERROR:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Gagal upload gambar.",
      },
      {
        status: 500,
      }
    );
  }
}