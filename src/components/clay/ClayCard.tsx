import React from 'react';

interface ClayCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'floating' | 'flat' | 'hero' | 'inset' | 'bento';
  className?: string;
  lift?: boolean;
}

export const ClayCard: React.FC<ClayCardProps> = ({
  children,
  variant = 'floating',
  className = '',
  lift = true,
  ...props
}) => {
  let shadowClass = 'shadow-clayCard';
  let bgClass = 'bg-[#FFFFFF]/90 backdrop-blur-xl border border-white/80';

  if (variant === 'inset') {
    shadowClass = 'shadow-clayPressed';
    bgClass = 'bg-[#EDE9E1]/70 border border-[#E3DDD1]/50';
  } else if (variant === 'hero') {
    shadowClass = 'shadow-deepClay';
    bgClass = 'bg-[#FFFFFF]/95 backdrop-blur-2xl border border-white';
  } else if (variant === 'flat') {
    shadowClass = 'shadow-clayCardSm';
    bgClass = 'bg-[#FFFFFF]/85 backdrop-blur-md border border-white/80';
  } else if (variant === 'bento') {
    shadowClass = 'shadow-clayCard';
    bgClass = 'bg-[#FAF8F5] border border-white';
  }

  const liftClass = lift && variant !== 'inset' ? 'clay-card-lift' : '';

  return (
    <div
      className={`relative overflow-hidden rounded-[32px] p-6 sm:p-8 text-[#1E1B26] ${bgClass} ${shadowClass} ${liftClass} ${className}`}
      {...props}
    >
      <div className="relative z-10 flex h-full flex-col min-h-0">{children}</div>
    </div>
  );
};
