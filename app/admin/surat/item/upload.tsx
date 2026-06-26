"use client";

import { useTransition } from "react";
import { createSurat, updateSurat } from "../action";

type Surat = {
  id_surat: number;
  kode: string;
  nama_file: string;
  file_url: string;
};

export default function UploadSurat({
  onClose,
  surat,
}: {
  onClose: () => void;
  surat?: Surat | null;
}) {
  const [isPending, startTransition] =
    useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = surat
        ? await updateSurat(surat.id_surat, formData)
        : await createSurat(formData);

      alert(result.message);

      if (result.success) {
        onClose();
        window.location.reload();
      }
    });
  };

  return (
    <form
      action={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Upload File PDF
        </label>

        <input
          type="file"
          name="file"
          required
          accept=".pdf,application/pdf"
          className="
            w-full rounded-xl border border-gray-200
            px-3 py-2 text-sm
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

        <p className="mt-1 text-xs text-gray-500">
          Format PDF, maksimal 2MB
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="
          w-full rounded-xl
          bg-[#1a3c2e]
          py-3
          text-sm
          font-medium
          text-white
          transition
          hover:bg-[#244d3c]
          disabled:opacity-50
        "
      >
        {isPending
          ? "Menyimpan..."
          : surat
          ? "Update Dokumen"
          : "Simpan Dokumen"}
      </button>
    </form>
  );
}
