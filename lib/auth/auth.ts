import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { getMongoClient } from '../db/mongodb';

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'medlens_secure_jwt_secret_key_2026_clinical_intelligence'
);

const COOKIE_NAME = 'medlens_session';

export interface UserPayload {
  userId: string;
  email: string;
  name: string;
  role: 'Clinician' | 'Medical Reviewer' | 'Admin';
}

export interface UserRecord extends UserPayload {
  id: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: UserPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as 'Clinician' | 'Medical Reviewer' | 'Admin'
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(payload: UserPayload): Promise<void> {
  const token = await createSessionToken(payload);
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 // 24 hours
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });
}

export async function getCurrentUser(): Promise<UserPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

// User Database Helpers
export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const client = await getMongoClient();
  if (client) {
    try {
      const db = client.db();
      const doc = await db.collection('users').findOne({ email: email.toLowerCase() });
      if (doc) {
        return {
          id: doc._id.toString(),
          userId: doc.userId || doc._id.toString(),
          email: doc.email,
          name: doc.name,
          role: doc.role,
          passwordHash: doc.passwordHash,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt
        };
      }
    } catch {}
  }
  
  // Default Demo Clinician User Fallback if DB not seeded
  if (email.toLowerCase() === 'dr.miller@medlens.org') {
    const defaultHash = await hashPassword('MedLens2026!');
    return {
      id: 'usr-1',
      userId: 'usr-1',
      email: 'dr.miller@medlens.org',
      name: 'Dr. Sarah Miller',
      role: 'Clinician',
      passwordHash: defaultHash,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    };
  }

  return null;
}

export async function createUser(data: {
  name: string;
  email: string;
  passwordHash: string;
  role: 'Clinician' | 'Medical Reviewer' | 'Admin';
}): Promise<UserRecord> {
  const newUser: Omit<UserRecord, 'id'> = {
    userId: `usr-${Date.now()}`,
    name: data.name,
    email: data.email.toLowerCase(),
    role: data.role,
    passwordHash: data.passwordHash,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const client = await getMongoClient();
  if (client) {
    try {
      const db = client.db();
      const res = await db.collection('users').insertOne(newUser);
      return { ...newUser, id: res.insertedId.toString() };
    } catch {}
  }

  return { ...newUser, id: newUser.userId };
}
