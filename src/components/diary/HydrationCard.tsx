import React, { useState } from 'react';
import { ClayCard } from '../clay/ClayCard';
import { ClayButton } from '../clay/ClayButton';
import { ClayProgressBar } from '../clay/ClayProgressBar';
import { GlassWater, Plus, Check, Droplets } from 'lucide-react';

interface HydrationCardProps {
  consumedWaterMl: number;
  targetWaterMl: number;
  onAddWater: (amountMl: number) => Promise<void>;
}

export const HydrationCard: React.FC<HydrationCardProps> = ({
  consumedWaterMl,
  targetWaterMl,
  onAddWater,
}) => {
  const [isLogging, setIsLogging] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState<number | null>(null);

  const handleQuickAdd = async (amount: number) => {
    setIsLogging(true);
    setRecentlyAdded(amount);
    try {
      await onAddWater(amount);
    } finally {
      setIsLogging(false);
      setTimeout(() => setRecentlyAdded(null), 1200);
    }
  };

  const percent = Math.min(100, Math.round((consumedWaterMl / (targetWaterMl || 1)) * 100));

  return (
    <ClayCard variant="floating" className="!p-6 bg-gradient-to-br from-white via-[#F7FAFE] to-[#EEF5FC]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-[20px] bg-gradient-to-br from-[#38BDF8] to-[#0284C7] flex items-center justify-center text-white shadow-[0_6px_16px_rgba(2,132,199,0.3)]">
            <GlassWater className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-nunito font-black text-lg text-[#1E1B26]">
                Hydration Station
              </h3>
              <span className="font-nunito text-xs font-black text-[#0284C7] bg-[#0284C7]/10 px-2.5 py-0.5 rounded-full">
                {percent}%
              </span>
            </div>
            <p className="font-nunito text-xs font-semibold text-[#645F73]">
              Daily Target: {(targetWaterMl / 1000).toFixed(1)} Liters
            </p>
          </div>
        </div>

        {/* Quick Add Pills */}
        <div className="flex items-center gap-2">
          <ClayButton
            size="sm"
            variant="secondary"
            disabled={isLogging}
            onClick={() => handleQuickAdd(250)}
            icon={recentlyAdded === 250 ? <Check className="h-4 w-4 text-[#10B981]" /> : <Droplets className="h-4 w-4 text-[#0284C7]" />}
            className="border border-[#E2DDD2]"
          >
            +250 ml
          </ClayButton>
          <ClayButton
            size="sm"
            variant="secondary"
            disabled={isLogging}
            onClick={() => handleQuickAdd(500)}
            icon={recentlyAdded === 500 ? <Check className="h-4 w-4 text-[#10B981]" /> : <Plus className="h-4 w-4 text-[#0284C7]" />}
            className="border border-[#E2DDD2]"
          >
            +500 ml
          </ClayButton>
        </div>
      </div>

      <div className="flex items-baseline justify-between mb-2">
        <div className="font-nunito font-black text-2xl text-[#1E1B26]">
          {consumedWaterMl.toLocaleString()}{' '}
          <span className="text-xs font-bold text-[#8C8799]">ml</span>
        </div>
        <div className="font-nunito text-xs font-bold text-[#645F73]">
          Remaining:{' '}
          <strong className="text-[#1E1B26]">
            {Math.max(0, targetWaterMl - consumedWaterMl).toLocaleString()} ml
          </strong>
        </div>
      </div>

      <ClayProgressBar
        value={consumedWaterMl}
        max={targetWaterMl}
        color="cobalt"
        height="default"
      />
    </ClayCard>
  );
};
