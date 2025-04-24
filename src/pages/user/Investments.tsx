
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  BarChart3,
  Clock,
  Calendar,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Info,
  CheckCircle,
  Filter,
  Search,
  ArrowRight
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Swal from "sweetalert2";

// Mock data for investment packages
const investmentPackages = [
  {
    id: "pkg-1",
    name: "Starter Fund",
    description: "Perfect for new investors looking to start their journey with minimal risk.",
    minAmount: 1000,
    maxAmount: 50000,
    roi: "8%",
    duration: 30, // days
    riskLevel: "Low",
    status: "active",
    category: "Fixed Income"
  },
  {
    id: "pkg-2",
    name: "Growth Portfolio",
    description: "Balanced investment focused on medium-term growth with moderate risk.",
    minAmount: 5000,
    maxAmount: 100000,
    roi: "12%",
    duration: 90, // days
    riskLevel: "Medium",
    status: "active",
    category: "Balanced"
  },
  {
    id: "pkg-3",
    name: "Premium Ventures",
    description: "High-yield opportunities for experienced investors looking for greater returns.",
    minAmount: 20000,
    maxAmount: 500000,
    roi: "18%",
    duration: 180, // days
    riskLevel: "High",
    status: "active",
    category: "Growth"
  },
  {
    id: "pkg-4",
    name: "Elite Fund",
    description: "Our exclusive high-end portfolio for significant investments with premium support.",
    minAmount: 100000,
    maxAmount: 1000000,
    roi: "22%",
    duration: 365, // days
    riskLevel: "High",
    status: "active",
    category: "Premium"
  },
  {
    id: "pkg-5",
    name: "Special Opportunity",
    description: "Limited time special opportunity with exceptional returns.",
    minAmount: 10000,
    maxAmount: 250000,
    roi: "15%",
    duration: 60, // days
    riskLevel: "Medium",
    status: "active",
    category: "Special"
  }
];

// Mock data for user's active investments
const userInvestments = [
  {
    id: "inv-1",
    packageId: "pkg-2",
    packageName: "Growth Portfolio",
    amount: 10000,
    roi: "12%",
    startDate: new Date(2024, 2, 15),
    endDate: new Date(2024, 5, 15),
    status: "active",
    progress: 45,
    projectedReturn: 1200,
  },
  {
    id: "inv-2",
    packageId: "pkg-1",
    packageName: "Starter Fund",
    amount: 5000,
    roi: "8%",
    startDate: new Date(2024, 3, 10),
    endDate: new Date(2024, 4, 10),
    status: "active",
    progress: 80,
    projectedReturn: 400,
  }
];

