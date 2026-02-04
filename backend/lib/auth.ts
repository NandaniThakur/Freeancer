import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export interface AuthPayload {
  userId: string;
  role: 'user' | 'client';
}

export function verifyAuth(token: string): AuthPayload | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key') as AuthPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  return req.cookies.get('token')?.value || null;
}

export function getAuthFromRequest(req: NextRequest): AuthPayload | null {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return verifyAuth(token);
}
