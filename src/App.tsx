import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Layouts
import UserLayout from "@/layouts/UserLayout";
import AdminLayout from "@/layouts/AdminLayout";

// Auth Pages
import Login from "@/pages/Login";
import Register from "@/pages/Register";

// User Pages
import Dashboard from "@/pages/user/Dashboard";
import Investments from "@/pages/user/Investments";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminPackages from "@/pages/admin/AdminPackages";
import AdminSupport from "@/pages/admin/AdminSupport";

// Other Pages
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Redirect root to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Auth Routes - Accessible to everyone */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* User Routes - Only accessible when authenticated as a regular user */}
              <Route
                element={
                  <ProtectedRoute>
                    <UserLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/investments" element={<Investments />} />
                <Route path="/transactions" element={<div>Transactions Page</div>} />
                <Route path="/referrals" element={<div>Referrals Page</div>} />
                <Route path="/notifications" element={<div>Notifications Page</div>} />
                <Route path="/support" element={<div>Support Page</div>} />
                <Route path="/learn" element={<div>Learn Page</div>} />
                <Route path="/profile" element={<div>Profile Page</div>} />
                <Route path="/settings" element={<div>Settings Page</div>} />
              </Route>

              {/* Admin Routes - Only accessible when authenticated as an admin */}
              <Route
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/packages" element={<AdminPackages />} />
                <Route path="/admin/support" element={<AdminSupport />} />
                <Route path="/admin/content" element={<div>Admin Content Page</div>} />
                <Route path="/admin/settings" element={<div>Admin Settings Page</div>} />
                <Route path="/admin/advanced" element={<div>Admin Advanced Page</div>} />
              </Route>

              {/* 404 - Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
