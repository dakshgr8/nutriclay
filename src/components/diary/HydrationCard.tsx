import React, { useState } from 'react';
import { ClayCard } from '../clay/ClayCard';
import { ClayButton } from '../clay/ClayButton';
import { ClayProgressBar } from '../clay/ClayProgressBar';
import { GlassWater, Plus, Check, Droplets } from 'lucide-react';

interface HydrationCardProps {
  consumedWaterMl: number;
  targetWaterMl: number;
  onAddWater: (amountMl: number) => Promise<void>;
  className?: string;
}

export const HydrationCard: React.FC<HydrationCardProps> = ({
  consumedWaterMl,
  targetWaterMl,
  onAddWater,
  className = '',
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
  const totalCups = Math.max(8, Math.round((targetWaterMl || 2000) / 250));
  const filledCups = Math.min(totalCups, Math.floor(consumedWaterMl / 250));

  return (
    <ClayCard
      variant="floating"
      className={`!p-6 bg-gradient-to-br from-white via-[#F7FAFE] to-[#EEF5FC] flex flex-col justify-between gap-4 ${className}`}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-[18px] bg-gradient-to-br from-[#38BDF8] to-[#0284C7] flex items-center justify-center text-white shadow-[0_4px_14px_rgba(2,132,199,0.35)] shrink-0">
            <GlassWater className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-nunito font-black text-base sm:text-lg text-[#1E1B26]">
                Hydration Station
              </h3>
              <span className="font-nunito text-[11px] font-black text-[#0284C7] bg-[#0284C7]/10 px-2 py-0.5 rounded-full">
                {percent}%
              </span>
            </div>
            <p className="font-nunito text-xs font-semibold text-[#645F73]">
              Daily Target: {(targetWaterMl / 1000).toFixed(1)}L ({totalCups} glasses)
            </p>
          </div>
        </div>

        {/* Quick Add Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <ClayButton
            size="sm"
            variant="secondary"
            disabled={isLogging}
            onClick={() => handleQuickAdd(250)}
            icon={recentlyAdded === 250 ? <Check className="h-3.5 w-3.5 text-[#10B981]" /> : <Droplets className="h-3.5 w-3.5 text-[#0284C7]" />}
            className="border border-[#E2DDD2] !py-1.5 !px-3 !text-xs"
          >
            +250 ml
          </ClayButton>
          <ClayButton
            size="sm"
            variant="secondary"
            disabled={isLogging}
            onClick={() => handleQuickAdd(500)}
            icon={recentlyAdded === 500 ? <Check className="h-3.5 w-3.5 text-[#10B981]" /> : <Plus className="h-3.5 w-3.5 text-[#0284C7]" />}
            className="border border-[#E2DDD2] !py-1.5 !px-3 !text-xs"
          >
            +500 ml
          </ClayButton>
        </div>
      </div>

      {/* Visual Clay Cups Grid */}
      <div className="p-3 rounded-[20px] bg-[#E9F2FA]/70 shadow-clayPressedSm">
        <div className="flex items-center justify-between mb-1.5 px-0.5">
          <span className="font-nunito text-[10px] font-bold uppercase tracking-wider text-[#645F73]">
            Tactile Glass Ledger (250ml / cup)
          </span>
          <span className="font-nunito text-[11px] font-extrabold text-[#0284C7]">
            {filledCups} / {totalCups} cups
          </span>
        </div>
        <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5">
          {Array.from({ length: totalCups }).map((_, idx) => {
            const isFilled = idx < filledCups;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => !isFilled && handleQuickAdd(250)}
                disabled={isLogging}
                title={isFilled ? `Cup ${idx + 1}: Logged` : `Click to log Cup ${idx + 1} (+250ml)`}
                className={`h-7 rounded-[10px] flex items-center justify-center transition-all cursor-pointer ${
                  isFilled
                    ? 'bg-gradient-to-t from-[#0284C7] to-[#38BDF8] text-white shadow-sm scale-100'
                    : 'bg-white/80 hover:bg-white text-[#96A8B8] hover:text-[#0284C7] border border-white/60 active:scale-90'
                }`}
              >
                <Droplets className={`h-3 w-3 ${isFilled ? 'text-white fill-white' : ''}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Numerical Stats & Progress */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <div className="font-nunito font-black text-xl sm:text-2xl text-[#1E1B26]">
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
      </div>
    </ClayCard>
  );
};
