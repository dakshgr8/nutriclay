import React, { useState, useEffect } from 'react';
import { ClayCard } from '../clay/ClayCard';
import { ClayButton } from '../clay/ClayButton';
import { ClayInput } from '../clay/ClayInput';
import { FoodItem, MealType } from '@/lib/types';
import { computeNutrition } from '@/lib/calculations';
import {
  X,
  Search,
  Zap,
  Barcode,
  UtensilsCrossed,
  Check,
  Scale,
  Sparkles,
  Minus,
  Plus,
  Sunrise,
  Sun,
  Moon,
  Dumbbell,
  Apple,
} from 'lucide-react';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMealType?: MealType;
  selectedDate: string;
  onLogFood: (entry: {
    foodId?: string;
    foodName: string;
    foodBrand?: string;
    logDate: string;
    mealType: MealType;
    quantityGrams: number;
    computedCalories: number;
    computedProtein: number;
    computedCarbs: number;
    computedFat: number;
  }) => Promise<void>;
}

type TabType = 'search' | 'quick' | 'barcode' | 'recipe';

const MEAL_SLOT_OPTIONS: Array<{
  id: MealType;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  activeColor: string;
}> = [
  { id: 'breakfast', label: 'Breakfast', shortLabel: 'Morning', icon: <Sunrise className="h-4 w-4" />, activeColor: 'bg-[#FF8A00] text-white shadow-sm' },
  { id: 'lunch', label: 'Lunch', shortLabel: 'Lunch', icon: <Sun className="h-4 w-4" />, activeColor: 'bg-[#059669] text-white shadow-sm' },
  { id: 'dinner', label: 'Dinner', shortLabel: 'Dinner', icon: <Moon className="h-4 w-4" />, activeColor: 'bg-[#2563EB] text-white shadow-sm' },
  { id: 'pre_post_workout', label: 'Workout', shortLabel: 'Workout', icon: <Dumbbell className="h-4 w-4" />, activeColor: 'bg-[#FF5A36] text-white shadow-sm' },
  { id: 'snack', label: 'Snacks', shortLabel: 'Snacks', icon: <Apple className="h-4 w-4" />, activeColor: 'bg-[#E11D48] text-white shadow-sm' },
];

