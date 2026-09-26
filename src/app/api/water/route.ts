import { NextRequest, NextResponse } from 'next/server';
import { addWaterLog, getDailySummary } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amountMl, logDate, userId = 'user_clay_01' } = body;

    if (!amountMl || !logDate) {
      return NextResponse.json(
        { success: false, error: 'Missing amount or date' },
        { status: 400 }
      );
    }

    addWaterLog(Number(amountMl), logDate, userId);
    const summary = getDailySummary(logDate, userId);

    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
