// Test endpoint to debug backend communication
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;
  
  console.log("=== REFRESH TOKEN DEBUG ===");
  console.log("Refresh token:", refreshToken);
  console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
  
  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token found" });
  }

  try {
    // Test different ways to send the refresh token
    const results = [];
    
    // Method 1: Cookie header
    try {
      console.log("Testing Method 1: Cookie header...");
      const response1 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Cookie": `refresh_token=${refreshToken}`
        },
        credentials: "include",
      });
      const text1 = await response1.text().catch(() => 'Failed to read response');
      results.push({
        method: "Cookie header",
        status: response1.status,
        response: text1,
        headers: Object.fromEntries(response1.headers.entries())
      });
    } catch (error) {
      results.push({
        method: "Cookie header",
        error: error instanceof Error ? error.message : String(error)
      });
    }

    // Method 2: Authorization header
    try {
      console.log("Testing Method 2: Authorization header...");
      const response2 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${refreshToken}`
        },
        credentials: "include",
      });
      const text2 = await response2.text().catch(() => 'Failed to read response');
      results.push({
        method: "Authorization header",
        status: response2.status,
        response: text2,
        headers: Object.fromEntries(response2.headers.entries())
      });
    } catch (error) {
      results.push({
        method: "Authorization header",
        error: error instanceof Error ? error.message : String(error)
      });
    }

    // Method 3: Body
    try {
      console.log("Testing Method 3: Body...");
      const response3 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
        credentials: "include",
      });
      const text3 = await response3.text().catch(() => 'Failed to read response');
      results.push({
        method: "Body",
        status: response3.status,
        response: text3,
        headers: Object.fromEntries(response3.headers.entries())
      });
    } catch (error) {
      results.push({
        method: "Body",
        error: error instanceof Error ? error.message : String(error)
      });
    }

    return NextResponse.json({
      refreshToken: refreshToken ? "Present" : "Missing",
      apiUrl: process.env.NEXT_PUBLIC_API_URL,
      results
    });

  } catch (error) {
    return NextResponse.json({ 
      error: "Test failed", 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
}