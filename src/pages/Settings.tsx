
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useData } from "@/contexts/DataContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Laptop, Moon, Sun, Database, Settings2, Download } from "lucide-react";
import { toast } from "sonner";
import { DataBackupRestore } from "@/components/settings/DataBackupRestore";

export default function Settings() {
  const { uiSettings, updateUISettings } = useData();
  const [theme, setTheme] = useState(uiSettings.theme || "light");
  const [accentColor, setAccentColor] = useState(uiSettings.accentColor || "teal");
  
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    updateUISettings({ theme: newTheme });
    // Apply theme to document
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    toast.success(`Theme changed to ${newTheme}`);
  };
  
  const handleAccentColorChange = (newColor: string) => {
    setAccentColor(newColor);
    updateUISettings({ accentColor: newColor });
    toast.success(`Accent color changed to ${newColor}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure application preferences and manage data
        </p>
      </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data Management
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the application looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="theme-mode">Theme Mode</Label>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant={theme === "light" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleThemeChange("light")}
                      className="w-24"
                    >
                      <Sun className="h-4 w-4 mr-2" />
                      Light
                    </Button>
                    <Button 
                      variant={theme === "dark" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleThemeChange("dark")}
                      className="w-24"
                    >
                      <Moon className="h-4 w-4 mr-2" />
                      Dark
                    </Button>
                    <Button 
                      variant={theme === "system" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleThemeChange("system")}
                      className="w-24"
                    >
                      <Laptop className="h-4 w-4 mr-2" />
                      System
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accent-color">Accent Color</Label>
                <Select value={accentColor} onValueChange={handleAccentColorChange}>
                  <SelectTrigger id="accent-color">
                    <SelectValue placeholder="Select an accent color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teal">Teal</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="pink">Pink</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="compact-mode">Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Reduce spacing throughout the interface
                  </p>
                </div>
                <Switch 
                  id="compact-mode" 
                  checked={uiSettings.compactMode || false}
                  onCheckedChange={(checked) => {
                    updateUISettings({ compactMode: checked });
                    toast.success(`Compact mode ${checked ? "enabled" : "disabled"}`);
                  }}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configure how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="payment-reminders">Payment Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about upcoming or overdue payments
                  </p>
                </div>
                <Switch 
                  id="payment-reminders" 
                  checked={uiSettings.paymentReminders || false}
                  onCheckedChange={(checked) => {
                    updateUISettings({ paymentReminders: checked });
                    toast.success(`Payment reminders ${checked ? "enabled" : "disabled"}`);
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="low-stock-alerts">Low Stock Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when products are running low
                  </p>
                </div>
                <Switch 
                  id="low-stock-alerts" 
                  checked={uiSettings.lowStockAlerts || false}
                  onCheckedChange={(checked) => {
                    updateUISettings({ lowStockAlerts: checked });
                    toast.success(`Low stock alerts ${checked ? "enabled" : "disabled"}`);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-4">
          {/* Add our new data backup and restore component */}
          <DataBackupRestore />
          
          <Card>
            <CardHeader>
              <CardTitle>Application Data</CardTitle>
              <CardDescription>
                View and manage application data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  This application stores all data locally on your device using browser's local storage.
                  No data is sent to any server unless you explicitly export it.
                </p>
                <p className="text-sm font-medium mt-4">Storage Management</p>
                <p className="text-sm text-muted-foreground">
                  Use with caution - these operations cannot be undone.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to clear all application data? This cannot be undone.")) {
                        StorageService.clearAllData();
                        toast.success("All data cleared. Reloading application...");
                        setTimeout(() => {
                          window.location.reload();
                        }, 1500);
                      }
                    }}
                    className="flex-1"
                  >
                    Clear All Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
