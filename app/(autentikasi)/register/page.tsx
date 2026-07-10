"use client";
import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const router = useRouter();

  // Form data state
  const [formData, setFormData] = useState({
    namaLengkap: "",
    alamat: "",
    pekerjaan: "",
    no_hp: "",
    jenisKelamin: "",
    tanggalLahir: "",
    email: "",
    password: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNextStep = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (step === 1) {
      // Validasi step 1 (UI validation)
      if (
        !formData.namaLengkap.trim() ||
        !formData.alamat.trim() ||
        !formData.pekerjaan.trim() ||
        !formData.no_hp.trim() ||
        !formData.jenisKelamin ||
        !formData.tanggalLahir
      ) {
        setErrorMsg("Mohon lengkapi semua data pada tahap ini.");
        return;
      }
      setStep(2);
      return;
    }

    // Step 2: submit ke API register
    if (!formData.email || !formData.password) {
      setErrorMsg("Email dan kata sandi wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/regis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // mapping ke schema Prisma/API
          nama: formData.namaLengkap,
          alamat: formData.alamat,
          no_hp: formData.no_hp,
          email: formData.email,
          password: formData.password,
          pekerjaan: formData.pekerjaan,
          jenis_kelamin: formData.jenisKelamin,
          tanggal_lahir: formData.tanggalLahir,

          // Catatan:
          // nik, jenisKelamin, tanggalLahir belum ada kolomnya di model Anggota,
          // jadi kita tidak kirim dulu biar tidak bingung.
        }),
      });

      const data = await res.json().catch(() => ({}));
      console.log("REGISTER STATUS:", res.status);
      console.log("REGISTER RESPONSE:", data);

      if (!res.ok) {
        const fieldErrors = data?.errors?.fieldErrors;
        const detail = fieldErrors
          ? Object.values(fieldErrors).flat().join(", ")
          : null;

        setErrorMsg(detail || data?.message || "Registrasi gagal. Coba lagi.");
        setLoading(false);
        return;
      }

      setLoading(false);

      // Opsional: arahkan ke login setelah 1 detik
      setTimeout(() => {
        sessionStorage.setItem("showRegisterToast", "true");
        router.push("/");
      }, 1000);
    } catch (err) {
      setLoading(false);
      setErrorMsg("Terjadi kesalahan jaringan. Coba lagi.");
    }
  };

  const handleBack = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    if (step === 1) {
      router.push("/");
    } else {
      setStep(1);
    }
  };

  // Animation variants (typed explicitly, no raw easing arrays)
  const easeOut = [0.22, 1, 0.36, 1] as const;

  const stepVariants: Variants = {
    enter: { opacity: 0, x: -16 },
    center: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.35, ease: easeOut },
    },
    exit: {
      opacity: 0,
      x: 16,
      transition: { duration: 0.25, ease: easeOut },
    },
  };

  const fieldContainerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.06, delayChildren: 0.1 },
    },
  };

  const fieldVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: easeOut },
    },
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left Side - form */}
      <div className="relative w-full flex-1 lg:flex-none lg:w-2/3 bg-[#F5C542] flex items-center justify-center px-5 sm:px-8 md:px-10 py-10 sm:py-12">
        <div className="w-full">
          <motion.button
            onClick={handleBack}
            whileTap={{ scale: 0.96 }}
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs sm:text-sm font-semibold text-black shadow-sm backdrop-blur hover:bg-white transition mb-6 sm:mb-8"
          >
            ← {step === 1 ? "Kembali ke Beranda" : "Kembali"}
          </motion.button>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 text-black">
                  Biar Lebih Dekat, Daftar Dulu Yuk!
                </h2>
                <p className="text-sm sm:text-base mb-8 sm:mb-10 lg:mb-12 text-black">
                  Kami butuh sedikit data kamu agar bisa kasih layanan terbaik ke depannya.
                </p>

                <motion.div
                  variants={fieldContainerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  {/* Nama Lengkap */}
                  <motion.div variants={fieldVariants}>
                    <label className="block text-sm font-medium mb-2 text-black">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="namaLengkap"
                      value={formData.namaLengkap}
                      onChange={handleInputChange}
                      className="w-full p-3 text-sm sm:text-base bg-white border-0 rounded-lg focus:ring-2 focus:ring-yellow-600 outline-none text-black"
                      placeholder="Masukkan nama lengkap"
                    />
                  </motion.div>

                  {/* Alamat */}
                  <motion.div variants={fieldVariants}>
                    <label className="block text-sm font-medium mb-2 text-black">
                      Alamat Tempat Tinggal
                    </label>
                    <input
                      type="text"
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleInputChange}
                      className="w-full p-3 text-sm sm:text-base bg-white border-0 rounded-lg focus:ring-2 focus:ring-yellow-600 outline-none text-black"
                      placeholder="Masukkan alamat tinggal"
                    />
                  </motion.div>

                  {/* Pekerjaan */}
                  <motion.div variants={fieldVariants}>
                    <label className="block text-sm font-medium mb-2 text-black">
                      Pekerjaan
                    </label>
                    <input
                      type="text"
                      name="pekerjaan"
                      value={formData.pekerjaan}
                      onChange={handleInputChange}
                      className="w-full p-3 text-sm sm:text-base bg-white border-0 rounded-lg focus:ring-2 focus:ring-yellow-600 outline-none text-black"
                      placeholder="Masukkan pekerjaan"
                    />
                  </motion.div>

                  {/* Jenis Kelamin, No HP, Tanggal Lahir */}
                  <motion.div
                    variants={fieldVariants}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
                  >
                    <div>
                      <label className="block text-sm font-medium mb-2 text-black">
                        Jenis Kelamin
                      </label>
                      <select
                        name="jenisKelamin"
                        value={formData.jenisKelamin}
                        onChange={handleInputChange}
                        className="w-full p-3 text-sm sm:text-base bg-white border-0 rounded-lg focus:ring-2 focus:ring-yellow-600 outline-none appearance-none text-black"
                      >
                        <option value="">Pilih</option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-black">
                        No HP
                      </label>
                      <input
                        type="text"
                        name="no_hp"
                        value={formData.no_hp}
                        onChange={handleInputChange}
                        className="w-full p-3 text-sm sm:text-base bg-white border-0 rounded-lg focus:ring-2 focus:ring-yellow-600 outline-none text-black"
                        placeholder="Nomor HP"
                      />
                    </div>

                    <div className="sm:col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium mb-2 text-black">
                        Tanggal Lahir
                      </label>
                      <input
                        type="date"
                        name="tanggalLahir"
                        value={formData.tanggalLahir}
                        onChange={handleInputChange}
                        className="w-full p-3 text-sm sm:text-base bg-white border-0 rounded-lg focus:ring-2 focus:ring-yellow-600 outline-none text-black"
                      />
                    </div>
                  </motion.div>

                  {/* Error */}
                  <AnimatePresence>
                    {errorMsg && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="text-xs sm:text-sm text-red-700 bg-red-100 p-3 rounded-lg overflow-hidden"
                      >
                        {errorMsg}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <motion.button
                    variants={fieldVariants}
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: 1.005 }}
                    onClick={handleNextStep}
                    type="button"
                    className="w-full bg-[#2B7DE9] text-white py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-blue-700 transition mt-2 sm:mt-6"
                  >
                    Lanjut
                  </motion.button>

                  <motion.p
                    variants={fieldVariants}
                    className="text-center text-xs sm:text-sm text-gray-800 mt-4"
                  >
                    sudah punya akun ?{" "}
                    <button
                      onClick={() => router.push("/login")}
                      className="text-blue-600 font-semibold hover:underline"
                      type="button"
                    >
                      Login
                    </button>
                  </motion.p>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 text-black">
                  Buat Akun untuk Login
                </h2>
                <p className="text-sm sm:text-base mb-6 sm:mb-8 text-black">
                  Masukkan email aktif dan buat kata sandi agar kamu bisa login dan akses layanan digital dari BUMDes kapan saja.
                </p>

                <motion.div
                  variants={fieldContainerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  <motion.div variants={fieldVariants}>
                    <label className="block text-sm font-medium mb-2 text-black">
                      Email Aktif
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-3 text-sm sm:text-base bg-white border-0 rounded-lg focus:ring-2 focus:ring-yellow-600 outline-none text-black"
                      placeholder="Masukkan email aktif"
                    />
                  </motion.div>

                  <motion.div variants={fieldVariants}>
                    <label className="block text-sm font-medium mb-2 text-black">
                      Kata sandi
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full p-3 pr-11 text-sm sm:text-base bg-white border-0 rounded-lg focus:ring-2 focus:ring-yellow-600 outline-none text-black"
                        placeholder="password minimal 8 karakter"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-0 top-0 h-full px-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label={
                          showPassword
                            ? "Sembunyikan password"
                            : "Tampilkan password"
                        }
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </motion.div>

                  {/* Error/Success */}
                  <AnimatePresence>
                    {errorMsg && (
                      <motion.p
                        key="err"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="text-xs sm:text-sm text-red-700 bg-red-100 p-3 rounded-lg overflow-hidden"
                      >
                        {errorMsg}
                      </motion.p>
                    )}
                    {successMsg && (
                      <motion.p
                        key="ok"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="text-xs sm:text-sm text-green-800 bg-green-100 p-3 rounded-lg overflow-hidden"
                      >
                        {successMsg}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <motion.button
                    variants={fieldVariants}
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: 1.005 }}
                    onClick={handleNextStep}
                    type="button"
                    disabled={loading}
                    className="w-full bg-[#2B7DE9] text-white py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-blue-700 transition mt-2 sm:mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.span
                          className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 0.7,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        Memproses...
                      </span>
                    ) : (
                      "Kirim"
                    )}
                  </motion.button>

                  <motion.p
                    variants={fieldVariants}
                    className="text-center text-xs sm:text-sm text-gray-800 mt-4"
                  >
                    sudah punya akun ?{" "}
                    <button
                      onClick={() => router.push("/login")}
                      className="text-blue-600 font-semibold hover:underline"
                      type="button"
                    >
                      Login disini
                    </button>
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Side - image, desktop only */}
      <div className="hidden lg:block lg:w-1/3">
        <motion.img
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: easeOut }}
          src="/img/lgbg.png"
          alt="Registration Illustration"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}