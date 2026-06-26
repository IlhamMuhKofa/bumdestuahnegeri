"use client";

import React, { createContext, useContext, useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";
type ToastItem = { id: string; type: ToastType; message: string; duration: number };

const ToastCtx = createContext<{ push: (t: Omit<ToastItem,"id">) => void } | null>(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push = useCallback((t: Omit<ToastItem,"id">) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((p) => [...p, { ...t, id }]);
    window.setTimeout(() => {
      setToasts((p) => p.filter((x) => x.id !== id));
    }, t.duration);
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastCtx.Provider value={value}>
      {children}

      <div className="fixed right-4 top-4 z-[100000] w-[320px] space-y-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden rounded-2xl border bg-white shadow-lg"
            >
              <div className="flex gap-3 p-3">
                {t.type === "success" && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                {t.type === "error" && <XCircle className="h-5 w-5 text-red-600" />}
                {t.type === "info" && <Info className="h-5 w-5 text-sky-600" />}

                <div className="text-sm font-semibold text-slate-900">{t.message}</div>
              </div>

              {/* progress bar */}
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: t.duration / 1000, ease: "linear" }}
                className={`h-1 ${
                  t.type === "success" ? "bg-emerald-600" : t.type === "error" ? "bg-red-600" : "bg-sky-600"
                }`}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}