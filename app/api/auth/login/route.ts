import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { findUserByEmail, comparePassword, setSessionCookie } from '@/lib/auth/auth';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = loginSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: parseResult.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;
    const user = await findUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isValidPassword = await comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Set HttpOnly session cookie
    await setSessionCookie({
      userId: user.userId,
      email: user.email,
      name: user.name,
      role: user.role
    });

    return NextResponse.json({
      success: true,
      data: {
        user: {
          userId: user.userId,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: 'Authentication failed. Please try again.' },
      { status: 500 }
    );
  }
}
