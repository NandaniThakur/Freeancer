import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  // Public routes that don't need authentication
  const publicRoutes = ['/auth/signin', '/auth/signup', '/website', '/api/auth/login', '/api/auth/signup'];
  
  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route => req.nextUrl.pathname.startsWith(route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // If route is protected and no token, redirect to signin
  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  try {
    // Verify token
    jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    return NextResponse.next();
  } catch (error) {
    // Token is invalid or expired
    const response = NextResponse.redirect(new URL('/auth/signin', req.url));
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
