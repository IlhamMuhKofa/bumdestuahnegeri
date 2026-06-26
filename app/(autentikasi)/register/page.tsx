"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

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
  const detail =
    fieldErrors ? Object.values(fieldErrors).flat().join(", ") : null;

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

  return (
    <div className="flex min-h-screen">
      {/* Left Side */}
      <div className="relative w-full lg:w-2/3 bg-[#F5C542] flex items-center justify-center p-6 md:p-10 lg:p-15 ">

  {step === 2 && (
  <motion.button
    onClick={() => setStep(1)}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3, delay: 0.3 }}
    className="absolute left-10 top-8 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-black shadow-sm backdrop-blur hover:bg-white transition mt-6"
    type="button"
  >
    ← Kembali
  </motion.button>
  )}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl lg:text-4xl font-bold mb-3 text-black">
                  Biar Lebih Dekat, Daftar Dulu Yuk!
                </h2>
                <p className="text-sm mb-12 text-black">
                  Kami butuh sedikit data kamu agar bisa kasih layanan terbaik ke depannya.
                </p>

                <div className="space-y-4">
                  {/* Nama Lengkap */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-black">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="namaLengkap"
                      value={formData.namaLengkap}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-white border-0 rounded-lg focus:ring-2 focus:ring-yellow-600 outline-none text-black"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>

                  {/* Alamat */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-black">
                      Alamat Tempat Tinggal
                    </label>
                    <input
                      type="text"
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-white border-0 rounded-lg focus:ring-2 focus:ring-yellow-600 outline-none text-black"
                      placeholder="Masukkan alamat tinggal"
                    />
                  </div>

                  {/* Pekerjaan */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-black">
                      Pekerjaan
                    </label>
                    <input
                      type="text"
                      name="pekerjaan"
                      value={formData.pekerjaan}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-white border-0 rounded-lg focus:ring-2 focus:ring-yellow-600 outline-none text-black"
                      placeholder="Masukkan pekerjaan"
                    />
                  </div>

                  {/* Jenis Kelamin, No HP, Tanggal Lahir */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-black">
                        Jenis Kelamin
                      </label>
                      <select
                        name="jenisKelamin"
                        value={formData.jenisKelamin}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-white border-0 rounded-lg focus:ring-2 focus:ring-yellow-600 outline-none appearance-none text-black"
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
                        className="w-full p-3 bg-white border-0 rounded-lg focus:ring-2 focus:ring-yellow-600 outline-none text-black"
                        placeholder="Nomor HP"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-black">
                        Tanggal Lahir
                      </label>
                      <input
                        type="date"
                        name="tanggalLahir"
                        value={formData.tanggalLahir}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-white border-0 rounded-lg focus:ring-2 focus:ring-yellow-600 outline-none text-black"
                      />
                    </div>
                  </div>

                  {/* Error/Success */}
                  {errorMsg && (
                    <p className="text-sm text-red-700 bg-red-100 p-3 rounded-lg">
                      {errorMsg}
                    </p>
                  )}

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNextStep}
                    className="w-full bg-[#2B7DE9] text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mt-6"
                  >
                    Lanjut
                  </motion.button>

                  <p className="text-center text-sm text-gray-800 mt-4">
                    sudah punya akun ?{" "}
                    <button
                      onClick={() => router.push("/login")}
                      className="text-blue-600 font-semibold hover:underline"
                      type="button"
                    >
                      Login
                    </button>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl lg:text-4xl font-bold mb-3 text-black">
                  Buat Akun untuk Login
                </h2>
                <p className="text-sm mb-8 text-black">
                  Masukkan email aktif dan buat kata sandi agar kamu bisa login dan akses layanan digital dari BUMDes kapan saja.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-black">
                      Email Aktif
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-white border-0 rounded-lg focus:ring-2 focus:ring-yellow-600 outline-none text-black"
                      placeholder="Masukkan email aktif"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-black">
                      Kata sandi
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-600 outline-none"
                        placeholder="password minimal 8 karakter"
                      />
                    </div>
                  </div>

                  {/* Error/Success */}
                  {errorMsg && (
                    <p className="text-sm text-red-700 bg-red-100 p-3 rounded-lg">
                      {errorMsg}
                    </p>
                  )}
                  {successMsg && (
                    <p className="text-sm text-green-800 bg-green-100 p-3 rounded-lg">
                      {successMsg}
                    </p>
                  )}

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNextStep}
                    disabled={loading}
                    className="w-full bg-[#2B7DE9] text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mt-6 disabled:opacity-60"
                  >
                    {loading ? "Memproses..." : "Kirim"}
                  </motion.button>

                  <p className="text-center text-sm text-gray-800 mt-4">
                    sudah punya akun ?{" "}
                    <button
                      onClick={() => router.push("/login")}
                      className="text-blue-600 font-semibold hover:underline"
                      type="button"
                    >
                      Login disini
                    </button>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Side */}
      <div className="hidden lg:block lg:w-1/2">
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          src="/img/lgbg.png"
          alt="Registration Illustration"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}