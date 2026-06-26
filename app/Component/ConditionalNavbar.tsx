"use client";

import { usePathname } from "next/navigation";
import Navbar from "./PublicNavbar/page";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const hideNavbar = ["/login", "/register"].includes(pathname);

  if (hideNavbar) return null;
  return <Navbar />;
}
