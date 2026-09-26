import React from 'react';

export interface ClayProgressBarProps {
  value: number;
  max: number;
  color?: 'coral' | 'emerald' | 'cobalt' | 'amber' | 'tangerine' | 'pink' | 'blue' | 'green' | 'violet';
  height?: 'sm' | 'default' | 'lg';
  showLabel?: boolean;
  label?: string;
  unit?: string;
  className?: string;
}

export const ClayProgressBar: React.FC<ClayProgressBarProps> = ({
  value,
  max,
  color = 'coral',
  height = 'default',
  showLabel = false,
  label,
  unit = 'g',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / (max || 1)) * 100)));

  let colorGradient = 'bg-gradient-to-r from-[#FF7E62] to-[#FF5A36]';
  let badgeColor = 'text-[#FF5A36] bg-[#FF5A36]/10';

  if (color === 'emerald' || color === 'green') {
    colorGradient = 'bg-gradient-to-r from-[#34D399] to-[#059669]';
    badgeColor = 'text-[#059669] bg-[#10B981]/10';
  } else if (color === 'cobalt' || color === 'blue') {
    colorGradient = 'bg-gradient-to-r from-[#60A5FA] to-[#2563EB]';
    badgeColor = 'text-[#2563EB] bg-[#2563EB]/10';
  } else if (color === 'amber') {
    colorGradient = 'bg-gradient-to-r from-[#FCD34D] to-[#D97706]';
    badgeColor = 'text-[#D97706] bg-[#F59E0B]/12';
  } else if (color === 'tangerine') {
    colorGradient = 'bg-gradient-to-r from-[#FFB347] to-[#FF8A00]';
    badgeColor = 'text-[#FF8A00] bg-[#FF8A00]/12';
  } else if (color === 'pink') {
    colorGradient = 'bg-gradient-to-r from-[#FB7185] to-[#E11D48]';
    badgeColor = 'text-[#E11D48] bg-[#E11D48]/10';
  }

  let heightClass = 'h-3.5';
  if (height === 'sm') heightClass = 'h-2.5';
  if (height === 'lg') heightClass = 'h-5';

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs font-nunito font-bold">
          <span className="text-[#1E1B26] flex items-center gap-1.5">
            {label}
            <span className={`px-2 py-0.5 rounded-full ${badgeColor}`}>
              {percentage}%
            </span>
          </span>
          <span className="text-[#645F73]">
            {value} <span className="font-normal text-[11px]">/ {max}{unit}</span>
          </span>
        </div>
      )}
      <div className={`w-full ${heightClass} rounded-full bg-[#E8E3D8] p-0.5 shadow-clayPressedSm overflow-hidden`}>
        <div
          className={`h-full rounded-full ${colorGradient} transition-all duration-700 ease-out shadow-sm`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
