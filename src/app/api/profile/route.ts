import { NextRequest, NextResponse } from 'next/server';
import { updateUserProfile, getUserProfile, getDailySummary } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId = 'user_clay_01', gender, heightCm, currentWeightKg, targetWeightKg, activityLevel, goal, date } = body;

    updateUserProfile(userId, {
      ...(gender && { gender }),
      ...(heightCm && { heightCm: Number(heightCm) }),
      ...(currentWeightKg && { currentWeightKg: Number(currentWeightKg) }),
      ...(targetWeightKg && { targetWeightKg: Number(targetWeightKg) }),
      ...(activityLevel && { activityLevel: Number(activityLevel) }),
      ...(goal && { goal }),
    });

    const profile = getUserProfile(userId);
    const logDate = date || new Date().toISOString().split('T')[0];
    const summary = getDailySummary(logDate, userId);

    return NextResponse.json({
      success: true,
      profile,
      summary,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
