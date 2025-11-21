// app/api/auth/refresh/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getApiUrl } from "@/lib/env";
import { authLogger, logError } from "@/lib/logger";

async function refreshTokenLogic(request: Request) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { error: "No refresh token found" },
      { status: 401 }
    );
  }

  try {
    // Backend expects the refresh token as a cookie, not in headers or body
    const response = await fetch(`${getApiUrl()}/auth/refresh`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        // Send the refresh token as a cookie header - this is what the backend expects
        "Cookie": `refresh_token=${refreshToken}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error text');
      throw new Error(`Backend refresh failed with status ${response.status}: ${errorText}`);
    }

    let data;
    try {
      const responseText = await response.text();
      data = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      data = { success: true };
    }

    authLogger.tokenRefresh(true);

    // Extract tokens from response headers (set-cookie)
    const responseHeaders = response.headers;
    const setCookieHeaders = [];
    
    // Collect all Set-Cookie headers
    for (const [key, value] of responseHeaders.entries()) {
      if (key.toLowerCase() === 'set-cookie') {
        setCookieHeaders.push(value);
      }
    }
    
    let newRefreshToken = data.refreshToken;
    let newAccessToken = data.accessToken;
    
    // Parse tokens from all set-cookie headers
    for (const cookieHeader of setCookieHeaders) {
      // Look for access_token anywhere in the header
      const accessTokenMatch = cookieHeader.match(/access_token=([A-Za-z0-9._-]+)/);
      if (accessTokenMatch) {
        newAccessToken = accessTokenMatch[1];
      }
      
      // Look for refresh_token anywhere in the header  
      const refreshTokenMatch = cookieHeader.match(/refresh_token=([A-Za-z0-9._-]+)/);
      if (refreshTokenMatch) {
        newRefreshToken = refreshTokenMatch[1];
      }
    }

    // Check if this is a GET request with redirect parameter
    const url = new URL(request.url);
    const redirectPath = url.searchParams.get("redirect");
    
    let res: NextResponse;
    
    if (redirectPath && request.method === "GET") {
      // For GET requests with redirect, redirect to the specified path
      res = NextResponse.redirect(new URL(redirectPath, request.url));
    } else {
      // For POST requests, return JSON response
      res = NextResponse.json({ success: true, data, newAccessToken, newRefreshToken });
    }

    // Set access token cookie if we have one
    if (newAccessToken) {
      res.cookies.set("access_token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60, // 15 minutes
      });
    }

    // Set refresh token cookie - use the new one from backend or keep existing
    const finalRefreshToken = newRefreshToken || refreshToken;
    res.cookies.set("refresh_token", finalRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return res;
  } catch (err) {
    logError(err, 'Token refresh route');
    authLogger.tokenRefresh(false);
    
    // For GET requests with redirect, redirect to login
    const url = new URL(request.url);
    const redirectPath = url.searchParams.get("redirect");
    
    if (redirectPath && request.method === "GET") {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("from", redirectPath);
      return NextResponse.redirect(loginUrl);
    }
    
    // For POST requests, return JSON error
    return NextResponse.json(
      { error: "Token refresh failed", details: err instanceof Error ? err.message : String(err) },
      { status: 401 }
    );
  }
}

export async function POST(request: Request) {
  return refreshTokenLogic(request);
}

export async function GET(request: Request) {
  return refreshTokenLogic(request);
}
