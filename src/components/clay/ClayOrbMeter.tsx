import React from 'react';

export interface ClayOrbMeterProps {
  current: number;
  target: number;
  label?: string;
  sublabel?: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const ClayOrbMeter: React.FC<ClayOrbMeterProps> = ({
  current,
  target,
  label = 'Remaining',
  sublabel,
  size = 280,
  strokeWidth = 16,
  className = '',
}) => {
  const radius = (size - strokeWidth * 2 - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.max(0, Math.round((current / (target || 1)) * 100)));
  const consumed = Math.max(0, target - current);
  const consumedPercent = Math.min(100, Math.round((consumed / (target || 1)) * 100));
  const strokeDashoffset = circumference - (consumedPercent / 100) * circumference;

  // Segmented dial tick marks (36 ticks = every 10 degrees)
  const ticks = Array.from({ length: 36 });

  return (
    <div
      className={`relative flex items-center justify-center rounded-full select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* 3D Convex Ceramic Bezel */}
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-white via-[#FAF8F5] to-[#EBE7DE] shadow-clayOrb animate-clay-breathe border border-white"
        aria-hidden="true"
      />

      {/* Tactile Dial Tick Marks */}
      <div className="absolute inset-4 rounded-full pointer-events-none" aria-hidden="true">
        {ticks.map((_, i) => (
          <div
            key={i}
            className={`absolute top-0 left-1/2 -ml-[1px] origin-bottom transition-opacity duration-300 ${
              i % 3 === 0 ? 'w-[2px] h-[7px] bg-[#C5BFD2]' : 'w-[1px] h-[4px] bg-[#DDD8E6]'
            }`}
            style={{
              height: size / 2 - 16,
              transform: `rotate(${i * 10}deg)`,
            }}
          />
        ))}
      </div>

      {/* Recessed Inset Well for the Radial Meter */}
      <div
        className="absolute inset-6 rounded-full bg-[#F4F1EA] shadow-clayPressed"
        aria-hidden="true"
      />

      {/* SVG Radial Meter */}
      <svg
        className="absolute inset-0 -rotate-90 transform"
        width={size}
        height={size}
      >
        <defs>
          <linearGradient id="clayDialGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFB347" />
            <stop offset="50%" stopColor="#FF8A00" />
            <stop offset="100%" stopColor="#FF5A36" />
          </linearGradient>
          <filter id="dialShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="3" stdDeviation="3" floodColor="#FF5A36" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Base Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#E2DDD2"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Dynamic Energy Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="url(#clayDialGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          filter="url(#dialShadow)"
        />
      </svg>

      {/* Inner Ceramic Island with Digital Readout */}
      <div
        className="relative z-10 flex flex-col items-center justify-center text-center rounded-full bg-gradient-to-b from-white to-[#F9F7F3] shadow-clayCardSm border border-white"
        style={{ width: size - 88, height: size - 88 }}
      >
        <span className="font-nunito text-[11px] font-black uppercase tracking-wider text-[#FF5A36] bg-[#FF5A36]/10 px-3 py-0.5 rounded-full mb-0.5">
          {label}
        </span>
        <div className="font-nunito font-black text-4xl sm:text-5xl tracking-tighter text-[#1E1B26] leading-none my-1">
          {Math.max(0, current).toLocaleString()}
        </div>
        <span className="font-nunito text-xs font-bold text-[#8C8799]">
          kcal remaining
        </span>
        <div className="mt-1.5 flex items-center gap-1 font-nunito text-[11px] font-bold text-[#645F73]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
          <span>{consumedPercent}% of budget consumed</span>
        </div>
      </div>
    </div>
  );
};
