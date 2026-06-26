"use client";

import { usePathname } from "next/navigation";
import Footer from "./footer/page";

export default function FooterWrapper() {
  const pathname = usePathname();

  // halaman tanpa footer
  const hideFooterPaths = ["/register", "/login"];

  if (hideFooterPaths.includes(pathname)) {
    return null; // footer tidak tampil
  }

  return <Footer />;
}
