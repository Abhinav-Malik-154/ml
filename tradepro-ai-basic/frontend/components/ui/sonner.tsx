"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      richColors
      theme="dark"
      closeButton
      toastOptions={{
        classNames: {
          toast: "border border-zinc-700 bg-zinc-900 text-zinc-100",
          description: "text-zinc-300",
        },
      }}
    />
  );
}
