
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, DollarSign, FileSpreadsheet, ShoppingBag, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Suppliers = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
          <p className="text-muted-foreground">
            Manage suppliers, payments, and purchase history
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
        </div>
      </div>

      <Tabs defaultValue="directory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="directory">
            <Truck className="mr-2 h-4 w-4" />
            Directory
          </TabsTrigger>
          <TabsTrigger value="payments">
            <DollarSign className="mr-2 h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="purchases">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Purchases
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="directory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Contact Person</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Phone</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4 align-middle">Farmfresh Dairy</td>
                      <td className="p-4 align-middle">John Smith</td>
                      <td className="p-4 align-middle">+91 98765 43210</td>
                      <td className="p-4 align-middle">
                        <Badge variant="success">Active</Badge>
                      </td>
                      <td className="p-4 align-middle">
                        <Button variant="outline" size="sm">View</Button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 align-middle">Organic Milk Co.</td>
                      <td className="p-4 align-middle">Sarah Johnson</td>
                      <td className="p-4 align-middle">+91 87654 32109</td>
                      <td className="p-4 align-middle">
                        <Badge variant="success">Active</Badge>
                      </td>
                      <td className="p-4 align-middle">
                        <Button variant="outline" size="sm">View</Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 align-middle">Hill Valley Farms</td>
                      <td className="p-4 align-middle">Robert Brown</td>
                      <td className="p-4 align-middle">+91 76543 21098</td>
                      <td className="p-4 align-middle">
                        <Badge variant="warning">Inactive</Badge>
                      </td>
                      <td className="p-4 align-middle">
                        <Button variant="outline" size="sm">View</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                View and manage payments to suppliers
              </p>
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="h-12 px-4 text-left align-middle font-medium">Supplier</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Amount</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4 align-middle">Farmfresh Dairy</td>
                      <td className="p-4 align-middle">2023-05-15</td>
                      <td className="p-4 align-middle">₹15,000</td>
                      <td className="p-4 align-middle">
                        <Badge variant="success">Paid</Badge>
                      </td>
                      <td className="p-4 align-middle">
                        <Button variant="outline" size="sm">Details</Button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 align-middle">Organic Milk Co.</td>
                      <td className="p-4 align-middle">2023-05-10</td>
                      <td className="p-4 align-middle">₹8,750</td>
                      <td className="p-4 align-middle">
                        <Badge variant="success">Paid</Badge>
                      </td>
                      <td className="p-4 align-middle">
                        <Button variant="outline" size="sm">Details</Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 align-middle">Hill Valley Farms</td>
                      <td className="p-4 align-middle">2023-05-05</td>
                      <td className="p-4 align-middle">₹12,300</td>
                      <td className="p-4 align-middle">
                        <Badge variant="warning">Pending</Badge>
                      </td>
                      <td className="p-4 align-middle">
                        <Button variant="outline" size="sm">Details</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="purchases">
          <Card>
            <CardHeader>
              <CardTitle>Purchase History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Track and manage purchases from suppliers
              </p>
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="h-12 px-4 text-left align-middle font-medium">Invoice #</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Supplier</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Items</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Amount</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4 align-middle">PUR-001</td>
                      <td className="p-4 align-middle">Farmfresh Dairy</td>
                      <td className="p-4 align-middle">2023-05-15</td>
                      <td className="p-4 align-middle">12</td>
                      <td className="p-4 align-middle">₹15,000</td>
                      <td className="p-4 align-middle">
                        <Button variant="outline" size="sm">View</Button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 align-middle">PUR-002</td>
                      <td className="p-4 align-middle">Organic Milk Co.</td>
                      <td className="p-4 align-middle">2023-05-10</td>
                      <td className="p-4 align-middle">8</td>
                      <td className="p-4 align-middle">₹8,750</td>
                      <td className="p-4 align-middle">
                        <Button variant="outline" size="sm">View</Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 align-middle">PUR-003</td>
                      <td className="p-4 align-middle">Hill Valley Farms</td>
                      <td className="p-4 align-middle">2023-05-05</td>
                      <td className="p-4 align-middle">10</td>
                      <td className="p-4 align-middle">₹12,300</td>
                      <td className="p-4 align-middle">
                        <Button variant="outline" size="sm">View</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Suppliers;
