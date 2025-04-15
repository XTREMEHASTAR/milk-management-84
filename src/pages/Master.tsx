
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, Users, Truck, Tag, Database, 
  Settings, Calendar, UserCog, MessageSquare, PaintBucket 
} from "lucide-react";

const Master = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Master Module</h1>
        <p className="text-muted-foreground">
          Manage your products, customers, suppliers, and settings
        </p>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="rates">Rate Management</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Products Management</CardTitle>
                <CardDescription>
                  Add, edit and manage your product catalog
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage all your products with details like SKU, price, and category
                </p>
                <Button onClick={() => navigate("/products")} className="w-full">
                  <Package className="mr-2 h-4 w-4" />
                  Manage Products
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Categories</CardTitle>
                <CardDescription>
                  Organize products with categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Create categories to better organize your product catalog
                </p>
                <Button onClick={() => navigate("/product-categories")} className="w-full">
                  <Database className="mr-2 h-4 w-4" />
                  Manage Categories
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stock Settings</CardTitle>
                <CardDescription>
                  Configure min/max stock levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Set minimum stock levels and get alerts when inventory is low
                </p>
                <Button onClick={() => navigate("/stock-settings")} className="w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  Stock Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Supplier Directory</CardTitle>
                <CardDescription>
                  Manage your supplier list
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Add, edit, and manage your suppliers with contact details
                </p>
                <Button onClick={() => navigate("/suppliers")} className="w-full">
                  <Truck className="mr-2 h-4 w-4" />
                  Manage Suppliers
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Supplier Ledger</CardTitle>
                <CardDescription>
                  Track financial transactions with suppliers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  View and download supplier ledger reports with date-wise entries
                </p>
                <Button onClick={() => navigate("/supplier-ledger")} className="w-full">
                  <Database className="mr-2 h-4 w-4" />
                  Supplier Ledger
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Purchase History</CardTitle>
                <CardDescription>
                  View purchase records by supplier
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Track and analyze historical purchases from suppliers
                </p>
                <Button onClick={() => navigate("/purchase-history")} className="w-full">
                  <Database className="mr-2 h-4 w-4" />
                  Purchase Records
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Customer Directory</CardTitle>
                <CardDescription>
                  Manage your customer database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Add, edit, and manage customer profiles and contact details
                </p>
                <Button onClick={() => navigate("/customers")} className="w-full">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Customers
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Ledger</CardTitle>
                <CardDescription>
                  Track financial transactions with customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  View and download customer ledger reports with date-wise entries
                </p>
                <Button onClick={() => navigate("/customer-ledger")} className="w-full">
                  <Database className="mr-2 h-4 w-4" />
                  Customer Ledger
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Truck Sheets</CardTitle>
                <CardDescription>
                  Manage vehicle-wise delivery sheets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Organize deliveries by vehicle and route
                </p>
                <Button onClick={() => navigate("/track-sheet")} className="w-full">
                  <Truck className="mr-2 h-4 w-4" />
                  Track Sheets
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Customer Rates</CardTitle>
                <CardDescription>
                  Manage customer-specific pricing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Set and update special rates for individual customers
                </p>
                <Button onClick={() => navigate("/customer-rates")} className="w-full">
                  <Tag className="mr-2 h-4 w-4" />
                  Customer Rates
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Rates</CardTitle>
                <CardDescription>
                  Manage product pricing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Set and update default product rates
                </p>
                <Button onClick={() => navigate("/product-rates")} className="w-full">
                  <Tag className="mr-2 h-4 w-4" />
                  Product Rates
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bulk Rate Update</CardTitle>
                <CardDescription>
                  Update multiple rates at once
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Apply rate changes to multiple customers or products at once
                </p>
                <Button onClick={() => navigate("/bulk-rates")} className="w-full">
                  <Database className="mr-2 h-4 w-4" />
                  Bulk Update
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 text-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Financial Year</CardTitle>
                <CardDescription className="text-gray-300">
                  Manage financial year settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mb-4">
                  Configure financial year start/end and perform year closing
                </p>
                <Button onClick={() => navigate("/financial-year")} className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20">
                  <Calendar className="mr-2 h-4 w-4" />
                  Financial Year
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 text-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Communication</CardTitle>
                <CardDescription className="text-gray-300">
                  Configure notification settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mb-4">
                  Set up WhatsApp, SMS, and email notification templates
                </p>
                <Button onClick={() => navigate("/communication")} className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Communication
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 text-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">User Access</CardTitle>
                <CardDescription className="text-gray-300">
                  Manage user roles and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mb-4">
                  Control who can access different parts of the system
                </p>
                <Button onClick={() => navigate("/user-access")} className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20">
                  <UserCog className="mr-2 h-4 w-4" />
                  User Access
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 text-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Theme & UI</CardTitle>
                <CardDescription className="text-gray-300">
                  Customize application appearance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mb-4">
                  Change theme colors, fonts, and UI preferences
                </p>
                <Button onClick={() => navigate("/settings")} className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20">
                  <PaintBucket className="mr-2 h-4 w-4" />
                  Theme Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Master;
