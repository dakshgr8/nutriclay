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
  const proteinPercent = Math.min(100, Math.round((consumedProtein / (targetProtein || 1)) * 100));
  const carbsPercent = Math.min(100, Math.round((consumedCarbs / (targetCarbs || 1)) * 100));
  const fatsPercent = Math.min(100, Math.round((consumedFats / (targetFats || 1)) * 100));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
      {/* 1. PROTEIN COMPARTMENT (Ruby Coral) */}
      <ClayCard variant="flat" className="!p-5 bg-gradient-to-br from-white via-[#FFF8F6] to-[#FFF0EC] border-l-4 border-l-[#FF5A36]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-[16px] bg-gradient-to-br from-[#FF7E62] to-[#FF5A36] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(255,90,54,0.3)]">
              <Drumstick className="h-5 w-5" />
            </div>
            <div>
              <span className="font-nunito font-extrabold text-sm text-[#1E1B26] block">
                Protein
              </span>
              <span className="font-nunito text-[11px] font-semibold text-[#645F73]">
                4 kcal / gram
              </span>
            </div>
          </div>
          <span className="font-nunito text-xs font-black text-[#FF5A36] bg-[#FF5A36]/10 px-2.5 py-1 rounded-full">
            {proteinPercent}%
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <span className="font-nunito font-black text-2xl text-[#1E1B26]">
            {consumedProtein} <span className="text-xs font-bold text-[#8C8799]">g</span>
          </span>
          <span className="font-nunito text-xs font-bold text-[#645F73]">
            Goal: <strong className="text-[#1E1B26]">{targetProtein}g</strong>
          </span>
        </div>

        <ClayProgressBar
          value={consumedProtein}
          max={targetProtein}
          color="coral"
          height="sm"
        />
      </ClayCard>

      {/* 2. CARBOHYDRATES COMPARTMENT (Mineral Cobalt) */}
      <ClayCard variant="flat" className="!p-5 bg-gradient-to-br from-white via-[#F5F9FF] to-[#EBF3FF] border-l-4 border-l-[#2563EB]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-[16px] bg-gradient-to-br from-[#60A5FA] to-[#2563EB] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)]">
              <Wheat className="h-5 w-5" />
            </div>
            <div>
              <span className="font-nunito font-extrabold text-sm text-[#1E1B26] block">
                Carbohydrates
              </span>
              <span className="font-nunito text-[11px] font-semibold text-[#645F73]">
                4 kcal / gram
              </span>
            </div>
          </div>
          <span className="font-nunito text-xs font-black text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-1 rounded-full">
            {carbsPercent}%
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <span className="font-nunito font-black text-2xl text-[#1E1B26]">
            {consumedCarbs} <span className="text-xs font-bold text-[#8C8799]">g</span>
          </span>
          <span className="font-nunito text-xs font-bold text-[#645F73]">
            Goal: <strong className="text-[#1E1B26]">{targetCarbs}g</strong>
          </span>
        </div>

        <ClayProgressBar
          value={consumedCarbs}
          max={targetCarbs}
          color="cobalt"
          height="sm"
        />
      </ClayCard>

      {/* 3. HEALTHY FATS COMPARTMENT (Golden Amber) */}
      <ClayCard variant="flat" className="!p-5 bg-gradient-to-br from-white via-[#FFFDF5] to-[#FFF9E6] border-l-4 border-l-[#F59E0B]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-[16px] bg-gradient-to-br from-[#FCD34D] to-[#D97706] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(245,158,11,0.3)]">
              <Droplets className="h-5 w-5" />
            </div>
            <div>
              <span className="font-nunito font-extrabold text-sm text-[#1E1B26] block">
                Healthy Fats
              </span>
              <span className="font-nunito text-[11px] font-semibold text-[#645F73]">
                9 kcal / gram
              </span>
            </div>
          </div>
          <span className="font-nunito text-xs font-black text-[#D97706] bg-[#F59E0B]/12 px-2.5 py-1 rounded-full">
            {fatsPercent}%
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <span className="font-nunito font-black text-2xl text-[#1E1B26]">
            {consumedFats} <span className="text-xs font-bold text-[#8C8799]">g</span>
          </span>
          <span className="font-nunito text-xs font-bold text-[#645F73]">
            Goal: <strong className="text-[#1E1B26]">{targetFats}g</strong>
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
