
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const StockSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Stock Settings</h1>
        <p className="text-muted-foreground">
          Configure inventory management settings and alerts
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
            <CardDescription>
              Configure when to receive alerts for low inventory levels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="enable-alerts" className="flex flex-col space-y-1">
                <span>Enable low stock alerts</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Get notified when stock levels fall below threshold
                </span>
              </Label>
              <Switch id="enable-alerts" />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="default-threshold">Default threshold percentage</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="default-threshold"
                  type="number"
                  defaultValue={15}
                  min={1}
                  max={100}
                />
                <span>%</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Alert when stock falls below this percentage of maximum stock level
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notification-method">Notification method</Label>
              <select
                id="notification-method"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="app">In-app notification only</option>
                <option value="email">Email</option>
                <option value="both">Both in-app and email</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock Count Settings</CardTitle>
            <CardDescription>
              Configure stock counting preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="fifo" className="flex flex-col space-y-1">
                <span>Use FIFO method</span>
                <span className="font-normal text-sm text-muted-foreground">
                  First in, first out inventory valuation method
                </span>
              </Label>
              <Switch id="fifo" defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="negative-stock" className="flex flex-col space-y-1">
                <span>Allow negative stock</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Allow stock to go below zero in urgent situations
                </span>
              </Label>
              <Switch id="negative-stock" />
            </div>
            
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="auto-adjust" className="flex flex-col space-y-1">
                <span>Auto-adjust stock levels</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Automatically update stock when orders are processed
                </span>
              </Label>
              <Switch id="auto-adjust" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Scheduled Stock Verification</CardTitle>
            <CardDescription>
              Set periodic stock verification schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="verification-freq">Verification frequency</Label>
                <select
                  id="verification-freq"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly" selected>Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="preferred-day">Preferred day</Label>
                <select
                  id="preferred-day"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option>Monday</option>
                  <option>Tuesday</option>
                  <option>Wednesday</option>
                  <option>Thursday</option>
                  <option>Friday</option>
                  <option>Saturday</option>
                  <option>Sunday</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Settings</Button>
      </div>
    </div>
  );
};

export default StockSettings;
