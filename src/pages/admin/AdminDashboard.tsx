
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  CreditCard,
  DollarSign,
  Package,
  Users,
  Clock,
  TrendingUp,
  AlertTriangle,
  Settings,
  Shield,
  Globe,
  MessageSquare
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

const AdminDashboard = () => {
  // Mock data for dashboard stats
  const stats = {
    totalUsers: 256,
    activeInvestments: 184,
    totalDeposits: 5824500,
    pendingWithdrawals: 7,
    activePackages: 8,
    referralEarnings: 348200,
  };

  // Mock data for user registration stats
  const userRegistrationData = [
    { name: "Jan", users: 20 },
    { name: "Feb", users: 35 },
    { name: "Mar", users: 28 },
    { name: "Apr", users: 45 },
    { name: "May", users: 62 },
    { name: "Jun", users: 48 },
    { name: "Jul", users: 56 },
  ];

  // Mock data for investment distribution
  const investmentDistribution = [
    { name: "Growth Fund", value: 45 },
    { name: "Income Plus", value: 25 },
    { name: "Secure Yield", value: 20 },
    { name: "High Risk", value: 10 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // Mock data for recent activities
  const recentActivities = [
    {
      id: 1,
      type: "withdrawal",
      user: "john_doe",
      amount: 25000,
      status: "pending",
      time: "10 minutes ago",
    },
    {
      id: 2,
      type: "deposit",
      user: "jane_smith",
      amount: 100000,
      status: "completed",
      time: "30 minutes ago",
    },
    {
      id: 3,
      type: "referral",
      user: "mike_jones",
      amount: 2000,
      status: "completed",
      time: "1 hour ago",
    },
    {
      id: 4,
      type: "investment",
      user: "sarah_williams",
      amount: 50000,
      status: "completed",
      time: "3 hours ago",
    },
    {
      id: 5,
      type: "support",
      user: "david_brown",
      message: "Requested help with KYC verification",
      status: "pending",
      time: "5 hours ago",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the admin panel. Here's an overview of your platform.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Clock className="h-4 w-4 mr-2" />
            Last 7 Days
          </Button>
          <Button variant="outline" size="sm">
            <Globe className="h-4 w-4 mr-2" />
            All Regions
          </Button>
          <Button size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="dashboard-stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stats-label">Total Users</p>
              <p className="stats-value">{stats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
        </Card>

        <Card className="dashboard-stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stats-label">Total Investments</p>
              <p className="stats-value">KES {stats.totalDeposits.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
        </Card>

        <Card className="dashboard-stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stats-label">Active Packages</p>
              <p className="stats-value">{stats.activePackages}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <Package className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
        </Card>

        <Card className="dashboard-stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stats-label">Pending Withdrawals</p>
              <p className="stats-value">{stats.pendingWithdrawals}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
              <Clock className="h-6 w-6 text-amber-600 dark:text-amber-300" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Registration Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={userRegistrationData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#0070f3"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Investment Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Investment Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={investmentDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {investmentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Activity</th>
                  <th className="text-left py-3 px-4 font-medium">User</th>
                  <th className="text-left py-3 px-4 font-medium">Details</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Time</th>
                  <th className="text-left py-3 px-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map((activity) => (
                  <tr key={activity.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {activity.type === "deposit" && <CreditCard className="h-4 w-4 mr-2 text-green-600" />}
                        {activity.type === "withdrawal" && <CreditCard className="h-4 w-4 mr-2 text-red-600" />}
                        {activity.type === "investment" && <Package className="h-4 w-4 mr-2 text-blue-600" />}
                        {activity.type === "referral" && <Users className="h-4 w-4 mr-2 text-purple-600" />}
                        {activity.type === "support" && <MessageSquare className="h-4 w-4 mr-2 text-amber-600" />}
                        {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                      </div>
                    </td>
                    <td className="py-3 px-4">@{activity.user}</td>
                    <td className="py-3 px-4">
                      {activity.amount ? (
                        <span>KES {activity.amount.toLocaleString()}</span>
                      ) : (
                        <span>{activity.message}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {activity.status === "completed" ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Completed
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">{activity.time}</td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                      {activity.status === "pending" && (
                        <Button variant="ghost" size="sm" className="text-primary">
                          Review
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 text-center border-t">
            <Button variant="outline" size="sm">
              View All Activities
            </Button>
          </div>
        </Card>
      </div>

      {/* System Alerts */}
      <div>
        <h2 className="text-xl font-semibold mb-4">System Alerts</h2>
        <div className="space-y-4">
          <Card className="p-4 border-l-4 border-l-red-500">
            <div className="flex">
              <div className="mr-4">
                <Shield className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h3 className="font-medium">Security Alert: 3 Failed Login Attempts</h3>
                <p className="text-muted-foreground text-sm">
                  Multiple failed login attempts detected for user account "admin" from IP 192.168.1.254.
                </p>
                <div className="flex space-x-2 mt-2">
                  <Button variant="outline" size="sm">Ignore</Button>
                  <Button size="sm" className="bg-red-500 hover:bg-red-600">Investigate</Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-amber-500">
            <div className="flex">
              <div className="mr-4">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h3 className="font-medium">7 Withdrawal Requests Pending Approval</h3>
                <p className="text-muted-foreground text-sm">
                  There are 7 withdrawal requests that have been pending for more than 24 hours.
                </p>
                <Button variant="link" className="p-0 h-auto mt-1">
                  Process Now
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
