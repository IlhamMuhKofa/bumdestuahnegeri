import { ReactNode } from "react";
import NasabahNavbar from "../Component/NasabahNavbar/page";
import Footer from "../Component/footer/page";

export default function NasabahLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NasabahNavbar />
      {children}
      <Footer />
    </>
  );
}