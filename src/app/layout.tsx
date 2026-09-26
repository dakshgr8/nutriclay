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
  title: "NutriClay — Physical Macro & Calorie Ledger",
  description: "Bespoke Claymorphic Nutrition Ledger with Mifflin-St Jeor Dynamic Target Engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${dmSans.variable}`}>
      <body className="relative min-h-screen bg-[#F7F5F0] text-[#1E1B26] antialiased selection:bg-[#FF5A36]/15 selection:text-[#FF5A36]">
        {/* Warm Studio Ambient Light Blobs (No Monotonous Purple!) */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10" aria-hidden="true">
          {/* Warm Solar Apricot Glow */}
          <div className="absolute -top-[10%] -left-[10%] h-[60vh] w-[60vh] rounded-full bg-[#FF7A00]/10 blur-[100px] animate-clay-float" />
          {/* Soft Sage / Fresh Mint Ambient Occlusion */}
          <div className="absolute top-[25%] -right-[12%] h-[65vh] w-[65vh] rounded-full bg-[#10B981]/8 blur-[110px] animate-clay-float-delayed" />
          {/* Subdued Mineral Cobalt Wash */}
          <div className="absolute -bottom-[15%] left-[25%] h-[60vh] w-[60vh] rounded-full bg-[#3B82F6]/7 blur-[120px] animate-clay-float" />
          {/* Warm Terracotta Horizon */}
          <div className="absolute top-[70%] -left-[10%] h-[50vh] w-[50vh] rounded-full bg-[#FF5A36]/8 blur-[90px] animate-clay-float-delayed" />
        </div>

        {children}
      </body>
    </html>
  );
}
