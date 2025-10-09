// app/api/auth/refresh/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function refreshTokenLogic(request: Request) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  console.log("Refresh token endpoint called", refreshToken ? "with token" : "without token");

  if (!refreshToken) {
    console.log("No refresh token found in cookies");
    return NextResponse.json(
      { error: "No refresh token found" },
      { status: 401 }
    );
  }

  try {
    console.log("Attempting to refresh token with backend...");
    
    // Backend expects the refresh token as a cookie, not in headers or body
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        // Send the refresh token as a cookie header - this is what the backend expects
        "Cookie": `refresh_token=${refreshToken}`,
      },
      credentials: "include",
    });

    console.log("Backend response status:", response.status);
    console.log("Backend response headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error text');
      console.log("Backend error response:", errorText);
      throw new Error(`Backend refresh failed with status ${response.status}: ${errorText}`);
    }

    let data;
    try {
      const responseText = await response.text();
      console.log("Backend response text:", responseText);
      data = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      console.log("Failed to parse backend response, treating as success");
      data = { success: true };
    }

    console.log("Backend refresh successful, data:", data);

    // Extract tokens from response headers (set-cookie)
    const responseHeaders = response.headers;
    const setCookieHeaders = [];
    
    // Collect all Set-Cookie headers
    for (const [key, value] of responseHeaders.entries()) {
      if (key.toLowerCase() === 'set-cookie') {
        setCookieHeaders.push(value);
      }
    }
    
    console.log("All Set-Cookie headers:", setCookieHeaders);
    
    let newRefreshToken = data.refreshToken;
    let newAccessToken = data.accessToken;
    
    // Parse tokens from all set-cookie headers
    for (const cookieHeader of setCookieHeaders) {
      console.log("Parsing full cookie header:", cookieHeader.substring(0, 200) + "...");
      
      // Look for access_token anywhere in the header
      const accessTokenMatch = cookieHeader.match(/access_token=([A-Za-z0-9._-]+)/);
      if (accessTokenMatch) {
        newAccessToken = accessTokenMatch[1];
        console.log("✅ Extracted access token:", newAccessToken.substring(0, 50) + "...");
      } else {
        console.log("❌ No access token found in this header");
      }
      
      // Look for refresh_token anywhere in the header  
      const refreshTokenMatch = cookieHeader.match(/refresh_token=([A-Za-z0-9._-]+)/);
      if (refreshTokenMatch) {
        newRefreshToken = refreshTokenMatch[1];
        console.log("✅ Extracted refresh token:", newRefreshToken.substring(0, 50) + "...");
      } else {
        console.log("❌ No refresh token found in this header");
      }
    }

    // Check if this is a GET request with redirect parameter
    const url = new URL(request.url);
    const redirectPath = url.searchParams.get("redirect");
    
    let res: NextResponse;
    
    if (redirectPath && request.method === "GET") {
      // For GET requests with redirect, redirect to the specified path
      console.log("Redirecting to:", redirectPath);
      res = NextResponse.redirect(new URL(redirectPath, request.url));
    } else {
      // For POST requests, return JSON response
      res = NextResponse.json({ success: true, data, newAccessToken, newRefreshToken });
    }

    // Set access token cookie if we have one
    if (newAccessToken) {
      console.log("✅ Setting access token cookie");
      res.cookies.set("access_token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60, // 15 minutes
      });
    } else {
      console.log("⚠️  No access token received from backend - this may cause authentication issues");
    }

    // Set refresh token cookie - use the new one from backend or keep existing
    const finalRefreshToken = newRefreshToken || refreshToken;
    console.log("✅ Setting refresh token cookie");
    res.cookies.set("refresh_token", finalRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return res;
  } catch (err) {
    console.error("Refresh error:", err);
    
    // For GET requests with redirect, redirect to login
    const url = new URL(request.url);
    const redirectPath = url.searchParams.get("redirect");
    
    if (redirectPath && request.method === "GET") {
      console.log("Refresh failed, redirecting to login with from parameter");
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
