
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Swal from "sweetalert2";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    // Check if the path includes "admin" and the user is not an admin
    const isAttemptingAdminAccess = location.pathname.includes("/admin");
    
    if (isAttemptingAdminAccess && (!user || user.role !== "admin")) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You do not have permission to access this area",
        confirmButtonColor: "#0070f3",
      }).then(() => {
        // Redirect to dashboard if logged in, otherwise login
        navigate(user ? "/dashboard" : "/login");
      });
    } else {
      console.error(
        "404 Error: User attempted to access non-existent route:",
        location.pathname
      );
    }
  }, [location.pathname, user, navigate]);

  const goBack = () => {
    if (user) {
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <div className="space-y-4">
          <Button onClick={goBack} className="w-full">
            Return to {user ? (user.role === "admin" ? "Admin Dashboard" : "Dashboard") : "Login"}
          </Button>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
