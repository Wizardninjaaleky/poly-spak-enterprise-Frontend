import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /admin, /admin/products)
  const path = request.nextUrl.pathname;

  // Check if the path starts with /admin
  if (path.startsWith('/admin')) {
    // Get the token from cookies
    const token = request.cookies.get('token')?.value;

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/login?redirect=/admin', request.url));
    }

    // For now, we'll let the component handle the role check
    // In a production app, you might want to verify the token here
    // and check the user role from the database
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
