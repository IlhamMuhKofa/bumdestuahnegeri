import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const surat = await prisma.surattemplate.findUnique({
      where: {
        kode: "SP2K_PENCAIRAN",
      },
      select: {
        id_surat: true,
        kode: true,
        nama_file: true,
        file_url: true,
      },
    });

    return NextResponse.json(surat);
  } catch (error) {
    console.error("GET SURAT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data surat",
      },
      {
        status: 500,
      }
    );
  }
}
