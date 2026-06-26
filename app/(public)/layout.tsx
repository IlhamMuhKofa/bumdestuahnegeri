import { ReactNode } from "react";
import PublicNavbar from "../Component/PublicNavbar/page";
import Footer from "../Component/footer/page";

export default function NasabahLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PublicNavbar />
      {children}
      <Footer />
    </>
  );
}