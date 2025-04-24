
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  User, Users, Search, Filter, MoreHorizontal, 
  Edit, Trash2, UserPlus, Mail, Shield, AlertTriangle,
  Wallet, Key
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Swal from "sweetalert2";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  role: "user" | "admin";
  status: "active" | "inactive" | "suspended";
  balance: number;
  referralCode: string;
  referralEarnings: number;
  createdAt: Date;
  lastLogin: Date;
  password?: string;
}

// Initial mock data
const initialUsers: User[] = [
  {
    id: "user-1",
    username: "johndoe",
    email: "john@example.com",
    name: "John Doe",
    role: "user",
    status: "active",
    balance: 15000,
    referralCode: "FYS-ABC123",
    referralEarnings: 750,
    createdAt: new Date(2023, 9, 15),
    lastLogin: new Date(2024, 4, 20),
    password: "password123"
  },
  {
    id: "user-2",
    username: "janedoe",
    email: "jane@example.com",
    name: "Jane Doe",
    role: "user",
    status: "active",
    balance: 8500,
    referralCode: "FYS-XYZ456",
    referralEarnings: 350,
    createdAt: new Date(2023, 10, 5),
    lastLogin: new Date(2024, 4, 18),
    password: "password123"
  },
  {
    id: "user-3",
    username: "mikebrown",
    email: "mike@example.com",
    name: "Mike Brown",
    role: "user",
    status: "suspended",
    balance: 2000,
    referralCode: "FYS-DEF789",
    referralEarnings: 120,
    createdAt: new Date(2024, 0, 22),
    lastLogin: new Date(2024, 3, 10),
    password: "password123"
  },
  {
    id: "user-4",
    username: "sarahjones",
    email: "sarah@example.com",
    name: "Sarah Jones",
    role: "user",
    status: "active",
    balance: 23500,
    referralCode: "FYS-GHI012",
    referralEarnings: 1200,
    createdAt: new Date(2023, 8, 30),
    lastLogin: new Date(2024, 4, 21),
    password: "password123"
  },
  {
    id: "user-5",
    username: "robertsmith",
    email: "robert@example.com",
    name: "Robert Smith",
    role: "user",
    status: "inactive",
    balance: 500,
    referralCode: "FYS-JKL345",
    referralEarnings: 0,
    createdAt: new Date(2024, 2, 15),
    lastLogin: new Date(2024, 3, 5),
    password: "password123"
  },
  {
    id: "admin-1",
    username: "admin",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    status: "active",
    balance: 0,
    referralCode: "ADMIN",
    referralEarnings: 0,
    createdAt: new Date(2023, 0, 1),
    lastLogin: new Date(),
    password: "admin123"
  }
];

