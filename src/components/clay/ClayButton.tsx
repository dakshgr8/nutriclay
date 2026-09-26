import React from 'react';

export interface ClayButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'emerald' | 'sky' | 'amber' | 'ghost' | 'outline';
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
  let sizeStyles = 'h-14 px-7 text-base rounded-[20px]';
  if (size === 'sm') {
    sizeStyles = 'h-11 px-4 text-sm rounded-[18px]';
  } else if (size === 'lg') {
    sizeStyles = 'h-16 px-8 text-lg rounded-[24px]';
  } else if (size === 'icon') {
    sizeStyles = 'h-12 w-12 rounded-[20px] p-0 flex items-center justify-center';
  }

  // Variants
  let variantStyles = 'bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] text-white shadow-clayButton hover:shadow-clayButtonHover';

  if (variant === 'secondary') {
    variantStyles = 'bg-white text-[#332F3A] border border-white/80 shadow-clayButton hover:shadow-clayButtonHover';
  } else if (variant === 'accent') {
    variantStyles = 'bg-gradient-to-br from-[#F472B6] to-[#DB2777] text-white shadow-clayButton hover:shadow-clayButtonHover';
  } else if (variant === 'emerald') {
    variantStyles = 'bg-gradient-to-br from-[#34D399] to-[#059669] text-white shadow-clayButton hover:shadow-clayButtonHover';
  } else if (variant === 'sky') {
    variantStyles = 'bg-gradient-to-br from-[#38BDF8] to-[#0284C7] text-white shadow-clayButton hover:shadow-clayButtonHover';
  } else if (variant === 'amber') {
    variantStyles = 'bg-gradient-to-br from-[#FBBF24] to-[#D97706] text-white shadow-clayButton hover:shadow-clayButtonHover';
  } else if (variant === 'ghost') {
    variantStyles = 'bg-transparent text-[#332F3A] hover:bg-[#7C3AED]/10 hover:text-[#7C3AED]';
  } else if (variant === 'outline') {
    variantStyles = 'border-2 border-[#7C3AED]/30 bg-white/40 text-[#7C3AED] hover:border-[#7C3AED] hover:bg-[#7C3AED]/10 shadow-clayCardSm';
  }

  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : 'clay-button-squish cursor-pointer';

  return (
    <button
      disabled={disabled}
      className={`relative inline-flex items-center justify-center gap-2.5 font-nunito font-extrabold tracking-wide select-none outline-none focus-visible:ring-4 focus-visible:ring-[#7C3AED]/30 ${sizeStyles} ${variantStyles} ${disabledStyles} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
