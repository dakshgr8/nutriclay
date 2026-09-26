import React from 'react';
import { ClayCard } from '../clay/ClayCard';
import { ClayButton } from '../clay/ClayButton';
import { ClayBadge } from '../clay/ClayBadge';
import { FoodLog, MealType } from '@/lib/types';
import { Sunrise, Sun, Moon, Dumbbell, Apple, Plus, Trash2 } from 'lucide-react';

interface MealSlotCardProps {
  mealType: MealType;
  title: string;
  logs: FoodLog[];
  onOpenAddModal: (mealType: MealType) => void;
  onDeleteLog: (logId: string) => Promise<void>;
}

const MEAL_ICONS: Record<MealType, React.ReactNode> = {
  breakfast: <Sunrise className="h-5 w-5 text-amber-500" />,
  lunch: <Sun className="h-5 w-5 text-yellow-500" />,
  dinner: <Moon className="h-5 w-5 text-indigo-500" />,
  pre_post_workout: <Dumbbell className="h-5 w-5 text-emerald-500" />,
  snack: <Apple className="h-5 w-5 text-rose-500" />,
};

const MEAL_BADGE_COLORS: Record<MealType, 'amber' | 'blue' | 'violet' | 'green' | 'pink'> = {
  breakfast: 'amber',
  lunch: 'blue',
  dinner: 'violet',
  pre_post_workout: 'green',
  snack: 'pink',
};

export const MealSlotCard: React.FC<MealSlotCardProps> = ({
  mealType,
  title,
  logs,
  onOpenAddModal,
  onDeleteLog,
}) => {
  const mealLogs = logs.filter((l) => l.mealType === mealType);

  const totalCalories = mealLogs.reduce((acc, curr) => acc + curr.computedCalories, 0);
  const totalProtein = Math.round(mealLogs.reduce((acc, curr) => acc + curr.computedProtein, 0) * 10) / 10;
  const totalCarbs = Math.round(mealLogs.reduce((acc, curr) => acc + curr.computedCarbs, 0) * 10) / 10;
  const totalFat = Math.round(mealLogs.reduce((acc, curr) => acc + curr.computedFat, 0) * 10) / 10;

  return (
    <ClayCard variant="floating" className="!p-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ECE7F4]">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-[18px] bg-white shadow-clayCardSm flex items-center justify-center">
            {MEAL_ICONS[mealType]}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="font-nunito font-black text-xl text-[#332F3A]">
                {title}
              </h3>
              <ClayBadge variant={MEAL_BADGE_COLORS[mealType]} size="sm">
                {totalCalories} kcal
              </ClayBadge>
            </div>
            <div className="flex items-center gap-3 mt-0.5 text-xs font-nunito font-semibold text-[#635F69]">
              <span>
                <strong className="text-[#DB2777]">{totalProtein}g</strong> Protein
              </span>
              <span>•</span>
              <span>
                <strong className="text-[#0284C7]">{totalCarbs}g</strong> Carbs
              </span>
              <span>•</span>
              <span>
                <strong className="text-[#D97706]">{totalFat}g</strong> Fat
              </span>
            </div>
          </div>
        </div>

        <ClayButton
          size="sm"
          variant="secondary"
          onClick={() => onOpenAddModal(mealType)}
          icon={<Plus className="h-4 w-4 text-[#7C3AED]" />}
          className="self-start sm:self-auto"
        >
          Add Food
        </ClayButton>
      </div>

      {/* Food Entries List */}
      <div className="mt-4 flex flex-col gap-2.5">
        {mealLogs.length === 0 ? (
          <div className="py-6 text-center rounded-[20px] bg-[#F7F4FC] border border-dashed border-[#DDD7E8]">
            <p className="font-nunito text-sm font-semibold text-[#635F69]">
              No food logged in {title} yet
            </p>
            <button
              onClick={() => onOpenAddModal(mealType)}
              className="mt-1.5 font-nunito text-xs font-bold text-[#7C3AED] hover:underline cursor-pointer"
            >
              + Log a quick item or search ingredients
            </button>
          </div>
        ) : (
          mealLogs.map((log) => (
            <div
              key={log.id}
              className="group flex items-center justify-between p-3.5 rounded-[20px] bg-white/80 hover:bg-white shadow-clayCardSm transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[#7C3AED]" />
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-nunito font-extrabold text-sm text-[#332F3A]">
                      {log.foodName}
                    </span>
                    {log.foodBrand && (
                      <span className="font-nunito text-[11px] font-semibold text-[#8E8A96]">
                        ({log.foodBrand})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-nunito font-semibold text-[#635F69] mt-0.5">
                    <span className="bg-[#EFEBF5] px-2 py-0.5 rounded-full text-[11px]">
                      {log.quantityGrams}g
                    </span>
                    <span>P: {log.computedProtein}g</span>
                    <span>•</span>
                    <span>C: {log.computedCarbs}g</span>
                    <span>•</span>
                    <span>F: {log.computedFat}g</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="font-nunito font-black text-sm text-[#332F3A] text-right">
                  {log.computedCalories}{' '}
                  <span className="text-[11px] font-bold text-[#635F69]">kcal</span>
                </div>
                <button
                  onClick={() => onDeleteLog(log.id)}
                  title="Remove item"
                  className="opacity-60 group-hover:opacity-100 p-2 rounded-xl text-[#8E8A96] hover:text-[#DB2777] hover:bg-rose-50 transition-all cursor-pointer active:scale-90"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </ClayCard>
  );
};