export const QuickLogModal: React.FC<QuickLogModalProps> = ({
  isOpen,
  onClose,
  initialMealType = 'breakfast',
  selectedDate,
  onLogFood,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('search');
  const [mealType, setMealType] = useState<MealType>(initialMealType);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search tab state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [searchQuantity, setSearchQuantity] = useState<number>(100);
  const [isSearching, setIsSearching] = useState(false);

  // Quick log tab state
  const [quickName, setQuickName] = useState('');
  const [quickCalories, setQuickCalories] = useState('');
  const [quickProtein, setQuickProtein] = useState('');
  const [quickCarbs, setQuickCarbs] = useState('');
  const [quickFat, setQuickFat] = useState('');
  const [quickQuantity, setQuickQuantity] = useState('150');

  // Barcode tab state
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [isScanning, setIsScanning] = useState(true);

  // Recipe Builder state
  const [recipeName, setRecipeName] = useState('High-Protein Power Bowl');
  const [recipeServings, setRecipeServings] = useState(1);
  const [recipeIngredients, setRecipeIngredients] = useState<
    Array<{ food: FoodItem; quantityGrams: number }>
  >([]);

  useEffect(() => {
    setMealType(initialMealType);
  }, [initialMealType]);

  // Initial load & search handler
  useEffect(() => {
    if (!isOpen) return;

    const fetchFoods = async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/foods/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (data.success) {
          setSearchResults(data.results);
          if (!selectedFood && data.results.length > 0) {
            setSelectedFood(data.results[0]);
            setSearchQuantity(data.results[0].servingSizeAmount || 100);
          }
        }
      } catch (err) {
        console.error('Failed to search foods', err);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(fetchFoods, 150);
    return () => clearTimeout(timer);
  }, [searchQuery, isOpen]);

  if (!isOpen) return null;

  // Computed values for selected search item
  const searchComputed = selectedFood
    ? computeNutrition(
        searchQuantity,
        selectedFood.caloriesPer100g,
        selectedFood.proteinPer100g,
        selectedFood.carbsPer100g,
        selectedFood.fatPer100g
      )
    : { calories: 0, protein: 0, carbs: 0, fat: 0 };

  const handleLogSearchItem = async () => {
    if (!selectedFood) return;
    setIsSubmitting(true);
    try {
      await onLogFood({
        foodId: selectedFood.id,
        foodName: selectedFood.name,
        foodBrand: selectedFood.brand,
        logDate: selectedDate,
        mealType,
        quantityGrams: searchQuantity,
        computedCalories: searchComputed.calories,
        computedProtein: searchComputed.protein,
        computedCarbs: searchComputed.carbs,
        computedFat: searchComputed.fat,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogQuickItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim() || !quickCalories) return;
    setIsSubmitting(true);
    try {
      await onLogFood({
        foodName: quickName,
        logDate: selectedDate,
        mealType,
        quantityGrams: Number(quickQuantity) || 100,
        computedCalories: Math.round(Number(quickCalories)),
        computedProtein: Number(quickProtein) || 0,
        computedCarbs: Number(quickCarbs) || 0,
        computedFat: Number(quickFat) || 0,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const sampleBarcodes = [
    { code: '011110023452', label: 'Grilled Chicken Breast', category: 'Poultry' },
    { code: '748927028669', label: 'Gold Standard Whey', category: 'Protein' },
    { code: '030000010204', label: 'Old Fashioned Oats', category: 'Grains' },
    { code: '894700010041', label: 'Plain Greek Yogurt', category: 'Dairy' },
  ];

  const handleSimulateScan = async (code: string) => {
    setScannedBarcode(code);
    setIsScanning(true);
    try {
      const res = await fetch(`/api/foods/search?q=${encodeURIComponent(code)}`);
      const data = await res.json();
      if (data.success && data.results.length > 0) {
        setSelectedFood(data.results[0]);
        setSearchQuantity(data.results[0].servingSizeAmount || 100);
        setActiveTab('search');
      }
    } finally {
      setIsScanning(false);
    }
  };

  const recipeTotals = recipeIngredients.reduce(
    (acc, curr) => {
      const nutrition = computeNutrition(
        curr.quantityGrams,
        curr.food.caloriesPer100g,
        curr.food.proteinPer100g,
        curr.food.carbsPer100g,
        curr.food.fatPer100g
      );
      return {
        calories: acc.calories + nutrition.calories,
        protein: Math.round((acc.protein + nutrition.protein) * 10) / 10,
        carbs: Math.round((acc.carbs + nutrition.carbs) * 10) / 10,
        fat: Math.round((acc.fat + nutrition.fat) * 10) / 10,
        weight: acc.weight + curr.quantityGrams,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, weight: 0 }
  );

  const handleAddIngredientToRecipe = (food: FoodItem) => {
    setRecipeIngredients((prev) => [
      ...prev,
      { food, quantityGrams: food.servingSizeAmount || 100 },
    ]);
  };

  const handleLogRecipe = async () => {
    if (recipeIngredients.length === 0) return;
    setIsSubmitting(true);
    try {
      const servings = Math.max(1, recipeServings);
      await onLogFood({
        foodName: `${recipeName} (1 of ${servings} svgs)`,
        foodBrand: 'Custom Recipe',
        logDate: selectedDate,
        mealType,
        quantityGrams: Math.round(recipeTotals.weight / servings),
        computedCalories: Math.round(recipeTotals.calories / servings),
        computedProtein: Math.round((recipeTotals.protein / servings) * 10) / 10,
        computedCarbs: Math.round((recipeTotals.carbs / servings) * 10) / 10,
        computedFat: Math.round((recipeTotals.fat / servings) * 10) / 10,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Dimmer Backdrop */}
      <div
        className="fixed inset-0 bg-[#1E1B26]/55 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Dialog Container with Balanced Width & Padding */}
      <div className="relative w-full max-w-2xl my-6 z-10">
        <ClayCard variant="hero" className="!p-6 sm:!p-7 max-h-[92vh] flex flex-col bg-white">
          {/* Top Header Row */}
          <div className="flex items-center justify-between pb-4 border-b border-[#EAE6DD]">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-[18px] bg-gradient-to-br from-[#FF7E62] to-[#FF5A36] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(255,90,54,0.35)] shrink-0">
                <UtensilsCrossed className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-nunito font-black text-xl sm:text-2xl text-[#1E1B26] leading-snug">
                  Log Food & Nutrients
                </h2>
                <p className="font-nunito text-xs font-semibold text-[#645F73]">
                  Precision ledger with automated macro calculations
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="h-9 w-9 rounded-[14px] bg-[#EFECE6] hover:bg-[#E2DDD2] flex items-center justify-center text-[#645F73] hover:text-[#1E1B26] transition-all cursor-pointer active:scale-90"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Mode Switcher: 4-Column Balanced Grid (NO Horizontal Scrollbar!) */}
          <div className="grid grid-cols-4 gap-1.5 p-1 rounded-[18px] bg-[#EFECE6] shadow-clayPressedSm my-4">
            {[
              { id: 'search', label: 'Search', icon: <Search className="h-3.5 w-3.5" /> },
              { id: 'quick', label: 'Quick Log', icon: <Zap className="h-3.5 w-3.5" /> },
              { id: 'barcode', label: 'Barcode', icon: <Barcode className="h-3.5 w-3.5" /> },
              { id: 'recipe', label: 'Recipe', icon: <Sparkles className="h-3.5 w-3.5" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-[14px] font-nunito font-extrabold text-xs transition-all cursor-pointer select-none ${
                  activeTab === tab.id
                    ? 'bg-white text-[#FF5A36] shadow-clayCardSm'
                    : 'text-[#645F73] hover:text-[#1E1B26]'
                }`}
              >
                {tab.icon}
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Meal Slot Selector: 5-Pill Equal Grid (Clean Alignment!) */}
          <div className="mb-4">
            <span className="font-nunito text-[11px] font-bold uppercase tracking-wider text-[#645F73] block mb-1.5 px-0.5">
              Select Meal Slot:
            </span>
            <div className="grid grid-cols-5 gap-1.5 p-1 rounded-[18px] bg-[#EFECE6] shadow-clayPressedSm">
              {MEAL_SLOT_OPTIONS.map((slot) => {
                const isSelected = mealType === slot.id;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setMealType(slot.id)}
                    className={`flex items-center justify-center gap-1 py-2 px-1 rounded-[14px] font-nunito font-extrabold text-xs transition-all cursor-pointer select-none ${
                      isSelected
                        ? slot.activeColor
                        : 'text-[#645F73] hover:text-[#1E1B26] hover:bg-white/50'
                    }`}
                  >
                    <span className="shrink-0">{slot.icon}</span>
                    <span className="truncate hidden sm:inline">{slot.label}</span>
                    <span className="truncate sm:hidden">{slot.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Body Section */}
          <div className="flex-1 overflow-y-auto pr-1">
            {/* TAB 1: DATABASE SEARCH */}
            {activeTab === 'search' && (
              <div className="flex flex-col gap-4">
                {/* Search Input */}
                <ClayInput
                  icon={<Search className="h-4 w-4" />}
                  placeholder="Search chicken breast, oats, yogurt, salmon, rice..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* Available Foods List */}
                <div className="flex flex-col gap-1.5">
                  <span className="font-nunito text-[11px] font-bold uppercase tracking-wider text-[#645F73] px-0.5">
                    Select Ingredient ({searchResults.length} available)
                  </span>
                  <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto p-0.5">
                    {searchResults.map((food) => {
                      const isSelected = selectedFood?.id === food.id;
                      return (
                        <div
                          key={food.id}
                          onClick={() => {
                            setSelectedFood(food);
                            setSearchQuantity(food.servingSizeAmount || 100);
                          }}
                          className={`p-2.5 px-3.5 rounded-[16px] transition-all cursor-pointer select-none flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#FFF5F2] border-2 border-[#FF5A36] shadow-clayCardSm'
                              : 'bg-[#FAF8F5] hover:bg-white border border-[#E8E2D8]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="h-2 w-2 rounded-full bg-[#FF5A36]" />
                            <div>
                              <span className="font-nunito font-extrabold text-xs text-[#1E1B26] block">
                                {food.name}
                              </span>
                              <span className="font-nunito text-[11px] font-semibold text-[#8C8799]">
                                {food.caloriesPer100g} kcal/100g • P: {food.proteinPer100g}g • C: {food.carbsPer100g}g • F: {food.fatPer100g}g
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="h-5 w-5 rounded-full bg-[#FF5A36] text-white flex items-center justify-center shrink-0">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Active Item Portion Control Panel */}
                {selectedFood && (
                  <div className="p-4 rounded-[24px] bg-gradient-to-br from-white via-[#FAF8F5] to-[#F7F4EF] border border-[#E8E2D8] shadow-clayCardSm flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-nunito font-black text-sm text-[#1E1B26]">
                          {selectedFood.name}
                        </span>
                        <span className="font-nunito text-[11px] font-bold text-[#FF5A36] bg-[#FF5A36]/10 px-2 py-0.5 rounded-full">
                          Portion Adjuster
                        </span>
                      </div>
                      <span className="font-nunito text-xs font-semibold text-[#8C8799]">
                        Base: 100g
                      </span>
                    </div>

                    {/* Raw vs Cooked reminder */}
                    {selectedFood.name.toLowerCase().includes('chicken') && (
                      <div className="p-2 rounded-[14px] bg-amber-50 border border-amber-200 text-[11px] font-nunito font-bold text-amber-900 flex items-center gap-2">
                        <Scale className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                        <span>Note: 100g raw yields ~75g cooked due to water evaporation.</span>
                      </div>
                    )}

                    {/* Stepper + Quick Presets in Balanced Row (NO Scrollbar!) */}
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      {/* Numeric Stepper */}
                      <div className="flex items-center gap-1.5 bg-[#EFECE6] p-1 rounded-[16px] shadow-clayPressedSm shrink-0 w-full sm:w-auto justify-between sm:justify-start">
                        <button
                          type="button"
                          onClick={() => setSearchQuantity(Math.max(10, searchQuantity - 10))}
                          className="h-8 w-8 rounded-[12px] bg-white text-[#1E1B26] hover:bg-[#FAF8F5] shadow-sm flex items-center justify-center font-black cursor-pointer active:scale-90"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <div className="flex items-baseline px-2 font-nunito font-black text-base text-[#1E1B26]">
                          <span>{searchQuantity}</span>
                          <span className="text-xs font-bold text-[#8C8799] ml-1">g</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSearchQuantity(searchQuantity + 10)}
                          className="h-8 w-8 rounded-[12px] bg-white text-[#1E1B26] hover:bg-[#FAF8F5] shadow-sm flex items-center justify-center font-black cursor-pointer active:scale-90"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Presets: 5 equal buttons spanning rest of space */}
                      <div className="grid grid-cols-5 gap-1.5 w-full">
                        {[50, 100, 150, 200, 250].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setSearchQuantity(amt)}
                            className={`py-1.5 rounded-[12px] font-nunito font-extrabold text-xs transition-all cursor-pointer ${
                              searchQuantity === amt
                                ? 'bg-[#1E1B26] text-white shadow-sm'
                                : 'bg-[#EFECE6] text-[#645F73] hover:bg-white'
                            }`}
                          >
                            {amt}g
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Computed Output Metrics */}
                    <div className="grid grid-cols-4 gap-2 text-center p-2.5 rounded-[18px] bg-[#EFECE6] shadow-clayPressedSm">
                      <div>
                        <span className="font-nunito text-[10px] font-bold text-[#645F73] uppercase block">
                          Calories
                        </span>
                        <span className="font-nunito font-black text-base text-[#1E1B26]">
                          {searchComputed.calories}
                        </span>
                      </div>
                      <div>
                        <span className="font-nunito text-[10px] font-bold text-[#FF5A36] uppercase block">
                          Protein
                        </span>
                        <span className="font-nunito font-black text-base text-[#FF5A36]">
                          {searchComputed.protein}g
                        </span>
                      </div>
                      <div>
                        <span className="font-nunito text-[10px] font-bold text-[#2563EB] uppercase block">
                          Carbs
                        </span>
                        <span className="font-nunito font-black text-base text-[#2563EB]">
                          {searchComputed.carbs}g
                        </span>
                      </div>
                      <div>
                        <span className="font-nunito text-[10px] font-bold text-[#D97706] uppercase block">
                          Fat
                        </span>
                        <span className="font-nunito font-black text-base text-[#D97706]">
                          {searchComputed.fat}g
                        </span>
                      </div>
                    </div>

                    {/* Submit CTA */}
                    <ClayButton
                      variant="primary"
                      disabled={isSubmitting}
                      onClick={handleLogSearchItem}
                      className="w-full mt-1"
                    >
                      {isSubmitting ? 'Logging...' : `Log ${searchComputed.calories} kcal to ${mealType.replace('_', ' ')}`}
                    </ClayButton>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: QUICK ENTRY */}
            {activeTab === 'quick' && (
              <form onSubmit={handleLogQuickItem} className="flex flex-col gap-4">
                <div className="p-4 rounded-[22px] bg-[#FAF8F5] border border-[#E8E2D8] flex flex-col gap-3">
                  <ClayInput
                    label="Food / Item Name"
                    placeholder="e.g. Avocado Toast with Poached Eggs"
                    value={quickName}
                    onChange={(e) => setQuickName(e.target.value)}
                    required
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <ClayInput
                      label="Calories"
                      type="number"
                      placeholder="450"
                      unit="kcal"
                      value={quickCalories}
                      onChange={(e) => setQuickCalories(e.target.value)}
                      required
                    />
                    <ClayInput
                      label="Protein"
                      type="number"
                      step="0.1"
                      placeholder="30"
                      unit="g"
                      value={quickProtein}
                      onChange={(e) => setQuickProtein(e.target.value)}
                    />
                    <ClayInput
                      label="Carbs"
                      type="number"
                      step="0.1"
                      placeholder="40"
                      unit="g"
                      value={quickCarbs}
                      onChange={(e) => setQuickCarbs(e.target.value)}
                    />
                    <ClayInput
                      label="Fat"
                      type="number"
                      step="0.1"
                      placeholder="15"
                      unit="g"
                      value={quickFat}
                      onChange={(e) => setQuickFat(e.target.value)}
                    />
                  </div>

                  <ClayInput
                    label="Serving Weight"
                    type="number"
                    unit="grams"
                    value={quickQuantity}
                    onChange={(e) => setQuickQuantity(e.target.value)}
                  />
                </div>

                <ClayButton
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting || !quickName || !quickCalories}
                  className="w-full"
                >
                  {isSubmitting ? 'Saving...' : `Log Quick Item to ${mealType.replace('_', ' ')}`}
                </ClayButton>
              </form>
            )}

            {/* TAB 3: BARCODE SCANNER */}
            {activeTab === 'barcode' && (
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="relative w-full h-44 rounded-[24px] bg-[#16141D] shadow-clayPressed overflow-hidden flex flex-col items-center justify-center border-2 border-white">
                  <div className="absolute inset-x-8 top-6 bottom-6 border-2 border-dashed border-[#FF5A36]/70 rounded-[18px] pointer-events-none flex items-center justify-center">
                    <div className="absolute w-full h-0.5 bg-[#FF5A36] shadow-[0_0_12px_#FF5A36] animate-bounce" />
                  </div>
                  <Barcode className="h-12 w-12 text-white/30" />
                  <span className="font-nunito text-[11px] font-bold text-white/80 mt-1 z-10">
                    Align Barcode within viewfinder
                  </span>
                </div>

                <div className="w-full">
                  <span className="font-nunito text-[11px] font-bold text-[#645F73] uppercase tracking-wider block mb-2 px-0.5 text-left">
                    Instant Barcode Lookup Demos:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {sampleBarcodes.map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => handleSimulateScan(item.code)}
                        className="p-2.5 rounded-[16px] bg-white hover:bg-[#FAF8F5] border border-[#E8E2D8] shadow-sm text-left transition-all active:scale-95 cursor-pointer"
                      >
                        <span className="font-nunito font-extrabold text-xs text-[#1E1B26] block truncate">
                          {item.label}
                        </span>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="font-mono text-[10px] text-[#FF5A36]">
                            {item.code}
                          </span>
                          <span className="text-[10px] font-bold text-[#8C8799]">
                            {item.category}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: RECIPE BUILDER */}
            {activeTab === 'recipe' && (
              <div className="flex flex-col gap-3.5">
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="col-span-2">
                    <ClayInput
                      label="Recipe Title"
                      value={recipeName}
                      onChange={(e) => setRecipeName(e.target.value)}
                    />
                  </div>
                  <div>
                    <ClayInput
                      label="Servings"
                      type="number"
                      min="1"
                      value={recipeServings}
                      onChange={(e) => setRecipeServings(Math.max(1, Number(e.target.value)))}
                    />
                  </div>
                </div>

                <div>
                  <span className="font-nunito text-[11px] font-bold uppercase tracking-wider text-[#645F73] block mb-1.5 px-0.5">
                    Click to Add Ingredients:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {searchResults.slice(0, 6).map((food) => (
                      <button
                        key={food.id}
                        type="button"
                        onClick={() => handleAddIngredientToRecipe(food)}
                        className="px-2.5 py-1 rounded-full bg-white hover:bg-[#FAF8F5] text-xs font-nunito font-bold text-[#1E1B26] border border-[#E2DDD2] shadow-sm cursor-pointer transition-all active:scale-95"
                      >
                        + {food.name.split('(')[0].trim()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-[20px] bg-[#FAF8F5] border border-[#E8E2D8]">
                  <span className="font-nunito text-xs font-extrabold text-[#1E1B26] block mb-1.5">
                    Components ({recipeIngredients.length}):
                  </span>
                  {recipeIngredients.length === 0 ? (
                    <p className="font-nunito text-xs text-[#8C8799] italic">
                      Add ingredients from above to calculate composite nutrition.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto">
                      {recipeIngredients.map((ing, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-xl bg-white shadow-sm text-xs font-nunito border border-[#EAE6DD]"
                        >
                          <span className="font-bold text-[#1E1B26] truncate">{ing.food.name}</span>
                          <div className="flex items-center gap-2.5 shrink-0">
                            <span className="text-[#645F73] font-semibold">{ing.quantityGrams}g</span>
                            <button
                              type="button"
                              onClick={() =>
                                setRecipeIngredients((prev) => prev.filter((_, i) => i !== idx))
                              }
                              className="text-rose-500 hover:text-rose-700 font-bold cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {recipeIngredients.length > 0 && (
                    <div className="mt-2.5 pt-2.5 border-t border-[#E8E2D8] flex items-center justify-between font-nunito text-xs font-extrabold text-[#1E1B26]">
                      <span>
                        Per Serving: <strong className="text-[#FF5A36]">{Math.round(recipeTotals.calories / recipeServings)} kcal</strong>
                      </span>
                      <span className="text-[#645F73]">
                        P: {Math.round((recipeTotals.protein / recipeServings) * 10) / 10}g • C: {Math.round((recipeTotals.carbs / recipeServings) * 10) / 10}g • F: {Math.round((recipeTotals.fat / recipeServings) * 10) / 10}g
                      </span>
                    </div>
                  )}
                </div>

                <ClayButton
                  variant="primary"
                  disabled={isSubmitting || recipeIngredients.length === 0}
                  onClick={handleLogRecipe}
                  className="w-full mt-1"
                >
                  {isSubmitting ? 'Logging...' : `Log Recipe to ${mealType.replace('_', ' ')}`}
                </ClayButton>
              </div>
            )}
          </div>
        </ClayCard>
      </div>
    </div>
  );
};
