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

  // Public routes and assets that don't require authentication
  const publicRoutes = ['/auth', '/p', '/debug', '/unauthorized', '/api'];
  const publicAssets = ['/favicon.ico', '/school-logo.svg', '/images/', '/.well-known/', '/next.svg', '/vercel.svg', '/file.svg', '/globe.svg', '/window.svg'];
  
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route)) || pathname === '/';
  const isPublicAsset = publicAssets.some(asset => pathname.startsWith(asset));

  // If it's a public route or asset, allow access
  if (isPublicRoute || isPublicAsset) {
    return NextResponse.next();
  }

  // Check if this is a logout action (no tokens present)
  // This prevents redirect loops after logout
  const hasNoTokens = !req.cookies.get('access_token')?.value && !req.cookies.get('refresh_token')?.value;
  if (hasNoTokens) {
    console.log('No authentication tokens found, redirecting to login');
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const accessToken = req.cookies.get('access_token')?.value;
  const refreshToken = req.cookies.get('refresh_token')?.value;
  
  console.log('Middleware - Pathname:', pathname, 'Has access token:', !!accessToken, 'Has refresh token:', !!refreshToken);

  // If we have access token, validate it
  if (accessToken) {
    try {
      const decoded = jwtDecode<JwtPayload>(accessToken);
      const userRole = decoded.role;
      
      console.log('Middleware - User role from JWT:', userRole, 'Pathname:', pathname);

      // Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
        console.log('JWT Token expired, checking for refresh token');
        
        if (refreshToken) {
          // Redirect to refresh route
          const refreshUrl = req.nextUrl.clone();
          refreshUrl.pathname = "/api/auth/refresh";
          refreshUrl.searchParams.set("redirect", pathname);
          return NextResponse.redirect(refreshUrl);
        } else {
          // No refresh token, redirect to login
          localStorage.clear();
          const loginUrl = new URL('/auth/login', req.url);
          loginUrl.searchParams.set('from', pathname);
          return NextResponse.redirect(loginUrl);
        }
      }

      // For non-admin users, enforce role restrictions
      if (pathname.startsWith('/admin') && userRole !== 'ADMIN' && userRole !== 'SUPERADMIN') {
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
      // Invalid access token, check for refresh token
      if (refreshToken) {
        const refreshUrl = req.nextUrl.clone();
        refreshUrl.pathname = "/api/auth/refresh";
        refreshUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(refreshUrl);
      }
    }
  }

  // No access token but have refresh token
  if (!accessToken && refreshToken) {
    console.log('No access token but refresh token exists, attempting refresh');
    const refreshUrl = req.nextUrl.clone();
    refreshUrl.pathname = "/api/auth/refresh";
    refreshUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(refreshUrl);
  }

  // No valid authentication found
  console.log('No valid authentication found, redirecting to login');
  const loginUrl = new URL('/auth/login', req.url);
  loginUrl.searchParams.set('from', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}