const Investments = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRisk, setSelectedRisk] = useState("all");

  // Filter packages based on search and filters
  const filteredPackages = investmentPackages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || pkg.category === selectedCategory;
    const matchesRisk = selectedRisk === "all" || pkg.riskLevel === selectedRisk;
    
    return matchesSearch && matchesCategory && matchesRisk;
  });

  // Categories and risk levels for filters
  const categories = ["Fixed Income", "Balanced", "Growth", "Premium", "Special"];
  const riskLevels = ["Low", "Medium", "High"];

  // Handle investment purchase
  const handleInvest = (packageId: string) => {
    const pkg = investmentPackages.find(p => p.id === packageId);
    if (!pkg) return;

    Swal.fire({
      title: `Invest in ${pkg.name}`,
      html: `
        <div class="text-left mb-4">
          <p class="mb-2"><strong>Package:</strong> ${pkg.name}</p>
          <p class="mb-2"><strong>ROI:</strong> ${pkg.roi}</p>
          <p class="mb-2"><strong>Duration:</strong> ${pkg.duration} days</p>
          <p class="mb-2"><strong>Min Amount:</strong> KES ${pkg.minAmount.toLocaleString()}</p>
          <p class="mb-2"><strong>Max Amount:</strong> KES ${pkg.maxAmount.toLocaleString()}</p>
          <p class="mb-4"><strong>Risk Level:</strong> ${pkg.riskLevel}</p>
        </div>
        <form id="invest-form">
          <div class="mb-3">
            <label for="amount" class="block text-left mb-1">Amount to Invest (KES)</label>
            <input
              type="number"
              id="amount"
              class="w-full px-3 py-2 border rounded-md"
              min="${pkg.minAmount}"
              max="${pkg.maxAmount}"
              placeholder="Enter amount"
            >
          </div>
          <div class="mb-3 flex items-center">
            <input type="checkbox" id="auto-reinvest" class="mr-2"> 
            <label for="auto-reinvest">Auto-reinvest returns at maturity</label>
          </div>
        </form>
      `,
      showCancelButton: true,
      confirmButtonText: "Confirm Investment",
      confirmButtonColor: "#0070f3",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const amount = Number((document.getElementById('amount') as HTMLInputElement).value);
        const autoReinvest = (document.getElementById('auto-reinvest') as HTMLInputElement).checked;
        
        if (!amount) {
          Swal.showValidationMessage("Please enter an investment amount");
          return false;
        }
        
        if (amount < pkg.minAmount) {
          Swal.showValidationMessage(`Minimum investment amount is KES ${pkg.minAmount.toLocaleString()}`);
          return false;
        }
        
        if (amount > pkg.maxAmount) {
          Swal.showValidationMessage(`Maximum investment amount is KES ${pkg.maxAmount.toLocaleString()}`);
          return false;
        }
        
        if (amount > (user?.balance || 0)) {
          Swal.showValidationMessage(`Insufficient balance. Your current balance is KES ${user?.balance.toLocaleString() || 0}`);
          return false;
        }
        
        return { amount, autoReinvest };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // In a real app, you would process the investment and update the database
        const amount = result.value.amount;
        const roi = parseFloat(pkg.roi) / 100;
        const projectedReturn = amount * roi;
        
        Swal.fire({
          icon: "success",
          title: "Investment Successful",
          html: `
            <p>You have successfully invested KES ${amount.toLocaleString()} in ${pkg.name}.</p>
            <p class="mt-2">Projected return: KES ${projectedReturn.toLocaleString()}</p>
            <p class="mt-2">Maturity date: ${new Date(Date.now() + pkg.duration * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
          `,
          confirmButtonColor: "#0070f3",
        });
      }
    });
  };

  // Handle view investment details
  const handleViewInvestment = (investmentId: string) => {
    const investment = userInvestments.find(inv => inv.id === investmentId);
    if (!investment) return;

    Swal.fire({
      title: "Investment Details",
      html: `
        <div class="text-left">
          <p class="mb-2"><strong>Package:</strong> ${investment.packageName}</p>
          <p class="mb-2"><strong>Amount:</strong> KES ${investment.amount.toLocaleString()}</p>
          <p class="mb-2"><strong>ROI:</strong> ${investment.roi}</p>
          <p class="mb-2"><strong>Start Date:</strong> ${investment.startDate.toLocaleDateString()}</p>
          <p class="mb-2"><strong>Maturity Date:</strong> ${investment.endDate.toLocaleDateString()}</p>
          <p class="mb-2"><strong>Status:</strong> Active</p>
          <p class="mb-2"><strong>Progress:</strong> ${investment.progress}%</p>
          <p class="mb-2"><strong>Projected Return:</strong> KES ${investment.projectedReturn.toLocaleString()}</p>
          <p class="mb-2"><strong>Total at Maturity:</strong> KES ${(investment.amount + investment.projectedReturn).toLocaleString()}</p>
        </div>
      `,
      confirmButtonText: "Close",
      confirmButtonColor: "#0070f3",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Investments</h1>
        <p className="text-muted-foreground">
          Grow your wealth with our carefully selected investment packages
        </p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">My Investments</TabsTrigger>
          <TabsTrigger value="packages">Available Packages</TabsTrigger>
        </TabsList>

        {/* My Active Investments Tab */}
        <TabsContent value="active" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">My Active Investments</h2>
              <p className="text-muted-foreground">Track the performance of your active investments</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Invested</p>
              <p className="text-lg font-bold">
                KES {userInvestments.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
              </p>
            </div>
          </div>

          {userInvestments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userInvestments.map(investment => (
                <Card key={investment.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{investment.packageName}</CardTitle>
                      <div className="flex items-center text-green-600 dark:text-green-400">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span>{investment.roi} ROI</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Amount Invested</span>
                        <span className="font-medium">KES {investment.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Projected Return</span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          +KES {investment.projectedReturn.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Period</span>
                        <span className="font-medium">
                          {investment.startDate.toLocaleDateString()} - {investment.endDate.toLocaleDateString()}
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
                  <CardFooter className="pt-0">
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => handleViewInvestment(investment.id)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <div className="flex flex-col items-center justify-center space-y-3">
                <Package className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">You don't have any active investments yet.</p>
                <Button onClick={() => document.querySelector('[data-value="packages"]')?.click()}>
                  Start Investing
                </Button>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Available Packages Tab */}
        <TabsContent value="packages" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search investment packages..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select 
                className="px-3 py-2 border rounded-md bg-background"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select 
                className="px-3 py-2 border rounded-md bg-background"
                value={selectedRisk}
                onChange={(e) => setSelectedRisk(e.target.value)}
              >
                <option value="all">All Risk Levels</option>
                {riskLevels.map(risk => (
                  <option key={risk} value={risk}>{risk}</option>
                ))}
              </select>
            </div>
          </div>

          {filteredPackages.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredPackages.map(pkg => (
                <Card key={pkg.id} className="overflow-hidden">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-semibold">{pkg.name}</h3>
                      </div>
                      <p className="mb-4 text-muted-foreground">{pkg.description}</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <div>
                            <p className="text-sm font-medium">ROI</p>
                            <p className="text-green-600 dark:text-green-400 font-bold">{pkg.roi}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <div>
                            <p className="text-sm font-medium">Duration</p>
                            <p>{pkg.duration} days</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-amber-500" />
                          <div>
                            <p className="text-sm font-medium">Min Investment</p>
                            <p>KES {pkg.minAmount.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className={`h-4 w-4 ${
                            pkg.riskLevel === "Low" ? "text-green-500" :
                            pkg.riskLevel === "Medium" ? "text-amber-500" : "text-red-500"
                          }`} />
                          <div>
                            <p className="text-sm font-medium">Risk Level</p>
                            <p>{pkg.riskLevel}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-muted/30 p-6 flex flex-col justify-center items-center">
                      <div className="text-center mb-4">
                        <p className="text-sm text-muted-foreground">Maximum Investment</p>
                        <p className="text-2xl font-bold">KES {pkg.maxAmount.toLocaleString()}</p>
                      </div>
                      <Button 
                        className="w-full flex items-center justify-center"
                        onClick={() => handleInvest(pkg.id)}
                      >
                        Invest Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <div className="flex flex-col items-center justify-center space-y-3">
                <Package className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">No investment packages match your search.</p>
                <Button variant="outline" onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedRisk("all");
                }}>
                  Clear Filters
                </Button>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Investments;
