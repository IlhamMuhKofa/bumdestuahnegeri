"use client";

import {
  Download,
  FileText,
} from "lucide-react";
import { deleteSurat } from "../action";

type Surat = {
  id_surat: number;
  kode: string;
  nama_file: string;
  file_url: string;
};

type Props = {
  data: Surat;
  onEdit: (surat: Surat) => void;
};

export default function SuratCard({
  data,
  onEdit,
}: Props) {
  const handleDelete = async () => {
    const confirmed = confirm(
      "Hapus dokumen SP2K Pencairan?"
    );

    if (!confirmed) return;

    const result = await deleteSurat(
      data.id_surat
    );

    alert(result.message);

    if (result.success) {
      window.location.reload();
    }
  };

  return (
    <div
      className="
        group
        bg-white
        border border-gray-200
        rounded-2xl
        p-5
        shadow-sm
        hover:shadow-md
        transition-all
        duration-300
      "
    >
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="
              w-11 h-11
              rounded-xl
              bg-[#1a3c2e]/10
              flex items-center justify-center
            "
          >
            <FileText
              size={22}
              className="text-[#1a3c2e]"
            />
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">
              SP2K Pencairan
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              Dokumen PDF
            </p>
          </div>
        </div>
      </div>

      <div
        className="
          rounded-xl
          border border-gray-200
          bg-gray-50
          p-4
          mb-5
        "
      >
        <p className="text-xs text-gray-500 mb-1">
          Nama File
        </p>

        <a
          href={data.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-[#1a3c2e] break-all hover:underline"
          title="Lihat berkas"
        >
          SP2K Pencairan.pdf
        </a>
      </div>

      <div className="flex items-center justify-between">
        <a
          href={data.file_url}
          target="_blank"
          rel="noopener noreferrer"
          download="SP2K Pencairan.pdf"
          className="
            inline-flex items-center gap-2
            text-sm font-medium
            text-[#1a3c2e]
            hover:underline
          "
        >
          <Download size={16} />
          Download
        </a>

        <div className="flex gap-2">

          {/* EDIT */}
          <button
            onClick={() => onEdit(data)}
            className="
              rounded-lg
              border
              border-blue-200
              bg-blue-50
              px-3
              py-2
              text-xs
              font-medium
              text-blue-600
              transition-all
              duration-200
              hover:bg-blue-100
            "
            type="button"
          >
            Edit
          </button>

          {/* HAPUS */}
          <button
            onClick={handleDelete}
            className="
              rounded-lg
              border
              border-red-200
              bg-red-50
              px-3
              py-2
              text-xs
              font-medium
              text-red-600
              transition-all
              duration-200
              hover:bg-red-100
            "
            type="button"
          >
            Hapus
          </button>

        </div>
      </div>
    </div>
  );
}