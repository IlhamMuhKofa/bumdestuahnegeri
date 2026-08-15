import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-gray-200 border-t-blue-500" />

          <p className="text-sm text-gray-400">
            Memuat data simpanan...
          </p>
        </div>
      </div>
  );
}