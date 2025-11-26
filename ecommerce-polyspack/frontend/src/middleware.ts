import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protect /admin routes
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const url = request.nextUrl.clone();

  // Only protect /admin routes
  if (url.pathname.startsWith('/admin')) {
    if (!token) {
      url.pathname = '/admin/vite_pages/Login';
      return NextResponse.redirect(url);
    }
    // Optionally: decode and check role here
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
