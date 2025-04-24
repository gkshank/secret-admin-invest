
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  User, Users, Search, Filter, MoreHorizontal, 
  Edit, Trash2, UserPlus, Mail, Shield, AlertTriangle 
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

// Mock user data for demonstration
const mockUsers = [
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
  },
];

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);

  // Search functionality
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term.trim() === "") {
      setFilteredUsers(mockUsers);
    } else {
      const filtered = mockUsers.filter(user => 
        user.username.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.name?.toLowerCase().includes(term)
      );
      setFilteredUsers(filtered);
    }
  };

  // Handle view user details
  const handleViewUser = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
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
    const user = mockUsers.find(u => u.id === userId);
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
            <div class="mb-3">
              <label for="balance" class="block mb-1 text-sm font-medium">Balance (KES)</label>
              <input id="balance" type="number" class="w-full px-3 py-2 border rounded-md" value="${user.balance}">
            </div>
          </form>
        `,
        showCancelButton: true,
        confirmButtonText: "Save Changes",
        confirmButtonColor: "#0070f3",
        preConfirm: () => {
          // In a real app, you would save these changes to the database
          return {
            username: (document.getElementById('username') as HTMLInputElement).value,
            email: (document.getElementById('email') as HTMLInputElement).value,
            name: (document.getElementById('name') as HTMLInputElement).value,
            status: (document.getElementById('status') as HTMLSelectElement).value,
            balance: (document.getElementById('balance') as HTMLInputElement).value,
          };
        }
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            icon: "success",
            title: "User Updated",
            text: "User details have been updated successfully.",
            confirmButtonColor: "#0070f3",
          });
        }
      });
    }
  };

  // Handle delete user
  const handleDeleteUser = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
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
          // In a real app, you would delete the user from the database
          setFilteredUsers(filteredUsers.filter(u => u.id !== userId));
          
          Swal.fire({
            icon: "success",
            title: "User Deleted",
            text: "User has been deleted successfully.",
            confirmButtonColor: "#0070f3",
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
        </form>
      `,
      showCancelButton: true,
      confirmButtonText: "Create User",
      confirmButtonColor: "#0070f3",
      preConfirm: () => {
        // Validate inputs
        const username = (document.getElementById('username') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        
        if (!username || !email) {
          Swal.showValidationMessage("Username and email are required");
          return false;
        }
        
        return {
          username,
          email,
          name: (document.getElementById('name') as HTMLInputElement).value,
          password: (document.getElementById('password') as HTMLInputElement).value,
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // In a real app, you would add the user to the database
        const newUser = {
          id: `user-${Date.now()}`,
          username: result.value.username,
          email: result.value.email,
          name: result.value.name,
          role: "user",
          status: "active",
          balance: 0,
          referralCode: `FYS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          referralEarnings: 0,
          createdAt: new Date(),
          lastLogin: new Date(),
        };
        
        setFilteredUsers([newUser, ...filteredUsers]);
        
        Swal.fire({
          icon: "success",
          title: "User Created",
          text: "New user has been created successfully.",
          confirmButtonColor: "#0070f3",
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
        Swal.fire({
          icon: "success",
          title: "Emails Sent",
          text: `Emails have been queued for delivery to ${filteredUsers.length} users.`,
          confirmButtonColor: "#0070f3",
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
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600" 
                              onClick={() => handleDeleteUser(user.id)}
                            >
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
