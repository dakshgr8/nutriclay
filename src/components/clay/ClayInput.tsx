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
      <div className="flex w-full flex-col gap-2">
        {label && (
          <label
            htmlFor={inputId}
            className="font-nunito text-xs font-bold uppercase tracking-wider text-[#635F69] px-1"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="pointer-events-none absolute left-4 text-[#635F69]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full rounded-2xl border-0 bg-[#EFEBF5] py-3.5 text-base font-medium text-[#332F3A] shadow-clayPressed transition-all duration-200 outline-none placeholder:text-[#8E8A96] focus:bg-white focus:ring-4 focus:ring-[#7C3AED]/20 ${
              icon ? 'pl-11' : 'pl-4'
            } ${unit ? 'pr-12' : 'pr-4'} ${className}`}
            {...props}
          />
          {unit && (
            <div className="pointer-events-none absolute right-4 font-nunito text-sm font-bold text-[#635F69]">
              {unit}
            </div>
          )}
        </div>
        {error && (
          <p className="font-nunito text-xs font-bold text-[#DB2777] px-1">{error}</p>
        )}
      </div>
    );
  }
);

ClayInput.displayName = 'ClayInput';
