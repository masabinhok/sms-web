import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;
    
    console.log("Logout endpoint called");

    // Call backend logout endpoint if we have a refresh token
    if (refreshToken) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Cookie": `refresh_token=${refreshToken}`,
          },
          credentials: "include",
        });
        console.log("Backend logout successful");
      } catch (error) {
        console.error("Backend logout failed:", error);
        // Continue with local logout even if backend fails
      }
    }

    // Create response with headers to clear cookies
    const response = NextResponse.json({ 
      success: true, 
      message: "Logged out successfully" 
    });

    // Clear all auth-related cookies with all possible paths
    const cookieOptions = {
      path: '/',
      maxAge: 0,
    };
    
    response.cookies.set("access_token", "", cookieOptions);
    response.cookies.set("refresh_token", "", cookieOptions);
    
    // Also try alternative cookie names just in case
    response.cookies.set("refreshToken", "", cookieOptions);
    response.cookies.set("accessToken", "", cookieOptions);
    
    console.log("Auth cookies cleared");

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    
    // Even on error, try to clear cookies
    const response = NextResponse.json(
      { error: "Logout failed", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
    
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    response.cookies.delete("refreshToken");
    response.cookies.delete("accessToken");
    
    return response;
  }
}
