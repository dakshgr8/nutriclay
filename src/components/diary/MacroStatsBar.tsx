import React from 'react';
import { ClayCard } from '../clay/ClayCard';
import { ClayProgressBar } from '../clay/ClayProgressBar';
import { Drumstick, Wheat, Droplets } from 'lucide-react';

interface MacroStatsBarProps {
  consumedProtein: number;
  targetProtein: number;
  consumedCarbs: number;
  targetCarbs: number;
  consumedFats: number;
  targetFats: number;
}

export const MacroStatsBar: React.FC<MacroStatsBarProps> = ({
  consumedProtein,
  targetProtein,
  consumedCarbs,
  targetCarbs,
  consumedFats,
  targetFats,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
      {/* Protein Card */}
      <ClayCard variant="flat" className="!p-5 bg-gradient-to-br from-white/90 to-[#FAF5FF]/80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-[16px] bg-gradient-to-br from-[#F472B6] to-[#DB2777] flex items-center justify-center text-white shadow-clayCardSm">
              <Drumstick className="h-5 w-5" />
            </div>
            <div>
              <span className="font-nunito font-extrabold text-sm text-[#332F3A] block">
                Protein
              </span>
              <span className="font-nunito text-[11px] font-semibold text-[#635F69]">
                4 kcal / gram
              </span>
            </div>
          </div>
          <span className="font-nunito text-xs font-black text-[#DB2777] bg-[#DB2777]/10 px-2.5 py-1 rounded-full">
            {Math.round((consumedProtein / (targetProtein || 1)) * 100)}%
          </span>
        </div>
        <div className="flex items-baseline justify-between mb-2">
          <span className="font-nunito font-black text-2xl text-[#332F3A]">
            {consumedProtein} <span className="text-xs font-bold text-[#635F69]">g</span>
          </span>
          <span className="font-nunito text-xs font-bold text-[#635F69]">
            Goal: {targetProtein}g
          </span>
        </div>
        <ClayProgressBar
          value={consumedProtein}
          max={targetProtein}
          color="pink"
          height="sm"
        />
      </ClayCard>

      {/* Carbs Card */}
      <ClayCard variant="flat" className="!p-5 bg-gradient-to-br from-white/90 to-[#F0F9FF]/80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-[16px] bg-gradient-to-br from-[#38BDF8] to-[#0284C7] flex items-center justify-center text-white shadow-clayCardSm">
              <Wheat className="h-5 w-5" />
            </div>
            <div>
              <span className="font-nunito font-extrabold text-sm text-[#332F3A] block">
                Carbohydrates
              </span>
              <span className="font-nunito text-[11px] font-semibold text-[#635F69]">
                4 kcal / gram
              </span>
            </div>
          </div>
          <span className="font-nunito text-xs font-black text-[#0284C7] bg-[#0284C7]/10 px-2.5 py-1 rounded-full">
            {Math.round((consumedCarbs / (targetCarbs || 1)) * 100)}%
          </span>
        </div>
        <div className="flex items-baseline justify-between mb-2">
          <span className="font-nunito font-black text-2xl text-[#332F3A]">
            {consumedCarbs} <span className="text-xs font-bold text-[#635F69]">g</span>
          </span>
          <span className="font-nunito text-xs font-bold text-[#635F69]">
            Goal: {targetCarbs}g
          </span>
        </div>
        <ClayProgressBar
          value={consumedCarbs}
          max={targetCarbs}
          color="blue"
          height="sm"
        />
      </ClayCard>

      {/* Fats Card */}
      <ClayCard variant="flat" className="!p-5 bg-gradient-to-br from-white/90 to-[#FFFBEB]/80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-[16px] bg-gradient-to-br from-[#FBBF24] to-[#D97706] flex items-center justify-center text-white shadow-clayCardSm">
              <Droplets className="h-5 w-5" />
            </div>
            <div>
              <span className="font-nunito font-extrabold text-sm text-[#332F3A] block">
                Healthy Fats
              </span>
              <span className="font-nunito text-[11px] font-semibold text-[#635F69]">
                9 kcal / gram
              </span>
            </div>
          </div>
          <span className="font-nunito text-xs font-black text-[#D97706] bg-[#F59E0B]/15 px-2.5 py-1 rounded-full">
            {Math.round((consumedFats / (targetFats || 1)) * 100)}%
          </span>
        </div>
        <div className="flex items-baseline justify-between mb-2">
          <span className="font-nunito font-black text-2xl text-[#332F3A]">
            {consumedFats} <span className="text-xs font-bold text-[#635F69]">g</span>
          </span>
          <span className="font-nunito text-xs font-bold text-[#635F69]">
            Goal: {targetFats}g
          </span>
        </div>
        <ClayProgressBar
          value={consumedFats}
          max={targetFats}
          color="amber"
          height="sm"
        />
      </ClayCard>
    </div>
  );
};
