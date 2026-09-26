import React from 'react';
import { ClayButton } from '../clay/ClayButton';
import { ClayBadge } from '../clay/ClayBadge';
import { UserProfile } from '@/lib/types';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Sparkles,
  Sliders,
  Plus,
  Scale,
} from 'lucide-react';

interface TopBarProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  profile: UserProfile | null;
  onOpenProfile: () => void;
  onOpenQuickLog: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  selectedDate,
  onDateChange,
  profile,
  onOpenProfile,
  onOpenQuickLog,
}) => {
  const currentDate = new Date(selectedDate);
  const todayStr = new Date().toISOString().split('T')[0];
  const isToday = selectedDate === todayStr;

  const formatDateDisplay = () => {
    if (isToday) return 'Today, ' + currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const shiftDay = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    onDateChange(d.toISOString().split('T')[0]);
  };

  return (
    <header className="sticky top-4 z-40 w-full mb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-[36px] bg-white/75 backdrop-blur-2xl border border-white/80 shadow-clayCard">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-[20px] bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] flex items-center justify-center text-white shadow-clayButton">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-nunito font-black text-2xl tracking-tight text-[#332F3A]">
                  Nutri<span className="text-[#7C3AED]">Clay</span>
                </h1>
                <ClayBadge variant="violet" size="sm">
                  v2.0
                </ClayBadge>
              </div>
              <p className="font-nunito text-[11px] font-bold text-[#635F69]">
                Precision Macro & Caloric Engine
              </p>
            </div>
          </div>

          {/* Date Navigator Pill */}
          <div className="flex items-center p-1.5 rounded-[24px] bg-[#EFEBF5] shadow-clayPressedSm gap-2">
            <button
              onClick={() => shiftDay(-1)}
              title="Previous Day"
              className="h-9 w-9 rounded-[16px] bg-white text-[#332F3A] hover:text-[#7C3AED] shadow-clayCardSm flex items-center justify-center transition-all active:scale-90 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 px-3 font-nunito font-extrabold text-sm text-[#332F3A] select-none">
              <Calendar className="h-4 w-4 text-[#7C3AED]" />
              <span>{formatDateDisplay()}</span>
            </div>

            <button
              onClick={() => shiftDay(1)}
              title="Next Day"
              className="h-9 w-9 rounded-[16px] bg-white text-[#332F3A] hover:text-[#7C3AED] shadow-clayCardSm flex items-center justify-center transition-all active:scale-90 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {!isToday && (
              <button
                onClick={() => onDateChange(todayStr)}
                className="px-2.5 py-1 rounded-[14px] bg-[#7C3AED] text-white text-[11px] font-nunito font-bold shadow-sm transition-all active:scale-95 cursor-pointer ml-1"
              >
                Today
              </button>
            )}
          </div>

          {/* User Profile Pill & Quick Log CTA */}
          <div className="flex items-center gap-3">
            {profile && (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2.5 p-2 pr-3.5 rounded-[22px] bg-white/90 hover:bg-white border border-[#E8E2F2] shadow-clayCardSm transition-all active:scale-95 cursor-pointer"
              >
                <div className="h-9 w-9 rounded-[16px] bg-gradient-to-br from-[#F472B6] to-[#DB2777] flex items-center justify-center text-white font-nunito font-black text-sm shadow-sm">
                  {profile.email.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="font-nunito font-black text-xs text-[#332F3A] block">
                    {profile.currentWeightKg}kg → {profile.targetWeightKg}kg
                  </span>
                  <span className="font-nunito text-[10px] font-bold text-[#7C3AED] uppercase">
                    {profile.goal === 'cut' ? '🔥 Fat Loss' : profile.goal === 'bulk' ? '💪 Hypertrophy' : '⚖️ Maintain'}
                  </span>
                </div>
                <Sliders className="h-4 w-4 text-[#635F69]" />
              </button>
            )}

            <ClayButton
              size="sm"
              variant="primary"
              onClick={onOpenQuickLog}
              icon={<Plus className="h-4 w-4" />}
            >
              Log Food
            </ClayButton>
          </div>
        </div>
      </div>
    </header>
  );
};
