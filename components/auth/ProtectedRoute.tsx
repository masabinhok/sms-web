'use client'

import { useAuth } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserRole } from "@/types/auth";
import { PasswordChangeWarning } from "./PasswordChangeWarning";

interface ProtectedRouteProps {
  children: React.ReactNode;
  // Array of allowed roles for the route. If omitted, any authenticated user can access.
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading, fetchUser, isAuthenticated, requiresPasswordChange } = useAuth();
  const router = useRouter();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  // Consolidated authentication and authorization logic
  useEffect(() => {
    // Try to fetch user if not authenticated and not loading
    if (!isAuthenticated && !loading) {
      fetchUser();
      return;
    }

    // If still loading, wait
    if (loading) return;

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
      router.push('/auth/login?from=' + window.location.pathname);
      return;
    }

    // Check password change requirement
    if (user && (requiresPasswordChange || user.passwordChangeCount === 0)) {
      setShowPasswordDialog(true);
    }

    // Check role-based access
    if (user && allowedRoles && allowedRoles.length > 0) {
      if (!allowedRoles.includes(user.role)) {
        router.push('/unauthorized');
      }
    }
  }, [loading, isAuthenticated, user, requiresPasswordChange, allowedRoles, router, fetchUser]);

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

  // If allowedRoles specified, enforce it here as well for synchronous render
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      return null; // redirect handled by effect above
    }
  }

  return (
    <>
      <PasswordChangeWarning 
        isOpen={showPasswordDialog} 
        onClose={() => setShowPasswordDialog(false)}
        isMandatory={requiresPasswordChange || user.passwordChangeCount === 0}
      />
      {children}
    </>
  );
}