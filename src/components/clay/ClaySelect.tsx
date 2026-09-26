import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface ClaySelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<{ value: string | number; label: string }>;
  error?: string;
}

export const ClaySelect = React.forwardRef<HTMLSelectElement, ClaySelectProps>(
  ({ label, options, error, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="font-nunito text-xs font-bold uppercase tracking-wider text-[#645F73] px-1"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            className={`w-full appearance-none rounded-[18px] border-0 bg-[#EFECE6] py-3 pl-4 pr-10 text-base font-semibold text-[#1E1B26] shadow-clayPressed transition-all duration-200 outline-none focus:bg-white focus:ring-4 focus:ring-[#FF5A36]/20 cursor-pointer ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-white text-[#1E1B26] py-2">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-4 text-[#8C8799]">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        {error && (
          <p className="font-nunito text-xs font-bold text-[#E11D48] px-1">{error}</p>
        )}
      </div>
    );
  }
);

ClaySelect.displayName = 'ClaySelect';
