
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Plus, Edit2, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

interface InvestmentPackage {
  id: string;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number | null;
  roi: number;
  duration: number;
  status: "active" | "paused" | "completed";
  riskLevel: "low" | "medium" | "high";
}

const AdminPackages = () => {
  const [packages, setPackages] = useState<InvestmentPackage[]>([
    {
      id: "pkg1",
      name: "Starter Growth",
      description: "Perfect for beginners. Low risk with steady returns.",
      minAmount: 5000,
      maxAmount: 50000,
      roi: 7.5,
      duration: 30,
      status: "active",
      riskLevel: "low"
    }
  ]);

  const handleAddPackage = () => {
    Swal.fire({
      title: "Add New Investment Package",
      html: `
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Package Name</label>
            <input id="name" class="w-full p-2 border rounded" required>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Description</label>
            <textarea id="description" class="w-full p-2 border rounded" rows="3" required></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Minimum Amount</label>
              <input id="minAmount" type="number" class="w-full p-2 border rounded" required>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Maximum Amount</label>
              <input id="maxAmount" type="number" class="w-full p-2 border rounded">
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">ROI (%)</label>
              <input id="roi" type="number" step="0.1" class="w-full p-2 border rounded" required>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Duration (days)</label>
              <input id="duration" type="number" class="w-full p-2 border rounded" required>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Risk Level</label>
            <select id="riskLevel" class="w-full p-2 border rounded" required>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Add Package",
      confirmButtonColor: "#0070f3",
      preConfirm: () => {
        const name = (document.getElementById('name') as HTMLInputElement).value;
        const description = (document.getElementById('description') as HTMLTextAreaElement).value;
        const minAmount = Number((document.getElementById('minAmount') as HTMLInputElement).value);
        const maxAmount = Number((document.getElementById('maxAmount') as HTMLInputElement).value) || null;
        const roi = Number((document.getElementById('roi') as HTMLInputElement).value);
        const duration = Number((document.getElementById('duration') as HTMLInputElement).value);
        const riskLevel = (document.getElementById('riskLevel') as HTMLSelectElement).value as "low" | "medium" | "high";

        if (!name || !description || !minAmount || !roi || !duration) {
          Swal.showValidationMessage('Please fill in all required fields');
          return false;
        }

        return {
          name,
          description,
          minAmount,
          maxAmount,
          roi,
          duration,
          riskLevel
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const newPackage: InvestmentPackage = {
          id: `pkg-${Date.now()}`,
          status: "active",
          ...result.value
        };
        setPackages([...packages, newPackage]);
        
        Swal.fire({
          icon: "success",
          title: "Package Added",
          text: "New investment package has been created successfully.",
          confirmButtonColor: "#0070f3",
        });
      }
    });
  };

  const handleEditPackage = (pkg: InvestmentPackage) => {
    Swal.fire({
      title: "Edit Investment Package",
      html: `
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Package Name</label>
            <input id="name" class="w-full p-2 border rounded" value="${pkg.name}" required>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Description</label>
            <textarea id="description" class="w-full p-2 border rounded" rows="3" required>${pkg.description}</textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Minimum Amount</label>
              <input id="minAmount" type="number" class="w-full p-2 border rounded" value="${pkg.minAmount}" required>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Maximum Amount</label>
              <input id="maxAmount" type="number" class="w-full p-2 border rounded" value="${pkg.maxAmount || ''}">
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">ROI (%)</label>
              <input id="roi" type="number" step="0.1" class="w-full p-2 border rounded" value="${pkg.roi}" required>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Duration (days)</label>
              <input id="duration" type="number" class="w-full p-2 border rounded" value="${pkg.duration}" required>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Risk Level</label>
            <select id="riskLevel" class="w-full p-2 border rounded" required>
              <option value="low" ${pkg.riskLevel === 'low' ? 'selected' : ''}>Low</option>
              <option value="medium" ${pkg.riskLevel === 'medium' ? 'selected' : ''}>Medium</option>
              <option value="high" ${pkg.riskLevel === 'high' ? 'selected' : ''}>High</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Status</label>
            <select id="status" class="w-full p-2 border rounded" required>
              <option value="active" ${pkg.status === 'active' ? 'selected' : ''}>Active</option>
              <option value="paused" ${pkg.status === 'paused' ? 'selected' : ''}>Paused</option>
              <option value="completed" ${pkg.status === 'completed' ? 'selected' : ''}>Completed</option>
            </select>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Update Package",
      confirmButtonColor: "#0070f3",
      preConfirm: () => {
        const name = (document.getElementById('name') as HTMLInputElement).value;
        const description = (document.getElementById('description') as HTMLTextAreaElement).value;
        const minAmount = Number((document.getElementById('minAmount') as HTMLInputElement).value);
        const maxAmount = Number((document.getElementById('maxAmount') as HTMLInputElement).value) || null;
        const roi = Number((document.getElementById('roi') as HTMLInputElement).value);
        const duration = Number((document.getElementById('duration') as HTMLInputElement).value);
        const riskLevel = (document.getElementById('riskLevel') as HTMLSelectElement).value as "low" | "medium" | "high";
        const status = (document.getElementById('status') as HTMLSelectElement).value as "active" | "paused" | "completed";

        if (!name || !description || !minAmount || !roi || !duration) {
          Swal.showValidationMessage('Please fill in all required fields');
          return false;
        }

        return {
          name,
          description,
          minAmount,
          maxAmount,
          roi,
          duration,
          riskLevel,
          status
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setPackages(packages.map(p => 
          p.id === pkg.id ? { ...p, ...result.value } : p
        ));
        
        Swal.fire({
          icon: "success",
          title: "Package Updated",
          text: "Investment package has been updated successfully.",
          confirmButtonColor: "#0070f3",
        });
      }
    });
  };

  const handleDeletePackage = (packageId: string) => {
    Swal.fire({
      title: "Delete Package",
      text: "Are you sure you want to delete this package?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
    }).then((result) => {
      if (result.isConfirmed) {
        setPackages(packages.filter(p => p.id !== packageId));
        
        Swal.fire({
          icon: "success",
          title: "Package Deleted",
          text: "Investment package has been deleted successfully.",
          confirmButtonColor: "#0070f3",
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Investment Packages</h1>
          <p className="text-muted-foreground">
            Manage investment packages and their parameters
          </p>
        </div>
        <Button onClick={handleAddPackage}>
          <Plus className="mr-2 h-4 w-4" />
          Add Package
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="relative">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  {pkg.name}
                </span>
                <div className="space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleEditPackage(pkg)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeletePackage(pkg.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{pkg.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Minimum Amount</p>
                    <p className="text-muted-foreground">KES {pkg.minAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-medium">Maximum Amount</p>
                    <p className="text-muted-foreground">
                      {pkg.maxAmount ? `KES ${pkg.maxAmount.toLocaleString()}` : "No limit"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">ROI</p>
                    <p className="text-muted-foreground">{pkg.roi}%</p>
                  </div>
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-muted-foreground">{pkg.duration} days</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    pkg.riskLevel === "low" ? "bg-green-100 text-green-800" :
                    pkg.riskLevel === "medium" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {pkg.riskLevel.toUpperCase()} RISK
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    pkg.status === "active" ? "bg-green-100 text-green-800" :
                    pkg.status === "paused" ? "bg-yellow-100 text-yellow-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {pkg.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminPackages;
