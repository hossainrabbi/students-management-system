import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { signToken, setAuthCookie } from '@/lib/jwt';
import { loginSchema } from '@/lib/validations/auth';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Validate body
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid validation fields', errors: validation.error.format() },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check status
    if (user.status !== 'active') {
      return NextResponse.json(
        { message: 'Your account is deactivated. Please contact an admin.' },
        { status: 403 }
      );
    }

    // Sign token & Set cookie
    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || '',
      },
    });
  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
