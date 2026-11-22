import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nyra 2.0 — Guardrailed AI Agent Harness",
  description: "Text-First Canadian Bill Guard, Scam Shield & FFE Money Coach",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        {children}
      </body>
    </html>
  );
}
