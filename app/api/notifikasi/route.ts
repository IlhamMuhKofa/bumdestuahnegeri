import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

type SessionUser = {
  id?: string | number;
  role?: string | null;
};

function getNotifikasiScope(user: SessionUser) {
  if (user.role === "admin") {
    return {
      role_tujuan: "admin",
    };
  }

  return {
    role_tujuan: "nasabah",
    id_anggota: Number(user.id),
  };
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser | undefined;

  if (!user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const where = getNotifikasiScope(user);

  const [items, unreadCount] = await Promise.all([
    prisma.notifikasi.findMany({
      where,
      orderBy: {
        created_at: "desc",
      },
      take: 10,
    }),
    prisma.notifikasi.count({
      where: {
        ...where,
        waktu_dibaca: null,
      },
    }),
  ]);

  return NextResponse.json({
    items,
    unreadCount,
  });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser | undefined;

  if (!user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    id_notifikasi?: number;
  };

  const scope = getNotifikasiScope(user);
  const where = body.id_notifikasi
    ? {
        ...scope,
        id_notifikasi: Number(body.id_notifikasi),
      }
    : {
        ...scope,
        waktu_dibaca: null,
      };

  await prisma.notifikasi.updateMany({
    where,
    data: {
      waktu_dibaca: new Date(),
    },
  });

  return NextResponse.json({
    success: true,
  });
}
