import React from 'react';

export interface ClayOrbMeterProps {
  current: number;
  target: number;
  label?: string;
  sublabel?: string;
  size?: number; // size in px
  strokeWidth?: number;
  color?: 'violet' | 'pink' | 'emerald' | 'sky';
  className?: string;
}

export const ClayOrbMeter: React.FC<ClayOrbMeterProps> = ({
  current,
  target,
  label = 'Remaining',
  sublabel,
  size = 260,
  strokeWidth = 14,
  color = 'violet',
  className = '',
}) => {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.max(0, Math.round((current / (target || 1)) * 100)));
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let strokeGradientStart = '#A78BFA';
  let strokeGradientEnd = '#7C3AED';

  if (color === 'pink') {
    strokeGradientStart = '#F472B6';
    strokeGradientEnd = '#DB2777';
  } else if (color === 'emerald') {
    strokeGradientStart = '#34D399';
    strokeGradientEnd = '#059669';
  } else if (color === 'sky') {
    strokeGradientStart = '#38BDF8';
    strokeGradientEnd = '#0284C7';
  }

  return (
    <div
      className={`relative flex items-center justify-center rounded-full transition-transform duration-500 hover:scale-[1.03] select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* 3D Convex Clay Sphere Body */}
      <div
        className="absolute inset-2 rounded-full bg-gradient-to-br from-white via-[#FAF8FF] to-[#ECE7F8] shadow-clayOrb animate-clay-breathe"
        aria-hidden="true"
      />

      {/* SVG Radial Meter */}
      <svg
        className="absolute inset-0 -rotate-90 transform"
        width={size}
        height={size}
      >
        <defs>
          <linearGradient id={`clayGradient-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={strokeGradientStart} />
            <stop offset="100%" stopColor={strokeGradientEnd} />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#7C3AED" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#E5DEEF"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={`url(#clayGradient-${color})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          filter="url(#softGlow)"
        />
      </svg>

      {/* Center Digital Clay Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
        <span className="font-nunito text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#7C3AED] bg-[#7C3AED]/10 px-3 py-1 rounded-full mb-1">
          {label}
        </span>
        <div className="font-nunito font-black text-4xl sm:text-5xl tracking-tight text-[#332F3A] leading-tight drop-shadow-sm">
          {Math.max(0, current).toLocaleString()}
        </div>
        <span className="font-nunito text-xs sm:text-sm font-bold text-[#635F69]">
          kcal
        </span>
        {sublabel && (
          <span className="mt-1 font-nunito text-[11px] font-semibold text-[#8E8A96]">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
