
import React, { useState, useEffect } from "react";
import { useData } from "@/contexts/data/DataContext";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerProductRate } from "@/types";
import { format } from "date-fns";

export default function CustomerRates() {
  const { customers, products, addCustomerProductRate, updateCustomerProductRate, deleteCustomerProductRate, getCustomerProductRates } = useData();
  const [selectedCustomerId, setSelectedCustomerId] = useState("none"); // Changed from empty string to "none"
  const [customerRates, setCustomerRates] = useState<CustomerProductRate[]>([]);
  const [editingRates, setEditingRates] = useState<Record<string, number>>({});

  // Load customer rates when customer selection changes
  useEffect(() => {
    if (selectedCustomerId && selectedCustomerId !== "none") {
      const rates = getCustomerProductRates(selectedCustomerId);
      setCustomerRates(rates);
      
      // Initialize editing state with current rates
      const rateMap: Record<string, number> = {};
      rates.forEach(rate => {
        rateMap[rate.productId] = rate.rate;
      });
      setEditingRates(rateMap);
    } else {
      setCustomerRates([]);
      setEditingRates({});
    }
  }, [selectedCustomerId, getCustomerProductRates]);

  const handleRateChange = (productId: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setEditingRates(prev => ({
        ...prev,
        [productId]: numValue
      }));
    }
  };

  const saveProductRate = (productId: string) => {
    const rate = editingRates[productId];
    if (!rate) return;

    const existingRate = customerRates.find(r => r.productId === productId);
    
    if (existingRate) {
      updateCustomerProductRate(existingRate.id, { rate });
      toast.success("Product rate updated");
    } else {
      addCustomerProductRate({
        customerId: selectedCustomerId,
        productId,
        rate,
        effectiveDate: format(new Date(), "yyyy-MM-dd")
      });
      toast.success("Product rate added");
    }
  };

  const deleteProductRate = (rateId: string) => {
    deleteCustomerProductRate(rateId);
    toast.success("Custom rate removed");
    
    // Refresh rates after deletion
    if (selectedCustomerId && selectedCustomerId !== "none") {
      const rates = getCustomerProductRates(selectedCustomerId);
      setCustomerRates(rates);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Customer-Wise Product Rates</h1>
        <p className="text-gray-500">Set custom product rates for specific customers</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Customer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-md mb-6">
            <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Select a customer</SelectItem>
                {customers.map(customer => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedCustomerId && selectedCustomerId !== "none" && (
        <Card>
          <CardHeader>
            <CardTitle>Product Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Default Rate (₹)</TableHead>
                    <TableHead>Custom Rate (₹)</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length > 0 ? (
                    products.map(product => {
                      const existingRate = customerRates.find(r => r.productId === product.id);
                      return (
                        <TableRow key={product.id}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.price}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={editingRates[product.id] || ""}
                              onChange={(e) => handleRateChange(product.id, e.target.value)}
                              placeholder={`${product.price}`}
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>
                            {existingRate ? (
                              <div className="flex space-x-2">
                                <Button size="sm" onClick={() => saveProductRate(product.id)}>
                                  Update
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => deleteProductRate(existingRate.id)}>
                                  Remove
                                </Button>
                              </div>
                            ) : (
                              <Button 
                                size="sm" 
                                onClick={() => saveProductRate(product.id)}
                                disabled={!editingRates[product.id]}
                              >
                                Set Rate
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        No products available. Add products first to set custom rates.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
