import React from 'react';

interface ClayCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'floating' | 'flat' | 'hero' | 'inset';
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
  let bgClass = 'bg-white/75 backdrop-blur-xl';

  if (variant === 'inset') {
    shadowClass = 'shadow-clayPressed';
    bgClass = 'bg-[#ECE7F4]/80 backdrop-blur-lg';
  } else if (variant === 'hero') {
    shadowClass = 'shadow-deepClay';
    bgClass = 'bg-white/85 backdrop-blur-2xl';
  } else if (variant === 'flat') {
    shadowClass = 'shadow-clayCardSm';
    bgClass = 'bg-white/70 backdrop-blur-md';
  }

  const liftClass = lift && variant !== 'inset' ? 'clay-card-lift' : '';

  return (
    <div
      className={`relative overflow-hidden rounded-[32px] p-6 sm:p-8 text-[#332F3A] border border-white/60 ${bgClass} ${shadowClass} ${liftClass} ${className}`}
      {...props}
    >
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </div>
  );
};
