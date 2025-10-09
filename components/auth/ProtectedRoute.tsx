'use client'

import { useAuth } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserRole } from "@/types/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading, fetchUser, isAuthenticated } = useAuth();
  const router = useRouter();

  // Try to fetch user on mount
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      fetchUser();
    }
  }, [fetchUser, isAuthenticated, loading]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login?from=' + window.location.pathname);
    }
  }, [loading, isAuthenticated, router]);

  // Check role-based access
  useEffect(() => {
    if (!loading && isAuthenticated && user && requiredRole) {
      // ADMIN can access all routes
      if (user.role === 'ADMIN') {
        return;
      }
      
      // For non-admin users, enforce role restrictions
      if (user.role !== requiredRole) {
        router.push('/unauthorized');
      }
    }
  }, [loading, isAuthenticated, user, requiredRole, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect to login
  }

  // ADMIN can access all routes
  if (user.role === 'ADMIN') {
    return <>{children}</>;
  }

  // For non-admin users, check role requirement
  if (requiredRole && user.role !== requiredRole) {
    return null; // Will redirect to unauthorized
  }

  return <>{children}</>;
}