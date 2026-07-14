import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/jwt';

export async function POST() {
  try {
    await clearAuthCookie();
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error: any) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
