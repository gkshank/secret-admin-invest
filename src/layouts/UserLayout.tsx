
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
  BookOpen,
  CreditCard,
  Clock
} from "lucide-react";
import Swal from "sweetalert2";

const UserLayout = () => {
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

  const handleSupportChat = () => {
    Swal.fire({
      title: "Chat with Support",
      html: `
        <form id="support-chat-form" class="text-left">
          <div class="mb-3">
            <label for="name" class="block mb-1 text-sm font-medium">Your Name</label>
            <input id="name" class="w-full px-3 py-2 border rounded-md" value="${user?.name || ''}" placeholder="Enter your name">
          </div>
          <div class="mb-3">
            <label for="email" class="block mb-1 text-sm font-medium">Email</label>
            <input id="email" class="w-full px-3 py-2 border rounded-md" value="${user?.email || ''}" placeholder="Enter your email">
          </div>
          <div class="mb-3">
            <label for="phone" class="block mb-1 text-sm font-medium">Phone</label>
            <input id="phone" class="w-full px-3 py-2 border rounded-md" value="${user?.phone || ''}" placeholder="Enter your phone number">
          </div>
          <div class="mb-3">
            <label for="message" class="block mb-1 text-sm font-medium">Message</label>
            <textarea id="message" class="w-full px-3 py-2 border rounded-md" rows="3" placeholder="How can we help you?"></textarea>
          </div>
        </form>
      `,
      showCancelButton: true,
      confirmButtonText: "Send Message",
      confirmButtonColor: "#0070f3",
      preConfirm: () => {
        const name = (document.getElementById('name') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const phone = (document.getElementById('phone') as HTMLInputElement).value;
        const message = (document.getElementById('message') as HTMLTextAreaElement).value;
        
        if (!name || !email || !message) {
          Swal.showValidationMessage("Please fill in all required fields");
          return false;
        }
        
        return { name, email, phone, message };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Message Sent",
          text: "Our support team will respond shortly. Thank you!",
          confirmButtonColor: "#0070f3",
        });
      }
    });
  };

  const navItems = [
    { path: "/dashboard", icon: <Home className="h-5 w-5" />, label: "Dashboard" },
    { path: "/investments", icon: <BarChart3 className="h-5 w-5" />, label: "Investments" },
    { path: "/transactions", icon: <CreditCard className="h-5 w-5" />, label: "Transactions" },
    { path: "/referrals", icon: <Users className="h-5 w-5" />, label: "Referrals" },
    { path: "/notifications", icon: <Bell className="h-5 w-5" />, label: "Notifications" },
    { path: "/support", icon: <MessageSquare className="h-5 w-5" />, label: "Support" },
    { path: "/learn", icon: <BookOpen className="h-5 w-5" />, label: "Learn" },
    { path: "/profile", icon: <UserIcon className="h-5 w-5" />, label: "Profile" },
    { path: "/settings", icon: <Settings className="h-5 w-5" />, label: "Settings" },
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
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-4 h-16 border-b dark:border-gray-700">
            <div className="flex items-center">
              <Package className="h-6 w-6 text-primary" />
              <span className="ml-2 text-lg font-semibold">FYS Invest</span>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* User info */}
          <div className="flex flex-col items-center p-4 border-b dark:border-gray-700">
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                {user?.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt="Profile" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                )}
              </div>
              <div className="absolute bottom-0 right-0 bg-green-500 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>
            <div className="mt-2 text-center">
              <p className="font-medium">{user?.name || user?.username}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>
            <div className="mt-2 text-sm font-semibold">
              <p className="text-center text-primary">KES {user?.balance.toLocaleString()}</p>
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
                          ? "bg-primary text-white" 
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
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
          <div className="p-4 border-t dark:border-gray-700">
            <Button 
              variant="outline" 
              className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-gray-700"
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
            <div className="lg:hidden font-medium">FYS Invest</div>
            
            {/* Right side buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSupportChat}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              >
                <MessageSquare className="h-5 w-5" />
              </button>
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
              <NavLink to="/profile" className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  {user?.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt="Profile" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  )}
                </div>
              </NavLink>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4">
          <Outlet />
        </main>
        
        {/* Chat with Support floating button */}
        <div className="fixed bottom-6 right-6 z-10">
          <button
            onClick={handleSupportChat}
            className="flex items-center justify-center h-14 w-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-colors"
          >
            <MessageSquare className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
