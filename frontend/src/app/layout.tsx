import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nyra 2.0 — Guardrailed AI Agent Harness & A2UI v1.0",
  description: "Text-First Canadian Bill Guard, Scam Shield & FFE Money Coach built on A2UI v1.0 declarative surfaces",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="min-h-screen bg-[#0B0E14] text-[#F1F5F9] font-sans antialiased selection:bg-[#2177D1]/30 selection:text-[#5BA3EC]">
        {children}
      </body>
    </html>
  );
}