const AdminUsers = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  // Initialize users from localStorage or use mock data
  useEffect(() => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      try {
        // Parse the stored JSON and convert date strings back to Date objects
        const parsedUsers = JSON.parse(savedUsers, (key, value) => {
          if (key === 'createdAt' || key === 'lastLogin') {
            return new Date(value);
          }
          return value;
        });
        setUsers(parsedUsers);
        setFilteredUsers(parsedUsers);
      } catch (error) {
        console.error("Error parsing users from localStorage:", error);
        setDefaultUsers();
      }
    } else {
      setDefaultUsers();
    }
  }, []);

  const setDefaultUsers = () => {
    setUsers(initialUsers);
    setFilteredUsers(initialUsers);
    saveUsersToLocalStorage(initialUsers);
  };

  // Save users to localStorage
  const saveUsersToLocalStorage = (usersToSave: User[]) => {
    localStorage.setItem('users', JSON.stringify(usersToSave));
  };

  // Search functionality
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.username.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.name?.toLowerCase().includes(term)
      );
      setFilteredUsers(filtered);
    }
  };

  // Handle view user details
  const handleViewUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      Swal.fire({
        title: "User Details",
        html: `
          <div class="text-left">
            <p><strong>ID:</strong> ${user.id}</p>
            <p><strong>Username:</strong> ${user.username}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Role:</strong> ${user.role}</p>
            <p><strong>Status:</strong> ${user.status}</p>
            <p><strong>Balance:</strong> KES ${user.balance.toLocaleString()}</p>
            <p><strong>Referral Code:</strong> ${user.referralCode}</p>
            <p><strong>Referral Earnings:</strong> KES ${user.referralEarnings.toLocaleString()}</p>
            <p><strong>Created:</strong> ${user.createdAt.toLocaleDateString()}</p>
            <p><strong>Last Login:</strong> ${user.lastLogin.toLocaleDateString()}</p>
          </div>
        `,
        confirmButtonText: "Close",
        confirmButtonColor: "#0070f3",
      });
    }
  };

  // Handle edit user
  const handleEditUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      Swal.fire({
        title: "Edit User",
        html: `
          <form id="edit-user-form" class="text-left">
            <div class="mb-3">
              <label for="username" class="block mb-1 text-sm font-medium">Username</label>
              <input id="username" class="w-full px-3 py-2 border rounded-md" value="${user.username}">
            </div>
            <div class="mb-3">
              <label for="email" class="block mb-1 text-sm font-medium">Email</label>
              <input id="email" class="w-full px-3 py-2 border rounded-md" value="${user.email}">
            </div>
            <div class="mb-3">
              <label for="name" class="block mb-1 text-sm font-medium">Name</label>
              <input id="name" class="w-full px-3 py-2 border rounded-md" value="${user.name || ''}">
            </div>
            <div class="mb-3">
              <label for="status" class="block mb-1 text-sm font-medium">Status</label>
              <select id="status" class="w-full px-3 py-2 border rounded-md">
                <option value="active" ${user.status === 'active' ? 'selected' : ''}>Active</option>
                <option value="inactive" ${user.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                <option value="suspended" ${user.status === 'suspended' ? 'selected' : ''}>Suspended</option>
              </select>
            </div>
          </form>
        `,
        showCancelButton: true,
        confirmButtonText: "Save Changes",
        confirmButtonColor: "#0070f3",
        preConfirm: () => {
          return {
            username: (document.getElementById('username') as HTMLInputElement).value,
            email: (document.getElementById('email') as HTMLInputElement).value,
            name: (document.getElementById('name') as HTMLInputElement).value,
            status: (document.getElementById('status') as HTMLSelectElement).value,
          };
        }
      }).then((result) => {
        if (result.isConfirmed) {
          // Update user in state
          const updatedUsers = users.map(u => {
            if (u.id === userId) {
              return {
                ...u,
                username: result.value.username,
                email: result.value.email,
                name: result.value.name,
                status: result.value.status as "active" | "inactive" | "suspended",
              };
            }
            return u;
          });
          
          setUsers(updatedUsers);
          setFilteredUsers(
            searchTerm ? 
              updatedUsers.filter(user => 
                user.username.toLowerCase().includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm) ||
                user.name?.toLowerCase().includes(searchTerm)
              ) : 
              updatedUsers
          );
          
          // Save to localStorage
          saveUsersToLocalStorage(updatedUsers);
          
          toast({
            title: "User Updated",
            description: "User details have been updated successfully."
          });
        }
      });
    }
  };

  // Handle change user password
  const handleChangePassword = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      Swal.fire({
        title: "Change Password",
        html: `
          <form id="change-password-form" class="text-left">
            <div class="mb-3">
              <label for="newPassword" class="block mb-1 text-sm font-medium">New Password</label>
              <input id="newPassword" type="password" class="w-full px-3 py-2 border rounded-md" placeholder="Enter new password">
            </div>
            <div class="mb-3">
              <label for="confirmPassword" class="block mb-1 text-sm font-medium">Confirm Password</label>
              <input id="confirmPassword" type="password" class="w-full px-3 py-2 border rounded-md" placeholder="Confirm new password">
            </div>
          </form>
        `,
        showCancelButton: true,
        confirmButtonText: "Change Password",
        confirmButtonColor: "#0070f3",
        preConfirm: () => {
          const newPassword = (document.getElementById('newPassword') as HTMLInputElement).value;
          const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;
          
          if (!newPassword || newPassword.length < 6) {
            Swal.showValidationMessage("Password must be at least 6 characters");
            return false;
          }
          
          if (newPassword !== confirmPassword) {
            Swal.showValidationMessage("Passwords do not match");
            return false;
          }
          
          return { newPassword };
        }
      }).then((result) => {
        if (result.isConfirmed) {
          // Update user password in state
          const updatedUsers = users.map(u => {
            if (u.id === userId) {
              return { ...u, password: result.value.newPassword };
            }
            return u;
          });
          
          setUsers(updatedUsers);
          // No need to update filtered users as password isn't used for filtering
          
          // Save to localStorage
          saveUsersToLocalStorage(updatedUsers);
          
          toast({
            title: "Password Changed",
            description: "User password has been updated successfully."
          });
        }
      });
    }
  };

  // Handle add balance
  const handleAddBalance = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      Swal.fire({
        title: "Add Balance",
        html: `
          <form id="add-balance-form" class="text-left">
            <div class="mb-3">
              <label for="amount" class="block mb-1 text-sm font-medium">Amount (KES)</label>
              <input id="amount" type="number" min="1" class="w-full px-3 py-2 border rounded-md" placeholder="Enter amount">
            </div>
            <div class="mb-3">
              <label for="notes" class="block mb-1 text-sm font-medium">Notes (Optional)</label>
              <textarea id="notes" class="w-full px-3 py-2 border rounded-md" placeholder="Add notes"></textarea>
            </div>
          </form>
        `,
        showCancelButton: true,
        confirmButtonText: "Add Balance",
        confirmButtonColor: "#0070f3",
        preConfirm: () => {
          const amount = Number((document.getElementById('amount') as HTMLInputElement).value);
          const notes = (document.getElementById('notes') as HTMLTextAreaElement).value;
          
          if (!amount || amount <= 0) {
            Swal.showValidationMessage("Please enter a valid amount");
            return false;
          }
          
          return { amount, notes };
        }
      }).then((result) => {
        if (result.isConfirmed) {
          // Update user balance in state
          const updatedUsers = users.map(u => {
            if (u.id === userId) {
              const newBalance = u.balance + result.value.amount;
              return { ...u, balance: newBalance };
            }
            return u;
          });
          
          setUsers(updatedUsers);
          setFilteredUsers(
            searchTerm ? 
              updatedUsers.filter(user => 
                user.username.toLowerCase().includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm) ||
                user.name?.toLowerCase().includes(searchTerm)
              ) : 
              updatedUsers
          );
          
          // Save to localStorage
          saveUsersToLocalStorage(updatedUsers);
          
          toast({
            title: "Balance Added",
            description: `KES ${result.value.amount.toLocaleString()} has been added to the user's account.`
          });
        }
      });
    }
  };

  // Handle delete user
  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      // Don't allow deleting the admin user
      if (user.role === "admin") {
        toast({
          variant: "destructive",
          title: "Cannot Delete Admin",
          description: "Admin users cannot be deleted from the system."
        });
        return;
      }

      Swal.fire({
        title: "Delete User",
        text: `Are you sure you want to delete ${user.username}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#dc2626",
      }).then((result) => {
        if (result.isConfirmed) {
          // Delete user from state
          const updatedUsers = users.filter(u => u.id !== userId);
          
          setUsers(updatedUsers);
          setFilteredUsers(
            searchTerm ? 
              updatedUsers.filter(user => 
                user.username.toLowerCase().includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm) ||
                user.name?.toLowerCase().includes(searchTerm)
              ) : 
              updatedUsers
          );
          
          // Save to localStorage
          saveUsersToLocalStorage(updatedUsers);
          
          toast({
            title: "User Deleted",
            description: "User has been deleted successfully."
          });
        }
      });
    }
  };

  // Handle add new user
  const handleAddUser = () => {
    Swal.fire({
      title: "Add New User",
      html: `
        <form id="add-user-form" class="text-left">
          <div class="mb-3">
            <label for="username" class="block mb-1 text-sm font-medium">Username</label>
            <input id="username" class="w-full px-3 py-2 border rounded-md" placeholder="Enter username">
          </div>
          <div class="mb-3">
            <label for="email" class="block mb-1 text-sm font-medium">Email</label>
            <input id="email" class="w-full px-3 py-2 border rounded-md" placeholder="Enter email">
          </div>
          <div class="mb-3">
            <label for="name" class="block mb-1 text-sm font-medium">Name</label>
            <input id="name" class="w-full px-3 py-2 border rounded-md" placeholder="Enter name">
          </div>
          <div class="mb-3">
            <label for="password" class="block mb-1 text-sm font-medium">Password</label>
            <input id="password" type="password" class="w-full px-3 py-2 border rounded-md" placeholder="Enter password">
          </div>
          <div class="mb-3">
            <label for="initialBalance" class="block mb-1 text-sm font-medium">Initial Balance (KES)</label>
            <input id="initialBalance" type="number" class="w-full px-3 py-2 border rounded-md" placeholder="0" value="0">
          </div>
        </form>
      `,
      showCancelButton: true,
      confirmButtonText: "Create User",
      confirmButtonColor: "#0070f3",
      preConfirm: () => {
        // Validate inputs
        const username = (document.getElementById('username') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;
        
        if (!username || !email) {
          Swal.showValidationMessage("Username and email are required");
          return false;
        }
        
        if (password.length < 6) {
          Swal.showValidationMessage("Password must be at least 6 characters");
          return false;
        }
        
        return {
          username,
          email,
          name: (document.getElementById('name') as HTMLInputElement).value,
          password,
          initialBalance: Number((document.getElementById('initialBalance') as HTMLInputElement).value) || 0,
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Create new user
        const newUser: User = {
          id: `user-${Date.now()}`,
          username: result.value.username,
          email: result.value.email,
          name: result.value.name,
          role: "user",
          status: "active",
          balance: result.value.initialBalance,
          referralCode: `FYS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          referralEarnings: 0,
          createdAt: new Date(),
          lastLogin: new Date(),
          password: result.value.password
        };
        
        // Add user to state
        const updatedUsers = [newUser, ...users];
        
        setUsers(updatedUsers);
        setFilteredUsers(
          searchTerm ? 
            updatedUsers.filter(user => 
              user.username.toLowerCase().includes(searchTerm) ||
              user.email.toLowerCase().includes(searchTerm) ||
              user.name?.toLowerCase().includes(searchTerm)
            ) : 
            updatedUsers
        );
        
        // Save to localStorage
        saveUsersToLocalStorage(updatedUsers);
        
        toast({
          title: "User Created",
          description: "New user has been created successfully."
        });
      }
    });
  };

  // Handle bulk actions
  const handleSendBulkEmail = () => {
    Swal.fire({
      title: "Send Bulk Email",
      html: `
        <form id="bulk-email-form" class="text-left">
          <div class="mb-3">
            <label for="subject" class="block mb-1 text-sm font-medium">Subject</label>
            <input id="subject" class="w-full px-3 py-2 border rounded-md" placeholder="Enter email subject">
          </div>
          <div class="mb-3">
            <label for="message" class="block mb-1 text-sm font-medium">Message</label>
            <textarea id="message" class="w-full px-3 py-2 border rounded-md" rows="5" placeholder="Enter your message"></textarea>
          </div>
        </form>
      `,
      showCancelButton: true,
      confirmButtonText: "Send Email",
      confirmButtonColor: "#0070f3",
      preConfirm: () => {
        const subject = (document.getElementById('subject') as HTMLInputElement).value;
        const message = (document.getElementById('message') as HTMLTextAreaElement).value;
        
        if (!subject || !message) {
          Swal.showValidationMessage("Subject and message are required");
          return false;
        }
        
        return { subject, message };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        toast({
          title: "Emails Sent",
          description: `Emails have been queued for delivery to ${filteredUsers.length} users.`
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts, permissions, and activities
          </p>
        </div>
        <Button onClick={handleAddUser} className="sm:w-auto w-full">
          <UserPlus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                className="pl-10"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSendBulkEmail}>
                <Mail className="mr-2 h-4 w-4" />
                Bulk Email
              </Button>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Balance</TableHead>
                  <TableHead className="hidden lg:table-cell">Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                            <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                          </div>
                          <div>
                            <div className="font-medium">{user.name || user.username}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {user.role === "admin" ? 
                            <Shield className="h-4 w-4 text-purple-500" /> : 
                            <User className="h-4 w-4 text-blue-500" />
                          }
                          <span className="capitalize">{user.role}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.status === "active" && (
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span>Active</span>
                          </div>
                        )}
                        {user.status === "inactive" && (
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                            <span>Inactive</span>
                          </div>
                        )}
                        {user.status === "suspended" && (
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-red-500"></div>
                            <span>Suspended</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        KES {user.balance.toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {user.createdAt.toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewUser(user.id)}>
                              <User className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleChangePassword(user.id)}>
                              <Key className="h-4 w-4 mr-2" />
                              Change Password
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAddBalance(user.id)}>
                              <Wallet className="h-4 w-4 mr-2" />
                              Add Balance
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600" 
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={user.role === "admin"}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="text-muted-foreground">No users found</p>
                          <p className="text-sm text-muted-foreground">
                            {searchTerm ? "Try a different search term" : "Add users to get started"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
