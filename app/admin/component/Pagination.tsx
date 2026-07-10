import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
  totalItems?: number;
  pageSize?: number;
};

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams = {},
  totalItems = 0,
  pageSize = 7,
}: Props) {
  const hrefFor = (page: number) => {
    const params = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== "page") {
        params.set(key, value);
      }
    });

    params.set("page", String(page));

    return `${basePath}?${params.toString()}`;
  };

  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalItems);
  const pageItems = Array.from({ length: totalPages || 1 }, (_, index) => index + 1)
    .filter((page) => {
      if (totalPages <= 5) return true;
      return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
    })
    .reduce<(number | string)[]>((acc, page, index, pages) => {
      if (index > 0 && page - pages[index - 1] > 1) {
        acc.push("...");
      }

      acc.push(page);
      return acc;
    }, []);

  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-3 px-1 text-sm text-gray-500 sm:flex-row">
      <p className="text-xs text-gray-500">
        Menampilkan{" "}
        <span className="font-semibold text-gray-700">
          {startIndex}-{endIndex}
        </span>{" "}
        dari{" "}
        <span className="font-semibold text-gray-700">
          {totalItems}
        </span>{" "}
        data
      </p>

      <div className="flex flex-wrap items-center justify-center gap-1">
        <PageLink
          disabled={currentPage <= 1}
          href={hrefFor(currentPage - 1)}
          label="Sebelumnya"
          direction="prev"
        />

        {pageItems.map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-xs text-gray-400"
            >
              ...
            </span>
          ) : (
            <Link
              key={page}
              href={hrefFor(page as number)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                page === currentPage
                  ? "bg-blue-700 text-white"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {page}
            </Link>
          )
        )}

        <PageLink
          disabled={currentPage >= totalPages}
          href={hrefFor(currentPage + 1)}
          label="Berikutnya"
          direction="next"
        />
      </div>
    </div>
  );
}

function PageLink({
  disabled,
  href,
  label,
  direction,
}: {
  disabled: boolean;
  href: string;
  label: string;
  direction: "prev" | "next";
}) {
  const content = (
    <>
      {direction === "prev" && <ChevronLeft className="h-3.5 w-3.5" />}
      {label}
      {direction === "next" && <ChevronRight className="h-3.5 w-3.5" />}
    </>
  );

  if (disabled) {
    return (
      <span className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-300">
        {content}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-all hover:bg-gray-100"
    >
      {content}
    </Link>
  );
}
