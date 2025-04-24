
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowUpRight, 
  TrendingUp, 
  Calendar, 
  AlertCircle, 
  Lock, 
  Clock, 
  DollarSign, 
  BarChart4, 
  Filter
} from "lucide-react";
import Swal from "sweetalert2";

// Investment package type definition
interface InvestmentPackage {
  id: string;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number | null;
  roi: number; // Return on Investment percentage
  duration: number; // Duration in days
  status: "active" | "paused" | "completed";
  riskLevel: "low" | "medium" | "high";
  features: string[];
  popularity: number;
}

// Active investment type definition
interface ActiveInvestment {
  id: string;
  packageId: string;
  packageName: string;
  amount: number;
  startDate: Date;
  endDate: Date;
  expectedReturn: number;
  status: "active" | "matured" | "cancelled";
  progress: number;
  autoReinvest: boolean;
}

// Mock investment packages
const investmentPackages: InvestmentPackage[] = [
  {
    id: "pkg1",
    name: "Starter Growth",
    description: "Perfect for beginners. Low risk with steady returns.",
    minAmount: 5000,
    maxAmount: 50000,
    roi: 7.5,
    duration: 30,
    status: "active",
    riskLevel: "low",
    features: ["No early withdrawal", "Interest paid at maturity", "Principal guaranteed"],
    popularity: 85,
  },
  {
    id: "pkg2",
    name: "Premium Growth",
    description: "Balanced risk and reward for moderate investors.",
    minAmount: 50000,
    maxAmount: 500000,
    roi: 12.5,
    duration: 90,
    status: "active",
    riskLevel: "medium",
    features: ["Partial early withdrawal", "Monthly interest payments", "Principal protected"],
    popularity: 72,
  },
  {
    id: "pkg3",
    name: "Wealth Maximizer",
    description: "Higher risk, higher reward for experienced investors.",
    minAmount: 500000,
    maxAmount: null,
    roi: 18.0,
    duration: 180,
    status: "active",
    riskLevel: "high",
    features: ["Quarterly dividend options", "Flexible withdrawal terms", "Advanced portfolio exposure"],
    popularity: 60,
  },
  {
    id: "pkg4",
    name: "Quick Returns",
    description: "Short-term investment with quick returns.",
    minAmount: 10000,
    maxAmount: 100000,
    roi: 5.0,
    duration: 15,
    status: "active",
    riskLevel: "low",
    features: ["Express processing", "Weekend payouts", "No lock-in period"],
    popularity: 90,
  },
];

// Mock active investments
const mockActiveInvestments: ActiveInvestment[] = [
  {
    id: "inv1",
    packageId: "pkg1",
    packageName: "Starter Growth",
    amount: 25000,
    startDate: new Date(2023, 0, 15),
    endDate: new Date(2023, 1, 14),
    expectedReturn: 25000 * 1.075,
    status: "active",
    progress: 65,
    autoReinvest: true,
  },
  {
    id: "inv2",
    packageId: "pkg4",
    packageName: "Quick Returns",
    amount: 15000,
    startDate: new Date(2023, 1, 1),
    endDate: new Date(2023, 1, 16),
    expectedReturn: 15000 * 1.05,
    status: "active",
    progress: 80,
    autoReinvest: false,
  },
];

