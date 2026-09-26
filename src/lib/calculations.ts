import { Gender, GoalType, DietModel } from './types';

/**
 * Calculates Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation.
 * Men: BMR = 10 * weight (kg) + 6.25 * height (cm) - 5 * age + 5
 * Women: BMR = 10 * weight (kg) + 6.25 * height (cm) - 5 * age - 161
 */
export function calculateBMR(
  gender: Gender,
  weightKg: number,
  heightCm: number,
  age: number
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === 'male' ? Math.round(base + 5) : Math.round(base - 161);
}

/**
 * Calculates Total Daily Energy Expenditure (TDEE).
 * TDEE = BMR * Activity Multiplier
 */
export function calculateTDEE(bmr: number, activityLevel: number): number {
  return Math.round(bmr * activityLevel);
}

/**
 * Calculates target calories based on user objective.
 * - 'cut': TDEE - 500 kcal (fat loss deficit)
 * - 'maintain': TDEE
 * - 'bulk': TDEE + 300 kcal (lean hypertrophy surplus)
 */
export function calculateTargetCalories(tdee: number, goal: GoalType): number {
  switch (goal) {
    case 'cut':
      return Math.max(1200, tdee - 500);
    case 'bulk':
      return tdee + 300;
    case 'maintain':
    default:
      return tdee;
  }
}

export interface MacroPercentages {
  protein: number;
  carbs: number;
  fats: number;
}

export const DIET_MODEL_PRESETS: Record<DietModel, MacroPercentages> = {
  high_protein: { protein: 40, carbs: 35, fats: 25 },
  balanced: { protein: 30, carbs: 40, fats: 30 },
  keto: { protein: 25, carbs: 5, fats: 70 },
  custom: { protein: 30, carbs: 40, fats: 30 },
};

/**
 * Splits adjusted daily calories into targets for Protein (4 kcal/g),
 * Carbohydrates (4 kcal/g), and Fats (9 kcal/g).
 */
export function calculateMacronutrients(
  targetCalories: number,
  dietModel: DietModel = 'high_protein',
  customPercentages?: MacroPercentages
): { proteinG: number; carbsG: number; fatsG: number } {
  const percentages = customPercentages || DIET_MODEL_PRESETS[dietModel];

  // Calories allocated
  const proteinKcal = targetCalories * (percentages.protein / 100);
  const carbsKcal = targetCalories * (percentages.carbs / 100);
  const fatsKcal = targetCalories * (percentages.fats / 100);

  return {
    proteinG: Math.round(proteinKcal / 4),
    carbsG: Math.round(carbsKcal / 4),
    fatsG: Math.round(fatsKcal / 9),
  };
}

/**
 * Computes individual food nutritional quantities from base values (per 100g).
 * Factor = quantityGrams / 100
 */
export function computeNutrition(
  quantityGrams: number,
  baseCaloriesPer100g: number,
  baseProteinPer100g: number,
  baseCarbsPer100g: number,
  baseFatPer100g: number
): {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
} {
  const factor = quantityGrams / 100;
  return {
    calories: Math.round(baseCaloriesPer100g * factor),
    protein: Math.round(baseProteinPer100g * factor * 10) / 10,
    carbs: Math.round(baseCarbsPer100g * factor * 10) / 10,
    fat: Math.round(baseFatPer100g * factor * 10) / 10,
  };
}

/**
 * Resolves standard unit conversion to grams.
 */
export function convertToGrams(amount: number, unit: string): number {
  const normalized = unit.toLowerCase().trim();
  switch (normalized) {
    case 'oz':
    case 'ounce':
      return amount * 28.3495;
    case 'lb':
    case 'pound':
      return amount * 453.592;
    case 'ml': // assume ~1g/ml density for standard liquids
      return amount;
    case 'cup':
      return amount * 240;
    case 'tbsp':
    case 'tablespoon':
      return amount * 15;
    case 'tsp':
    case 'teaspoon':
      return amount * 5;
    case 'g':
    case 'gram':
    default:
      return amount;
  }
}
