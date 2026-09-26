import React from 'react';

export interface ClayInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  unit?: string;
  icon?: React.ReactNode;
}

export const ClayInput = React.forwardRef<HTMLInputElement, ClayInputProps>(
  ({ label, error, unit, icon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="font-nunito text-xs font-bold uppercase tracking-wider text-[#645F73] px-1"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="pointer-events-none absolute left-4 text-[#8C8799]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full rounded-[18px] border-0 bg-[#EFECE6] py-3 text-base font-semibold text-[#1E1B26] shadow-clayPressed transition-all duration-200 outline-none placeholder:text-[#9B96A8] focus:bg-white focus:ring-4 focus:ring-[#FF5A36]/20 ${
              icon ? 'pl-11' : 'pl-4'
            } ${unit ? 'pr-12' : 'pr-4'} ${className}`}
            {...props}
          />
          {unit && (
            <div className="pointer-events-none absolute right-4 font-nunito text-xs font-bold text-[#8C8799]">
              {unit}
            </div>
          )}
        </div>
        {error && (
          <p className="font-nunito text-xs font-bold text-[#E11D48] px-1">{error}</p>
        )}
      </div>
    );
  }
);

ClayInput.displayName = 'ClayInput';
