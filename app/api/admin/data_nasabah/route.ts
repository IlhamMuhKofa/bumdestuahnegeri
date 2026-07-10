import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

// =======================
// GET ALL NASABAH
// =======================
export async function GET() {
  try {
    const data = await prisma.anggota.findMany({
      where: {
        role: "nasabah",
      },

      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        nama: true,
        username: true,
        nik: true,
        email: true,
        no_hp: true,
        alamat: true,
        jenis_kelamin: true,
        tanggal_lahir: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(data);

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      {
        error: "Gagal mengambil data.",
      },
      {
        status: 500,
      }
    );
  }
}



// =======================
// CREATE NASABAH
// =======================
export async function POST(req: Request) {

  try {

    const body = await req.json();

    const {

      nama,
      nik,
      email,
      no_hp,
      alamat,
      jenis_kelamin,
      tanggal_lahir,
      password,

    } = body;

    // ==========================
    // VALIDASI
    // ==========================

    if (
      !nama ||
      !email ||
      !password
    ) {
      return NextResponse.json(
        {
          error: "Data wajib belum lengkap.",
        },
        {
          status: 400,
        }
      );
    }

    // EMAIL

    const emailExist =
      await prisma.anggota.findUnique({
        where: {
          email,
        },
      });

    if (emailExist) {
      return NextResponse.json(
        {
          error: "Email sudah digunakan.",
        },
        {
          status: 400,
        }
      );
    }

    // NIK

    if (nik) {

      const nikExist =
        await prisma.anggota.findFirst({
          where: {
            nik,
          },
        });

      if (nikExist) {
        return NextResponse.json(
          {
            error: "NIK sudah digunakan.",
          },
          {
            status: 400,
          }
        );
      }

    }

    // HASH PASSWORD

    const hash =
      await bcrypt.hash(
        password,
        10
      );

    // CREATE

    const anggota =
      await prisma.anggota.create({
        data: {

          nama,
          nik,
          email,
          no_hp,
          alamat,
          jenis_kelamin,

          tanggal_lahir:
            tanggal_lahir
              ? new Date(
                  tanggal_lahir
                )
              : null,

          password: hash,

          role: "nasabah",

          status: "active",

          isProfileComplete: false,

        },
      });

    return NextResponse.json({
      success: true,
      data: anggota,
    });

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      {
        error: "Gagal menambahkan nasabah.",
      },
      {
        status: 500,
      }
    );

  }

}