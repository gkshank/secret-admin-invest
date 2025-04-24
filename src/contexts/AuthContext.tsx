
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Swal from "sweetalert2";

// User types
export type UserRole = "admin" | "user";

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  name?: string;
  phone?: string;
  profilePicture?: string;
  balance: number;
  referralCode: string;
  referralEarnings: number;
  createdAt: Date;
}

// Auth context state interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

// Mock data for initial development
const mockAdmin: User = {
  id: "admin-id",
  username: "admin",
  email: "admin@example.com",
  role: "admin",
  name: "Admin User",
  balance: 0,
  referralCode: "FYS-ADMIN",
  referralEarnings: 0,
  createdAt: new Date(),
};

const mockUser: User = {
  id: "user-id",
  username: "user",
  email: "user@example.com",
  role: "user",
  name: "Regular User",
  balance: 5000,
  referralCode: "FYS-USER1",
  referralEarnings: 250,
  createdAt: new Date(),
};

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // For demo - mock auth logic
      if (username === "admin" && password === "Fa4262@#$") {
        setUser(mockAdmin);
        localStorage.setItem("user", JSON.stringify(mockAdmin));
        await Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome to the Admin Panel",
          confirmButtonColor: "#0070f3",
        });
        return; // Return here to prevent the error from being thrown
      } else if (username === "user" && password === "password") {
        setUser(mockUser);
        localStorage.setItem("user", JSON.stringify(mockUser));
        await Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome back!",
          confirmButtonColor: "#0070f3",
        });
        return; // Return here to prevent the error from being thrown
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error instanceof Error ? error.message : "Invalid credentials",
        confirmButtonColor: "#0070f3",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // For demo - mock registration logic
      if (username === "admin") {
        throw new Error("Username not available");
      }

      // Create a new user based on the mockUser template
      const newUser: User = {
        ...mockUser,
        id: `user-${Date.now()}`,
        username,
        email,
        referralCode: `FYS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        createdAt: new Date(),
        balance: 0,
        referralEarnings: 0,
      };

      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      
      await Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "Your account has been created successfully!",
        confirmButtonColor: "#0070f3",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error instanceof Error ? error.message : "Registration failed",
        confirmButtonColor: "#0070f3",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    Swal.fire({
      icon: "success",
      title: "Logged Out",
      text: "You have been successfully logged out",
      confirmButtonColor: "#0070f3",
    });
  };

  // Forgot password function
  const forgotPassword = async (email: string) => {
    try {
      // For demo - mock forgot password logic
      await Swal.fire({
        icon: "success",
        title: "Password Reset Request",
        text: "If an account with this email exists, you will receive instructions to reset your password.",
        confirmButtonColor: "#0070f3",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Request Failed",
        text: "Failed to process your request. Please try again.",
        confirmButtonColor: "#0070f3",
      });
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (oldPassword: string, newPassword: string) => {
    try {
      // For demo - mock password reset logic
      if (!user) throw new Error("Not authenticated");
      
      if ((user.username === "admin" && oldPassword !== "Fa4262@#$") || 
          (user.username === "user" && oldPassword !== "password")) {
        throw new Error("Current password is incorrect");
      }
      
      await Swal.fire({
        icon: "success",
        title: "Password Updated",
        text: "Your password has been updated successfully.",
        confirmButtonColor: "#0070f3",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error instanceof Error ? error.message : "Failed to update password",
        confirmButtonColor: "#0070f3",
      });
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
