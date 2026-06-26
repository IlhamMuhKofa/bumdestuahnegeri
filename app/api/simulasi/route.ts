import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const jumlah = Number(searchParams.get("jumlah"));
    const tenor = Number(searchParams.get("tenor"));

    // 🔥 VALIDASI
    if (!jumlah || !tenor) {
      return NextResponse.json(
        { error: "Parameter tidak lengkap" },
        { status: 400 }
      );
    }

    // 🔥 AMBIL DATA SIMULASI
    const simulasi = await prisma.simulasiCicilan.findFirst({
      where: {
        jumlah_pinjaman: jumlah,
        tenor: tenor,
      },
    });

    // 🔥 JIKA TIDAK ADA
    if (!simulasi) {
      return NextResponse.json(
        { error: "Simulasi tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: simulasi,
    });

  } catch (error) {
    console.error("ERROR SIMULASI:", error);

    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}