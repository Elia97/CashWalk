import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth/auth';

export const runtime = 'nodejs';

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (session) return NextResponse.next();

  const loginUrl = new URL('/auth/login', request.url);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    '/overview/:path*',
    '/accounts/:path*',
    '/transactions/:path*',
    '/analytics/:path*',
    '/settings/:path*',
    '/profile/:path*',
    '/admin/:path*',
    '/welcome/:path*',
  ],
};
