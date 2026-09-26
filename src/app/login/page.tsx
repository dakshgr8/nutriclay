'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ClayCard } from '@/components/clay/ClayCard';
import { ClayButton } from '@/components/clay/ClayButton';
import { ClayInput } from '@/components/clay/ClayInput';
import { ClaySelect } from '@/components/clay/ClaySelect';
import { ClayBadge } from '@/components/clay/ClayBadge';
import {
  Sparkles,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Check,
  ShieldCheck,
  Scale,
  Cpu,
} from 'lucide-react';
import { Gender, GoalType } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [email, setEmail] = useState('alex.rivera@nutriclay.app');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Alex Rivera');
  const [gender, setGender] = useState<Gender>('male');
  const [weightKg, setWeightKg] = useState('82.5');
  const [goal, setGoal] = useState<GoalType>('cut');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate crisp authentic login with state transition
    setTimeout(() => {
      setIsLoading(false);
      router.push('/app');
    }, 600);
  };

  const handleDemoSignIn = () => {
    setEmail('alex.rivera@nutriclay.app');
    setPassword('demopassword123');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push('/app');
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1E1B26] selection:bg-[#FF5A36] selection:text-white flex flex-col justify-between p-4 sm:p-6">
      {/* Top Bar with Home Link */}
      <header className="mx-auto max-w-7xl w-full flex items-center justify-between py-2">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-[14px] bg-gradient-to-br from-[#FF7E62] to-[#FF5A36] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-nunito font-black text-xl tracking-tight text-[#1E1B26]">
            Nutri<span className="text-[#FF5A36]">Clay</span>
          </span>
        </Link>

        <Link
          href="/"
          className="font-nunito text-xs font-extrabold text-[#645F73] hover:text-[#FF5A36] transition-colors flex items-center gap-1"
        >
          ← Back to Overview
        </Link>
      </header>

      {/* Main Login Frame */}
      <main className="my-auto py-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <ClayCard
            variant="hero"
            className="!p-7 sm:!p-9 bg-white border border-[#EAE6DD] shadow-deepClay rounded-[36px]"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div className="h-14 w-14 rounded-[22px] bg-gradient-to-br from-[#FF7E62] to-[#FF5A36] flex items-center justify-center text-white shadow-[0_8px_20px_rgba(255,90,54,0.35)] mx-auto mb-3.5">
                <Sparkles className="h-7 w-7" />
              </div>
              <h1 className="font-nunito font-black text-2xl sm:text-3xl text-[#1E1B26]">
                {mode === 'signin' ? 'Welcome Back' : 'Join NutriClay'}
              </h1>
              <p className="font-dmsans text-xs text-[#645F73] font-medium mt-1">
                {mode === 'signin'
                  ? 'Access your personal metabolic ledger & daily targets'
                  : 'Start your personalized Mifflin-St Jeor tracking profile'}
              </p>
            </div>

            {/* 1-Click Instant Demo Button */}
            <div className="mb-5">
              <button
                type="button"
                onClick={handleDemoSignIn}
                disabled={isLoading}
                className="w-full p-3 rounded-[20px] bg-gradient-to-r from-[#FAF8F5] via-[#FFF6F2] to-[#FFF0EB] border border-[#FF5A36]/30 shadow-clayCardSm hover:shadow-clayCard flex items-center justify-between text-left transition-all active:scale-95 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-[14px] bg-gradient-to-br from-[#FFB347] to-[#FF8A00] flex items-center justify-center text-white font-nunito font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
                    A
                  </div>
                  <div>
                    <span className="font-nunito font-black text-xs text-[#1E1B26] block">
                      Quick Demo Access
                    </span>
                    <span className="font-nunito text-[11px] font-bold text-[#FF5A36]">
                      Sign in instantly as Alex Rivera (82.5 kg)
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-[#FF5A36] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center mb-5">
              <div className="w-full border-t border-[#ECE7DC]" />
              <span className="absolute px-3 bg-white font-nunito text-[10px] font-bold uppercase tracking-wider text-[#8C8799]">
                or use credentials
              </span>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-[18px] bg-[#EFECE6] shadow-clayPressedSm mb-5">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`py-2 rounded-[14px] font-nunito font-extrabold text-xs transition-all cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-white text-[#FF5A36] shadow-clayCardSm'
                    : 'text-[#645F73] hover:text-[#1E1B26]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`py-2 rounded-[14px] font-nunito font-extrabold text-xs transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white text-[#FF5A36] shadow-clayCardSm'
                    : 'text-[#645F73] hover:text-[#1E1B26]'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <ClayInput
                  label="Athlete Name"
                  icon={<User className="h-4 w-4 text-[#8C8799]" />}
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}

              <ClayInput
                label="Email Address"
                type="email"
                icon={<Mail className="h-4 w-4 text-[#8C8799]" />}
                placeholder="alex.rivera@nutriclay.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="relative">
                <ClayInput
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  icon={<Lock className="h-4 w-4 text-[#8C8799]" />}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-[38px] text-[#8C8799] hover:text-[#1E1B26] transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {mode === 'signup' && (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-2 gap-3">
                    <ClaySelect
                      label="Sex"
                      value={gender}
                      onChange={(e) => setGender(e.target.value as Gender)}
                      options={[
                        { value: 'male', label: 'Male' },
                        { value: 'female', label: 'Female' },
                      ]}
                    />
                    <ClayInput
                      label="Weight (kg)"
                      type="number"
                      step="0.1"
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value)}
                    />
                  </div>

                  <ClaySelect
                    label="Primary Objective"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value as GoalType)}
                    options={[
                      { value: 'cut', label: 'Fat Loss (-500 kcal)' },
                      { value: 'maintain', label: 'Maintenance (TDEE)' },
                      { value: 'bulk', label: 'Hypertrophy (+300 kcal)' },
                    ]}
                  />
                </div>
              )}

              {mode === 'signin' && (
                <div className="flex items-center justify-between text-xs font-nunito">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-[#645F73]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded accent-[#FF5A36] h-3.5 w-3.5"
                    />
                    <span>Remember on this device</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Demo Reset: Your sample profile is always available!')}
                    className="font-bold text-[#FF5A36] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <ClayButton
                type="submit"
                variant="primary"
                disabled={isLoading}
                className="w-full shadow-clayButton !py-3 !text-sm mt-2"
                icon={<ArrowRight className="h-4 w-4" />}
              >
                {isLoading
                  ? 'Authenticating...'
                  : mode === 'signin'
                  ? 'Enter NutriClay Studio'
                  : 'Create Athlete Profile'}
              </ClayButton>
            </form>

            {/* Direct Skip Link */}
            <div className="mt-5 text-center">
              <Link
                href="/app"
                className="font-nunito text-xs font-extrabold text-[#645F73] hover:text-[#FF5A36] transition-colors"
              >
                Skip authentication and explore as Guest →
              </Link>
            </div>
          </ClayCard>

          {/* Privacy Guarantee */}
          <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs font-nunito font-semibold text-[#8C8799]">
            <ShieldCheck className="h-4 w-4 text-[#10B981]" />
            <span>Client-Side SQLite Engine • 100% Privacy Preserved</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-2 font-nunito text-xs font-bold text-[#8C8799]">
        © 2026 NutriClay. High-Fidelity Ceramic Nutrition Architecture.
      </footer>
    </div>
  );
}
