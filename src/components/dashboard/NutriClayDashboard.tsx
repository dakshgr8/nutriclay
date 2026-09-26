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
  TrendingDown,
  Sparkles,
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

  const calorieBudgetEquation = `${summary.targetCalories} (Goal) - ${summary.consumedCalories} (Food) = ${summary.remainingCalories} kcal`;

  return (
    <div className="min-h-screen pb-24 text-[#332F3A]">
      {/* Top Navigation Bar */}
      <TopBar
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        profile={profile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenQuickLog={() => handleOpenLogModal('breakfast')}
      />

      {/* Main Responsive Layout */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col gap-8">
        {/* HERO: Calorie & Macro Command Center (Bento Layout) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Caloric Orb Centerpiece (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <ClayCard variant="hero" className="flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="font-nunito font-extrabold text-xs uppercase tracking-widest text-[#7C3AED] bg-[#7C3AED]/12 px-3 py-1 rounded-full">
                    Daily Energy Budget
                  </span>
                  <ClayBadge variant="neutral" size="sm">
                    Mifflin-St Jeor Engine
                  </ClayBadge>
                </div>
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="font-nunito text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Target className="h-3.5 w-3.5" />
                  Adjust Targets
                </button>
              </div>

              {/* Center Convex Orb & Formula Breakdown */}
              <div className="flex flex-col items-center justify-center my-4">
                <ClayOrbMeter
                  current={summary.remainingCalories}
                  target={summary.targetCalories}
                  label="Remaining"
                  sublabel="Daily Budget"
                  size={270}
                  strokeWidth={16}
                  color={summary.remainingCalories >= 0 ? 'violet' : 'pink'}
                />

                {/* Remaining Budget Equation Badge */}
                <div className="mt-6 px-4 py-2.5 rounded-[22px] bg-[#EFEBF5] shadow-clayPressedSm flex items-center gap-2 text-xs font-nunito font-bold text-[#635F69] text-center">
                  <Info className="h-4 w-4 text-[#7C3AED] shrink-0" />
                  <span>
                    Remaining Budget: <strong className="text-[#332F3A]">{calorieBudgetEquation}</strong>
                  </span>
                </div>
              </div>

              {/* Caloric Ingestion Metrics Row */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#ECE7F4] text-center">
                <div className="p-3 rounded-[20px] bg-white/70 shadow-clayCardSm">
                  <span className="font-nunito text-[11px] font-bold text-[#635F69] block">
                    Target Goal
                  </span>
                  <span className="font-nunito font-black text-xl text-[#332F3A]">
                    {summary.targetCalories} <span className="text-xs font-bold">kcal</span>
                  </span>
                </div>
                <div className="p-3 rounded-[20px] bg-white/70 shadow-clayCardSm">
                  <span className="font-nunito text-[11px] font-bold text-[#635F69] block">
                    Total Ingested
                  </span>
                  <span className="font-nunito font-black text-xl text-[#7C3AED]">
                    {summary.consumedCalories} <span className="text-xs font-bold">kcal</span>
                  </span>
                </div>
                <div className="p-3 rounded-[20px] bg-white/70 shadow-clayCardSm">
                  <span className="font-nunito text-[11px] font-bold text-[#635F69] block">
                    Exercise Burn
                  </span>
                  <span className="font-nunito font-black text-xl text-[#10B981]">
                    +{summary.exerciseBurnKcal} <span className="text-xs font-bold">kcal</span>
                  </span>
                </div>
              </div>
            </ClayCard>
          </div>

          {/* Side Column: Hydration + Metabolic Status Cards (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            {/* Hydration Card */}
            <HydrationCard
              consumedWaterMl={summary.consumedWaterMl}
              targetWaterMl={summary.targetWaterMl}
              onAddWater={handleAddWater}
            />

            {/* Metabolic Adaptation & Compliance Pod */}
            <ClayCard variant="floating" className="!p-6 bg-gradient-to-br from-white/90 to-[#FAF5FF]/80">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 rounded-[16px] bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center text-white shadow-clayButton">
                    <Flame className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-nunito font-black text-base text-[#332F3A]">
                      Metabolic Trajectory
                    </h3>
                    <span className="font-nunito text-[11px] font-semibold text-[#635F69]">
                      Goal: {profile.goal === 'cut' ? 'Fat Loss (-500 kcal)' : 'Hypertrophy'}
                    </span>
                  </div>
                </div>
                <ClayBadge variant="green" size="sm">
                  On Target (±4%)
                </ClayBadge>
              </div>

              <p className="font-nunito text-xs text-[#635F69] leading-relaxed mb-4">
                Your current rolling intake maintains a 500 kcal deficit, projecting ~0.45 kg weekly fat loss without compromising lean muscle tissue.
              </p>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-2.5 rounded-[18px] bg-[#EFEBF5] shadow-clayPressedSm">
                  <span className="font-nunito text-[10px] font-bold text-[#635F69] uppercase block">
                    Current Weight
                  </span>
                  <span className="font-nunito font-black text-base text-[#332F3A]">
                    {profile.currentWeightKg} kg
                  </span>
                </div>
                <div className="p-2.5 rounded-[18px] bg-[#EFEBF5] shadow-clayPressedSm">
                  <span className="font-nunito text-[10px] font-bold text-[#635F69] uppercase block">
                    Projected Target
                  </span>
                  <span className="font-nunito font-black text-base text-[#7C3AED]">
                    {profile.targetWeightKg} kg
                  </span>
                </div>
              </div>
            </ClayCard>
          </div>
        </section>

        {/* SECTION 2: MACRONUTRIENT ALLOCATION PODS */}
        <section className="w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-nunito font-black text-2xl text-[#332F3A]">
              Macronutrient Ledger
            </h2>
            <span className="font-nunito text-xs font-bold text-[#635F69]">
              High-Protein Split (40% P • 35% C • 25% F)
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

        {/* SECTION 3: CATEGORIZED MEAL LOGS LEDGER */}
        <section className="w-full flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-nunito font-black text-2xl text-[#332F3A]">
                Daily Meal Diary
              </h2>
              <p className="font-nunito text-xs font-semibold text-[#635F69]">
                Organized meal slots with exact component weights and calculated calories
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

      {/* User Profiling & Dynamic Target Engine Modal */}
      <ProfileEngineModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
      />
    </div>
  );
};
