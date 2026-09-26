import React, { useState } from 'react';
import { ClayCard } from '../clay/ClayCard';
import { ClayButton } from '../clay/ClayButton';
import { ClayInput } from '../clay/ClayInput';
import { ClaySelect } from '../clay/ClaySelect';
import { UserProfile, Gender, GoalType, DietModel } from '@/lib/types';
import {
  calculateBMR,
  calculateTDEE,
  calculateTargetCalories,
  calculateMacronutrients,
  DIET_MODEL_PRESETS,
} from '@/lib/calculations';
import { X, Activity, Cpu } from 'lucide-react';

interface ProfileEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => Promise<void>;
}

export const ProfileEngineModal: React.FC<ProfileEngineModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
}) => {
  const [gender, setGender] = useState<Gender>(profile.gender);
  const [age, setAge] = useState<number>(profile.age || 28);
  const [heightCm, setHeightCm] = useState<number>(profile.heightCm);
  const [currentWeightKg, setCurrentWeightKg] = useState<number>(profile.currentWeightKg);
  const [targetWeightKg, setTargetWeightKg] = useState<number>(profile.targetWeightKg || 78);
  const [activityLevel, setActivityLevel] = useState<number>(profile.activityLevel);
  const [goal, setGoal] = useState<GoalType>(profile.goal);
  const [dietModel, setDietModel] = useState<DietModel>('high_protein');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Live Mifflin-St Jeor computations
  const liveBMR = calculateBMR(gender, currentWeightKg, heightCm, age);
  const liveTDEE = calculateTDEE(liveBMR, activityLevel);
  const liveTargetCalories = calculateTargetCalories(liveTDEE, goal);
  const liveMacros = calculateMacronutrients(liveTargetCalories, dietModel);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onUpdateProfile({
        gender,
        heightCm,
        currentWeightKg,
        targetWeightKg,
        activityLevel,
        goal,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      style={{ overscrollBehavior: 'contain' }}
    >
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-[#1E1B26]/50 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl my-8 z-10">
        <ClayCard variant="hero" className="!p-6 sm:!p-8 max-h-[90vh] flex flex-col bg-white">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#ECE8DF]">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-[20px] bg-gradient-to-br from-[#FFB347] to-[#FF8A00] flex items-center justify-center text-white shadow-[0_6px_16px_rgba(255,138,0,0.3)]">
                <Cpu className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-nunito font-black text-2xl text-[#1E1B26]">
                  Dynamic Target Engine
                </h2>
                <p className="font-nunito text-xs font-semibold text-[#645F73]">
                  Mifflin-St Jeor BMR & Adaptive TDEE Macro Splitter
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="h-10 w-10 rounded-[16px] bg-[#EFECE6] hover:bg-[#E2DDD2] flex items-center justify-center text-[#645F73] hover:text-[#1E1B26] transition-all cursor-pointer active:scale-90"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form & Computational Flow */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1 py-4 flex flex-col gap-6">
            {/* Biometric Parameters */}
            <div>
              <span className="font-nunito text-xs font-bold uppercase tracking-wider text-[#645F73] block mb-3">
                Biometric Intake Parameters
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                <ClaySelect
                  label="Biological Sex"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  options={[
                    { value: 'male', label: 'Male (+5 constant)' },
                    { value: 'female', label: 'Female (-161 constant)' },
                  ]}
                />
                <ClayInput
                  label="Age"
                  type="number"
                  min="14"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                />
                <ClayInput
                  label="Height"
                  type="number"
                  min="100"
                  max="250"
                  unit="cm"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                />
                <ClayInput
                  label="Current Weight"
                  type="number"
                  step="0.1"
                  min="30"
                  max="300"
                  unit="kg"
                  value={currentWeightKg}
                  onChange={(e) => setCurrentWeightKg(Number(e.target.value))}
                />
                <ClayInput
                  label="Target Weight"
                  type="number"
                  step="0.1"
                  unit="kg"
                  value={targetWeightKg}
                  onChange={(e) => setTargetWeightKg(Number(e.target.value))}
                />
                <ClaySelect
                  label="Primary Objective"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value as GoalType)}
                  options={[
                    { value: 'cut', label: '🔥 Fat Loss (-500 kcal)' },
                    { value: 'maintain', label: '⚖️ Maintain TDEE (0 kcal)' },
                    { value: 'bulk', label: '💪 Hypertrophy (+300 kcal)' },
                  ]}
                />
              </div>

              <div className="mt-3.5">
                <ClaySelect
                  label="Daily Activity Factor Multiplier"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(Number(e.target.value))}
                  options={[
                    { value: 1.2, label: 'Sedentary: 1.2 (Desk job, little to no exercise)' },
                    { value: 1.375, label: 'Lightly Active: 1.375 (1-3 days/week exercise)' },
                    { value: 1.55, label: 'Moderately Active: 1.55 (3-5 days/week moderate)' },
                    { value: 1.725, label: 'Very Active: 1.725 (6-7 days/week hard training)' },
                    { value: 1.9, label: 'Extremely Active: 1.9 (Athlete or physical labour)' },
                  ]}
                />
              </div>
            </div>

            {/* Diet Model Preset Selector */}
            <div>
              <span className="font-nunito text-xs font-bold uppercase tracking-wider text-[#645F73] block mb-2">
                Macronutrient Ratio Model
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'high_protein', label: 'High-Protein', split: '40P / 35C / 25F' },
                  { id: 'balanced', label: 'Balanced 40/30/30', split: '30P / 40C / 30F' },
                  { id: 'keto', label: 'Ketogenic', split: '25P / 5C / 70F' },
                ].map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => setDietModel(model.id as DietModel)}
                    className={`p-3 rounded-[20px] transition-all cursor-pointer select-none text-left ${
                      dietModel === model.id
                        ? 'bg-[#FFF5F2] border-2 border-[#FF5A36] shadow-clayCardSm'
                        : 'bg-[#FAF8F5] hover:bg-white border border-[#E8E2D8] shadow-sm'
                    }`}
                  >
                    <span className="font-nunito font-extrabold text-xs text-[#1E1B26] block">
                      {model.label}
                    </span>
                    <span className="font-nunito text-[11px] font-black text-[#FF5A36]">
                      {model.split}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Computational Breakdown */}
            <div className="p-5 rounded-[28px] bg-gradient-to-br from-[#FAF8F5] to-[#F4EFE6] border border-[#E8E2D8] shadow-clayPressedSm">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="h-5 w-5 text-[#FF5A36]" />
                <h4 className="font-nunito font-black text-sm text-[#1E1B26] uppercase tracking-wider">
                  Live Mifflin-St Jeor Engine Calculations
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="p-3.5 rounded-[20px] bg-white shadow-clayCardSm text-center border border-white">
                  <span className="font-nunito text-[11px] font-bold text-[#645F73] block">
                    Basal Metabolic (BMR)
                  </span>
                  <span className="font-nunito font-black text-2xl text-[#1E1B26]">
                    {liveBMR.toLocaleString()} <span className="text-xs font-bold">kcal</span>
                  </span>
                  <span className="font-nunito text-[10px] text-[#8C8799] block mt-0.5">
                    10w + 6.25h - 5a {gender === 'male' ? '+ 5' : '- 161'}
                  </span>
                </div>

                <div className="p-3.5 rounded-[20px] bg-white shadow-clayCardSm text-center border border-white">
                  <span className="font-nunito text-[11px] font-bold text-[#645F73] block">
                    Total Expenditure (TDEE)
                  </span>
                  <span className="font-nunito font-black text-2xl text-[#2563EB]">
                    {liveTDEE.toLocaleString()} <span className="text-xs font-bold">kcal</span>
                  </span>
                  <span className="font-nunito text-[10px] text-[#8C8799] block mt-0.5">
                    BMR × {activityLevel} Multiplier
                  </span>
                </div>

                <div className="p-3.5 rounded-[20px] bg-white shadow-clayCardSm text-center border border-white">
                  <span className="font-nunito text-[11px] font-bold text-[#645F73] block">
                    Target Intake Budget
                  </span>
                  <span className="font-nunito font-black text-2xl text-[#FF5A36]">
                    {liveTargetCalories.toLocaleString()} <span className="text-xs font-bold">kcal</span>
                  </span>
                  <span className="font-nunito text-[10px] text-[#8C8799] block mt-0.5">
                    {goal === 'cut' ? 'TDEE - 500 kcal' : goal === 'bulk' ? 'TDEE + 300 kcal' : 'TDEE (Maintain)'}
                  </span>
                </div>
              </div>

              {/* Dynamic Macro Allocation */}
              <div className="p-4 rounded-[20px] bg-white shadow-clayCardSm border border-white">
                <span className="font-nunito text-xs font-extrabold text-[#1E1B26] block mb-2">
                  Computed Target Macronutrients ({DIET_MODEL_PRESETS[dietModel].protein}% P /{' '}
                  {DIET_MODEL_PRESETS[dietModel].carbs}% C / {DIET_MODEL_PRESETS[dietModel].fats}% F):
                </span>
                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="p-2.5 rounded-[16px] bg-[#FFF5F2] border border-[#FF5A36]/20">
                    <span className="text-[10px] uppercase font-extrabold text-[#FF5A36] block">Protein (4 kcal/g)</span>
                    <span className="font-nunito font-black text-xl text-[#FF5A36]">{liveMacros.proteinG}g</span>
                  </div>
                  <div className="p-2.5 rounded-[16px] bg-[#F5F9FF] border border-[#2563EB]/20">
                    <span className="text-[10px] uppercase font-extrabold text-[#2563EB] block">Carbs (4 kcal/g)</span>
                    <span className="font-nunito font-black text-xl text-[#2563EB]">{liveMacros.carbsG}g</span>
                  </div>
                  <div className="p-2.5 rounded-[16px] bg-[#FFFDF5] border border-[#F59E0B]/20">
                    <span className="text-[10px] uppercase font-extrabold text-[#D97706] block">Fats (9 kcal/g)</span>
                    <span className="font-nunito font-black text-xl text-[#D97706]">{liveMacros.fatsG}g</span>
                  </div>
                </div>
              </div>
            </div>

            <ClayButton
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full mt-2"
            >
              {isSubmitting ? 'Updating Targets...' : `Save & Recalculate Daily Goals (${liveTargetCalories} kcal)`}
            </ClayButton>
          </form>
        </ClayCard>
      </div>
    </div>
  );
};
