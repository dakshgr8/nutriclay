import React, { useState, useEffect } from 'react';
import { ClayCard } from '../clay/ClayCard';
import { ClayButton } from '../clay/ClayButton';
import { ClayInput } from '../clay/ClayInput';
import { ClaySelect } from '../clay/ClaySelect';
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
  const [recipeName, setRecipeName] = useState('My High-Protein Clay Bowl');
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

    const timer = setTimeout(fetchFoods, 200);
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

  // Handle Search Submission
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

  // Handle Quick Entry Submission
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

  // Barcode presets for rapid testing
  const sampleBarcodes = [
    { code: '011110023452', label: 'Grilled Chicken Breast', category: 'Poultry' },
    { code: '748927028669', label: 'Gold Standard Whey Isolate', category: 'Protein' },
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

  // Recipe totals computation
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
        foodBrand: 'Custom Clay Recipe',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Warm Ambient Backdrop */}
      <div
        className="fixed inset-0 bg-[#1E1B26]/50 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl my-8 z-10">
        <ClayCard variant="hero" className="!p-6 sm:!p-8 max-h-[90vh] flex flex-col bg-white">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#ECE8DF]">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-[20px] bg-gradient-to-br from-[#FF7E62] to-[#FF5A36] flex items-center justify-center text-white shadow-[0_6px_16px_rgba(255,90,54,0.3)]">
                <UtensilsCrossed className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-nunito font-black text-2xl text-[#1E1B26]">
                  Food Ingestion Ledger
                </h2>
                <p className="font-nunito text-xs font-semibold text-[#645F73]">
                  Precision logging with raw vs. cooked weight conversion
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

          {/* Slot Selector & Segmented Pill Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 my-5">
            <div className="w-full sm:w-56">
              <ClaySelect
                label="Target Meal Slot"
                value={mealType}
                onChange={(e) => setMealType(e.target.value as MealType)}
                options={[
                  { value: 'breakfast', label: '🌅 Breakfast' },
                  { value: 'lunch', label: '☀️ Lunch' },
                  { value: 'dinner', label: '🌙 Dinner' },
                  { value: 'pre_post_workout', label: '⚡ Pre / Post Workout' },
                  { value: 'snack', label: '🍎 Snack' },
                ]}
              />
            </div>

            {/* Ingestion Mode Segmented Pills */}
            <div className="flex items-center p-1.5 rounded-[22px] bg-[#EFECE6] shadow-clayPressedSm gap-1 overflow-x-auto">
              {[
                { id: 'search', label: 'Database Search', icon: <Search className="h-3.5 w-3.5" /> },
                { id: 'quick', label: 'Quick Raw', icon: <Zap className="h-3.5 w-3.5" /> },
                { id: 'barcode', label: 'Barcode UPC', icon: <Barcode className="h-3.5 w-3.5" /> },
                { id: 'recipe', label: 'Recipe Builder', icon: <Sparkles className="h-3.5 w-3.5" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-[16px] font-nunito font-extrabold text-xs transition-all cursor-pointer select-none whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white text-[#FF5A36] shadow-clayCardSm'
                      : 'text-[#645F73] hover:text-[#1E1B26]'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Body */}
          <div className="flex-1 overflow-y-auto pr-1">
            {/* TAB 1: DATABASE SEARCH */}
            {activeTab === 'search' && (
              <div className="flex flex-col gap-5">
                <ClayInput
                  icon={<Search className="h-4 w-4" />}
                  placeholder="Search chicken breast, oats, greek yogurt, salmon, rice..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Results List */}
                  <div className="flex flex-col gap-2 max-h-72 overflow-y-auto p-1">
                    <span className="font-nunito text-xs font-bold uppercase tracking-wider text-[#645F73]">
                      Nutritional Database ({searchResults.length})
                    </span>
                    {searchResults.map((food) => {
                      const isSelected = selectedFood?.id === food.id;
                      return (
                        <div
                          key={food.id}
                          onClick={() => {
                            setSelectedFood(food);
                            setSearchQuantity(food.servingSizeAmount || 100);
                          }}
                          className={`p-3.5 rounded-[20px] transition-all cursor-pointer select-none flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#FFF5F2] border-2 border-[#FF5A36] shadow-clayCardSm'
                              : 'bg-[#FAF8F5] hover:bg-white border border-[#E8E2D8] shadow-sm'
                          }`}
                        >
                          <div>
                            <p className="font-nunito font-extrabold text-sm text-[#1E1B26]">
                              {food.name}
                            </p>
                            <p className="font-nunito text-[11px] font-semibold text-[#8C8799]">
                              {food.brand || 'Fresh Produce'} • {food.caloriesPer100g} kcal/100g
                            </p>
                          </div>
                          {isSelected && (
                            <div className="h-6 w-6 rounded-full bg-[#FF5A36] text-white flex items-center justify-center shrink-0">
                              <Check className="h-3.5 w-3.5" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Serving Size & Nutrition Calculator */}
                  {selectedFood && (
                    <div className="flex flex-col justify-between p-5 rounded-[28px] bg-gradient-to-br from-white via-[#FAF8F5] to-[#F7F4EF] border border-[#E8E2D8] shadow-clayCardSm">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-nunito font-extrabold text-xs uppercase tracking-wider text-[#FF5A36] bg-[#FF5A36]/10 px-3 py-1 rounded-full">
                            Active Portion
                          </span>
                          <span className="font-nunito text-xs font-bold text-[#8C8799]">
                            Base: 100g
                          </span>
                        </div>

                        <h4 className="font-nunito font-black text-lg text-[#1E1B26] mb-1">
                          {selectedFood.name}
                        </h4>

                        {/* Raw vs Cooked descriptor notice */}
                        {selectedFood.name.toLowerCase().includes('chicken') && (
                          <div className="my-2.5 p-2.5 rounded-[16px] bg-amber-50 border border-amber-200 text-[11px] font-nunito font-bold text-amber-900 flex items-center gap-2">
                            <Scale className="h-4 w-4 shrink-0 text-amber-600" />
                            <span>
                              100g raw yields ~75g cooked due to water loss. Select cooked descriptor if measuring after cooking.
                            </span>
                          </div>
                        )}

                        <div className="my-4">
                          <ClayInput
                            label="Serving Grams"
                            type="number"
                            min="1"
                            unit="grams"
                            value={searchQuantity}
                            onChange={(e) => setSearchQuantity(Math.max(1, Number(e.target.value)))}
                          />

                          {/* Quick Gram Presets */}
                          <div className="flex items-center gap-2 mt-2.5 overflow-x-auto pb-1">
                            {[50, 100, 150, 200, 250].map((amount) => (
                              <button
                                key={amount}
                                type="button"
                                onClick={() => setSearchQuantity(amount)}
                                className={`px-2.5 py-1 rounded-[12px] font-nunito text-xs font-bold transition-all cursor-pointer ${
                                  searchQuantity === amount
                                    ? 'bg-[#1E1B26] text-white shadow-sm'
                                    : 'bg-[#EFECE6] text-[#645F73] hover:bg-white'
                                }`}
                              >
                                {amount}g
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Computed Nutrition Tiles */}
                        <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-[20px] bg-[#EFECE6] shadow-clayPressedSm mb-4">
                          <div>
                            <span className="font-nunito text-[10px] font-bold text-[#645F73] uppercase block">
                              Calories
                            </span>
                            <span className="font-nunito font-black text-lg text-[#1E1B26]">
                              {searchComputed.calories}
                            </span>
                          </div>
                          <div>
                            <span className="font-nunito text-[10px] font-bold text-[#FF5A36] uppercase block">
                              Protein
                            </span>
                            <span className="font-nunito font-black text-lg text-[#FF5A36]">
                              {searchComputed.protein}g
                            </span>
                          </div>
                          <div>
                            <span className="font-nunito text-[10px] font-bold text-[#2563EB] uppercase block">
                              Carbs
                            </span>
                            <span className="font-nunito font-black text-lg text-[#2563EB]">
                              {searchComputed.carbs}g
                            </span>
                          </div>
                          <div>
                            <span className="font-nunito text-[10px] font-bold text-[#D97706] uppercase block">
                              Fat
                            </span>
                            <span className="font-nunito font-black text-lg text-[#D97706]">
                              {searchComputed.fat}g
                            </span>
                          </div>
                        </div>
                      </div>

                      <ClayButton
                        variant="primary"
                        disabled={isSubmitting}
                        onClick={handleLogSearchItem}
                        className="w-full"
                      >
                        {isSubmitting ? 'Logging...' : `Log ${searchComputed.calories} kcal to ${mealType}`}
                      </ClayButton>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: QUICK ENTRY */}
            {activeTab === 'quick' && (
              <form onSubmit={handleLogQuickItem} className="flex flex-col gap-4">
                <div className="p-5 rounded-[24px] bg-[#FAF8F5] border border-[#E8E2D8] shadow-sm">
                  <h4 className="font-nunito font-black text-base text-[#1E1B26] mb-1">
                    Direct Raw Numerical Ingestion
                  </h4>
                  <p className="font-nunito text-xs text-[#645F73] mb-4">
                    Fast-entry mode for quick calorie tracking without querying a database entity.
                  </p>

                  <div className="flex flex-col gap-3.5">
                    <ClayInput
                      label="Meal / Entity Name"
                      placeholder="e.g. Protein Pancake Stack or Restaurant Bowl"
                      value={quickName}
                      onChange={(e) => setQuickName(e.target.value)}
                      required
                    />

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <ClayInput
                        label="Calories"
                        type="number"
                        placeholder="520"
                        unit="kcal"
                        value={quickCalories}
                        onChange={(e) => setQuickCalories(e.target.value)}
                        required
                      />
                      <ClayInput
                        label="Protein"
                        type="number"
                        step="0.1"
                        placeholder="35"
                        unit="g"
                        value={quickProtein}
                        onChange={(e) => setQuickProtein(e.target.value)}
                      />
                      <ClayInput
                        label="Carbs"
                        type="number"
                        step="0.1"
                        placeholder="50"
                        unit="g"
                        value={quickCarbs}
                        onChange={(e) => setQuickCarbs(e.target.value)}
                      />
                      <ClayInput
                        label="Fat"
                        type="number"
                        step="0.1"
                        placeholder="16"
                        unit="g"
                        value={quickFat}
                        onChange={(e) => setQuickFat(e.target.value)}
                      />
                    </div>

                    <ClayInput
                      label="Serving Weight Estimate"
                      type="number"
                      unit="grams"
                      value={quickQuantity}
                      onChange={(e) => setQuickQuantity(e.target.value)}
                    />
                  </div>
                </div>

                <ClayButton
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting || !quickName || !quickCalories}
                  className="w-full mt-2"
                >
                  {isSubmitting ? 'Saving...' : `Log Quick Item to ${mealType}`}
                </ClayButton>
              </form>
            )}

            {/* TAB 3: BARCODE SCANNER (UPC) */}
            {activeTab === 'barcode' && (
              <div className="flex flex-col items-center gap-5 text-center">
                {/* Viewfinder Frame */}
                <div className="relative w-full max-w-md h-56 rounded-[32px] bg-[#16141D] shadow-clayPressed overflow-hidden flex flex-col items-center justify-center border-4 border-white">
                  <div className="absolute inset-x-8 top-8 bottom-8 border-2 border-dashed border-[#FF5A36]/70 rounded-[20px] pointer-events-none flex items-center justify-center">
                    <div className="absolute w-full h-1 bg-[#FF5A36] shadow-[0_0_14px_#FF5A36] animate-bounce" />
                  </div>
                  <Barcode className="h-16 w-16 text-white/30" />
                  <span className="font-nunito text-xs font-bold text-white/80 mt-2 z-10">
                    Align barcode within scanner frame
                  </span>
                </div>

                <div className="w-full max-w-md">
                  <p className="font-nunito text-xs font-bold text-[#645F73] uppercase tracking-wider mb-2">
                    Test Packaged Barcode Lookups (UPC/EAN)
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {sampleBarcodes.map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => handleSimulateScan(item.code)}
                        className="p-3 rounded-[20px] bg-white hover:bg-[#FAF8F5] border border-[#E8E2D8] shadow-clayCardSm text-left transition-all active:scale-95 cursor-pointer"
                      >
                        <span className="font-nunito font-extrabold text-xs text-[#1E1B26] block">
                          {item.label}
                        </span>
                        <div className="flex items-center justify-between mt-1">
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
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <ClayInput
                      label="Recipe Name"
                      value={recipeName}
                      onChange={(e) => setRecipeName(e.target.value)}
                    />
                  </div>
                  <div className="w-full sm:w-36">
                    <ClayInput
                      label="Total Servings"
                      type="number"
                      min="1"
                      value={recipeServings}
                      onChange={(e) => setRecipeServings(Math.max(1, Number(e.target.value)))}
                    />
                  </div>
                </div>

                <div>
                  <span className="font-nunito text-xs font-bold uppercase tracking-wider text-[#645F73] block mb-2">
                    Add Raw Components to Recipe:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {searchResults.slice(0, 6).map((food) => (
                      <button
                        key={food.id}
                        type="button"
                        onClick={() => handleAddIngredientToRecipe(food)}
                        className="px-3 py-1.5 rounded-full bg-white hover:bg-[#FAF8F5] text-xs font-nunito font-bold text-[#1E1B26] border border-[#E2DDD2] shadow-sm cursor-pointer transition-all active:scale-95"
                      >
                        + {food.name.split('(')[0].trim()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-[24px] bg-[#FAF8F5] border border-[#E8E2D8]">
                  <span className="font-nunito text-xs font-extrabold text-[#1E1B26] block mb-2">
                    Combined Ingredients ({recipeIngredients.length}):
                  </span>
                  {recipeIngredients.length === 0 ? (
                    <p className="font-nunito text-xs text-[#8C8799] italic">
                      Click ingredients above to combine them into an immutable saved meal.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                      {recipeIngredients.map((ing, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-white shadow-sm text-xs font-nunito border border-[#EAE6DD]"
                        >
                          <span className="font-bold text-[#1E1B26]">{ing.food.name}</span>
                          <div className="flex items-center gap-3">
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
                    <div className="mt-3 pt-3 border-t border-[#E8E2D8] flex items-center justify-between font-nunito text-xs font-extrabold text-[#1E1B26]">
                      <span>
                        Per Serving (1/{recipeServings}):{' '}
                        <strong className="text-[#FF5A36]">
                          {Math.round(recipeTotals.calories / recipeServings)} kcal
                        </strong>
                      </span>
                      <span className="text-[#645F73]">
                        P: {Math.round((recipeTotals.protein / recipeServings) * 10) / 10}g • C:{' '}
                        {Math.round((recipeTotals.carbs / recipeServings) * 10) / 10}g • F:{' '}
                        {Math.round((recipeTotals.fat / recipeServings) * 10) / 10}g
                      </span>
                    </div>
                  )}
                </div>

                <ClayButton
                  variant="primary"
                  disabled={isSubmitting || recipeIngredients.length === 0}
                  onClick={handleLogRecipe}
                  className="w-full mt-2"
                >
                  {isSubmitting ? 'Logging...' : `Log Recipe to ${mealType}`}
                </ClayButton>
              </div>
            )}
          </div>
        </ClayCard>
      </div>
    </div>
  );
};
