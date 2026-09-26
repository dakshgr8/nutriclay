import React from 'react';
import { ClayCard } from '../clay/ClayCard';
import { ClayButton } from '../clay/ClayButton';
import { ClayBadge } from '../clay/ClayBadge';
import { FoodLog, MealType } from '@/lib/types';
import { Sunrise, Sun, Moon, Dumbbell, Apple, Plus, Trash2, Utensils } from 'lucide-react';

interface MealSlotCardProps {
  mealType: MealType;
  title: string;
  logs: FoodLog[];
  onOpenAddModal: (mealType: MealType) => void;
  onDeleteLog: (logId: string) => Promise<void>;
}

interface MealTheme {
  icon: React.ReactNode;
  accentColor: string;
  badgeVariant: 'amber' | 'emerald' | 'cobalt' | 'tangerine' | 'pink' | 'coral';
  bgGradient: string;
  borderColor: string;
}

const MEAL_THEMES: Record<MealType, MealTheme> = {
  breakfast: {
    icon: <Sunrise className="h-5 w-5 text-[#FF8A00]" />,
    accentColor: '#FF8A00',
    badgeVariant: 'tangerine',
    bgGradient: 'from-white via-[#FFF9F2] to-[#FFF3E5]',
    borderColor: '#FF8A00',
  },
  lunch: {
    icon: <Sun className="h-5 w-5 text-[#059669]" />,
    accentColor: '#059669',
    badgeVariant: 'emerald',
    bgGradient: 'from-white via-[#F4FDF8] to-[#E9FBF1]',
    borderColor: '#059669',
  },
  dinner: {
    icon: <Moon className="h-5 w-5 text-[#2563EB]" />,
    accentColor: '#2563EB',
    badgeVariant: 'cobalt',
    bgGradient: 'from-white via-[#F5F9FF] to-[#EBF3FF]',
    borderColor: '#2563EB',
  },
  pre_post_workout: {
    icon: <Dumbbell className="h-5 w-5 text-[#FF5A36]" />,
    accentColor: '#FF5A36',
    badgeVariant: 'coral',
    bgGradient: 'from-white via-[#FFF8F6] to-[#FFF0EC]',
    borderColor: '#FF5A36',
  },
  snack: {
    icon: <Apple className="h-5 w-5 text-[#E11D48]" />,
    accentColor: '#E11D48',
    badgeVariant: 'pink',
    bgGradient: 'from-white via-[#FFF5F6] to-[#FFEBEF]',
    borderColor: '#E11D48',
  },
};

export const MealSlotCard: React.FC<MealSlotCardProps> = ({
  mealType,
  title,
  logs,
  onOpenAddModal,
  onDeleteLog,
}) => {
  const theme = MEAL_THEMES[mealType];
  const mealLogs = logs.filter((l) => l.mealType === mealType);

  const totalCalories = mealLogs.reduce((acc, curr) => acc + curr.computedCalories, 0);
  const totalProtein = Math.round(mealLogs.reduce((acc, curr) => acc + curr.computedProtein, 0) * 10) / 10;
  const totalCarbs = Math.round(mealLogs.reduce((acc, curr) => acc + curr.computedCarbs, 0) * 10) / 10;
  const totalFat = Math.round(mealLogs.reduce((acc, curr) => acc + curr.computedFat, 0) * 10) / 10;

  return (
    <ClayCard
      variant="floating"
      className={`!p-6 w-full bg-gradient-to-br ${theme.bgGradient} border-l-4`}
      style={{ borderLeftColor: theme.borderColor }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D8]/80">
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-[18px] bg-white shadow-clayCardSm flex items-center justify-center border border-white">
            {theme.icon}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="font-nunito font-black text-xl text-[#1E1B26]">
                {title}
              </h3>
              <ClayBadge variant={theme.badgeVariant} size="sm">
                {totalCalories} kcal
              </ClayBadge>
            </div>
            <div className="flex items-center gap-3 mt-0.5 text-xs font-nunito font-semibold text-[#645F73]">
              <span>
                <strong className="text-[#FF5A36]">{totalProtein}g</strong> Protein
              </span>
              <span>•</span>
              <span>
                <strong className="text-[#2563EB]">{totalCarbs}g</strong> Carbs
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
          icon={<Plus className="h-4 w-4 text-[#FF5A36]" />}
          className="self-start sm:self-auto border border-[#E2DDD2]"
        >
          Add Food
        </ClayButton>
      </div>

      {/* Food Entries List */}
      <div className="mt-4 flex flex-col gap-2.5">
        {mealLogs.length === 0 ? (
          <div className="py-6 text-center rounded-[22px] bg-white/60 border border-dashed border-[#DDD7CC]">
            <p className="font-nunito text-xs font-bold text-[#8C8799]">
              No items logged for {title} yet
            </p>
            <button
              onClick={() => onOpenAddModal(mealType)}
              className="mt-1 font-nunito text-xs font-black text-[#FF5A36] hover:underline cursor-pointer"
            >
              + Quick log or search foods
            </button>
          </div>
        ) : (
          mealLogs.map((log) => (
            <div
              key={log.id}
              className="group flex items-center justify-between p-3.5 rounded-[20px] bg-white/95 hover:bg-white shadow-clayCardSm transition-all duration-200 border border-white"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: theme.borderColor }}
                />
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-nunito font-extrabold text-sm text-[#1E1B26]">
                      {log.foodName}
                    </span>
                    {log.foodBrand && (
                      <span className="font-nunito text-[11px] font-semibold text-[#8C8799]">
                        ({log.foodBrand})
                      </span>
                    )}
                  </div>
                  {/* Miniature Physical Macro Chips */}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-[#EFECE6] px-2 py-0.5 rounded-md font-nunito text-[11px] font-bold text-[#645F73]">
                      {log.quantityGrams}g
                    </span>
                    <span className="bg-[#FF5A36]/10 px-2 py-0.5 rounded-md font-nunito text-[11px] font-extrabold text-[#FF5A36]">
                      P: {log.computedProtein}g
                    </span>
                    <span className="bg-[#2563EB]/10 px-2 py-0.5 rounded-md font-nunito text-[11px] font-extrabold text-[#2563EB]">
                      C: {log.computedCarbs}g
                    </span>
                    <span className="bg-[#F59E0B]/12 px-2 py-0.5 rounded-md font-nunito text-[11px] font-extrabold text-[#D97706]">
                      F: {log.computedFat}g
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="font-nunito font-black text-sm text-[#1E1B26] text-right">
                  {log.computedCalories}{' '}
                  <span className="text-[11px] font-bold text-[#8C8799]">kcal</span>
                </div>
                <button
                  onClick={() => onDeleteLog(log.id)}
                  title="Remove item"
                  className="opacity-50 group-hover:opacity-100 p-2 rounded-[14px] text-[#8C8799] hover:text-[#E11D48] hover:bg-rose-50 transition-all cursor-pointer active:scale-90"
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
