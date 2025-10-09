import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;
  username: string;
  role: string;
  exp: number;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/auth', '/p', '/unauthorized'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route)) || pathname === '/';

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get('access_token')?.value;

  // If no authentication cookies at all, redirect to login
  if (!accessToken) {
    console.log('No authentication cookies found, redirecting to login');
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If we have a JWT token, decode and check it
  if (accessToken) {
    try {
      const decoded = jwtDecode<JwtPayload>(accessToken);
      const userRole = decoded.role;
      
      console.log('Middleware - User role from JWT:', userRole, 'Pathname:', pathname);

      // Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
        console.log('JWT Token expired');
        const loginUrl = new URL('/auth/login', req.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Role-based access control

      // For non-admin users, enforce role restrictions
      if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }

      if (pathname.startsWith('/teacher') && userRole !== 'TEACHER') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }

      if (pathname.startsWith('/student') && userRole !== 'STUDENT') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }

      return NextResponse.next();

    } catch (error) {
      console.error('JWT decode error:', error);
      // Fall through to session-based auth
    }
  }

  // No valid authentication found
  console.log('No valid authentication found');
  const loginUrl = new URL('/auth/login', req.url);
  loginUrl.searchParams.set('from', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}