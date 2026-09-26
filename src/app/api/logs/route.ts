import { NextRequest, NextResponse } from 'next/server';
import { addFoodLog, getDailySummary } from '@/lib/db';
import { MealType } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId = 'user_clay_01',
      foodId,
      foodName,
      foodBrand,
      logDate,
      mealType,
      quantityGrams,
      computedCalories,
      computedProtein,
      computedCarbs,
      computedFat,
    } = body;

    if (!foodName || !logDate || !mealType || quantityGrams == null) {
      return NextResponse.json(
        { success: false, error: 'Missing required log fields' },
        { status: 400 }
      );
    }

    const logId = addFoodLog({
      userId,
      foodId,
      foodName,
      foodBrand,
      logDate,
      mealType: mealType as MealType,
      quantityGrams: Number(quantityGrams),
      computedCalories: Math.round(Number(computedCalories)),
      computedProtein: Math.round(Number(computedProtein) * 10) / 10,
      computedCarbs: Math.round(Number(computedCarbs) * 10) / 10,
      computedFat: Math.round(Number(computedFat) * 10) / 10,
    });

    const summary = getDailySummary(logDate, userId);

    return NextResponse.json({
      success: true,
      logId,
      summary,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
