import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TopTicker } from "@/app/components/TopTicker";

export const metadata: Metadata = {
  title: "TradePro AI",
  description: "Professional AI-powered trading dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100 antialiased">
        <TopTicker />
        <main className="min-h-[calc(100vh-44px)]">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
