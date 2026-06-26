import { writeFile } from "fs/promises";
import path from "path";

// optional: batasi ukuran file (misal 2MB)
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json(
        { error: "File tidak ditemukan" },
        { status: 400 }
      );
    }

    // validasi tipe file (hanya gambar)
    if (!file.type.startsWith("image/")) {
      return Response.json(
        { error: "File harus berupa gambar" },
        { status: 400 }
      );
    }

    // validasi ukuran
    if (file.size > MAX_SIZE) {
      return Response.json(
        { error: "Ukuran file maksimal 2MB" },
        { status: 400 }
      );
    }

    // ubah ke buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // bikin nama file unik
    const fileName =
      Date.now() +
      "-" +
      file.name.replace(/\s/g, "_");

    // path simpan ke public/uploads
    const uploadDir = path.join(
      process.cwd(),
      "public/uploads"
    );

    const filePath = path.join(
      uploadDir,
      fileName
    );

    // simpan file
    await writeFile(filePath, buffer);

    // return URL untuk disimpan di DB
    return Response.json({
      url: `/uploads/${fileName}`,
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return Response.json(
      { error: "Gagal upload file" },
      { status: 500 }
    );
  }
}