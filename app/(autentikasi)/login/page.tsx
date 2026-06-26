"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { signIn, getSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/nasabah/dashboard";

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
        setErrorMsg("Akun kamu ditolak. Hubungi admin untuk info lebih lanjut.");
      } else {
        setErrorMsg("Email atau password salah.");
      }
      return;
    }

    // ✅ AMBIL SESSION DI SINI
const session = await getSession();

if (!session) {
  setErrorMsg("Gagal mengambil session.");
  return;
}

    // Kalau sukses, NextAuth memberi res.url
      const role = (session.user as any).role;

  if (role === "admin") {
    router.push("/admin/dashboard");
  } else {
    router.push("/nasabah/dashboard");
  }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side */}
      <div className="hidden lg:block lg:w-1/2">
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          src="/img/lgbg.png"
          alt="Login Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Login Form */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full md:w-2/3 flex items-center justify-center p-10"
      >
        <div className="w-full">
          <h2 className="text-3xl lg:text-4xl font-bold mb-3 text-black">
            Selamat Datang Kembali!
          </h2>
          <p className="text-lg mb-12 text-black text-justify">
            Masuk ke akunmu untuk mengakses layanan dan informasi dari BUMDes Tuah Negeri.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            {errorMsg && (
              <p className="text-sm text-red-700 bg-red-100 p-3 rounded-lg">
                {errorMsg}
              </p>
            )}

            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Login"}
            </motion.button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Belum punya akun?{" "}
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="text-blue-600 font-semibold hover:underline"
            >
              Daftar
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}