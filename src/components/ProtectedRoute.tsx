
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Swal from "sweetalert2";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireAdmin = false,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Check if user is trying to access admin routes
  const isAttemptingAdminAccess = location.pathname.includes("/admin");
  
  useEffect(() => {
    // Show alert when non-admin tries to access admin routes
    if (isAuthenticated && isAttemptingAdminAccess && user?.role !== "admin") {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You do not have permission to access this area",
        confirmButtonColor: "#0070f3",
      });
    }
  }, [isAuthenticated, isAttemptingAdminAccess, user?.role]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // If requires authentication and not authenticated, redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If requires admin role but user is not admin, redirect to dashboard with alert
  if (requireAdmin && user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // If already authenticated but trying to access login/register pages, redirect to dashboard
  if (!requireAuth && isAuthenticated) {
    return <Navigate to={user?.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
