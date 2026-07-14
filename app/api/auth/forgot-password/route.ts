import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { forgotPasswordSchema } from '@/lib/validations/auth';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const validation = forgotPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid email address', errors: validation.error.format() },
        { status: 400 }
      );
    }

    const { email } = validation.data;
    const user = await User.findOne({ email });

    if (user) {
      // Generate raw random token
      const rawToken = crypto.randomBytes(32).toString('hex');
      
      // Hash token and set expiry (1 hour from now)
      const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpire = new Date(Date.now() + 3600000); // 1 hour

      await user.save();

      // Formulate reset URL
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const resetUrl = `${appUrl}/reset-password?token=${rawToken}`;

      // Mock email send: log clearly to terminal console
      console.log('\n=============== PASSWORD RESET EMAIL (MOCK) ===============');
      console.log(`To:         ${email}`);
      console.log(`Reset Link: ${resetUrl}`);
      console.log('===========================================================\n');
    }

    // Generic response for security (prevents user enumeration)
    return NextResponse.json({
      success: true,
      message: 'If the email exists, a password reset link has been sent.',
    });
  } catch (error: any) {
    console.error('Forgot password API error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
