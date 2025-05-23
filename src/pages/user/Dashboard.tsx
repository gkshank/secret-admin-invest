
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  CreditCard,
  DollarSign,
  Package,
  Users,
  Clock,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Swal from "sweetalert2";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data for active investments
  const activeInvestments = [
    {
      id: 1,
      name: "Growth Fund",
      amount: 2500,
      roi: "12%",
      progress: 65,
      startDate: "2024-03-15",
      endDate: "2024-09-15",
    },
    {
      id: 2,
      name: "Income Plus",
      amount: 1000,
      roi: "8%",
      progress: 30,
      startDate: "2024-04-10",
      endDate: "2024-10-10",
    },
  ];

  // Mock data for recent transactions
  const recentTransactions = [
    {
      id: 1,
      type: "deposit",
      amount: 1000,
      status: "completed",
      date: "2024-04-18",
    },
    {
      id: 2,
      type: "investment",
      amount: 2500,
      status: "completed",
      date: "2024-04-15",
    },
    {
      id: 3,
      type: "referral",
      amount: 250,
      status: "completed",
      date: "2024-04-12",
    },
    {
      id: 4,
      type: "withdrawal",
      amount: 800,
      status: "pending",
      date: "2024-04-20",
    },
  ];

  // Quick actions handler
  const handleQuickAction = (action: string) => {
    switch(action) {
      case 'deposit':
        Swal.fire({
          title: 'Make a Deposit',
          html: `
            <div class="text-left mb-4">
              <p class="font-semibold">Deposit Instructions:</p>
              <ol class="list-decimal pl-5 mt-2">
                <li>Send the amount to our M-PESA till number: <strong>765432</strong></li>
                <li>Enter your name as the reference</li>
                <li>Complete the form below with your transaction details</li>
              </ol>
            </div>
            <form id="deposit-form">
              <div class="mb-3">
                <label for="amount" class="block text-left mb-1">Amount (KES)</label>
                <input type="number" id="amount" class="w-full px-3 py-2 border rounded-md" placeholder="Enter amount">
              </div>
              <div class="mb-3">
                <label for="mpesa-code" class="block text-left mb-1">M-PESA Transaction Code</label>
                <input type="text" id="mpesa-code" class="w-full px-3 py-2 border rounded-md" placeholder="e.g., QWE123456">
              </div>
              <div class="mb-3">
                <label for="phone" class="block text-left mb-1">Phone Number Used</label>
                <input type="tel" id="phone" class="w-full px-3 py-2 border rounded-md" placeholder="e.g., 0712345678">
              </div>
            </form>
          `,
          showCancelButton: true,
          confirmButtonText: "Submit Deposit",
          confirmButtonColor: "#0070f3",
          preConfirm: () => {
            const amount = (document.getElementById('amount') as HTMLInputElement).value;
            const code = (document.getElementById('mpesa-code') as HTMLInputElement).value;
            const phone = (document.getElementById('phone') as HTMLInputElement).value;
            
            if (!amount || !code || !phone) {
              Swal.showValidationMessage("Please fill in all fields");
              return false;
            }
            
            return { amount, code, phone };
          }
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              icon: "success",
              title: "Deposit Submitted",
              text: "Your deposit request has been received and is pending verification. It will be processed within 24 hours.",
              confirmButtonColor: "#0070f3",
            });
          }
        });
        break;
        
      case 'withdraw':
        Swal.fire({
          title: 'Request a Withdrawal',
          html: `
            <div class="text-left mb-4">
              <p>Available balance: <strong>KES ${user?.balance.toLocaleString()}</strong></p>
            </div>
            <form id="withdrawal-form">
              <div class="mb-3">
                <label for="amount" class="block text-left mb-1">Amount to Withdraw (KES)</label>
                <input 
                  type="number" 
                  id="amount" 
                  class="w-full px-3 py-2 border rounded-md" 
                  placeholder="Enter amount"
                  max="${user?.balance}"
                >
              </div>
              <div class="mb-3">
                <label for="phone" class="block text-left mb-1">M-PESA Number</label>
                <input type="tel" id="phone" class="w-full px-3 py-2 border rounded-md" placeholder="e.g., 0712345678">
              </div>
            </form>
            <p class="text-left text-sm text-gray-500 mt-2">Note: Withdrawals are processed within 24-48 hours. A 2% processing fee applies.</p>
          `,
          showCancelButton: true,
          confirmButtonText: "Request Withdrawal",
          confirmButtonColor: "#0070f3",
          preConfirm: () => {
            const amount = Number((document.getElementById('amount') as HTMLInputElement).value);
            const phone = (document.getElementById('phone') as HTMLInputElement).value;
            
            if (!amount || !phone) {
              Swal.showValidationMessage("Please fill in all fields");
              return false;
            }
            
            if (amount > (user?.balance || 0)) {
              Swal.showValidationMessage("Withdrawal amount exceeds your available balance");
              return false;
            }
            
            if (amount < 500) {
              Swal.showValidationMessage("Minimum withdrawal amount is KES 500");
              return false;
            }
            
            return { amount, phone };
          }
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              icon: "success",
              title: "Withdrawal Requested",
              text: "Your withdrawal request has been submitted successfully. It will be processed within 24-48 hours.",
              confirmButtonColor: "#0070f3",
            });
          }
        });
        break;
        
      case 'invest':
        navigate('/investments');
        break;
        
      case 'refer':
        Swal.fire({
          title: 'Refer a Friend',
          html: `
            <div class="text-center mb-4">
              <p class="font-semibold mb-2">Your Referral Code</p>
              <div class="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-lg font-mono">
                ${user?.referralCode}
              </div>
            </div>
            <div class="mb-4">
              <p class="text-center">Share this link with your friends:</p>
              <div class="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg mt-2 text-sm overflow-x-auto">
                https://fysinvest.com/register?ref=${user?.referralCode}
              </div>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <button class="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600">
                <i class="fab fa-whatsapp mr-1"></i> WhatsApp
              </button>
              <button class="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
                <i class="fab fa-facebook mr-1"></i> Facebook
              </button>
              <button class="bg-blue-400 text-white p-2 rounded-lg hover:bg-blue-500">
                <i class="fab fa-twitter mr-1"></i> Twitter
              </button>
            </div>
            <div class="mt-4 text-left">
              <p class="font-medium">Referral Benefits:</p>
              <ul class="list-disc pl-5 mt-1 text-sm">
                <li>Earn 5% of your referral's first investment</li>
                <li>Earn 1% of all their future investments</li>
                <li>Your friend gets a KES 500 bonus on their first investment</li>
              </ul>
            </div>
          `,
          confirmButtonText: "Copy Link",
          confirmButtonColor: "#0070f3",
        }).then((result) => {
          if (result.isConfirmed) {
            navigator.clipboard.writeText(`https://fysinvest.com/register?ref=${user?.referralCode}`);
            Swal.fire({
              icon: "success",
              title: "Copied!",
              text: "Referral link copied to clipboard",
              confirmButtonColor: "#0070f3",
              timer: 1500,
              showConfirmButton: false
            });
          }
        });
        break;
        
      case 'transactions':
        navigate('/transactions');
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back{user?.name ? `, ${user.name}` : ""}! Here's an overview of your investments.
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-bold">KES {user?.balance.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Investments</p>
              <p className="text-2xl font-bold">KES {activeInvestments.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Referral Earnings</p>
              <p className="text-2xl font-bold">KES {user?.referralEarnings.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Transactions</p>
              <p className="text-2xl font-bold">
                {recentTransactions.filter(t => t.status === "pending").length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
              <Clock className="h-6 w-6 text-amber-600 dark:text-amber-300" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 flex flex-col items-center gap-2 transition-colors"
            onClick={() => handleQuickAction('deposit')}
          >
            <CreditCard className="h-5 w-5 text-green-600" />
            <span>Deposit</span>
          </button>
          <button 
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 flex flex-col items-center gap-2 transition-colors"
            onClick={() => handleQuickAction('withdraw')}
          >
            <DollarSign className="h-5 w-5 text-red-600" />
            <span>Withdraw</span>
          </button>
          <button 
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 flex flex-col items-center gap-2 transition-colors"
            onClick={() => handleQuickAction('invest')}
          >
            <Package className="h-5 w-5 text-blue-600" />
            <span>Buy Package</span>
          </button>
          <button 
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 flex flex-col items-center gap-2 transition-colors"
            onClick={() => handleQuickAction('refer')}
          >
            <Users className="h-5 w-5 text-purple-600" />
            <span>Refer a Friend</span>
          </button>
        </div>
      </div>

      {/* Active Investments */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Active Investments</h2>
        {activeInvestments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeInvestments.map((investment) => (
              <Card key={investment.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{investment.name}</CardTitle>
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>{investment.roi} ROI</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Amount Invested</span>
                      <span className="font-medium">KES {investment.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Period</span>
                      <span className="font-medium">
                        {investment.startDate} - {investment.endDate}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{investment.progress}%</span>
                      </div>
                      <Progress value={investment.progress} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Card className="border-dashed border-2 bg-muted/50 flex items-center justify-center">
              <Button 
                variant="ghost" 
                className="w-full h-full py-8 flex flex-col items-center gap-2"
                onClick={() => navigate('/investments')}
              >
                <Package className="h-8 w-8 text-muted-foreground" />
                <span>Explore More Packages</span>
              </Button>
            </Card>
          </div>
        ) : (
          <Card className="p-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-3">
              <Package className="h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">You don't have any active investments yet.</p>
              <Button onClick={() => handleQuickAction('invest')}>
                Start Investing
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Type</th>
                  <th className="text-left py-3 px-4 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {transaction.type === "deposit" && <CreditCard className="h-4 w-4 mr-2 text-green-600" />}
                        {transaction.type === "withdrawal" && <CreditCard className="h-4 w-4 mr-2 text-red-600" />}
                        {transaction.type === "investment" && <Package className="h-4 w-4 mr-2 text-blue-600" />}
                        {transaction.type === "referral" && <Users className="h-4 w-4 mr-2 text-purple-600" />}
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {transaction.type === "withdrawal" ? (
                          <span className="text-red-600">- KES {transaction.amount.toLocaleString()}</span>
                        ) : (
                          <span className="text-green-600">+ KES {transaction.amount.toLocaleString()}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {transaction.status === "completed" ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Completed
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {transaction.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 text-center border-t">
            <Button variant="outline" size="sm" onClick={() => handleQuickAction('transactions')}>
              View All Transactions
            </Button>
          </div>
        </Card>
      </div>

      {/* Announcements */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Announcements</h2>
        <Card className="p-4 border-l-4 border-l-amber-500">
          <div className="flex">
            <div className="mr-4">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h3 className="font-medium">New Investment Packages Available</h3>
              <p className="text-muted-foreground text-sm">
                Check out our new high-yield packages now available for a limited time.
              </p>
              <Button variant="link" className="p-0 h-auto mt-1" onClick={() => handleQuickAction('invest')}>
                Learn More
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
