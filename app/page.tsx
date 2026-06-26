"use client";

import { useSearchParams,useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Banner from "./(public)/banner/page";
import Benefit from "./(public)/benefit/page";
import Layanan from "./(public)/layanan/page";
import HomeBerita from "./(public)/homeberita/page";
import {toast} from "react-toastify";
import { useEffect, useRef } from "react";
import FooterWrapper from "./Component/FooterWrapper";
import ConditionalNavbar from "./Component/ConditionalNavbar";

export default function Home() {
  const hasShownToast = useRef(false);
  const router = useRouter();

  useEffect(() => {
    const shouldShowToast = sessionStorage.getItem("showRegisterToast");

    if (shouldShowToast === "true") {
      toast.success("Akun berhasil dibuat, silahkan login 🎉", {
        autoClose: 6000,
      });

      sessionStorage.removeItem("showRegisterToast");
    }
  }, []);

  return (
    <>
    <ConditionalNavbar />
    <Banner />
    <section>
      <Benefit />
    </section>
    <section>
      <Layanan />
    </section>
    <section>
      <HomeBerita />
    </section>
    <FooterWrapper />
    </>
  );
}
