
import React, { useMemo } from 'react';
import { useData } from '@/contexts/data/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { 
  Truck, 
  User, 
  Package, 
  CreditCard, 
  Calendar, 
  AlertTriangle, 
  Check, 
  Clock,
  FileText,
  MapPin,
  ArrowRight
} from "lucide-react";

export default function Dashboard() {
  const { 
    orders, 
    vehicles, 
    salesmen,
    products,
    customers,
    payments 
  } = useData();
  const navigate = useNavigate();

  // Calculate key metrics
  const metrics = useMemo(() => {
    const unassigned = orders.filter(order => !order.vehicleId || !order.salesmanId).length;
    const fullyAssigned = orders.filter(order => order.vehicleId && order.salesmanId).length;
    const partiallyAssigned = orders.length - unassigned - fullyAssigned;
    
    // Get active vehicles and salesmen
    const activeVehicles = vehicles.filter(v => v.isActive).length;
    const activeSalesmen = salesmen.filter(s => s.isActive).length;
    
    // Get today's orders
    const today = new Date().toISOString().split('T')[0];
    const todaysOrders = orders.filter(order => order.date.startsWith(today)).length;
    
    // Calculate total payments received
    const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
    
    return {
      unassigned,
      fullyAssigned,
      partiallyAssigned,
      activeVehicles,
      activeSalesmen,
      todaysOrders,
      totalPayments,
      totalOrders: orders.length,
      totalProducts: products.length,
      totalCustomers: customers.length
    };
  }, [orders, vehicles, salesmen, products, customers, payments]);

  // Get recent unassigned orders
  const recentUnassignedOrders = useMemo(() => {
    return orders
      .filter(order => !order.vehicleId || !order.salesmanId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [orders]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your dashboard. Here's an overview of your milk distribution center.
        </p>
      </div>
      
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Assigned: {metrics.fullyAssigned + metrics.partiallyAssigned}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Fleet</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeVehicles}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total vehicles: {vehicles.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Salesmen</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeSalesmen}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total salesmen: {salesmen.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.todaysOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Last updated: {new Date().toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Assignment Status */}
      <Card>
        <CardHeader>
          <CardTitle>Order Assignment Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col items-center p-4 bg-red-50 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
              <h3 className="text-xl font-bold">{metrics.unassigned}</h3>
              <p className="text-sm text-red-600">Unassigned Orders</p>
              {metrics.unassigned > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => navigate('/orders')}
                >
                  Assign Now
                </Button>
              )}
            </div>
            
            <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg">
              <Clock className="h-8 w-8 text-yellow-500 mb-2" />
              <h3 className="text-xl font-bold">{metrics.partiallyAssigned}</h3>
              <p className="text-sm text-yellow-600">Partially Assigned</p>
              {metrics.partiallyAssigned > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => navigate('/orders')}
                >
                  Complete
                </Button>
              )}
            </div>
            
            <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
              <Check className="h-8 w-8 text-green-500 mb-2" />
              <h3 className="text-xl font-bold">{metrics.fullyAssigned}</h3>
              <p className="text-sm text-green-600">Fully Assigned</p>
              <Badge variant="success" className="mt-2">Ready for Delivery</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Unassigned Orders and Other Data */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Unassigned Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
              Orders Needing Assignment
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentUnassignedOrders.length > 0 ? (
              <div className="space-y-4">
                {recentUnassignedOrders.map(order => {
                  // Get customer name from the first item
                  const firstItem = order.items[0];
                  const customer = firstItem ? customers.find(c => c.id === firstItem.customerId) : null;
                  
                  return (
                    <div key={order.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                      <div>
                        <div className="font-medium">{customer?.name || 'Unknown Customer'}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(order.date).toLocaleDateString()} - {order.items.length} items
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {!order.vehicleId && (
                          <Badge variant="warning" className="flex items-center">
                            <Truck className="h-3 w-3 mr-1" />
                            No Vehicle
                          </Badge>
                        )}
                        {!order.salesmanId && (
                          <Badge variant="warning" className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            No Salesman
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full" 
                  onClick={() => navigate('/orders')}
                >
                  View All Unassigned Orders
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center py-6">
                <Check className="h-12 w-12 text-green-500 mb-2" />
                <p className="text-muted-foreground">All orders have been assigned!</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Business Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Business Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Customers Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center">
                  <User className="h-6 w-6 text-blue-600 mb-1" />
                  <span className="text-xl font-bold">{metrics.totalCustomers}</span>
                  <span className="text-xs text-muted-foreground">Total Customers</span>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg flex flex-col items-center">
                  <Package className="h-6 w-6 text-purple-600 mb-1" />
                  <span className="text-xl font-bold">{metrics.totalProducts}</span>
                  <span className="text-xs text-muted-foreground">Products</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Financial Overview</h3>
              <div className="bg-green-50 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Total Payments</p>
                    <p className="text-2xl font-bold">₹{metrics.totalPayments.toLocaleString()}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/payments')}>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center"
              onClick={() => navigate('/order-entry')}
            >
              <FileText className="h-6 w-6 mb-2" />
              <span>New Order</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center"
              onClick={() => navigate('/vehicle-tracking')}
            >
              <Truck className="h-6 w-6 mb-2" />
              <span>Vehicle Tracking</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center"
              onClick={() => navigate('/area-management')}
            >
              <MapPin className="h-6 w-6 mb-2" />
              <span>Area Management</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center"
              onClick={() => navigate('/payment-create')}
            >
              <CreditCard className="h-6 w-6 mb-2" />
              <span>Record Payment</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
