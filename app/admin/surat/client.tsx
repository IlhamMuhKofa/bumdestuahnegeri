"use client";

import { useState, useTransition } from "react";
import SuratCard from "./item/suratcard";
import { createSurat, updateSurat } from "./action";

type Surat = {
  id_surat: number;
  kode: string;
  nama_file: string;
  file_url: string;
};

export default function ClientPage({
  surat,
}: {
  surat: Surat | null;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = surat
        ? await updateSurat(surat.id_surat, formData)
        : await createSurat(formData);

      alert(result.message);

      if (result.success) {
        setOpen(false);
        window.location.reload();
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              SP2K Pencairan
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Kelola dokumen SP2K Pencairan yang dapat diunduh oleh nasabah
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="bg-blue-800 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#142f24]"
          >
            {surat ? "Update Dokumen" : "+ Upload Dokumen"}
          </button>
        </div>

        {surat ? (
          <div className="max-w-xl">
            <SuratCard
              data={surat}
              onEdit={() => setOpen(true)}
            />
          </div>
        ) : (
          <div className="text-center py-10 text-sm text-gray-400">
            Belum ada dokumen SP2K Pencairan
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="
                relative
                w-full
                max-w-lg
                rounded-3xl
                bg-white
                shadow-2xl
                border
                border-gray-100
                animate-in
                fade-in
                zoom-in-95
                duration-200
              "
            >
              <div className="border-b border-gray-100 px-6 py-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {surat
                        ? "Update SP2K Pencairan"
                        : "Upload SP2K Pencairan"}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Upload satu file PDF berisi seluruh dokumen SP2K Pencairan
                    </p>
                  </div>

                  <button
                    onClick={() => setOpen(false)}
                    className="
                      h-10 w-10
                      rounded-xl
                      hover:bg-gray-100
                      transition
                      flex items-center justify-center
                      text-gray-500
                    "
                    type="button"
                  >
                    x
                  </button>
                </div>
              </div>

              <div className="p-6">
                <form
                  action={handleSubmit}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload File PDF
                    </label>

                    <input
                      type="file"
                      name="file"
                      required
                      accept=".pdf,application/pdf"
                      className="
                        w-full
                        rounded-xl
                        border border-gray-200
                        px-3 py-3
                        text-sm
                        file:mr-3
                        file:rounded-lg
                        file:border-0
                        file:bg-[#1a3c2e]
                        file:px-3
                        file:py-2
                        file:text-white
                        hover:file:bg-[#244d3c]
                      "
                    />

                    <p className="mt-2 text-xs text-gray-500">
                      Format PDF, maksimal 2MB
                    </p>
                  </div>

                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="
                        rounded-xl
                        border border-gray-200
                        px-4 py-2.5
                        text-sm
                        font-medium
                        text-gray-600
                        hover:bg-gray-50
                      "
                    >
                      Batal
                    </button>

                    <button
                      type="submit"
                      disabled={isPending}
                      className="
                        rounded-xl
                        bg-[#1a3c2e]
                        px-5 py-2.5
                        text-sm
                        font-medium
                        text-white
                        hover:bg-[#244d3c]
                        disabled:opacity-50
                      "
                    >
                      {isPending
                        ? surat
                          ? "Mengupdate..."
                          : "Mengupload..."
                        : surat
                        ? "Update Dokumen"
                        : "Simpan Dokumen"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
