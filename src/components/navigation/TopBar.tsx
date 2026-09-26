import React from 'react';
import Link from 'next/link';
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
  LogOut,
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
    <header className="relative w-full pt-4 mb-6 z-30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-[36px] bg-white/90 backdrop-blur-2xl border border-white shadow-clayCard">
          {/* Logo & Tagline (links to landing page) */}
          <Link href="/" title="Go to NutriClay Landing Page" className="flex items-center gap-3.5 group cursor-pointer">
            <div className="h-12 w-12 rounded-[20px] bg-gradient-to-br from-[#FF7E62] to-[#FF5A36] flex items-center justify-center text-white shadow-[0_6px_16px_rgba(255,90,54,0.35)] group-hover:scale-105 transition-transform">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-nunito font-black text-2xl tracking-tight text-[#1E1B26]">
                  Nutri<span className="text-[#FF5A36]">Clay</span>
                </h1>
                <ClayBadge variant="coral" size="sm">
                  Pro Engine
                </ClayBadge>
              </div>
              <p className="font-nunito text-[11px] font-bold text-[#8C8799] group-hover:text-[#FF5A36] transition-colors">
                Precision Macro & Calorie Ledger • Overview ↗
              </p>
            </div>
          </Link>

          {/* Date Navigator Pill */}
          <div className="flex items-center p-1.5 rounded-[24px] bg-[#EFECE6] shadow-clayPressedSm gap-2">
            <button
              onClick={() => shiftDay(-1)}
              title="Previous Day"
              className="h-9 w-9 rounded-[16px] bg-white text-[#1E1B26] hover:text-[#FF5A36] shadow-clayCardSm flex items-center justify-center transition-all active:scale-90 cursor-pointer border border-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 px-3 font-nunito font-extrabold text-sm text-[#1E1B26] select-none">
              <Calendar className="h-4 w-4 text-[#FF5A36]" />
              <span>{formatDateDisplay()}</span>
            </div>

            <button
              onClick={() => shiftDay(1)}
              title="Next Day"
              className="h-9 w-9 rounded-[16px] bg-white text-[#1E1B26] hover:text-[#FF5A36] shadow-clayCardSm flex items-center justify-center transition-all active:scale-90 cursor-pointer border border-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {!isToday && (
              <button
                onClick={() => onDateChange(todayStr)}
                className="px-2.5 py-1 rounded-[14px] bg-[#FF5A36] text-white text-[11px] font-nunito font-bold shadow-sm transition-all active:scale-95 cursor-pointer ml-1"
              >
                Today
              </button>
            )}
          </div>

          {/* User Profile Pill & Quick Log CTA */}
          <div className="flex items-center gap-3">
            {profile && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenProfile}
                  title="Configure Dynamic Target Engine"
                  className="flex items-center gap-2.5 p-2 pr-3.5 rounded-[22px] bg-[#FAF8F5] hover:bg-white border border-[#E8E3D8] shadow-clayCardSm transition-all active:scale-95 cursor-pointer"
                >
                  <div className="h-9 w-9 rounded-[16px] bg-gradient-to-br from-[#FFB347] to-[#FF8A00] flex items-center justify-center text-white font-nunito font-black text-sm shadow-sm">
                    {profile.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden sm:block">
                    <span className="font-nunito font-black text-xs text-[#1E1B26] block">
                      {profile.currentWeightKg}kg → {profile.targetWeightKg}kg
                    </span>
                    <span className="font-nunito text-[10px] font-extrabold text-[#FF5A36] uppercase">
                      {profile.goal === 'cut' ? '🔥 Fat Loss Deficit' : profile.goal === 'bulk' ? '💪 Hypertrophy' : '⚖️ Maintain'}
                    </span>
                  </div>
                  <Sliders className="h-4 w-4 text-[#8C8799]" />
                </button>

                <Link
                  href="/login"
                  title="Switch Athlete / Sign Out"
                  className="h-10 w-10 rounded-[18px] bg-[#FAF8F5] hover:bg-white text-[#8C8799] hover:text-[#FF5A36] border border-[#E8E3D8] shadow-clayCardSm flex items-center justify-center transition-all active:scale-90 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                </Link>
              </div>
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
