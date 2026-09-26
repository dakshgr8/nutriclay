import React from 'react';

export interface ClayBadgeProps {
  children: React.ReactNode;
  variant?: 'violet' | 'pink' | 'blue' | 'green' | 'amber' | 'neutral';
  size?: 'sm' | 'default';
  className?: string;
  icon?: React.ReactNode;
}

export const ClayBadge: React.FC<ClayBadgeProps> = ({
  children,
  variant = 'violet',
  size = 'default',
  className = '',
  icon,
}) => {
  let colorStyles = 'bg-[#7C3AED]/12 text-[#7C3AED] border border-[#7C3AED]/20';

  if (variant === 'pink') {
    colorStyles = 'bg-[#DB2777]/12 text-[#DB2777] border border-[#DB2777]/20';
  } else if (variant === 'blue') {
    colorStyles = 'bg-[#0EA5E9]/12 text-[#0284C7] border border-[#0EA5E9]/20';
  } else if (variant === 'green') {
    colorStyles = 'bg-[#10B981]/12 text-[#059669] border border-[#10B981]/20';
  } else if (variant === 'amber') {
    colorStyles = 'bg-[#F59E0B]/12 text-[#D97706] border border-[#F59E0B]/20';
  } else if (variant === 'neutral') {
    colorStyles = 'bg-white/80 text-[#635F69] border border-[#D5CDE3]';
  }

  const sizeStyles = size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-nunito font-extrabold tracking-wide shadow-clayCardSm ${sizeStyles} ${colorStyles} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
