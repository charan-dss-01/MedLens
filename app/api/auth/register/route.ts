import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { findUserByEmail, hashPassword, createUser, setSessionCookie } from '@/lib/auth/auth';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['Clinician', 'Medical Reviewer'])
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = registerSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: parseResult.error.errors[0]?.message || 'Invalid registration details' },
        { status: 400 }
      );
    }

    const { name, email, password, role } = parseResult.data;
    const existing = await findUserByEmail(email);

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const newUser = await createUser({
      name,
      email,
      passwordHash,
      role
    });

    await setSessionCookie({
      userId: newUser.userId,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    });

    return NextResponse.json({
      success: true,
      data: {
        user: {
          userId: newUser.userId,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}
