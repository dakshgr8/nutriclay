export type Gender = 'male' | 'female';

export type GoalType = 'cut' | 'maintain' | 'bulk';

export type DietModel = 'high_protein' | 'balanced' | 'keto' | 'custom';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_post_workout';

export interface UserProfile {
  id: string;
  email: string;
  birthDate: string; // YYYY-MM-DD
  age: number;
  gender: Gender;
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  activityLevel: number; // 1.2 to 1.9
  goal: GoalType;
}

export interface DailyGoal {
  id: string;
  userId: string;
  targetCalories: number;
  targetProteinG: number;
  targetCarbsG: number;
  targetFatsG: number;
  waterMl: number;
  effectiveFrom: string;
  dietModel?: DietModel;
}

export interface FoodItem {
  id: string;
  barcode?: string;
  name: string;
  brand?: string;
  servingSizeAmount: number;
  servingSizeUnit: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fiberPer100g: number;
  isCustom: boolean;
  category: 'poultry' | 'meat' | 'fish' | 'dairy' | 'grains' | 'fruits' | 'vegetables' | 'fats' | 'supplements' | 'snacks' | 'other';
  createdBy?: string;
}

export interface FoodLog {
  id: string;
  userId: string;
  foodId?: string;
  foodName: string;
  foodBrand?: string;
  logDate: string; // YYYY-MM-DD
  mealType: MealType;
  quantityGrams: number;
  computedCalories: number;
  computedProtein: number;
  computedCarbs: number;
  computedFat: number;
  createdAt: string;
}

export interface DailySummary {
  date: string;
  targetCalories: number;
  targetProteinG: number;
  targetCarbsG: number;
  targetFatsG: number;
  targetWaterMl: number;
  
  consumedCalories: number;
  consumedProteinG: number;
  consumedCarbsG: number;
  consumedFatsG: number;
  consumedWaterMl: number;
  exerciseBurnKcal: number;
  
  remainingCalories: number;
  remainingProteinG: number;
  remainingCarbsG: number;
  remainingFatsG: number;
  remainingWaterMl: number;
  
  logs: FoodLog[];
}
