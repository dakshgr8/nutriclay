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
    { code: '011110023452', label: 'Grilled Chicken Breast' },
    { code: '748927028669', label: 'Gold Standard Whey Isolate' },
    { code: '030000010204', label: 'Old Fashioned Oats' },
    { code: '894700010041', label: 'Plain Greek Yogurt' },
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
      {/* Blurred Clay Backdrop */}
      <div
        className="fixed inset-0 bg-[#332F3A]/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl my-8 z-10 animate-clay-breathe">
        <ClayCard variant="hero" className="!p-6 sm:!p-8 max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E2F2]">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-[20px] bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] flex items-center justify-center text-white shadow-clayButton">
                <UtensilsCrossed className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-nunito font-black text-2xl text-[#332F3A]">
                  Log Food & Nutrients
                </h2>
                <p className="font-nunito text-xs font-semibold text-[#635F69]">
                  Precision intake ledger with raw vs cooked state support
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="h-10 w-10 rounded-[16px] bg-white shadow-clayCardSm flex items-center justify-center text-[#635F69] hover:text-[#DB2777] transition-all cursor-pointer active:scale-90"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Meal Slot Selector & Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 my-5">
            {/* Slot Dropdown */}
            <div className="w-full sm:w-60">
              <ClaySelect
                label="Meal Slot"
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

            {/* Ingestion Mode Tabs */}
            <div className="flex items-center p-1.5 rounded-[22px] bg-[#EFEBF5] shadow-clayPressedSm gap-1 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('search')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-[16px] font-nunito font-bold text-xs transition-all cursor-pointer select-none whitespace-nowrap ${
                  activeTab === 'search'
                    ? 'bg-white text-[#7C3AED] shadow-clayCardSm font-extrabold'
                    : 'text-[#635F69] hover:text-[#332F3A]'
                }`}
              >
                <Search className="h-3.5 w-3.5" />
                Catalog Search
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('quick')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-[16px] font-nunito font-bold text-xs transition-all cursor-pointer select-none whitespace-nowrap ${
                  activeTab === 'quick'
                    ? 'bg-white text-[#7C3AED] shadow-clayCardSm font-extrabold'
                    : 'text-[#635F69] hover:text-[#332F3A]'
                }`}
              >
                <Zap className="h-3.5 w-3.5" />
                Quick Log
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('barcode')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-[16px] font-nunito font-bold text-xs transition-all cursor-pointer select-none whitespace-nowrap ${
                  activeTab === 'barcode'
                    ? 'bg-white text-[#7C3AED] shadow-clayCardSm font-extrabold'
                    : 'text-[#635F69] hover:text-[#332F3A]'
                }`}
              >
                <Barcode className="h-3.5 w-3.5" />
                Barcode UPC
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('recipe')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-[16px] font-nunito font-bold text-xs transition-all cursor-pointer select-none whitespace-nowrap ${
                  activeTab === 'recipe'
                    ? 'bg-white text-[#7C3AED] shadow-clayCardSm font-extrabold'
                    : 'text-[#635F69] hover:text-[#332F3A]'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Recipe Builder
              </button>
            </div>
          </div>

          {/* Modal Body / Tab Content */}
          <div className="flex-1 overflow-y-auto pr-1">
            {/* TAB 1: SEARCH DATABASE */}
            {activeTab === 'search' && (
              <div className="flex flex-col gap-5">
                <ClayInput
                  icon={<Search className="h-4 w-4" />}
                  placeholder="Search chicken breast, oats, yogurt, rice, salmon..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Results List */}
                  <div className="flex flex-col gap-2 max-h-72 overflow-y-auto p-1">
                    <span className="font-nunito text-xs font-bold uppercase tracking-wider text-[#635F69]">
                      Matching Foods ({searchResults.length})
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
                          className={`p-3 rounded-[20px] transition-all cursor-pointer select-none flex items-center justify-between ${
                            isSelected
                              ? 'bg-gradient-to-r from-[#A78BFA]/15 to-[#7C3AED]/15 border-2 border-[#7C3AED] shadow-clayCardSm'
                              : 'bg-white hover:bg-[#FAF8FF] border border-transparent shadow-clayCardSm'
                          }`}
                        >
                          <div>
                            <p className="font-nunito font-extrabold text-sm text-[#332F3A]">
                              {food.name}
                            </p>
                            <p className="font-nunito text-[11px] font-semibold text-[#635F69]">
                              {food.brand || 'Generic'} • {food.caloriesPer100g} kcal/100g
                            </p>
                          </div>
                          {isSelected && (
                            <div className="h-6 w-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center">
                              <Check className="h-3.5 w-3.5" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Quantity & Live Calculated Breakdown */}
                  {selectedFood && (
                    <div className="flex flex-col justify-between p-5 rounded-[28px] bg-gradient-to-br from-white/90 to-[#F7F4FD] border border-white shadow-clayCardSm">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-nunito font-extrabold text-xs uppercase tracking-wider text-[#7C3AED] bg-[#7C3AED]/10 px-3 py-1 rounded-full">
                            Serving Modifier
                          </span>
                          <span className="font-nunito text-xs font-bold text-[#635F69]">
                            Base: 100g
                          </span>
                        </div>

                        <h4 className="font-nunito font-black text-lg text-[#332F3A] mb-1">
                          {selectedFood.name}
                        </h4>

                        {/* Raw vs Cooked descriptor alert notice */}
                        {selectedFood.name.toLowerCase().includes('chicken') && (
                          <div className="my-2.5 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] font-nunito font-bold text-amber-800 flex items-center gap-2">
                            <Scale className="h-4 w-4 shrink-0" />
                            <span>
                              Note: Raw chicken yields ~75% cooked weight due to moisture loss.
                            </span>
                          </div>
                        )}

                        <div className="my-4">
                          <ClayInput
                            label="Logged Quantity"
                            type="number"
                            min="1"
                            unit="grams"
                            value={searchQuantity}
                            onChange={(e) => setSearchQuantity(Math.max(1, Number(e.target.value)))}
                          />

                          {/* Quick Quantity Presets */}
                          <div className="flex items-center gap-2 mt-2.5 overflow-x-auto pb-1">
                            {[50, 100, 150, 200, 250].map((amount) => (
                              <button
                                key={amount}
                                type="button"
                                onClick={() => setSearchQuantity(amount)}
                                className={`px-2.5 py-1 rounded-xl font-nunito text-xs font-bold transition-all cursor-pointer ${
                                  searchQuantity === amount
                                    ? 'bg-[#7C3AED] text-white shadow-sm'
                                    : 'bg-[#EFEBF5] text-[#635F69] hover:bg-white'
                                }`}
                              >
                                {amount}g
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Computed Output Pods */}
                        <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-[20px] bg-[#EFEBF5] shadow-clayPressedSm mb-4">
                          <div>
                            <span className="font-nunito text-[10px] font-bold text-[#635F69] uppercase block">
                              Calories
                            </span>
                            <span className="font-nunito font-black text-lg text-[#332F3A]">
                              {searchComputed.calories}
                            </span>
                          </div>
                          <div>
                            <span className="font-nunito text-[10px] font-bold text-[#DB2777] uppercase block">
                              Protein
                            </span>
                            <span className="font-nunito font-black text-lg text-[#DB2777]">
                              {searchComputed.protein}g
                            </span>
                          </div>
                          <div>
                            <span className="font-nunito text-[10px] font-bold text-[#0284C7] uppercase block">
                              Carbs
                            </span>
                            <span className="font-nunito font-black text-lg text-[#0284C7]">
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

            {/* TAB 2: QUICK RAW ENTRY */}
            {activeTab === 'quick' && (
              <form onSubmit={handleLogQuickItem} className="flex flex-col gap-4">
                <div className="p-4 rounded-[24px] bg-gradient-to-br from-white/90 to-[#FAF5FF] border border-white shadow-clayCardSm">
                  <h4 className="font-nunito font-black text-base text-[#332F3A] mb-1">
                    Direct Numeric Fast-Entry
                  </h4>
                  <p className="font-nunito text-xs text-[#635F69] mb-4">
                    Instantly log calories and macros from restaurant menus or packaging without a database search.
                  </p>

                  <div className="flex flex-col gap-3.5">
                    <ClayInput
                      label="Meal / Item Name"
                      placeholder="e.g. Avocado Toast with Poached Eggs"
                      value={quickName}
                      onChange={(e) => setQuickName(e.target.value)}
                      required
                    />

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                      label="Estimated Portion Weight"
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

            {/* TAB 3: BARCODE SCANNER (UPC/EAN) */}
            {activeTab === 'barcode' && (
              <div className="flex flex-col items-center gap-5 text-center">
                {/* Simulated Camera Viewfinder Frame */}
                <div className="relative w-full max-w-md h-56 rounded-[32px] bg-[#1E1B24] shadow-clayPressed overflow-hidden flex flex-col items-center justify-center border-4 border-white">
                  <div className="absolute inset-x-8 top-8 bottom-8 border-2 border-dashed border-[#7C3AED]/70 rounded-[20px] pointer-events-none flex items-center justify-center">
                    {/* Laser Scanner Line */}
                    <div className="absolute w-full h-1 bg-[#DB2777] shadow-[0_0_12px_#DB2777] animate-bounce" />
                  </div>
                  <Barcode className="h-16 w-16 text-white/30" />
                  <span className="font-nunito text-xs font-bold text-white/80 mt-2 z-10">
                    Align Barcode within viewfinder
                  </span>
                </div>

                <div className="w-full max-w-md">
                  <p className="font-nunito text-xs font-bold text-[#635F69] uppercase tracking-wider mb-2">
                    Test Packaged Barcode Lookups (UPC/EAN)
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {sampleBarcodes.map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => handleSimulateScan(item.code)}
                        className="p-3 rounded-[20px] bg-white hover:bg-[#FAF8FF] border border-[#E5DEEF] shadow-clayCardSm text-left transition-all active:scale-95 cursor-pointer"
                      >
                        <span className="font-nunito font-extrabold text-xs text-[#332F3A] block">
                          {item.label}
                        </span>
                        <span className="font-mono text-[10px] text-[#7C3AED]">
                          {item.code}
                        </span>
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
                      label="Recipe / Meal Name"
                      value={recipeName}
                      onChange={(e) => setRecipeName(e.target.value)}
                    />
                  </div>
                  <div className="w-full sm:w-36">
                    <ClayInput
                      label="Servings"
                      type="number"
                      min="1"
                      value={recipeServings}
                      onChange={(e) => setRecipeServings(Math.max(1, Number(e.target.value)))}
                    />
                  </div>
                </div>

                {/* Add Quick Ingredients from Catalog */}
                <div>
                  <span className="font-nunito text-xs font-bold uppercase tracking-wider text-[#635F69] block mb-2">
                    Add Raw Ingredients to Recipe:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {searchResults.slice(0, 6).map((food) => (
                      <button
                        key={food.id}
                        type="button"
                        onClick={() => handleAddIngredientToRecipe(food)}
                        className="px-3 py-1.5 rounded-full bg-white hover:bg-[#FAF8FF] text-xs font-nunito font-bold text-[#332F3A] border border-[#DDD7E8] shadow-clayCardSm cursor-pointer transition-all active:scale-95"
                      >
                        + {food.name.split('(')[0].trim()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ingredient Ledger */}
                <div className="p-4 rounded-[24px] bg-[#FAF8FF] border border-[#ECE7F4]">
                  <span className="font-nunito text-xs font-extrabold text-[#332F3A] block mb-2">
                    Included Ingredients ({recipeIngredients.length}):
                  </span>
                  {recipeIngredients.length === 0 ? (
                    <p className="font-nunito text-xs text-[#8E8A96] italic">
                      Click ingredients above to combine them into a single saved recipe.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                      {recipeIngredients.map((ing, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-xl bg-white shadow-sm text-xs font-nunito"
                        >
                          <span className="font-bold text-[#332F3A]">{ing.food.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-[#635F69]">{ing.quantityGrams}g</span>
                            <button
                              type="button"
                              onClick={() =>
                                setRecipeIngredients((prev) => prev.filter((_, i) => i !== idx))
                              }
                              className="text-rose-500 hover:text-rose-700 font-bold"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Summary Bar */}
                  {recipeIngredients.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#ECE7F4] flex items-center justify-between font-nunito text-xs font-extrabold text-[#332F3A]">
                      <span>
                        Per Serving (1/{recipeServings}):{' '}
                        <strong className="text-[#7C3AED]">
                          {Math.round(recipeTotals.calories / recipeServings)} kcal
                        </strong>
                      </span>
                      <span className="text-[#635F69]">
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