const Investments = () => {
  const { user } = useAuth();
  const [activeInvestments, setActiveInvestments] = useState<ActiveInvestment[]>(mockActiveInvestments);
  const [selectedPackage, setSelectedPackage] = useState<InvestmentPackage | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<number>(0);
  const [filter, setFilter] = useState<"all" | "low" | "medium" | "high">("all");

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Calculate days remaining
  const daysRemaining = (endDate: Date): number => {
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Handle investment
  const handleInvest = (pkg: InvestmentPackage) => {
    setSelectedPackage(pkg);
    
    Swal.fire({
      title: `Invest in ${pkg.name}`,
      html: `
        <div class="mb-4">
          <p class="mb-2 text-left text-sm">Package Details:</p>
          <ul class="list-disc pl-5 text-left text-sm">
            <li>ROI: ${pkg.roi}%</li>
            <li>Duration: ${pkg.duration} days</li>
            <li>Min Investment: ${formatCurrency(pkg.minAmount)}</li>
            <li>Risk Level: ${pkg.riskLevel.toUpperCase()}</li>
          </ul>
        </div>
        <div class="mb-4">
          <label for="investment-amount" class="block text-left text-sm font-medium mb-1">Investment Amount (KES)</label>
          <input 
            id="investment-amount" 
            type="number" 
            min="${pkg.minAmount}"
            ${pkg.maxAmount ? `max="${pkg.maxAmount}"` : ""}
            class="w-full p-2 border rounded-md"
            placeholder="Enter amount"
          />
        </div>
        <div class="flex items-center mb-4">
          <input id="auto-reinvest" type="checkbox" class="mr-2" />
          <label for="auto-reinvest" class="text-left text-sm">Enable auto-reinvestment</label>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: "#0070f3",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm Investment",
      preConfirm: () => {
        const amountInput = document.getElementById('investment-amount') as HTMLInputElement;
        const autoReinvest = (document.getElementById('auto-reinvest') as HTMLInputElement).checked;
        
        const amount = Number(amountInput.value);
        
        // Validate amount
        if (!amount) {
          Swal.showValidationMessage('Please enter an investment amount');
          return false;
        }
        
        if (amount < pkg.minAmount) {
          Swal.showValidationMessage(`Minimum investment amount is ${formatCurrency(pkg.minAmount)}`);
          return false;
        }
        
        if (pkg.maxAmount && amount > pkg.maxAmount) {
          Swal.showValidationMessage(`Maximum investment amount is ${formatCurrency(pkg.maxAmount)}`);
          return false;
        }
        
        if (amount > (user?.balance || 0)) {
          Swal.showValidationMessage(`Insufficient balance. Available: ${formatCurrency(user?.balance || 0)}`);
          return false;
        }
        
        return { amount, autoReinvest };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const { amount, autoReinvest } = result.value;
        
        // Create a new investment
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + pkg.duration);
        
        const newInvestment: ActiveInvestment = {
          id: `inv${Date.now()}`,
          packageId: pkg.id,
          packageName: pkg.name,
          amount,
          startDate,
          endDate,
          expectedReturn: amount * (1 + pkg.roi / 100),
          status: "active",
          progress: 0,
          autoReinvest,
        };
        
        // Add to active investments
        setActiveInvestments([...activeInvestments, newInvestment]);
        
        Swal.fire({
          icon: "success",
          title: "Investment Successful!",
          text: `You have successfully invested ${formatCurrency(amount)} in ${pkg.name}. Expected return: ${formatCurrency(newInvestment.expectedReturn)}`,
          confirmButtonColor: "#0070f3",
        });
      }
    });
  };

  // Handle toggle auto-reinvest
  const toggleAutoReinvest = (investmentId: string) => {
    setActiveInvestments(
      activeInvestments.map((inv) => 
        inv.id === investmentId 
          ? { ...inv, autoReinvest: !inv.autoReinvest } 
          : inv
      )
    );
    
    Swal.fire({
      icon: "success",
      title: "Setting Updated",
      text: "Auto-reinvest setting has been updated.",
      confirmButtonColor: "#0070f3",
    });
  };

  // Filter packages by risk level
  const filteredPackages = investmentPackages.filter(pkg => {
    if (filter === "all") return true;
    return pkg.riskLevel === filter;
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Investment Center</h1>
          <p className="text-gray-500 dark:text-gray-400">Grow your wealth with our investment packages</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => {
            document.getElementById('active-investments-tab')?.click();
          }}>
            <BarChart4 className="h-4 w-4 mr-1" />
            My Investments
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            document.getElementById('filter-dialog')?.click();
          }}>
            <Filter className="h-4 w-4 mr-1" />
            Filter
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="packages">
        <TabsList className="mb-4">
          <TabsTrigger value="packages">Available Packages</TabsTrigger>
          <TabsTrigger id="active-investments-tab" value="active">Active Investments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="packages" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPackages.map((pkg) => (
              <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{pkg.name}</CardTitle>
                      <CardDescription className="mt-1">{pkg.description}</CardDescription>
                    </div>
                    <Badge variant={
                      pkg.riskLevel === "low" ? "outline" :
                      pkg.riskLevel === "medium" ? "secondary" : "destructive"
                    }>
                      {pkg.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Minimum Investment</p>
                      <p className="text-lg font-semibold">{formatCurrency(pkg.minAmount)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">ROI</p>
                      <p className="text-lg font-semibold text-green-600 flex items-center">
                        {pkg.roi}% <TrendingUp className="ml-1 h-4 w-4" />
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                      <p className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                        {pkg.duration} days
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Popularity</p>
                      <div className="flex items-center justify-end">
                        <Progress value={pkg.popularity} className="h-2 w-20" />
                        <span className="ml-2 text-sm">{pkg.popularity}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Key Features:</p>
                    <ul className="text-sm space-y-1">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <ArrowUpRight className="h-3 w-3 mr-1 text-green-600 mt-1 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handleInvest(pkg)}
                    disabled={pkg.status !== "active"}
                  >
                    <DollarSign className="h-4 w-4 mr-1" />
                    Invest Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="active">
          {activeInvestments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeInvestments.map((inv) => (
                <Card key={inv.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{inv.packageName}</CardTitle>
                      <Badge variant="outline" className="ml-2">
                        {inv.status.toUpperCase()}
                      </Badge>
                    </div>
                    <CardDescription>
                      Investment ID: {inv.id}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Principal</p>
                          <p className="font-semibold">{formatCurrency(inv.amount)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Expected Return</p>
                          <p className="font-semibold text-green-600">{formatCurrency(inv.expectedReturn)}</p>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{inv.progress}%</span>
                        </div>
                        <Progress value={inv.progress} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Start Date</p>
                          <p className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                            {formatDate(inv.startDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Maturity Date</p>
                          <p className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                            {formatDate(inv.endDate)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-500" />
                          <span>
                            {daysRemaining(inv.endDate) > 0
                              ? `${daysRemaining(inv.endDate)} days remaining`
                              : "Matured"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">Auto-reinvest:</span>
                          <Button
                            variant={inv.autoReinvest ? "default" : "outline"}
                            size="sm"
                            className={`h-7 ${inv.autoReinvest ? 'bg-green-600 hover:bg-green-700' : ''}`}
                            onClick={() => toggleAutoReinvest(inv.id)}
                          >
                            {inv.autoReinvest ? "ON" : "OFF"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Active Investments</h3>
              <p className="text-gray-500 max-w-md mb-6">
                You don't have any active investments yet. Browse our packages and start growing your money today.
              </p>
              <Button onClick={() => {
                const packagesTab = document.querySelector('[data-value="packages"]');
                if (packagesTab instanceof HTMLElement) {
                  packagesTab.click();
                }
              }}>
                View Investment Packages
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Hidden button for filter dialog */}
      <Button 
        id="filter-dialog" 
        className="hidden"
        onClick={() => {
          Swal.fire({
            title: 'Filter Packages',
            html: `
              <div class="flex flex-col space-y-3 text-left">
                <label class="inline-flex items-center">
                  <input type="radio" name="risk-filter" value="all" class="mr-2" checked>
                  <span>All Risk Levels</span>
                </label>
                <label class="inline-flex items-center">
                  <input type="radio" name="risk-filter" value="low" class="mr-2">
                  <span>Low Risk Only</span>
                </label>
                <label class="inline-flex items-center">
                  <input type="radio" name="risk-filter" value="medium" class="mr-2">
                  <span>Medium Risk Only</span>
                </label>
                <label class="inline-flex items-center">
                  <input type="radio" name="risk-filter" value="high" class="mr-2">
                  <span>High Risk Only</span>
                </label>
              </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Apply Filter',
            confirmButtonColor: '#0070f3',
            focusConfirm: false,
            preConfirm: () => {
              const selected = document.querySelector('input[name="risk-filter"]:checked') as HTMLInputElement;
              return selected ? selected.value : 'all';
            }
          }).then((result) => {
            if (result.isConfirmed) {
              setFilter(result.value as "all" | "low" | "medium" | "high");
            }
          });
        }}
      >
        Filter
      </Button>
    </div>
  );
};

export default Investments;
