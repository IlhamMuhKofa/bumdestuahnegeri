"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type Props = {
  href: string;
  label?: string;
  className?: string;
};

export default function DetailButton({
  href,
  label = "Detail",
  className = "",
}: Props) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const handleDetail = () => {
    if (loading) return;

    setLoading(true);

    router.push(href);
  };

  return (
    <button
      type="button"
      onClick={handleDetail}
      disabled={loading}
      className={`
        inline-flex
        h-8
        min-w-[72px]
        items-center
        justify-center
        gap-1.5
        rounded-xl
        border
        px-4
        py-2
        text-xs
        font-semibold
        transition-all
        disabled:cursor-not-allowed
        disabled:opacity-70
        ${className}
      `}
    >
      {loading ? (
        <>
          <Loader2
            className="h-3.5 w-3.5 animate-spin"
          />

          Memuat...
        </>
      ) : (
        label
      )}
    </button>
  );
}