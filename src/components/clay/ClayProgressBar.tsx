import React from 'react';

export interface ClayProgressBarProps {
  value: number; // current value
  max: number; // target max value
  color?: 'violet' | 'pink' | 'blue' | 'green' | 'amber';
  height?: 'sm' | 'default' | 'lg';
  showLabel?: boolean;
  label?: string;
  unit?: string;
  className?: string;
}

export const ClayProgressBar: React.FC<ClayProgressBarProps> = ({
  value,
  max,
  color = 'violet',
  height = 'default',
  showLabel = false,
  label,
  unit = 'g',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / (max || 1)) * 100)));

  let colorGradient = 'bg-gradient-to-r from-[#A78BFA] to-[#7C3AED]';
  let badgeColor = 'text-[#7C3AED] bg-[#7C3AED]/10';

  if (color === 'pink') {
    colorGradient = 'bg-gradient-to-r from-[#F472B6] to-[#DB2777]';
    badgeColor = 'text-[#DB2777] bg-[#DB2777]/10';
  } else if (color === 'blue') {
    colorGradient = 'bg-gradient-to-r from-[#38BDF8] to-[#0284C7]';
    badgeColor = 'text-[#0284C7] bg-[#0284C7]/10';
  } else if (color === 'green') {
    colorGradient = 'bg-gradient-to-r from-[#34D399] to-[#059669]';
    badgeColor = 'text-[#059669] bg-[#059669]/10';
  } else if (color === 'amber') {
    colorGradient = 'bg-gradient-to-r from-[#FBBF24] to-[#D97706]';
    badgeColor = 'text-[#D97706] bg-[#D97706]/10';
  }

  let heightClass = 'h-4';
  if (height === 'sm') heightClass = 'h-2.5';
  if (height === 'lg') heightClass = 'h-5';

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs font-nunito font-bold">
          <span className="text-[#332F3A] flex items-center gap-1.5">
            {label}
            <span className={`px-2 py-0.5 rounded-full ${badgeColor}`}>
              {percentage}%
            </span>
          </span>
          <span className="text-[#635F69]">
            {value} <span className="font-normal text-[11px]">/ {max}{unit}</span>
          </span>
        </div>
      )}
      <div className={`w-full ${heightClass} rounded-full bg-[#E5DFEF] p-0.5 shadow-clayPressedSm overflow-hidden`}>
        <div
          className={`h-full rounded-full ${colorGradient} transition-all duration-700 ease-out shadow-sm`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
