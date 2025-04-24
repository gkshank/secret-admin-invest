
import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Home, 
  LogOut, 
  Menu, 
  MessageSquare, 
  Package, 
  Settings, 
  User as UserIcon, 
  Users, 
  X, 
  Moon, 
  Sun, 
  Bell, 
  Shield,
  DollarSign,
  FileText,
  Layers,
  RefreshCw
} from "lucide-react";
import Swal from "sweetalert2";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      icon: "question",
      title: "Logout Confirmation",
      text: "Are you sure you want to logout?",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#0070f3",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/login");
      }
    });
  };

  // Admin navigation items
  const navItems = [
    { path: "/admin", icon: <Home className="h-5 w-5" />, label: "Dashboard" },
    { path: "/admin/users", icon: <Users className="h-5 w-5" />, label: "Users" },
    { path: "/admin/packages", icon: <Package className="h-5 w-5" />, label: "Packages" },
    { path: "/admin/transactions", icon: <DollarSign className="h-5 w-5" />, label: "Transactions" },
    { path: "/admin/referrals", icon: <RefreshCw className="h-5 w-5" />, label: "Referrals" },
    { path: "/admin/support", icon: <MessageSquare className="h-5 w-5" />, label: "Support" },
    { path: "/admin/content", icon: <FileText className="h-5 w-5" />, label: "Content" },
    { path: "/admin/settings", icon: <Settings className="h-5 w-5" />, label: "Settings" },
    { path: "/admin/advanced", icon: <Layers className="h-5 w-5" />, label: "Advanced" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-gray-800">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-red-500" />
              <span className="ml-2 text-lg font-semibold">Admin Panel</span>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md lg:hidden hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* User info */}
          <div className="flex flex-col items-center p-4 border-b border-gray-800">
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                <UserIcon className="h-8 w-8 text-gray-300" />
              </div>
              <div className="absolute bottom-0 right-0 bg-green-500 h-3 w-3 rounded-full border-2 border-gray-900"></div>
            </div>
            <div className="mt-2 text-center">
              <p className="font-medium">Administrator</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-2">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => 
                      `flex items-center px-4 py-2 rounded-lg transition-colors ${
                        isActive 
                          ? "bg-red-600 text-white" 
                          : "text-gray-300 hover:bg-gray-800"
                      }`
                    }
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Sidebar footer */}
          <div className="p-4 border-t border-gray-800">
            <Button 
              variant="outline" 
              className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-gray-800 border-gray-700"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Hamburger menu */}
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            {/* Title */}
            <div className="lg:hidden flex items-center">
              <Shield className="h-5 w-5 text-red-500 mr-2" />
              <span className="font-medium">Admin</span>
            </div>
            
            {/* Right side buttons */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-gray-300" />
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
