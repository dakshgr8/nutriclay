import { NextRequest, NextResponse } from 'next/server';
import { getDailySummary, getUserProfile } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const userId = searchParams.get('userId') || 'user_clay_01';

    const summary = getDailySummary(date, userId);
    const profile = getUserProfile(userId);

    return NextResponse.json({
      success: true,
      summary,
      profile,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
