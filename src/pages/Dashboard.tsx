
import React from 'react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your dashboard
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-medium">Recent Orders</h3>
          <p className="text-muted-foreground">No recent orders</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-medium">Outstanding Payments</h3>
          <p className="text-muted-foreground">No outstanding payments</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-medium">Stock Status</h3>
          <p className="text-muted-foreground">All products in stock</p>
        </div>
      </div>
    </div>
  );
}
