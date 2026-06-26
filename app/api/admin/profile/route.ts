import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcrypt";


// ======================================================
// GET PROFILE + LIST ADMIN
// ======================================================
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const admin = await prisma.anggota.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        username: true,
        no_hp: true,
        role: true,
        createdAt: true,
      },
    });

    const adminList = await prisma.anggota.findMany({
      where: {
        role: {
          equals: "admin",
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        nama: true,
        email: true,
        username: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      profile: admin,
      admins: adminList,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Gagal mengambil data" },
      { status: 500 }
    );
  }
}


// ======================================================
// UPDATE PROFILE ADMIN
// ======================================================
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      nama,
      email,
      username,
      no_hp,
    } = body;

    const currentUser =
      await prisma.anggota.findUnique({
        where: {
          email: session.user.email,
        },
      });

    if (!currentUser) {
      return NextResponse.json(
        { error: "Admin tidak ditemukan" },
        { status: 404 }
      );
    }

    // cek email duplicate
    if (
      email &&
      email !== currentUser.email
    ) {
      const existingEmail =
        await prisma.anggota.findUnique({
          where: { email },
        });

      if (existingEmail) {
        return NextResponse.json(
          {
            error:
              "Email sudah digunakan",
          },
          { status: 400 }
        );
      }
    }

    // cek username duplicate
    if (
      username &&
      username !== currentUser.username
    ) {
      const existingUsername =
        await prisma.anggota.findUnique({
          where: { username },
        });

      if (existingUsername) {
        return NextResponse.json(
          {
            error:
              "Username sudah digunakan",
          },
          { status: 400 }
        );
      }
    }

    const updated =
      await prisma.anggota.update({
        where: {
          id: currentUser.id,
        },
        data: {
          nama,
          email,
          username,
          no_hp,
        },
      });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Gagal update profil" },
      { status: 500 }
    );
  }
}


// ======================================================
// TAMBAH ADMIN BARU
// ======================================================
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      nama,
      email,
      username,
      password,
    } = body;

    if (
      !nama ||
      !email ||
      !username ||
      !password
    ) {
      return NextResponse.json(
        {
          error:
            "Semua field wajib diisi",
        },
        { status: 400 }
      );
    }

    const existingEmail =
      await prisma.anggota.findUnique({
        where: { email },
      });

    if (existingEmail) {
      return NextResponse.json(
        {
          error:
            "Email sudah digunakan",
        },
        { status: 400 }
      );
    }

    const existingUsername =
      await prisma.anggota.findUnique({
        where: { username },
      });

    if (existingUsername) {
      return NextResponse.json(
        {
          error:
            "Username sudah digunakan",
        },
        { status: 400 }
      );
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const admin =
      await prisma.anggota.create({
        data: {
          nama,
          email,
          username,
          password: hashedPassword,
          role: "admin",
          status: "active",
          isProfileComplete: true,
        },
      });

    return NextResponse.json({
      success: true,
      data: admin,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Gagal menambahkan admin",
      },
      { status: 500 }
    );
  }
}