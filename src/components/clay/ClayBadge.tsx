import React from 'react';

export interface ClayBadgeProps {
  children: React.ReactNode;
  variant?: 'coral' | 'tangerine' | 'emerald' | 'cobalt' | 'amber' | 'neutral' | 'violet' | 'pink' | 'blue' | 'green';
  size?: 'sm' | 'default';
  className?: string;
  icon?: React.ReactNode;
}

export const ClayBadge: React.FC<ClayBadgeProps> = ({
  children,
  variant = 'coral',
  size = 'default',
  className = '',
  icon,
}) => {
  let colorStyles = 'bg-[#FF5A36]/10 text-[#FF5A36] border border-[#FF5A36]/20';

  if (variant === 'tangerine') {
    colorStyles = 'bg-[#FF8A00]/10 text-[#FF8A00] border border-[#FF8A00]/20';
  } else if (variant === 'emerald' || variant === 'green') {
    colorStyles = 'bg-[#10B981]/10 text-[#059669] border border-[#10B981]/20';
  } else if (variant === 'cobalt' || variant === 'blue') {
    colorStyles = 'bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20';
  } else if (variant === 'amber') {
    colorStyles = 'bg-[#F59E0B]/12 text-[#D97706] border border-[#F59E0B]/20';
  } else if (variant === 'pink') {
    colorStyles = 'bg-[#E11D48]/10 text-[#E11D48] border border-[#E11D48]/20';
  } else if (variant === 'neutral' || variant === 'violet') {
    colorStyles = 'bg-white/80 text-[#645F73] border border-[#E2DDD2]';
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
