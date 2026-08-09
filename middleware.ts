import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Belum login
  if (!token) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  const role = token.role?.toString().toLowerCase();

  // Proteksi admin
  if (pathname.startsWith("/admin")) {
    if (role !== "admin") {
      return NextResponse.redirect(
        new URL("/login", req.url)
      );
    }
  }

  // Proteksi nasabah
  if (pathname.startsWith("/nasabah")) {
    if (role !== "nasabah") {
      return NextResponse.redirect(
        new URL("/login", req.url)
      );
    }
  }

  const response = NextResponse.next();

  // Jangan cache halaman protected
  response.headers.set(
    "Cache-Control",
    "private, no-store, no-cache, must-revalidate"
  );

  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/nasabah/:path*",
  ],
};