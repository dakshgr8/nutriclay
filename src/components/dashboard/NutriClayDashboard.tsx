'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TopBar } from '@/components/navigation/TopBar';
import { ClayCard } from '@/components/clay/ClayCard';
import { ClayButton } from '@/components/clay/ClayButton';
import { ClayOrbMeter } from '@/components/clay/ClayOrbMeter';
import { ClayBadge } from '@/components/clay/ClayBadge';
import { MacroStatsBar } from '@/components/diary/MacroStatsBar';
import { HydrationCard } from '@/components/diary/HydrationCard';
import { MealSlotCard } from '@/components/diary/MealSlotCard';
import { QuickLogModal } from '@/components/modals/QuickLogModal';
import { ProfileEngineModal } from '@/components/modals/ProfileEngineModal';
import { DailySummary, UserProfile, MealType } from '@/lib/types';
import {
  Flame,
  Plus,
  Target,
  Info,
  Sparkles,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface NutriClayDashboardProps {
  initialSummary: DailySummary;
  initialProfile: UserProfile;
  initialDate: string;
}

export const NutriClayDashboard: React.FC<NutriClayDashboardProps> = ({
  initialSummary,
  initialProfile,
  initialDate,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [summary, setSummary] = useState<DailySummary>(initialSummary);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);

  // Modal controls
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [activeMealSlot, setActiveMealSlot] = useState<MealType>('breakfast');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Fetch summary when date changes
  const loadData = useCallback(async (date: string) => {
    try {
      const res = await fetch(`/api/summary?date=${date}`);
      const data = await res.json();
      if (data.success) {
        setSummary(data.summary);
        setProfile(data.profile);
      }
    } catch (err) {
      console.error('Failed to load daily ledger data', err);
    }
  }, []);

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    loadData(newDate);
  };

  // Open Log Modal for specific slot
  const handleOpenLogModal = (mealType: MealType) => {
    setActiveMealSlot(mealType);
    setIsLogModalOpen(true);
  };

  // Add Food Log
  const handleLogFood = async (entry: any) => {
    try {
      const res = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      const data = await res.json();
      if (data.success) {
        setSummary(data.summary);
      }
    } catch (err) {
      console.error('Failed to add food log', err);
    }
  };

  // Delete Food Log
  const handleDeleteLog = async (logId: string) => {
    try {
      const res = await fetch(`/api/logs/${logId}?date=${selectedDate}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setSummary(data.summary);
      }
    } catch (err) {
      console.error('Failed to delete log', err);
    }
  };

  // Quick Add Water
  const handleAddWater = async (amountMl: number) => {
    try {
      const res = await fetch('/api/water', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountMl, logDate: selectedDate }),
      });
      const data = await res.json();
      if (data.success) {
        setSummary(data.summary);
      }
    } catch (err) {
      console.error('Failed to log water', err);
    }
  };

  // Update Profile & Dynamic Target Engine
  const handleUpdateProfile = async (updated: Partial<UserProfile>) => {
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updated, date: selectedDate }),
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.profile);
        setSummary(data.summary);
      }
    } catch (err) {
      console.error('Failed to update profile', err);
    }
  };

  const calorieBudgetEquation = `${summary.targetCalories} Target - ${summary.consumedCalories} Food = ${summary.remainingCalories} kcal`;

  return (
    <div className="min-h-screen pb-24 text-[#1E1B26]">
      {/* Top Ceramic Navigation Bar */}
      <TopBar
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        profile={profile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenQuickLog={() => handleOpenLogModal('breakfast')}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col gap-8">
        {/* HERO: Calorie & Macro Command Center */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Caloric Dial Centerpiece (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <ClayCard variant="hero" className="flex-1 flex flex-col justify-between !p-7 sm:!p-9">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="font-nunito font-extrabold text-xs uppercase tracking-widest text-[#FF5A36] bg-[#FF5A36]/10 px-3.5 py-1 rounded-full">
                    Daily Energy Ledger
                  </span>
                  <ClayBadge variant="neutral" size="sm">
                    Mifflin-St Jeor Formula
                  </ClayBadge>
                </div>
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="font-nunito text-xs font-bold text-[#FF5A36] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Target className="h-3.5 w-3.5" />
                  Adjust Parameters
                </button>
              </div>

              {/* Center Physical Ceramic Dial with Ticks */}
              <div className="flex flex-col items-center justify-center my-3">
                <ClayOrbMeter
                  current={summary.remainingCalories}
                  target={summary.targetCalories}
                  label="Remaining"
                  sublabel="Daily Budget"
                  size={290}
                  strokeWidth={16}
                />

                {/* Equation Pill */}
                <div className="mt-6 px-4 py-2 rounded-[20px] bg-[#EFECE6] shadow-clayPressedSm flex items-center gap-2 text-xs font-nunito font-bold text-[#645F73]">
                  <Info className="h-4 w-4 text-[#FF5A36] shrink-0" />
                  <span>
                    Equation: <strong className="text-[#1E1B26]">{calorieBudgetEquation}</strong>
                  </span>
                </div>
              </div>

              {/* Caloric Intake Metrics */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#E8E2D8] text-center">
                <div className="p-3.5 rounded-[22px] bg-[#FAF8F5] border border-white shadow-clayCardSm">
                  <span className="font-nunito text-[11px] font-bold text-[#645F73] block">
                    Daily Goal
                  </span>
                  <span className="font-nunito font-black text-xl text-[#1E1B26]">
                    {summary.targetCalories} <span className="text-xs font-bold text-[#8C8799]">kcal</span>
                  </span>
                </div>
                <div className="p-3.5 rounded-[22px] bg-[#FAF8F5] border border-white shadow-clayCardSm">
                  <span className="font-nunito text-[11px] font-bold text-[#645F73] block">
                    Ingested
                  </span>
                  <span className="font-nunito font-black text-xl text-[#FF5A36]">
                    {summary.consumedCalories} <span className="text-xs font-bold text-[#8C8799]">kcal</span>
                  </span>
                </div>
                <div className="p-3.5 rounded-[22px] bg-[#FAF8F5] border border-white shadow-clayCardSm">
                  <span className="font-nunito text-[11px] font-bold text-[#645F73] block">
                    Burn Offset
                  </span>
                  <span className="font-nunito font-black text-xl text-[#10B981]">
                    +{summary.exerciseBurnKcal} <span className="text-xs font-bold text-[#8C8799]">kcal</span>
                  </span>
                </div>
              </div>
            </ClayCard>
          </div>

          {/* Side Column: Hydration & Metabolic Compliance (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            {/* Hydration Station */}
            <HydrationCard
              consumedWaterMl={summary.consumedWaterMl}
              targetWaterMl={summary.targetWaterMl}
              onAddWater={handleAddWater}
            />

            {/* Metabolic Trajectory Pod */}
            <ClayCard variant="floating" className="!p-6 bg-gradient-to-br from-white via-[#FFF9F5] to-[#FFF4EC] border-l-4 border-l-[#FF8A00]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-[16px] bg-gradient-to-br from-[#FFB347] to-[#FF8A00] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(255,138,0,0.3)]">
                    <Flame className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-nunito font-black text-base text-[#1E1B26]">
                      Metabolic Trajectory
                    </h3>
                    <span className="font-nunito text-[11px] font-bold text-[#645F73]">
                      Goal: {profile.goal === 'cut' ? 'Fat Loss (-500 kcal)' : profile.goal === 'bulk' ? 'Hypertrophy (+300 kcal)' : 'Maintenance'}
                    </span>
                  </div>
                </div>
                <ClayBadge variant="emerald" size="sm">
                  Adherence: 96%
                </ClayBadge>
              </div>

              <p className="font-nunito text-xs text-[#645F73] leading-relaxed mb-4">
                Your current rolling intake maintains a 500 kcal deficit, projecting ~0.45 kg weekly fat loss while preserving lean skeletal muscle tissue.
              </p>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-[18px] bg-white border border-[#E8E2D8] shadow-sm">
                  <span className="font-nunito text-[10px] font-bold text-[#8C8799] uppercase block">
                    Starting Scale Weight
                  </span>
                  <span className="font-nunito font-black text-lg text-[#1E1B26]">
                    {profile.currentWeightKg} kg
                  </span>
                </div>
                <div className="p-3 rounded-[18px] bg-white border border-[#E8E2D8] shadow-sm">
                  <span className="font-nunito text-[10px] font-bold text-[#8C8799] uppercase block">
                    Target Milestone
                  </span>
                  <span className="font-nunito font-black text-lg text-[#FF5A36]">
                    {profile.targetWeightKg} kg
                  </span>
                </div>
              </div>
            </ClayCard>
          </div>
        </section>

        {/* SECTION 2: MACRONUTRIENT LEDGER */}
        <section className="w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-nunito font-black text-2xl text-[#1E1B26]">
              Macronutrient Compartments
            </h2>
            <span className="font-nunito text-xs font-bold text-[#645F73]">
              High-Protein Allocation (40% P • 35% C • 25% F)
            </span>
          </div>

          <MacroStatsBar
            consumedProtein={summary.consumedProteinG}
            targetProtein={summary.targetProteinG}
            consumedCarbs={summary.consumedCarbsG}
            targetCarbs={summary.targetCarbsG}
            consumedFats={summary.consumedFatsG}
            targetFats={summary.targetFatsG}
          />
        </section>

        {/* SECTION 3: DAILY MEAL BENTO LEDGER */}
        <section className="w-full flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-nunito font-black text-2xl text-[#1E1B26]">
                Daily Meal Bento
              </h2>
              <p className="font-nunito text-xs font-semibold text-[#645F73]">
                Categorized meal slots with exact component weights and calculated calories
              </p>
            </div>

            <ClayButton
              variant="primary"
              size="sm"
              onClick={() => handleOpenLogModal('breakfast')}
              icon={<Plus className="h-4 w-4" />}
            >
              Add Entry
            </ClayButton>
          </div>

          <div className="flex flex-col gap-5">
            <MealSlotCard
              mealType="breakfast"
              title="Breakfast"
              logs={summary.logs}
              onOpenAddModal={handleOpenLogModal}
              onDeleteLog={handleDeleteLog}
            />

            <MealSlotCard
              mealType="lunch"
              title="Lunch"
              logs={summary.logs}
              onOpenAddModal={handleOpenLogModal}
              onDeleteLog={handleDeleteLog}
            />

            <MealSlotCard
              mealType="dinner"
              title="Dinner"
              logs={summary.logs}
              onOpenAddModal={handleOpenLogModal}
              onDeleteLog={handleDeleteLog}
            />

            <MealSlotCard
              mealType="pre_post_workout"
              title="Pre / Post Workout"
              logs={summary.logs}
              onOpenAddModal={handleOpenLogModal}
              onDeleteLog={handleDeleteLog}
            />

            <MealSlotCard
              mealType="snack"
              title="Snacks & Extras"
              logs={summary.logs}
              onOpenAddModal={handleOpenLogModal}
              onDeleteLog={handleDeleteLog}
            />
          </div>
        </section>
      </main>

      {/* Multi-Modal Quick Log Modal */}
      <QuickLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        initialMealType={activeMealSlot}
        selectedDate={selectedDate}
        onLogFood={handleLogFood}
      />

      {/* Dynamic Target Engine Modal */}
      <ProfileEngineModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
      />
    </div>
  );
};
