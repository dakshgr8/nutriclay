'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ClayCard } from '../clay/ClayCard';
import { ClayButton } from '../clay/ClayButton';
import { ClayBadge } from '../clay/ClayBadge';
import {
  Sparkles,
  ArrowRight,
  Flame,
  GlassWater,
  UtensilsCrossed,
  Scale,
  Zap,
  Check,
  Shield,
  Cpu,
  Star,
  Activity,
  ChevronRight,
  Apple,
  Dumbbell,
  Layers,
} from 'lucide-react';
import {
  calculateBMR,
  calculateTDEE,
  calculateTargetCalories,
  calculateMacronutrients,
} from '@/lib/calculations';
import { Gender, GoalType } from '@/lib/types';

export const LandingPage: React.FC = () => {
  // Live interactive calculator state on landing page
  const [calcGender, setCalcGender] = useState<Gender>('male');
  const [calcAge, setCalcAge] = useState<number>(28);
  const [calcWeight, setCalcWeight] = useState<number>(80);
  const [calcHeight, setCalcHeight] = useState<number>(180);
  const [calcGoal, setCalcGoal] = useState<GoalType>('cut');

  const liveBmr = calculateBMR(calcGender, calcWeight, calcHeight, calcAge);
  const liveTdee = calculateTDEE(liveBmr, 1.55);
  const liveTarget = calculateTargetCalories(liveTdee, calcGoal);
  const liveMacros = calculateMacronutrients(liveTarget, 'high_protein');

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1E1B26] selection:bg-[#FF5A36] selection:text-white">
      {/* ── TOP NAVIGATION BAR ── */}
      <nav className="sticky top-0 z-40 w-full px-4 sm:px-6 py-4 bg-[#F7F5F0]/85 backdrop-blur-xl border-b border-[#ECE7DC]/80">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-11 w-11 rounded-[18px] bg-gradient-to-br from-[#FF7E62] to-[#FF5A36] flex items-center justify-center text-white shadow-[0_4px_14px_rgba(255,90,54,0.35)] group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-nunito font-black text-2xl tracking-tight text-[#1E1B26]">
                  Nutri<span className="text-[#FF5A36]">Clay</span>
                </span>
                <ClayBadge variant="coral" size="sm">
                  v2.4
                </ClayBadge>
              </div>
              <span className="font-nunito text-[10px] font-bold text-[#8C8799] block -mt-0.5">
                Precision Digital Clay Engine
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-7 font-nunito font-extrabold text-sm text-[#645F73]">
            <a href="#features" className="hover:text-[#FF5A36] transition-colors">
              Features
            </a>
            <a href="#engine" className="hover:text-[#FF5A36] transition-colors">
              Metabolic Engine
            </a>
            <a href="#calculator" className="hover:text-[#FF5A36] transition-colors">
              Live Calibrator
            </a>
            <a href="#comparison" className="hover:text-[#FF5A36] transition-colors">
              Why NutriClay
            </a>
            <a href="#reviews" className="hover:text-[#FF5A36] transition-colors">
              Testimonials
            </a>
          </div>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-3">
            <Link href="/login">
              <ClayButton
                size="sm"
                variant="ghost"
                className="font-nunito text-[#645F73] hover:text-[#1E1B26]"
              >
                Sign In
              </ClayButton>
            </Link>
            <Link href="/app">
              <ClayButton
                size="sm"
                variant="primary"
                icon={<ArrowRight className="h-4 w-4" />}
                className="shadow-[0_6px_18px_rgba(255,90,54,0.3)]"
              >
                Open Studio Tracker
              </ClayButton>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Soft Ceramic Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-[#FF5A36]/10 via-[#FF8A00]/8 to-[#2563EB]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E8E3D8] shadow-clayCardSm text-xs font-nunito font-extrabold text-[#645F73]">
              <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>High-Fidelity Claymorphism • Dynamic Mifflin-St Jeor Engine</span>
            </div>

            {/* Headline */}
            <h1 className="font-nunito font-black text-4xl sm:text-6xl md:text-7xl tracking-tight text-[#1E1B26] leading-[1.08]">
              Tactile Precision for Every{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A36] via-[#FF8A00] to-[#E11D48]">
                Calorie & Macro.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="font-dmsans text-base sm:text-xl text-[#645F73] font-medium leading-relaxed max-w-2xl mx-auto">
              Say goodbye to flat, sterile spreadsheets and ad-bloated counters. Experience high-fidelity digital clay engineered around mathematical energy balance, 5 bento meal compartments, and real-time kinetic budgets.
            </p>

            {/* Hero CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/app" className="w-full sm:w-auto">
                <ClayButton
                  size="lg"
                  variant="primary"
                  icon={<ArrowRight className="h-5 w-5" />}
                  className="w-full sm:w-auto shadow-[0_12px_28px_rgba(255,90,54,0.35)]"
                >
                  Launch Interactive Tracker (Free)
                </ClayButton>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <ClayButton
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto border border-[#E2DDD2]"
                >
                  Demo Sign-In
                </ClayButton>
              </Link>
            </div>

            {/* Mini Trust Ticker */}
            <div className="pt-4 flex items-center justify-center gap-6 text-xs font-nunito font-bold text-[#8C8799]">
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-[#10B981]" /> 100% Client-Side Privacy
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-[#10B981]" /> Zero Ad Bloat
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-[#10B981]" /> Mifflin-St Jeor Validated
              </span>
            </div>
          </div>

          {/* ── HERO INTERACTIVE PREVIEW BENTO ── */}
          <div className="mt-14 max-w-5xl mx-auto">
            <ClayCard
              variant="hero"
              className="!p-6 sm:!p-10 bg-white/95 border-2 border-white shadow-deepClay rounded-[36px]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Visual Dial Preview (6 cols) */}
                <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 rounded-[28px] bg-gradient-to-br from-[#FAF8F5] via-[#FFF9F5] to-[#FFF3EC] border border-[#EFE8DD] text-center shadow-clayCardSm">
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-white shadow-clayOrb flex flex-col items-center justify-center p-4 border border-[#EBE5DB]">
                    <span className="font-nunito text-[11px] font-bold uppercase tracking-wider text-[#645F73]">
                      Remaining Energy
                    </span>
                    <span className="font-nunito font-black text-4xl sm:text-5xl text-[#1E1B26] my-1">
                      1,141
                    </span>
                    <span className="font-nunito text-xs font-bold text-[#FF5A36] bg-[#FF5A36]/10 px-2.5 py-0.5 rounded-full">
                      kcal to target
                    </span>

                    {/* Progress Arc Indicator */}
                    <div className="absolute inset-2 rounded-full border-4 border-dashed border-[#FF5A36]/30 pointer-events-none" />
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2.5 w-full text-center">
                    <div className="p-2.5 rounded-[16px] bg-white border border-[#EBE5DA] shadow-sm">
                      <span className="text-[10px] uppercase font-bold text-[#645F73] block">Target</span>
                      <span className="font-nunito font-black text-sm text-[#1E1B26]">2,313 kcal</span>
                    </div>
                    <div className="p-2.5 rounded-[16px] bg-white border border-[#EBE5DA] shadow-sm">
                      <span className="text-[10px] uppercase font-bold text-[#FF5A36] block">Ingested</span>
                      <span className="font-nunito font-black text-sm text-[#FF5A36]">1,172 kcal</span>
                    </div>
                    <div className="p-2.5 rounded-[16px] bg-white border border-[#EBE5DA] shadow-sm">
                      <span className="text-[10px] uppercase font-bold text-[#10B981] block">Deficit</span>
                      <span className="font-nunito font-black text-sm text-[#10B981]">-500 kcal</span>
                    </div>
                  </div>
                </div>

                {/* Right Interactive Highlights (6 cols) */}
                <div className="lg:col-span-6 flex flex-col justify-between gap-5">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF8A00]/10 text-[#FF8A00] text-xs font-nunito font-black uppercase tracking-wider mb-2">
                      <Flame className="h-3.5 w-3.5" /> High-Protein Allocation
                    </div>
                    <h3 className="font-nunito font-black text-2xl sm:text-3xl text-[#1E1B26] leading-snug">
                      Engineered for Serious Body Composition.
                    </h3>
                    <p className="font-dmsans text-sm text-[#645F73] font-medium leading-relaxed mt-2">
                      Dynamic macro splitting automatically allocates 40% protein (4 kcal/g), 35% carbohydrates (4 kcal/g), and 25% fats (9 kcal/g) to maximize lean mass retention.
                    </p>
                  </div>

                  {/* 3 Macro Pods */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-[20px] bg-[#FFF5F2] border border-[#FF5A36]/20">
                      <span className="font-nunito text-[11px] font-extrabold text-[#FF5A36] uppercase block">Protein</span>
                      <span className="font-nunito font-black text-xl text-[#FF5A36]">124g</span>
                      <span className="text-[10px] font-bold text-[#8C8799]">of 231g</span>
                    </div>
                    <div className="p-3 rounded-[20px] bg-[#F5F9FF] border border-[#2563EB]/20">
                      <span className="font-nunito text-[11px] font-extrabold text-[#2563EB] uppercase block">Carbs</span>
                      <span className="font-nunito font-black text-xl text-[#2563EB]">137g</span>
                      <span className="text-[10px] font-bold text-[#8C8799]">of 202g</span>
                    </div>
                    <div className="p-3 rounded-[20px] bg-[#FFFDF5] border border-[#F59E0B]/20">
                      <span className="font-nunito text-[11px] font-extrabold text-[#D97706] uppercase block">Fats</span>
                      <span className="font-nunito font-black text-xl text-[#D97706]">14g</span>
                      <span className="text-[10px] font-bold text-[#8C8799]">of 64g</span>
                    </div>
                  </div>

                  {/* Direct Launch Strip */}
                  <div className="flex items-center justify-between p-3.5 rounded-[20px] bg-[#FAF8F5] border border-[#ECE7DD]">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold">
                        ✓
                      </div>
                      <span className="font-nunito font-extrabold text-xs text-[#1E1B26]">
                        Pre-loaded with sample foods & SQLite ledger
                      </span>
                    </div>
                    <Link href="/app">
                      <button className="font-nunito font-black text-xs text-[#FF5A36] hover:underline flex items-center gap-1 cursor-pointer">
                        Test Drive <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </ClayCard>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: 4 CORE ARCHITECTURAL PILLARS (BENTO) ── */}
      <section id="features" className="py-20 bg-white border-y border-[#ECE7DC]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <ClayBadge variant="coral" size="sm">
              Core Architecture
            </ClayBadge>
            <h2 className="font-nunito font-black text-3xl sm:text-4xl text-[#1E1B26] mt-3">
              Built Like Industrial Precision Hardware.
            </h2>
            <p className="font-dmsans text-sm sm:text-base text-[#645F73] mt-2">
              Four synchronized engines work together in milliseconds to turn raw biometric data into exact daily actions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <ClayCard
              variant="floating"
              className="!p-6 bg-gradient-to-br from-white to-[#FFF9F6] border border-[#EFECE6] flex flex-col justify-between"
            >
              <div>
                <div className="h-12 w-12 rounded-[20px] bg-gradient-to-br from-[#FFB347] to-[#FF8A00] flex items-center justify-center text-white shadow-[0_6px_16px_rgba(255,138,0,0.3)] mb-4">
                  <Cpu className="h-6 w-6" />
                </div>
                <h3 className="font-nunito font-black text-xl text-[#1E1B26]">
                  Dynamic Target Engine
                </h3>
                <p className="font-dmsans text-xs text-[#645F73] leading-relaxed mt-2.5">
                  Computes Mifflin-St Jeor Basal Metabolic Rate and applies activity coefficients (1.2 to 1.9) with automated deficit and surplus allocation.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#ECE7DC] text-[11px] font-mono font-bold text-[#FF8A00]">
                BMR = 10W + 6.25H - 5A + s
              </div>
            </ClayCard>

            {/* Pillar 2 */}
            <ClayCard
              variant="floating"
              className="!p-6 bg-gradient-to-br from-white to-[#F6FAF8] border border-[#EFECE6] flex flex-col justify-between"
            >
              <div>
                <div className="h-12 w-12 rounded-[20px] bg-gradient-to-br from-[#34D399] to-[#059669] flex items-center justify-center text-white shadow-[0_6px_16px_rgba(5,150,105,0.3)] mb-4">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="font-nunito font-black text-xl text-[#1E1B26]">
                  Multi-Modal Ingestion
                </h3>
                <p className="font-dmsans text-xs text-[#645F73] leading-relaxed mt-2.5">
                  Instant text search, UPC barcode scanning emulation, quick-entry calorie pills, and composite custom recipe construction.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#ECE7DC] text-[11px] font-nunito font-extrabold text-[#059669]">
                4 Ingestion Modes • Zero Friction
              </div>
            </ClayCard>

            {/* Pillar 3 */}
            <ClayCard
              variant="floating"
              className="!p-6 bg-gradient-to-br from-white to-[#F6F9FE] border border-[#EFECE6] flex flex-col justify-between"
            >
              <div>
                <div className="h-12 w-12 rounded-[20px] bg-gradient-to-br from-[#60A5FA] to-[#2563EB] flex items-center justify-center text-white shadow-[0_6px_16px_rgba(37,99,235,0.3)] mb-4">
                  <UtensilsCrossed className="h-6 w-6" />
                </div>
                <h3 className="font-nunito font-black text-xl text-[#1E1B26]">
                  5 Bento Meal Slots
                </h3>
                <p className="font-dmsans text-xs text-[#645F73] leading-relaxed mt-2.5">
                  Dedicated compartments for Breakfast, Lunch, Dinner, Pre/Post Workout, and Nutrient Snacks with automatic per-slot macro aggregations.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#ECE7DC] text-[11px] font-nunito font-extrabold text-[#2563EB]">
                Individual Bento Compartments
              </div>
            </ClayCard>

            {/* Pillar 4 */}
            <ClayCard
              variant="floating"
              className="!p-6 bg-gradient-to-br from-white to-[#F0F8FF] border border-[#EFECE6] flex flex-col justify-between"
            >
              <div>
                <div className="h-12 w-12 rounded-[20px] bg-gradient-to-br from-[#38BDF8] to-[#0284C7] flex items-center justify-center text-white shadow-[0_6px_16px_rgba(2,132,199,0.3)] mb-4">
                  <GlassWater className="h-6 w-6" />
                </div>
                <h3 className="font-nunito font-black text-xl text-[#1E1B26]">
                  Tactile Hydration Station
                </h3>
                <p className="font-dmsans text-xs text-[#645F73] leading-relaxed mt-2.5">
                  10-glass visual ceramic ledger tracking 250ml precision increments with one-click logging and remaining water volume metrics.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#ECE7DC] text-[11px] font-nunito font-extrabold text-[#0284C7]">
                Interactive 250ml Glass Grid
              </div>
            </ClayCard>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: LIVE INTERACTIVE METABOLIC CALIBRATOR ── */}
      <section id="calculator" className="py-20 bg-[#F7F5F0]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <ClayBadge variant="tangerine" size="sm">
              Live Mathematical Preview
            </ClayBadge>
            <h2 className="font-nunito font-black text-3xl sm:text-4xl text-[#1E1B26] mt-3">
              Calibrate Your Metabolic Targets Right Now.
            </h2>
            <p className="font-dmsans text-sm sm:text-base text-[#645F73] mt-2">
              Adjust your biometrics below to see the Mifflin-St Jeor equation compute your daily calorie targets and macro splits in real time.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <ClayCard
              variant="hero"
              className="!p-6 sm:!p-8 bg-white border border-[#EAE6DD] shadow-deepClay rounded-[36px]"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Inputs Column */}
                <div className="space-y-4">
                  <span className="font-nunito text-xs font-bold uppercase tracking-wider text-[#645F73] block mb-1">
                    Your Biometric Profile:
                  </span>

                  {/* Sex Selector */}
                  <div className="grid grid-cols-2 gap-2 p-1 rounded-[16px] bg-[#EFECE6] shadow-clayPressedSm">
                    <button
                      type="button"
                      onClick={() => setCalcGender('male')}
                      className={`py-2 rounded-[12px] font-nunito font-extrabold text-xs transition-all cursor-pointer ${
                        calcGender === 'male'
                          ? 'bg-white text-[#FF5A36] shadow-clayCardSm'
                          : 'text-[#645F73] hover:text-[#1E1B26]'
                      }`}
                    >
                      Male (+5 constant)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcGender('female')}
                      className={`py-2 rounded-[12px] font-nunito font-extrabold text-xs transition-all cursor-pointer ${
                        calcGender === 'female'
                          ? 'bg-white text-[#FF5A36] shadow-clayCardSm'
                          : 'text-[#645F73] hover:text-[#1E1B26]'
                      }`}
                    >
                      Female (-161 constant)
                    </button>
                  </div>

                  {/* Weight Slider */}
                  <div className="p-3.5 rounded-[20px] bg-[#FAF8F5] border border-[#E8E2D8]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-nunito text-xs font-extrabold text-[#1E1B26]">Body Weight</span>
                      <span className="font-nunito font-black text-sm text-[#FF5A36]">{calcWeight} kg</span>
                    </div>
                    <input
                      type="range"
                      min="45"
                      max="140"
                      value={calcWeight}
                      onChange={(e) => setCalcWeight(Number(e.target.value))}
                      className="w-full accent-[#FF5A36] cursor-pointer"
                    />
                  </div>

                  {/* Height Slider */}
                  <div className="p-3.5 rounded-[20px] bg-[#FAF8F5] border border-[#E8E2D8]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-nunito text-xs font-extrabold text-[#1E1B26]">Height</span>
                      <span className="font-nunito font-black text-sm text-[#2563EB]">{calcHeight} cm</span>
                    </div>
                    <input
                      type="range"
                      min="140"
                      max="215"
                      value={calcHeight}
                      onChange={(e) => setCalcHeight(Number(e.target.value))}
                      className="w-full accent-[#2563EB] cursor-pointer"
                    />
                  </div>

                  {/* Goal Selector */}
                  <div className="grid grid-cols-3 gap-1.5 p-1 rounded-[16px] bg-[#EFECE6] shadow-clayPressedSm">
                    {[
                      { id: 'cut', label: 'Fat Loss (-500)' },
                      { id: 'maintain', label: 'Maintain (TDEE)' },
                      { id: 'bulk', label: 'Hypertrophy (+300)' },
                    ].map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setCalcGoal(g.id as GoalType)}
                        className={`py-2 px-1 rounded-[12px] font-nunito font-extrabold text-[11px] transition-all cursor-pointer truncate ${
                          calcGoal === g.id
                            ? 'bg-white text-[#FF5A36] shadow-clayCardSm'
                            : 'text-[#645F73] hover:text-[#1E1B26]'
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Computed Output Column */}
                <div className="flex flex-col justify-between gap-5 p-6 rounded-[28px] bg-gradient-to-br from-[#FAF8F5] via-[#FFF9F5] to-[#FFF3EC] border border-[#E8E2D8] shadow-clayCardSm text-center">
                  <div>
                    <span className="font-nunito text-[11px] font-bold uppercase tracking-wider text-[#645F73]">
                      Computed Daily Target Calories
                    </span>
                    <div className="font-nunito font-black text-4xl sm:text-5xl text-[#FF5A36] my-2">
                      {liveTarget.toLocaleString()}{' '}
                      <span className="text-sm font-bold text-[#8C8799]">kcal/day</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-xs font-nunito font-bold text-[#645F73]">
                      <span>BMR: {liveBmr} kcal</span>
                      <span>•</span>
                      <span>TDEE: {liveTdee} kcal</span>
                    </div>
                  </div>

                  {/* Macros Breakdown */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 rounded-[18px] bg-white border border-[#FF5A36]/20 shadow-sm">
                      <span className="text-[10px] font-extrabold text-[#FF5A36] uppercase block">Protein</span>
                      <span className="font-nunito font-black text-xl text-[#FF5A36]">{liveMacros.proteinG}g</span>
                      <span className="text-[9px] text-[#8C8799]">40% split</span>
                    </div>
                    <div className="p-3 rounded-[18px] bg-white border border-[#2563EB]/20 shadow-sm">
                      <span className="text-[10px] font-extrabold text-[#2563EB] uppercase block">Carbs</span>
                      <span className="font-nunito font-black text-xl text-[#2563EB]">{liveMacros.carbsG}g</span>
                      <span className="text-[9px] text-[#8C8799]">35% split</span>
                    </div>
                    <div className="p-3 rounded-[18px] bg-white border border-[#F59E0B]/20 shadow-sm">
                      <span className="text-[10px] font-extrabold text-[#D97706] uppercase block">Fats</span>
                      <span className="font-nunito font-black text-xl text-[#D97706]">{liveMacros.fatsG}g</span>
                      <span className="text-[9px] text-[#8C8799]">25% split</span>
                    </div>
                  </div>

                  <Link href="/app">
                    <ClayButton
                      variant="primary"
                      className="w-full shadow-clayButton"
                      icon={<ArrowRight className="h-4 w-4" />}
                    >
                      Track These Targets in NutriClay
                    </ClayButton>
                  </Link>
                </div>
              </div>
            </ClayCard>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: COMPARISON TABLE (WHY NUTRICLAY) ── */}
      <section id="comparison" className="py-20 bg-white border-y border-[#ECE7DC]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <ClayBadge variant="emerald" size="sm">
              The Digital Clay Advantage
            </ClayBadge>
            <h2 className="font-nunito font-black text-3xl sm:text-4xl text-[#1E1B26] mt-3">
              Why Athletes Abandon Legacy Trackers.
            </h2>
            <p className="font-dmsans text-sm sm:text-base text-[#645F73] mt-2">
              Most nutrition apps are cluttered advertising hubs. NutriClay is a focused, high-precision tactile instrument.
            </p>
          </div>

          <div className="max-w-4xl mx-auto overflow-hidden rounded-[32px] border border-[#EAE6DD] shadow-clayCard">
            <div className="grid grid-cols-2 divide-x divide-[#ECE7DC] bg-[#FAF8F5]">
              {/* Legacy Trackers Header */}
              <div className="p-5 sm:p-7 text-center">
                <span className="font-nunito font-black text-lg text-[#8C8799] line-through block">
                  Legacy Flat Apps
                </span>
                <span className="text-xs text-[#8C8799] mt-0.5 block">MyFitnessPal / LoseIt style</span>
              </div>

              {/* NutriClay Header */}
              <div className="p-5 sm:p-7 text-center bg-white">
                <span className="font-nunito font-black text-xl text-[#FF5A36] block">
                  NutriClay Studio
                </span>
                <span className="text-xs font-bold text-[#059669] mt-0.5 block">High-Fidelity Ceramic Hardware UI</span>
              </div>
            </div>

            <div className="divide-y divide-[#ECE7DC] bg-white font-nunito text-xs sm:text-sm">
              {[
                { feature: 'Visual Design', legacy: 'Sterile flat greys, banner ads & paywalls', clay: 'Tactile 3D digital clay, warm studio porcelain' },
                { feature: 'Caloric Engine', legacy: 'Arbitrary static goals or guesswork', clay: 'Live Mifflin-St Jeor BMR & adaptive TDEE' },
                { feature: 'Raw vs. Cooked Weight', legacy: 'Inconsistent crowd-sourced confusion', clay: 'Explicit state converters (-25% water loss)' },
                { feature: 'Database Drift', legacy: 'Editing a food alters all past history', clay: 'Immutable historical logs with static macros' },
                { feature: 'Hydration Ledger', legacy: 'Buried 3 menus deep behind a modal', clay: 'Tactile 10-glass matrix with 1-click pills' },
                { feature: 'Privacy & Storage', legacy: 'Tracks behavior across commercial ad networks', clay: 'Client-side embedded SQLite database' },
              ].map((row, idx) => (
                <div key={idx} className="grid grid-cols-2 divide-x divide-[#ECE7DC]">
                  <div className="p-4 sm:p-5 text-[#8C8799] bg-[#FAF8F5]/60 flex items-center gap-2">
                    <span className="text-rose-400 font-bold shrink-0">✕</span>
                    <span>{row.legacy}</span>
                  </div>
                  <div className="p-4 sm:p-5 text-[#1E1B26] font-bold flex items-center gap-2">
                    <span className="text-[#10B981] font-bold shrink-0">✓</span>
                    <span>{row.clay}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: ATHLETE TESTIMONIALS ── */}
      <section id="reviews" className="py-20 bg-[#F7F5F0]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <ClayBadge variant="coral" size="sm">
              Community Endorsements
            </ClayBadge>
            <h2 className="font-nunito font-black text-3xl sm:text-4xl text-[#1E1B26] mt-3">
              Trusted by Coaches & Physique Athletes.
            </h2>
            <p className="font-dmsans text-sm sm:text-base text-[#645F73] mt-2">
              Here is how serious bodybuilders and nutritionists use NutriClay daily.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Marcus Vance',
                role: 'Natural Bodybuilder & Coach',
                text: 'The raw vs. cooked modifier alone saved my prep. Most apps don’t account for 25% moisture evaporation in chicken breast and jasmine rice. NutriClay’s tactile dials make logging enjoyable.',
                rating: 5,
                initial: 'M',
                color: 'from-[#FF7E62] to-[#FF5A36]',
              },
              {
                name: 'Elena Rostova',
                role: 'Sports Dietitian, RD',
                text: 'Mifflin-St Jeor is the clinical gold standard. Having the dynamic TDEE and high-protein split automatically recomputed in the Dynamic Target Engine gives my athletes zero excuses for falling off track.',
                rating: 5,
                initial: 'E',
                color: 'from-[#38BDF8] to-[#0284C7]',
              },
              {
                name: 'Devon Patel',
                role: 'Strength & Conditioning Specialist',
                text: 'The claymorphic tactile interface feels like holding physical equipment. The 5-compartment bento makes meal planning clear, and there is zero lag or annoying commercial advertisements.',
                rating: 5,
                initial: 'D',
                color: 'from-[#34D399] to-[#059669]',
              },
            ].map((review, idx) => (
              <ClayCard
                key={idx}
                variant="floating"
                className="!p-6 bg-white border border-[#EAE6DD] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#FF8A00] mb-3">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#FF8A00]" />
                    ))}
                  </div>
                  <p className="font-dmsans text-xs sm:text-sm text-[#645F73] leading-relaxed italic">
                    "{review.text}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#ECE7DC] flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-[14px] bg-gradient-to-br ${review.color} text-white font-nunito font-black flex items-center justify-center shadow-sm`}>
                    {review.initial}
                  </div>
                  <div>
                    <span className="font-nunito font-black text-sm text-[#1E1B26] block">
                      {review.name}
                    </span>
                    <span className="font-nunito text-[11px] font-semibold text-[#8C8799]">
                      {review.role}
                    </span>
                  </div>
                </div>
              </ClayCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: BOTTOM CONVERSION CTA ── */}
      <section className="py-20 bg-white border-t border-[#ECE7DC]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <ClayCard
            variant="hero"
            className="!p-8 sm:!p-14 bg-gradient-to-br from-[#1E1B26] to-[#2B2638] text-white rounded-[40px] text-center shadow-[0_30px_70px_rgba(30,27,38,0.35)] relative overflow-hidden"
          >
            {/* Background Accent Glows */}
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#FF5A36]/30 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#FF8A00]/25 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-white text-xs font-nunito font-extrabold backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-[#FF7E62]" />
                Zero Setup • Instant Browser Sandbox
              </div>

              <h2 className="font-nunito font-black text-3xl sm:text-5xl tracking-tight leading-tight">
                Take Full Control of Your Metabolic Trajectory Today.
              </h2>

              <p className="font-dmsans text-sm sm:text-base text-white/80 leading-relaxed max-w-xl mx-auto">
                No credit cards. No aggressive notifications. Just pure, mathematical nutrition modeling built on high-fidelity digital clay.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/app" className="w-full sm:w-auto">
                  <ClayButton
                    size="lg"
                    variant="primary"
                    icon={<ArrowRight className="h-5 w-5" />}
                    className="w-full sm:w-auto shadow-[0_12px_28px_rgba(255,90,54,0.4)]"
                  >
                    Open Studio Tracker Now
                  </ClayButton>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-6 py-3.5 rounded-[22px] bg-white/10 hover:bg-white/20 text-white font-nunito font-extrabold text-sm border border-white/20 transition-all active:scale-95 cursor-pointer">
                    Sign In with Demo Account
                  </button>
                </Link>
              </div>
            </div>
          </ClayCard>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 bg-[#F7F5F0] border-t border-[#ECE7DC] font-nunito">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#8C8799] font-bold">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-[12px] bg-gradient-to-br from-[#FF7E62] to-[#FF5A36] flex items-center justify-center text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-[#1E1B26] font-black text-sm">NutriClay</span>
            <span>• Ceramic Nutrition Architecture</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/app" className="hover:text-[#FF5A36] transition-colors">
              Studio Tracker
            </Link>
            <Link href="/login" className="hover:text-[#FF5A36] transition-colors">
              Sign In
            </Link>
            <a href="#features" className="hover:text-[#FF5A36] transition-colors">
              Features
            </a>
            <a href="#calculator" className="hover:text-[#FF5A36] transition-colors">
              Calibrator
            </a>
          </div>

          <div>
            © 2026 NutriClay. Precision High-Fidelity Claymorphism.
          </div>
        </div>
      </footer>
    </div>
  );
};
