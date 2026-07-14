import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { resetPasswordSchema } from '@/lib/validations/auth';

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    // Extract token from query parameters
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    if (!token) {
      return NextResponse.json(
        { message: 'Reset token is missing' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate request inputs (password & confirmPassword)
    const validation = resetPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid validation fields', errors: validation.error.format() },
        { status: 400 }
      );
    }

    const { password } = validation.data;

    // Hash the token using sha256 to match database record
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find the user with matching token and make sure it has not expired yet
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired password reset token' },
        { status: 400 }
      );
    }

    // Update password (pre-save mongoose hook will hash this value automatically)
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully. You can now log in.',
    });
  } catch (error: any) {
    console.error('Reset password API error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
