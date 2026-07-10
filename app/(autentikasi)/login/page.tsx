"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { signIn, getSession } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl =
    searchParams.get("callbackUrl") || "/nasabah/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (!res) {
      setErrorMsg("Gagal login. Coba lagi.");
      return;
    }

    if (res.error) {
      if (res.error === "AKUN_MENUNGGU") {
        setErrorMsg("Akun kamu masih menunggu verifikasi admin.");
      } else if (res.error === "AKUN_DITOLAK") {
        setErrorMsg(
          "Akun kamu ditolak. Hubungi admin untuk info lebih lanjut."
        );
      } else {
        setErrorMsg("Email atau password salah.");
      }
      return;
    }

    const session = await getSession();

    if (!session) {
      setErrorMsg("Gagal mengambil session.");
      return;
    }

    const role = (session.user as any).role;

    if (role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/nasabah/dashboard");
    }
  }

  // Animation variants
  const easeOut = [0.22, 1, 0.36, 1] as const;

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.09,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: easeOut },
    },
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side - image, desktop only */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <motion.img
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: easeOut }}
          src="/img/lgbg.png"
          alt="Login Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Mobile top banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="lg:hidden absolute top-0 left-0 right-0 h-40 sm:h-48 overflow-hidden"
      >
        <img
          src="/img/lgbg.png"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-16 sm:h-20 bg-gradient-to-b from-transparent to-white" />
      </motion.div>

      {/* Right Side */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full lg:w-1/2 flex items-center justify-center px-5 sm:px-8 md:px-10 py-10 relative"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-sm sm:max-w-md mt-28 sm:mt-32 lg:mt-0"
        >
          <motion.h2
            variants={itemVariants}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 text-black"
          >
            Selamat Datang Kembali!
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base lg:text-lg mb-8 sm:mb-10 lg:mb-12 text-gray-600"
          >
            Masuk ke akunmu untuk mengakses layanan dan informasi dari BUMDes
            Tuah Negeri.
          </motion.p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <motion.input
              variants={itemVariants}
              type="email"
              placeholder="Email"
              className="w-full p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            <motion.div variants={itemVariants} className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-3 pr-11 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-0 top-0 h-full px-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={
                  showPassword ? "Sembunyikan password" : "Tampilkan password"
                }
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </motion.div>

            <AnimatePresence>
              {errorMsg && (
                <motion.p
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-xs sm:text-sm text-red-700 bg-red-100 p-3 rounded-lg overflow-hidden"
                >
                  {errorMsg}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              variants={itemVariants}
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.01 }}
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                  />
                  Memproses...
                </span>
              ) : (
                "Login"
              )}
            </motion.button>
          </form>

          <motion.p
            variants={itemVariants}
            className="mt-5 sm:mt-4 text-center text-xs sm:text-sm text-gray-600"
          >
            Belum punya akun?{" "}
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="text-blue-600 font-semibold hover:underline"
            >
              Daftar
            </button>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">
          Loading...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}