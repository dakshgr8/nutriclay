import type { Metadata } from "next";
import { Nunito, DM_Sans } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NutriClay — Precision Macro & Nutrition Ledger",
  description: "High-Fidelity Claymorphism Food Diary, Mifflin-St Jeor Caloric Engine & Macro Splitter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${dmSans.variable}`}>
      <body className="relative min-h-screen bg-[#F4F1FA] text-[#332F3A] antialiased selection:bg-[#7C3AED]/20 selection:text-[#7C3AED]">
        {/* Ambient 3D Clay Background Blobs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10" aria-hidden="true">
          <div className="absolute -top-[12%] -left-[10%] h-[65vh] w-[65vh] rounded-full bg-[#8B5CF6]/15 blur-3xl animate-clay-float" />
          <div className="absolute top-[30%] -right-[12%] h-[60vh] w-[60vh] rounded-full bg-[#EC4899]/12 blur-3xl animate-clay-float-delayed" />
          <div className="absolute -bottom-[15%] left-[20%] h-[70vh] w-[70vh] rounded-full bg-[#0EA5E9]/12 blur-3xl animate-clay-float-slow" />
          <div className="absolute top-[65%] -left-[10%] h-[50vh] w-[50vh] rounded-full bg-[#10B981]/10 blur-3xl animate-clay-float" />
        </div>

        {children}
      </body>
    </html>
  );
}
