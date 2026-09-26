import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { UserProfile, DailyGoal, FoodItem, FoodLog, DailySummary, MealType } from './types';
import { calculateBMR, calculateTDEE, calculateTargetCalories, calculateMacronutrients } from './calculations';

// Ensure data folder exists (uses /tmp on Vercel serverless to avoid EROFS error)
const isVercel = process.env.VERCEL === '1' || Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);
const dataDir = isVercel ? '/tmp/nutriclay-data' : path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
  } catch (err) {
    console.error('Failed to create data dir', err);
  }
}

const dbPath = path.join(dataDir, 'nutriclay.db');
let dbInstance: DatabaseSync | null = null;

export function getDatabase(): DatabaseSync {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(dbPath);
    initDatabase(dbInstance);
  }
  return dbInstance;
}

function initDatabase(db: DatabaseSync) {
  // Create tables matching PostgreSQL relational architecture
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      birth_date TEXT NOT NULL,
      gender TEXT NOT NULL,
      height_cm REAL NOT NULL,
      current_weight_kg REAL NOT NULL,
      target_weight_kg REAL,
      activity_level REAL NOT NULL,
      goal TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS daily_goals (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      target_calories INTEGER NOT NULL,
      target_protein_g REAL NOT NULL,
      target_carbs_g REAL NOT NULL,
      target_fats_g REAL NOT NULL,
      water_ml INTEGER DEFAULT 2500,
      effective_from TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS foods (
      id TEXT PRIMARY KEY,
      barcode TEXT UNIQUE,
      name TEXT NOT NULL,
      brand TEXT,
      serving_size_amount REAL NOT NULL,
      serving_size_unit TEXT NOT NULL,
      calories_per_100g INTEGER NOT NULL,
      protein_per_100g REAL NOT NULL,
      carbs_per_100g REAL NOT NULL,
      fat_per_100g REAL NOT NULL,
      fiber_per_100g REAL DEFAULT 0,
      is_custom INTEGER DEFAULT 0,
      category TEXT DEFAULT 'other',
      created_by TEXT,
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS food_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      food_id TEXT,
      food_name TEXT NOT NULL,
      food_brand TEXT,
      log_date TEXT NOT NULL,
      meal_type TEXT NOT NULL,
      quantity_grams REAL NOT NULL,
      computed_calories INTEGER NOT NULL,
      computed_protein REAL NOT NULL,
      computed_carbs REAL NOT NULL,
      computed_fat REAL NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (food_id) REFERENCES foods(id)
    );

    CREATE TABLE IF NOT EXISTS water_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      log_date TEXT NOT NULL,
      amount_ml INTEGER NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  seedInitialData(db);
}

function seedInitialData(db: DatabaseSync) {
  // Check if foods already seeded
  const foodCountRow = db.prepare('SELECT COUNT(*) as count FROM foods').get() as { count: number };
  if (foodCountRow && foodCountRow.count > 0) {
    return;
  }

  // 1. Seed Default User
  const defaultUser: UserProfile = {
    id: 'user_clay_01',
    email: 'alex.rivera@nutriclay.app',
    birthDate: '1998-05-14',
    age: 28,
    gender: 'male',
    heightCm: 180,
    currentWeightKg: 82.5,
    targetWeightKg: 78.0,
    activityLevel: 1.55, // Moderately Active
    goal: 'cut', // Fat Loss Deficit
  };

  db.prepare(`
    INSERT INTO users (id, email, birth_date, gender, height_cm, current_weight_kg, target_weight_kg, activity_level, goal)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    defaultUser.id,
    defaultUser.email,
    defaultUser.birthDate,
    defaultUser.gender,
    defaultUser.heightCm,
    defaultUser.currentWeightKg,
    defaultUser.targetWeightKg,
    defaultUser.activityLevel,
    defaultUser.goal
  );

  // 2. Compute and Seed Daily Target
  const bmr = calculateBMR(defaultUser.gender, defaultUser.currentWeightKg, defaultUser.heightCm, defaultUser.age);
  const tdee = calculateTDEE(bmr, defaultUser.activityLevel);
  const targetCalories = calculateTargetCalories(tdee, defaultUser.goal);
  const macros = calculateMacronutrients(targetCalories, 'high_protein');

  db.prepare(`
    INSERT INTO daily_goals (id, user_id, target_calories, target_protein_g, target_carbs_g, target_fats_g, water_ml, effective_from)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'goal_clay_01',
    defaultUser.id,
    targetCalories,
    macros.proteinG,
    macros.carbsG,
    macros.fatsG,
    3000,
    '2026-01-01'
  );

  // 3. Seed Comprehensive Nutritional Food Database
  const stapleFoods: Array<Omit<FoodItem, 'isCustom'> & { isCustom: number }> = [
    {
      id: 'food_chicken_raw',
      barcode: '011110023451',
      name: 'Chicken Breast (Raw, Skinless)',
      brand: 'Butcher Select',
      servingSizeAmount: 150,
      servingSizeUnit: 'g',
      caloriesPer100g: 120,
      proteinPer100g: 22.5,
      carbsPer100g: 0.0,
      fatPer100g: 2.6,
      fiberPer100g: 0.0,
      category: 'poultry',
      isCustom: 0,
    },
    {
      id: 'food_chicken_grilled',
      barcode: '011110023452',
      name: 'Chicken Breast (Grilled / Cooked)',
      brand: 'NutriKitchen',
      servingSizeAmount: 120,
      servingSizeUnit: 'g',
      caloriesPer100g: 165,
      proteinPer100g: 31.0,
      carbsPer100g: 0.0,
      fatPer100g: 3.6,
      fiberPer100g: 0.0,
      category: 'poultry',
      isCustom: 0,
    },
    {
      id: 'food_rolled_oats',
      barcode: '030000010204',
      name: 'Old Fashioned Rolled Oats',
      brand: 'Quaker Heritage',
      servingSizeAmount: 50,
      servingSizeUnit: 'g',
      caloriesPer100g: 389,
      proteinPer100g: 16.9,
      carbsPer100g: 66.3,
      fatPer100g: 6.9,
      fiberPer100g: 10.6,
      category: 'grains',
      isCustom: 0,
    },
    {
      id: 'food_greek_yogurt',
      barcode: '894700010041',
      name: '0% Plain Greek Yogurt',
      brand: 'Chobani Pure',
      servingSizeAmount: 170,
      servingSizeUnit: 'g',
      caloriesPer100g: 59,
      proteinPer100g: 10.3,
      carbsPer100g: 3.6,
      fatPer100g: 0.4,
      fiberPer100g: 0.0,
      category: 'dairy',
      isCustom: 0,
    },
    {
      id: 'food_whey_isolate',
      barcode: '748927028669',
      name: 'Gold Standard 100% Whey Isolate (Vanilla)',
      brand: 'Optimum Nutrition',
      servingSizeAmount: 31,
      servingSizeUnit: 'g',
      caloriesPer100g: 387,
      proteinPer100g: 80.6,
      carbsPer100g: 6.5,
      fatPer100g: 3.2,
      fiberPer100g: 1.0,
      category: 'supplements',
      isCustom: 0,
    },
    {
      id: 'food_jasmine_rice',
      barcode: '070383000123',
      name: 'Jasmine Rice (Steamed / Cooked)',
      brand: 'Royal Aroma',
      servingSizeAmount: 150,
      servingSizeUnit: 'g',
      caloriesPer100g: 130,
      proteinPer100g: 2.7,
      carbsPer100g: 28.2,
      fatPer100g: 0.3,
      fiberPer100g: 0.4,
      category: 'grains',
      isCustom: 0,
    },
    {
      id: 'food_avocado',
      barcode: '033383401201',
      name: 'Fresh Hass Avocado',
      brand: 'Produce Organics',
      servingSizeAmount: 100,
      servingSizeUnit: 'g',
      caloriesPer100g: 160,
      proteinPer100g: 2.0,
      carbsPer100g: 8.5,
      fatPer100g: 14.7,
      fiberPer100g: 6.7,
      category: 'fats',
      isCustom: 0,
    },
    {
      id: 'food_salmon_fillet',
      barcode: '022340055102',
      name: 'Wild Atlantic Salmon (Pan-Seared)',
      brand: 'Ocean Fresh',
      servingSizeAmount: 150,
      servingSizeUnit: 'g',
      caloriesPer100g: 208,
      proteinPer100g: 22.1,
      carbsPer100g: 0.0,
      fatPer100g: 13.4,
      fiberPer100g: 0.0,
      category: 'fish',
      isCustom: 0,
    },
    {
      id: 'food_eggs_large',
      barcode: '041220789012',
      name: 'Pasture-Raised Grade A Large Eggs',
      brand: 'Vital Farms',
      servingSizeAmount: 100,
      servingSizeUnit: 'g',
      caloriesPer100g: 143,
      proteinPer100g: 12.6,
      carbsPer100g: 0.7,
      fatPer100g: 9.5,
      fiberPer100g: 0.0,
      category: 'dairy',
      isCustom: 0,
    },
    {
      id: 'food_almonds',
      barcode: '041570056123',
      name: 'Roasted Unsalted Whole Almonds',
      brand: 'Blue Diamond',
      servingSizeAmount: 28,
      servingSizeUnit: 'g',
      caloriesPer100g: 579,
      proteinPer100g: 21.2,
      carbsPer100g: 21.6,
      fatPer100g: 49.9,
      fiberPer100g: 12.5,
      category: 'snacks',
      isCustom: 0,
    },
    {
      id: 'food_broccoli',
      barcode: '033383002341',
      name: 'Fresh Steamed Broccoli Florets',
      brand: 'Garden Crisp',
      servingSizeAmount: 150,
      servingSizeUnit: 'g',
      caloriesPer100g: 35,
      proteinPer100g: 2.4,
      carbsPer100g: 7.2,
      fatPer100g: 0.4,
      fiberPer100g: 2.6,
      category: 'vegetables',
      isCustom: 0,
    },
    {
      id: 'food_banana',
      barcode: '040110000001',
      name: 'Fresh Cavendish Banana',
      brand: 'Chiquita',
      servingSizeAmount: 118,
      servingSizeUnit: 'g',
      caloriesPer100g: 89,
      proteinPer100g: 1.1,
      carbsPer100g: 22.8,
      fatPer100g: 0.3,
      fiberPer100g: 2.6,
      category: 'fruits',
      isCustom: 0,
    },
    {
      id: 'food_olive_oil',
      barcode: '018340002134',
      name: 'Extra Virgin Cold Pressed Olive Oil',
      brand: 'California Olive Ranch',
      servingSizeAmount: 15,
      servingSizeUnit: 'ml',
      caloriesPer100g: 884,
      proteinPer100g: 0.0,
      carbsPer100g: 0.0,
      fatPer100g: 100.0,
      fiberPer100g: 0.0,
      category: 'fats',
      isCustom: 0,
    },
  ];

  const insertFood = db.prepare(`
    INSERT INTO foods (
      id, barcode, name, brand, serving_size_amount, serving_size_unit,
      calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
      is_custom, category
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const item of stapleFoods) {
    insertFood.run(
      item.id,
      item.barcode || null,
      item.name,
      item.brand || null,
      item.servingSizeAmount,
      item.servingSizeUnit,
      item.caloriesPer100g,
      item.proteinPer100g,
      item.carbsPer100g,
      item.fatPer100g,
      item.fiberPer100g,
      item.isCustom,
      item.category
    );
  }

  // 4. Seed Today's Sample Logs
  const today = new Date().toISOString().split('T')[0];
  const sampleLogs = [
    {
      id: 'log_01',
      userId: defaultUser.id,
      foodId: 'food_rolled_oats',
      foodName: 'Old Fashioned Rolled Oats',
      foodBrand: 'Quaker Heritage',
      logDate: today,
      mealType: 'breakfast' as MealType,
      quantityGrams: 60,
      computedCalories: 233,
      computedProtein: 10.1,
      computedCarbs: 39.8,
      computedFat: 4.1,
    },
    {
      id: 'log_02',
      userId: defaultUser.id,
      foodId: 'food_greek_yogurt',
      foodName: '0% Plain Greek Yogurt',
      foodBrand: 'Chobani Pure',
      logDate: today,
      mealType: 'breakfast' as MealType,
      quantityGrams: 200,
      computedCalories: 118,
      computedProtein: 20.6,
      computedCarbs: 7.2,
      computedFat: 0.8,
    },
    {
      id: 'log_03',
      userId: defaultUser.id,
      foodId: 'food_chicken_grilled',
      foodName: 'Chicken Breast (Grilled / Cooked)',
      foodBrand: 'NutriKitchen',
      logDate: today,
      mealType: 'lunch' as MealType,
      quantityGrams: 180,
      computedCalories: 297,
      computedProtein: 55.8,
      computedCarbs: 0.0,
      computedFat: 6.5,
    },
    {
      id: 'log_04',
      userId: defaultUser.id,
      foodId: 'food_jasmine_rice',
      foodName: 'Jasmine Rice (Steamed / Cooked)',
      foodBrand: 'Royal Aroma',
      logDate: today,
      mealType: 'lunch' as MealType,
      quantityGrams: 180,
      computedCalories: 234,
      computedProtein: 4.9,
      computedCarbs: 50.8,
      computedFat: 0.5,
    },
    {
      id: 'log_05',
      userId: defaultUser.id,
      foodId: 'food_whey_isolate',
      foodName: 'Gold Standard 100% Whey Isolate (Vanilla)',
      foodBrand: 'Optimum Nutrition',
      logDate: today,
      mealType: 'pre_post_workout' as MealType,
      quantityGrams: 35,
      computedCalories: 135,
      computedProtein: 28.2,
      computedCarbs: 2.3,
      computedFat: 1.1,
    },
    {
      id: 'log_06',
      userId: defaultUser.id,
      foodId: 'food_banana',
      foodName: 'Fresh Cavendish Banana',
      foodBrand: 'Chiquita',
      logDate: today,
      mealType: 'pre_post_workout' as MealType,
      quantityGrams: 115,
      computedCalories: 102,
      computedProtein: 1.3,
      computedCarbs: 26.2,
      computedFat: 0.3,
    },
  ];

  const insertLog = db.prepare(`
    INSERT INTO food_logs (
      id, user_id, food_id, food_name, food_brand, log_date, meal_type,
      quantity_grams, computed_calories, computed_protein, computed_carbs, computed_fat
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const log of sampleLogs) {
    insertLog.run(
      log.id,
      log.userId,
      log.foodId,
      log.foodName,
      log.foodBrand,
      log.logDate,
      log.mealType,
      log.quantityGrams,
      log.computedCalories,
      log.computedProtein,
      log.computedCarbs,
      log.computedFat
    );
  }

  // Seed Water Log for today
  db.prepare(`
    INSERT INTO water_logs (id, user_id, log_date, amount_ml)
    VALUES (?, ?, ?, ?)
  `).run('water_01', defaultUser.id, today, 1750);
}

function toPlainObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function getUserProfile(userId = 'user_clay_01'): UserProfile {
  const db = getDatabase();
  const row = db.prepare(`
    SELECT id, email, birth_date as birthDate, gender, height_cm as heightCm,
           current_weight_kg as currentWeightKg, target_weight_kg as targetWeightKg,
           activity_level as activityLevel, goal
    FROM users WHERE id = ?
  `).get(userId) as any;

  if (!row) {
    throw new Error('User not found');
  }

  const birthYear = new Date(row.birthDate).getFullYear();
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;

  return toPlainObject({
    ...row,
    age,
  });
}

export function updateUserProfile(
  userId: string,
  profile: Partial<Omit<UserProfile, 'id' | 'email' | 'age'>>
) {
  const db = getDatabase();
  const current = getUserProfile(userId);
  const updated = { ...current, ...profile };

  db.prepare(`
    UPDATE users SET
      gender = ?,
      height_cm = ?,
      current_weight_kg = ?,
      target_weight_kg = ?,
      activity_level = ?,
      goal = ?
    WHERE id = ?
  `).run(
    updated.gender,
    updated.heightCm,
    updated.currentWeightKg,
    updated.targetWeightKg,
    updated.activityLevel,
    updated.goal,
    userId
  );

  // Recalculate and update daily goals dynamically
  const bmr = calculateBMR(updated.gender, updated.currentWeightKg, updated.heightCm, updated.age);
  const tdee = calculateTDEE(bmr, updated.activityLevel);
  const targetCalories = calculateTargetCalories(tdee, updated.goal);
  const macros = calculateMacronutrients(targetCalories, 'high_protein');

  db.prepare(`
    UPDATE daily_goals SET
      target_calories = ?,
      target_protein_g = ?,
      target_carbs_g = ?,
      target_fats_g = ?
    WHERE user_id = ?
  `).run(
    targetCalories,
    macros.proteinG,
    macros.carbsG,
    macros.fatsG,
    userId
  );
}

export function getDailySummary(dateString: string, userId = 'user_clay_01'): DailySummary {
  const db = getDatabase();

  const goalRow = db.prepare(`
    SELECT target_calories as targetCalories,
           target_protein_g as targetProteinG,
           target_carbs_g as targetCarbsG,
           target_fats_g as targetFatsG,
           water_ml as targetWaterMl
    FROM daily_goals
    WHERE user_id = ?
    ORDER BY effective_from DESC LIMIT 1
  `).get(userId) as any;

  const targetCalories = goalRow?.targetCalories ?? 2200;
  const targetProteinG = goalRow?.targetProteinG ?? 200;
  const targetCarbsG = goalRow?.targetCarbsG ?? 180;
  const targetFatsG = goalRow?.targetFatsG ?? 60;
  const targetWaterMl = goalRow?.targetWaterMl ?? 3000;

  const logs = db.prepare(`
    SELECT id, user_id as userId, food_id as foodId, food_name as foodName,
           food_brand as foodBrand, log_date as logDate, meal_type as mealType,
           quantity_grams as quantityGrams, computed_calories as computedCalories,
           computed_protein as computedProtein, computed_carbs as computedCarbs,
           computed_fat as computedFat, created_at as createdAt
    FROM food_logs
    WHERE user_id = ? AND log_date = ?
    ORDER BY created_at ASC
  `).all(userId, dateString) as any as FoodLog[];

  let consumedCalories = 0;
  let consumedProteinG = 0;
  let consumedCarbsG = 0;
  let consumedFatsG = 0;

  for (const log of logs) {
    consumedCalories += log.computedCalories;
    consumedProteinG += log.computedProtein;
    consumedCarbsG += log.computedCarbs;
    consumedFatsG += log.computedFat;
  }

  // Water logs sum
  const waterRow = db.prepare(`
    SELECT SUM(amount_ml) as totalWater
    FROM water_logs
    WHERE user_id = ? AND log_date = ?
  `).get(userId, dateString) as { totalWater: number | null };

  const consumedWaterMl = waterRow?.totalWater || 0;
  const exerciseBurnKcal = 0; // Default zero unless logged

  return toPlainObject({
    date: dateString,
    targetCalories,
    targetProteinG,
    targetCarbsG,
    targetFatsG,
    targetWaterMl,
    consumedCalories,
    consumedProteinG: Math.round(consumedProteinG * 10) / 10,
    consumedCarbsG: Math.round(consumedCarbsG * 10) / 10,
    consumedFatsG: Math.round(consumedFatsG * 10) / 10,
    consumedWaterMl,
    exerciseBurnKcal,
    remainingCalories: targetCalories - consumedCalories + exerciseBurnKcal,
    remainingProteinG: Math.round((targetProteinG - consumedProteinG) * 10) / 10,
    remainingCarbsG: Math.round((targetCarbsG - consumedCarbsG) * 10) / 10,
    remainingFatsG: Math.round((targetFatsG - consumedFatsG) * 10) / 10,
    remainingWaterMl: Math.max(0, targetWaterMl - consumedWaterMl),
    logs,
  });
}

export function searchFoods(query: string): FoodItem[] {
  const db = getDatabase();
  const pattern = `%${query.trim().toLowerCase()}%`;
  const rows = db.prepare(`
    SELECT id, barcode, name, brand, serving_size_amount as servingSizeAmount,
           serving_size_unit as servingSizeUnit, calories_per_100g as caloriesPer100g,
           protein_per_100g as proteinPer100g, carbs_per_100g as carbsPer100g,
           fat_per_100g as fatPer100g, fiber_per_100g as fiberPer100g,
           is_custom as isCustom, category
    FROM foods
    WHERE LOWER(name) LIKE ? OR LOWER(brand) LIKE ? OR barcode LIKE ?
    LIMIT 25
  `).all(pattern, pattern, pattern) as any[];

  return toPlainObject(rows.map((r) => ({
    ...r,
    isCustom: Boolean(r.isCustom),
  })));
}

export function addFoodLog(entry: {
  userId?: string;
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
}) {
  const db = getDatabase();
  const id = `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const userId = entry.userId || 'user_clay_01';

  db.prepare(`
    INSERT INTO food_logs (
      id, user_id, food_id, food_name, food_brand, log_date, meal_type,
      quantity_grams, computed_calories, computed_protein, computed_carbs, computed_fat
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    userId,
    entry.foodId || null,
    entry.foodName,
    entry.foodBrand || null,
    entry.logDate,
    entry.mealType,
    entry.quantityGrams,
    entry.computedCalories,
    entry.computedProtein,
    entry.computedCarbs,
    entry.computedFat
  );

  return id;
}

export function deleteFoodLog(logId: string) {
  const db = getDatabase();
  db.prepare('DELETE FROM food_logs WHERE id = ?').run(logId);
}

export function addWaterLog(amountMl: number, dateString: string, userId = 'user_clay_01') {
  const db = getDatabase();
  const id = `water_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  db.prepare(`
    INSERT INTO water_logs (id, user_id, log_date, amount_ml)
    VALUES (?, ?, ?, ?)
  `).run(id, userId, dateString, amountMl);
  return id;
}
