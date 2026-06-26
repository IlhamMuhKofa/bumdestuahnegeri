import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. IZINKAN halaman public
  const publicPaths = ["/login", "/register", "/", "/artikel", "/panduan"];
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // 2. AMBIL token
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 3. VERIFIKASI token
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // ROLE CHECKING
    if (pathname.startsWith("/admin") && decoded.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (pathname.startsWith("/nasabah") && decoded.role !== "nasabah") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}


export const config = {
  matcher: ["/nasabah/:path*", "/admin/:path*"],
};

