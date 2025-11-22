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

  // In production with cross-domain API, cookies may not be available
  // Check if we should skip middleware for client-side auth
  const hasNoTokens = !req.cookies.get('access_token')?.value && !req.cookies.get('refresh_token')?.value;
  
  // Allow the request to proceed if no cookies - client-side will handle auth
  // This is necessary for cross-domain API scenarios in production
  if (hasNoTokens) {
    // Let it through - AuthProvider will handle redirects on client
    return NextResponse.next();
  }

  const accessToken = req.cookies.get('access_token')?.value;
  const refreshToken = req.cookies.get('refresh_token')?.value;

  // If we have access token, validate it
  if (accessToken) {
    try {
      const decoded = jwtDecode<JwtPayload>(accessToken);
      const userRole = decoded.role;

      // Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
        if (refreshToken) {
          // Redirect to refresh route
          const refreshUrl = req.nextUrl.clone();
          refreshUrl.pathname = "/api/auth/refresh";
          refreshUrl.searchParams.set("redirect", pathname);
          return NextResponse.redirect(refreshUrl);
        } else {
          // No refresh token, redirect to login
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
    const refreshUrl = req.nextUrl.clone();
    refreshUrl.pathname = "/api/auth/refresh";
    refreshUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(refreshUrl);
  }

  // No valid authentication found
  const loginUrl = new URL('/auth/login', req.url);
  loginUrl.searchParams.set('from', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}