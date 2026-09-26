import React from 'react';
import Link from 'next/link';
import { ClayCard } from '@/components/clay/ClayCard';
import { ClayButton } from '@/components/clay/ClayButton';
import { ClayBadge } from '@/components/clay/ClayBadge';
import {
  Cpu,
  Flame,
  Activity,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  Scale,
  Shield,
  Check,
} from 'lucide-react';

export const metadata = {
  title: 'Metabolic Engine • NutriClay Clinical Architecture',
  description:
    'Deep-dive into the Mifflin-St Jeor Basal Metabolic Rate equation, TDEE physical activity multipliers, and dynamic macronutrient splitting.',
};

export default function EnginePage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1E1B26] selection:bg-[#FF5A36] selection:text-white p-4 sm:p-8">
      {/* Top Header */}
      <header className="mx-auto max-w-5xl w-full flex items-center justify-between pb-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-[14px] bg-gradient-to-br from-[#FF7E62] to-[#FF5A36] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-nunito font-black text-xl tracking-tight text-[#1E1B26]">
            Nutri<span className="text-[#FF5A36]">Clay</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="font-nunito text-xs font-extrabold text-[#645F73] hover:text-[#FF5A36] transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Overview
          </Link>
          <Link href="/app">
            <ClayButton size="sm" variant="primary" icon={<ArrowRight className="h-4 w-4" />}>
              Open Studio Tracker
            </ClayButton>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl w-full space-y-10 pb-16">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <ClayBadge variant="tangerine" size="sm">
            Clinical Metabolic Architecture
          </ClayBadge>
          <h1 className="font-nunito font-black text-3xl sm:text-5xl text-[#1E1B26] tracking-tight">
            The Dynamic Mifflin-St Jeor Engine
          </h1>
          <p className="font-dmsans text-sm sm:text-base text-[#645F73] leading-relaxed max-w-2xl mx-auto">
            A comprehensive reference on how NutriClay dynamically models Basal Metabolic Rate (BMR), Total Daily Energy Expenditure (TDEE), and kinetic energy allocations.
          </p>
        </div>

        {/* Section 1: The BMR Equation */}
        <ClayCard
          variant="hero"
          className="!p-7 sm:!p-10 bg-white border border-[#EAE6DD] shadow-deepClay rounded-[36px]"
        >
          <div className="flex items-center gap-3.5 mb-6">
            <div className="h-12 w-12 rounded-[20px] bg-gradient-to-br from-[#FFB347] to-[#FF8A00] flex items-center justify-center text-white shadow-[0_6px_16px_rgba(255,138,0,0.3)]">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-nunito font-black text-2xl text-[#1E1B26]">
                Basal Metabolic Rate Formulation
              </h2>
              <span className="font-nunito text-xs font-semibold text-[#8C8799]">
                Mifflin MD, St Jeor ST, et al. (1990)
              </span>
            </div>
          </div>

          <div className="p-5 rounded-[24px] bg-[#FAF8F5] border border-[#E8E2D8] shadow-clayPressedSm mb-6">
            <span className="font-nunito text-xs font-bold uppercase tracking-wider text-[#645F73] block mb-2">
              Clinical Mathematical Model:
            </span>
            <div className="font-mono text-sm sm:text-base font-black text-[#1E1B26] bg-white p-4 rounded-[18px] border border-[#E2DDD2] shadow-sm leading-relaxed overflow-x-auto">
              BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + s
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs font-nunito font-extrabold">
              <div className="p-3 rounded-[16px] bg-[#FFF5F2] border border-[#FF5A36]/20 text-[#FF5A36] flex items-center justify-between">
                <span>Biological Men Constant:</span>
                <span className="font-mono font-black text-sm">s = +5</span>
              </div>
              <div className="p-3 rounded-[16px] bg-[#F5F9FF] border border-[#2563EB]/20 text-[#2563EB] flex items-center justify-between">
                <span>Biological Women Constant:</span>
                <span className="font-mono font-black text-sm">s = -161</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 font-dmsans text-xs sm:text-sm text-[#645F73] leading-relaxed">
            <p>
              Basal Metabolic Rate accounts for approximately 60–75% of your total daily energy expenditure. It represents the thermodynamic cost of cellular maintenance, respiration, cardiac output, renal filtration, and homeostatic body temperature regulation at complete physical rest.
            </p>
            <p>
              In multiple double-blind validation studies comparing predictive equations against indirect calorimetry, the Mifflin-St Jeor equation accurately estimated resting metabolic rate within 10% of measured values in over 82% of non-obese and obese subjects, significantly outperforming legacy Harris-Benedict and Katch-McArdle models.
            </p>
          </div>
        </ClayCard>

        {/* Section 2: Activity Factor Multipliers */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-between">
            <ClayCard
              variant="floating"
              className="!p-7 bg-white border border-[#EAE6DD] h-full flex flex-col justify-between gap-6"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-11 w-11 rounded-[18px] bg-gradient-to-br from-[#38BDF8] to-[#0284C7] flex items-center justify-center text-white shadow-sm shrink-0">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-nunito font-black text-xl text-[#1E1B26]">
                      Physical Activity Spectrum
                    </h3>
                    <span className="font-nunito text-xs font-semibold text-[#8C8799]">
                      TDEE = BMR × Activity Multiplier
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {[
                    { title: 'Sedentary (1.20×)', desc: 'Desk bound job, little to no structured movement.' },
                    { title: 'Lightly Active (1.375×)', desc: 'Light exercise or sports 1 to 3 days per week.' },
                    { title: 'Moderately Active (1.55×)', desc: 'Moderate lifting / cardio 3 to 5 days per week.' },
                    { title: 'Very Active (1.725×)', desc: 'Hard training / sports 6 to 7 days per week.' },
                    { title: 'Extremely Active (1.90×)', desc: 'Hard physical labor or double daily athletic training.' },
                  ].map((lvl, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-[18px] bg-[#FAF8F5] border border-[#ECE7DC] flex items-center justify-between text-xs font-nunito"
                    >
                      <div>
                        <span className="font-black text-[#1E1B26] block">{lvl.title}</span>
                        <span className="text-[11px] text-[#8C8799] font-medium">{lvl.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ClayCard>
          </div>

          {/* Section 3: Macronutrient Energy Splitter */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <ClayCard
              variant="floating"
              className="!p-7 bg-white border border-[#EAE6DD] h-full flex flex-col justify-between gap-6"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-11 w-11 rounded-[18px] bg-gradient-to-br from-[#34D399] to-[#059669] flex items-center justify-center text-white shadow-sm shrink-0">
                    <Scale className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-nunito font-black text-xl text-[#1E1B26]">
                      Dynamic Macro Allocation
                    </h3>
                    <span className="font-nunito text-xs font-semibold text-[#8C8799]">
                      Thermodynamic nutrient coefficients
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-center mb-4">
                  <div className="p-3 rounded-[18px] bg-[#FFF5F2] border border-[#FF5A36]/20">
                    <span className="text-[10px] font-extrabold uppercase text-[#FF5A36] block">Protein</span>
                    <span className="font-nunito font-black text-lg text-[#FF5A36]">4 kcal/g</span>
                  </div>
                  <div className="p-3 rounded-[18px] bg-[#F5F9FF] border border-[#2563EB]/20">
                    <span className="text-[10px] font-extrabold uppercase text-[#2563EB] block">Carbs</span>
                    <span className="font-nunito font-black text-lg text-[#2563EB]">4 kcal/g</span>
                  </div>
                  <div className="p-3 rounded-[18px] bg-[#FFFDF5] border border-[#F59E0B]/20">
                    <span className="text-[10px] font-extrabold uppercase text-[#D97706] block">Fats</span>
                    <span className="font-nunito font-black text-lg text-[#D97706]">9 kcal/g</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs font-nunito">
                  <div className="p-3 rounded-[18px] bg-[#FAF8F5] border border-[#ECE7DC]">
                    <span className="font-extrabold text-[#1E1B26] block">High-Protein Athlete (40% P / 35% C / 25% F)</span>
                    <span className="text-[11px] text-[#645F73]">Ideal for fat loss while preserving lean skeletal muscle tissue.</span>
                  </div>
                  <div className="p-3 rounded-[18px] bg-[#FAF8F5] border border-[#ECE7DC]">
                    <span className="font-extrabold text-[#1E1B26] block">Balanced Performance (30% P / 40% C / 30% F)</span>
                    <span className="text-[11px] text-[#645F73]">Standard athletic macro split for glycogen replenishment.</span>
                  </div>
                  <div className="p-3 rounded-[18px] bg-[#FAF8F5] border border-[#ECE7DC]">
                    <span className="font-extrabold text-[#1E1B26] block">Ketogenic Protocol (25% P / 5% C / 70% F)</span>
                    <span className="text-[11px] text-[#645F73]">Fat-adapted nutritional ketosis for metabolic flexibility.</span>
                  </div>
                </div>
              </div>
            </ClayCard>
          </div>
        </div>

        {/* Bottom CTA to Studio Tracker */}
        <div className="text-center pt-4">
          <Link href="/app">
            <ClayButton size="lg" variant="primary" icon={<ArrowRight className="h-5 w-5" />}>
              Calibrate Your Goals in NutriClay Studio
            </ClayButton>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 font-nunito text-xs font-bold text-[#8C8799] border-t border-[#ECE7DC] max-w-5xl mx-auto">
        © 2026 NutriClay. Clinical Metabolic Architecture & Digital Clay Interface.
      </footer>
    </div>
  );
}
