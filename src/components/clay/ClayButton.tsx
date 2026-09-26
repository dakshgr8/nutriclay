import React from 'react';

export interface ClayButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'coral' | 'tangerine' | 'emerald' | 'cobalt' | 'charcoal' | 'ghost' | 'outline';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  className?: string;
  icon?: React.ReactNode;
}

export const ClayButton: React.FC<ClayButtonProps> = ({
  children,
  variant = 'primary',
  size = 'default',
  className = '',
  icon,
  disabled,
  ...props
}) => {
  // Sizing
  let sizeStyles = 'h-13 px-6 text-base rounded-[20px]';
  if (size === 'sm') {
    sizeStyles = 'h-10 px-4 text-xs rounded-[16px]';
  } else if (size === 'lg') {
    sizeStyles = 'h-15 px-8 text-lg rounded-[22px]';
  } else if (size === 'icon') {
    sizeStyles = 'h-11 w-11 rounded-[18px] p-0 flex items-center justify-center';
  }

  // Variants (Terracotta Coral, Tangerine, Emerald, Cobalt, Ceramic Secondary)
  let variantStyles = 'bg-gradient-to-br from-[#FF7E62] to-[#FF5A36] text-white shadow-clayButton hover:shadow-clayButtonHover border-t border-white/30';

  if (variant === 'secondary') {
    variantStyles = 'bg-white text-[#1E1B26] border border-white shadow-clayButtonSecondary hover:bg-[#FAF8F5]';
  } else if (variant === 'tangerine') {
    variantStyles = 'bg-gradient-to-br from-[#FFB347] to-[#FF8A00] text-white shadow-[8px_12px_24px_rgba(255,138,0,0.3)] border-t border-white/30';
  } else if (variant === 'emerald') {
    variantStyles = 'bg-gradient-to-br from-[#34D399] to-[#059669] text-white shadow-[8px_12px_24px_rgba(16,185,129,0.28)] border-t border-white/30';
  } else if (variant === 'cobalt') {
    variantStyles = 'bg-gradient-to-br from-[#60A5FA] to-[#2563EB] text-white shadow-[8px_12px_24px_rgba(37,99,235,0.28)] border-t border-white/30';
  } else if (variant === 'charcoal') {
    variantStyles = 'bg-[#1E1B26] text-white shadow-[8px_12px_24px_rgba(30,27,38,0.25)] border-t border-white/20';
  } else if (variant === 'ghost') {
    variantStyles = 'bg-transparent text-[#645F73] hover:bg-[#EFECE6] hover:text-[#1E1B26]';
  } else if (variant === 'outline') {
    variantStyles = 'border-2 border-[#1E1B26]/12 bg-white/70 text-[#1E1B26] hover:border-[#FF5A36] hover:text-[#FF5A36] shadow-clayCardSm';
  }

  const disabledStyles = disabled
    ? 'opacity-40 cursor-not-allowed pointer-events-none'
    : 'clay-button-squish cursor-pointer';

  return (
    <button
      disabled={disabled}
      className={`relative inline-flex items-center justify-center gap-2 font-nunito font-extrabold tracking-wide select-none outline-none focus-visible:ring-4 focus-visible:ring-[#FF5A36]/30 ${sizeStyles} ${variantStyles} ${disabledStyles} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
