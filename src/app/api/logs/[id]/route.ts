import { NextRequest, NextResponse } from 'next/server';
import { deleteFoodLog, getDailySummary } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const userId = searchParams.get('userId') || 'user_clay_01';

    deleteFoodLog(id);
    const summary = getDailySummary(date, userId);

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
