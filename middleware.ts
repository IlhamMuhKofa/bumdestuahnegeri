import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // =====================================================
  // 1. AMBIL TOKEN
  // =====================================================

  const token = req.cookies.get("token")?.value;

  // =====================================================
  // 2. JIKA TIDAK ADA TOKEN
  // =====================================================

  if (!token) {
    const response = NextResponse.redirect(
      new URL("/login", req.url)
    );

    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );

    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  }

  // =====================================================
  // 3. VERIFIKASI TOKEN
  // =====================================================

  try {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    const role = decoded.role?.toString().toLowerCase();

    // ===================================================
    // 4. PROTEKSI HALAMAN ADMIN
    // ===================================================

    if (pathname.startsWith("/admin")) {
      if (role !== "admin") {
        const response = NextResponse.redirect(
          new URL("/login", req.url)
        );

        response.headers.set(
          "Cache-Control",
          "no-store, no-cache, must-revalidate, proxy-revalidate"
        );

        response.headers.set("Pragma", "no-cache");
        response.headers.set("Expires", "0");

        return response;
      }
    }

    // ===================================================
    // 5. PROTEKSI HALAMAN NASABAH
    // ===================================================

    if (pathname.startsWith("/nasabah")) {
      if (role !== "nasabah") {
        const response = NextResponse.redirect(
          new URL("/login", req.url)
        );

        response.headers.set(
          "Cache-Control",
          "no-store, no-cache, must-revalidate, proxy-revalidate"
        );

        response.headers.set("Pragma", "no-cache");
        response.headers.set("Expires", "0");

        return response;
      }
    }

    // ===================================================
    // 6. TOKEN VALID → LANJUT KE HALAMAN
    // ===================================================

    const response = NextResponse.next();

    // Jangan cache halaman protected
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );

    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;

  } catch (error) {
    console.error(
      "JWT verification failed:",
      error
    );

    const response = NextResponse.redirect(
      new URL("/login", req.url)
    );

    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );

    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/nasabah/:path*",
  ],
};