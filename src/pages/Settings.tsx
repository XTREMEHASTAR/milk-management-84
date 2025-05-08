
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useData } from "@/contexts/DataContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Laptop, Moon, Sun, Database, Settings2, Download, Palette, ScreenShare, Bell, FileText, Languages, Printer, Lock, User, Clock, Mail } from "lucide-react";
import { toast } from "sonner";
import { DataBackupRestore } from "@/components/settings/DataBackupRestore";
import { StorageService } from "@/services/StorageService";
import { StorageStatus } from "@/components/settings/StorageStatus";
import { ElectronService } from "@/services/ElectronService";

export default function Settings() {
  const { uiSettings, updateUISettings } = useData();
  const [theme, setTheme] = useState<"light" | "dark" | "system">(uiSettings.theme || "dark");
  const [accentColor, setAccentColor] = useState(uiSettings.accentColor || "teal");
  const [sidebarStyle, setSidebarStyle] = useState(uiSettings.sidebarStyle || "gradient");
  const [tableStyle, setTableStyle] = useState(uiSettings.tableStyle || "striped");
  const [languagePreference, setLanguagePreference] = useState("english");
  const [dateFormat, setDateFormat] = useState("MMM dd, yyyy");
  const [currencyFormat, setCurrencyFormat] = useState("₹#,###.##");
  const [isElectron, setIsElectron] = useState(false);
  
  // Check if running in Electron
  useState(() => {
    setIsElectron(ElectronService.isElectron());
  });
  
  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    updateUISettings({ theme: newTheme });
    // Apply theme to document
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else if (newTheme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      // System preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      } else {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
      }
    }
    toast.success(`Theme changed to ${newTheme}`);
  };
  
  const handleAccentColorChange = (newColor: string) => {
    setAccentColor(newColor);
    updateUISettings({ accentColor: newColor });
    toast.success(`Accent color changed to ${newColor}`);
  };

  const handleSidebarStyleChange = (newStyle: string) => {
    setSidebarStyle(newStyle);
    updateUISettings({ sidebarStyle: newStyle });
    toast.success(`Sidebar style changed to ${newStyle}`);
  };

  const handleTableStyleChange = (newStyle: string) => {
    setTableStyle(newStyle);
    updateUISettings({ tableStyle: newStyle });
    toast.success(`Table style changed to ${newStyle}`);
  };
  
  const handleLanguageChange = (language: string) => {
    setLanguagePreference(language);
    toast.success(`Language preference set to ${language}. Please restart the application for changes to take effect.`);
  };
  
  const handleDateFormatChange = (format: string) => {
    setDateFormat(format);
    updateUISettings({ dateFormat: format });
    toast.success(`Date format changed`);
  };
  
  const handleCurrencyFormatChange = (format: string) => {
    setCurrencyFormat(format);
    updateUISettings({ currencyFormat: format });
    toast.success(`Currency format changed`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure application preferences and manage data
        </p>
      </div>
      
      <Tabs defaultValue="appearance" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:flex md:flex-wrap">
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="display" className="flex items-center gap-2">
            <ScreenShare className="h-4 w-4" />
            Display
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data Management
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Invoice Settings
          </TabsTrigger>
          <TabsTrigger value="regional" className="flex items-center gap-2">
            <Languages className="h-4 w-4" />
            Regional
          </TabsTrigger>
          {isElectron && (
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              System
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
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
                    <SelectItem value="green">Green</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex mt-2 gap-2">
                  <div className={`w-6 h-6 rounded-full bg-teal-500 ${accentColor === 'teal' ? 'ring-2 ring-offset-2' : ''}`}></div>
                  <div className={`w-6 h-6 rounded-full bg-blue-500 ${accentColor === 'blue' ? 'ring-2 ring-offset-2' : ''}`}></div>
                  <div className={`w-6 h-6 rounded-full bg-purple-500 ${accentColor === 'purple' ? 'ring-2 ring-offset-2' : ''}`}></div>
                  <div className={`w-6 h-6 rounded-full bg-pink-500 ${accentColor === 'pink' ? 'ring-2 ring-offset-2' : ''}`}></div>
                  <div className={`w-6 h-6 rounded-full bg-orange-500 ${accentColor === 'orange' ? 'ring-2 ring-offset-2' : ''}`}></div>
                  <div className={`w-6 h-6 rounded-full bg-green-500 ${accentColor === 'green' ? 'ring-2 ring-offset-2' : ''}`}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sidebar-style">Sidebar Style</Label>
                <Select value={sidebarStyle} onValueChange={handleSidebarStyleChange}>
                  <SelectTrigger id="sidebar-style">
                    <SelectValue placeholder="Select a sidebar style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gradient">Gradient</SelectItem>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="expanded">Expanded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="animations">Interface Animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable UI animations
                  </p>
                </div>
                <Switch 
                  id="animations" 
                  checked={uiSettings.enableAnimations !== false}
                  onCheckedChange={(checked) => {
                    updateUISettings({ enableAnimations: checked });
                    toast.success(`Animations ${checked ? "enabled" : "disabled"}`);
                  }}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Accessibility</CardTitle>
              <CardDescription>
                Settings to improve application accessibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="high-contrast">High Contrast Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Increase contrast for better visibility
                  </p>
                </div>
                <Switch 
                  id="high-contrast" 
                  checked={uiSettings.highContrast || false}
                  onCheckedChange={(checked) => {
                    updateUISettings({ highContrast: checked });
                    toast.success(`High contrast mode ${checked ? "enabled" : "disabled"}`);
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="font-size">Font Size</Label>
                <Select 
                  value={uiSettings.fontSize || "medium"} 
                  onValueChange={(value) => {
                    updateUISettings({ fontSize: value });
                    toast.success(`Font size set to ${value}`);
                  }}
                >
                  <SelectTrigger id="font-size">
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium (Default)</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="x-large">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="display" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>
                Configure how data is displayed in the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="table-style">Table Style</Label>
                <Select value={tableStyle} onValueChange={handleTableStyleChange}>
                  <SelectTrigger id="table-style">
                    <SelectValue placeholder="Select a table style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="striped">Striped</SelectItem>
                    <SelectItem value="bordered">Bordered</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
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
              
              <div className="space-y-2">
                <Label htmlFor="default-view">Default View</Label>
                <Select 
                  value={uiSettings.defaultView || "dashboard"} 
                  onValueChange={(value) => {
                    updateUISettings({ defaultView: value });
                    toast.success(`Default view set to ${value}`);
                  }}
                >
                  <SelectTrigger id="default-view">
                    <SelectValue placeholder="Select default view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dashboard">Dashboard</SelectItem>
                    <SelectItem value="customers">Customers</SelectItem>
                    <SelectItem value="products">Products</SelectItem>
                    <SelectItem value="orders">Orders</SelectItem>
                    <SelectItem value="invoices">Invoices</SelectItem>
                    <SelectItem value="payments">Payments</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-tips">Show Tips</Label>
                  <p className="text-sm text-muted-foreground">
                    Show helpful tips and shortcuts
                  </p>
                </div>
                <Switch 
                  id="show-tips" 
                  checked={uiSettings.showTips !== false}
                  onCheckedChange={(checked) => {
                    updateUISettings({ showTips: checked });
                    toast.success(`Tips ${checked ? "enabled" : "disabled"}`);
                  }}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Settings</CardTitle>
              <CardDescription>
                Customize what appears on your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-quick-actions">Quick Actions</Label>
                  <Switch 
                    id="show-quick-actions" 
                    checked={uiSettings.showQuickActions !== false}
                    onCheckedChange={(checked) => {
                      updateUISettings({ showQuickActions: checked });
                      toast.success(`Quick actions ${checked ? "shown" : "hidden"}`);
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-revenue-chart">Revenue Chart</Label>
                  <Switch 
                    id="show-revenue-chart" 
                    checked={uiSettings.showRevenueChart !== false}
                    onCheckedChange={(checked) => {
                      updateUISettings({ showRevenueChart: checked });
                      toast.success(`Revenue chart ${checked ? "shown" : "hidden"}`);
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-recent-activities">Recent Activities</Label>
                  <Switch 
                    id="show-recent-activities" 
                    checked={uiSettings.showRecentActivities !== false}
                    onCheckedChange={(checked) => {
                      updateUISettings({ showRecentActivities: checked });
                      toast.success(`Recent activities ${checked ? "shown" : "hidden"}`);
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-customer-stats">Customer Stats</Label>
                  <Switch 
                    id="show-customer-stats" 
                    checked={uiSettings.showCustomerStats !== false}
                    onCheckedChange={(checked) => {
                      updateUISettings({ showCustomerStats: checked });
                      toast.success(`Customer stats ${checked ? "shown" : "hidden"}`);
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
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
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="order-notifications">Order Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when new orders are created
                  </p>
                </div>
                <Switch 
                  id="order-notifications" 
                  checked={uiSettings.orderNotifications || false}
                  onCheckedChange={(checked) => {
                    updateUISettings({ orderNotifications: checked });
                    toast.success(`Order notifications ${checked ? "enabled" : "disabled"}`);
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="invoice-notifications">Invoice Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when new invoices are generated
                  </p>
                </div>
                <Switch 
                  id="invoice-notifications" 
                  checked={uiSettings.invoiceNotifications || false}
                  onCheckedChange={(checked) => {
                    updateUISettings({ invoiceNotifications: checked });
                    toast.success(`Invoice notifications ${checked ? "enabled" : "disabled"}`);
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notification-frequency">Notification Frequency</Label>
                <Select 
                  value={uiSettings.notificationFrequency || "immediate"} 
                  onValueChange={(value) => {
                    updateUISettings({ notificationFrequency: value });
                    toast.success(`Notification frequency set to ${value}`);
                  }}
                >
                  <SelectTrigger id="notification-frequency">
                    <SelectValue placeholder="Select notification frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="hourly">Hourly Digest</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Digest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Preferences</CardTitle>
              <CardDescription>
                Configure default invoice settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="default-invoice-template">Default Template</Label>
                <Select 
                  value={uiSettings.defaultInvoiceTemplate || "standard"} 
                  onValueChange={(value) => {
                    updateUISettings({ defaultInvoiceTemplate: value });
                    toast.success(`Default invoice template set to ${value}`);
                  }}
                >
                  <SelectTrigger id="default-invoice-template">
                    <SelectValue placeholder="Select default template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                    <SelectItem value="simple">Simple</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="invoice-due-days">Default Payment Terms</Label>
                <Select 
                  value={(uiSettings.invoiceDueDays || 15).toString()} 
                  onValueChange={(value) => {
                    updateUISettings({ invoiceDueDays: Number(value) });
                    toast.success(`Default payment terms set to ${value} days`);
                  }}
                >
                  <SelectTrigger id="invoice-due-days">
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Due immediately</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="15">15 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="45">45 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-invoice">Automatic Invoice Generation</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically generate invoices for new orders
                  </p>
                </div>
                <Switch 
                  id="auto-invoice" 
                  checked={uiSettings.autoGenerateInvoices || false}
                  onCheckedChange={(checked) => {
                    updateUISettings({ autoGenerateInvoices: checked });
                    toast.success(`Automatic invoice generation ${checked ? "enabled" : "disabled"}`);
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="invoice-notes">Default Invoice Notes</Label>
                <Input 
                  id="invoice-notes"
                  value={uiSettings.defaultInvoiceNotes || ""} 
                  onChange={(e) => {
                    updateUISettings({ defaultInvoiceNotes: e.target.value });
                  }}
                  placeholder="Thank you for your business"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Invoice Numbering</CardTitle>
              <CardDescription>
                Configure invoice number format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="invoice-prefix">Invoice Number Prefix</Label>
                <Input 
                  id="invoice-prefix"
                  value={uiSettings.invoicePrefix || "INV-"} 
                  onChange={(e) => {
                    updateUISettings({ invoicePrefix: e.target.value });
                  }}
                  placeholder="INV-"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="invoice-start">Invoice Starting Number</Label>
                <Input 
                  id="invoice-start"
                  type="number"
                  value={uiSettings.invoiceStartNumber || 1000} 
                  onChange={(e) => {
                    updateUISettings({ invoiceStartNumber: Number(e.target.value) });
                  }}
                  placeholder="1000"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="include-date">Include Date in Invoice Number</Label>
                  <p className="text-sm text-muted-foreground">
                    Add current date to invoice numbers (e.g. INV-20230501-1001)
                  </p>
                </div>
                <Switch 
                  id="include-date" 
                  checked={uiSettings.includeDateInInvoice || false}
                  onCheckedChange={(checked) => {
                    updateUISettings({ includeDateInInvoice: checked });
                    toast.success(`Date in invoice number ${checked ? "enabled" : "disabled"}`);
                  }}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => {
                  toast.success("Invoice numbering settings saved");
                }}
              >
                Save Numbering Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="regional" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Language & Region</CardTitle>
              <CardDescription>
                Configure language and regional preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={languagePreference} onValueChange={handleLanguageChange}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="marathi">Marathi</SelectItem>
                    <SelectItem value="gujarati">Gujarati</SelectItem>
                    <SelectItem value="tamil">Tamil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
                <Select value={dateFormat} onValueChange={handleDateFormatChange}>
                  <SelectTrigger id="date-format">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MMM dd, yyyy">MMM dd, yyyy (Jan 01, 2023)</SelectItem>
                    <SelectItem value="dd/MM/yyyy">dd/MM/yyyy (01/01/2023)</SelectItem>
                    <SelectItem value="MM/dd/yyyy">MM/dd/yyyy (01/01/2023)</SelectItem>
                    <SelectItem value="yyyy-MM-dd">yyyy-MM-dd (2023-01-01)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency-format">Currency Format</Label>
                <Select value={currencyFormat} onValueChange={handleCurrencyFormatChange}>
                  <SelectTrigger id="currency-format">
                    <SelectValue placeholder="Select currency format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="₹#,###.##">₹#,###.## (₹1,234.56)</SelectItem>
                    <SelectItem value="₹ #,###.##">₹ #,###.## (₹ 1,234.56)</SelectItem>
                    <SelectItem value="#,###.## ₹">#,###.## ₹ (1,234.56 ₹)</SelectItem>
                    <SelectItem value="Rs. #,###.##">Rs. #,###.## (Rs. 1,234.56)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Time Zone</Label>
                <Select 
                  value={uiSettings.timezone || "Asia/Kolkata"} 
                  onValueChange={(value) => {
                    updateUISettings({ timezone: value });
                    toast.success(`Time zone set to ${value}`);
                  }}
                >
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Kolkata">India (UTC+5:30)</SelectItem>
                    <SelectItem value="Etc/UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time (US & Canada)</SelectItem>
                    <SelectItem value="Europe/London">United Kingdom</SelectItem>
                    <SelectItem value="Asia/Dubai">Dubai</SelectItem>
                    <SelectItem value="Asia/Singapore">Singapore</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-4">
          {/* Add our data backup and restore component */}
          <DataBackupRestore />
          
          <Card>
            <CardHeader>
              <CardTitle>Storage Usage</CardTitle>
              <CardDescription>
                Monitor and manage your local storage usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StorageStatus />
            </CardContent>
          </Card>
          
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
        
        {isElectron && (
          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Integration</CardTitle>
                <CardDescription>
                  Configure how the application integrates with your system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="start-with-system">Start with System</Label>
                    <p className="text-sm text-muted-foreground">
                      Launch application when your system starts
                    </p>
                  </div>
                  <Switch 
                    id="start-with-system" 
                    checked={uiSettings.startWithSystem || false}
                    onCheckedChange={(checked) => {
                      updateUISettings({ startWithSystem: checked });
                      toast.success(`Start with system ${checked ? "enabled" : "disabled"}`);
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="minimize-to-tray">Minimize to System Tray</Label>
                    <p className="text-sm text-muted-foreground">
                      Keep application running in system tray when closed
                    </p>
                  </div>
                  <Switch 
                    id="minimize-to-tray" 
                    checked={uiSettings.minimizeToTray || false}
                    onCheckedChange={(checked) => {
                      updateUISettings({ minimizeToTray: checked });
                      toast.success(`Minimize to tray ${checked ? "enabled" : "disabled"}`);
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="printer-setup">Default Printer</Label>
                  <Select 
                    value={uiSettings.defaultPrinter || "system-default"} 
                    onValueChange={(value) => {
                      updateUISettings({ defaultPrinter: value });
                      toast.success(`Default printer set`);
                    }}
                  >
                    <SelectTrigger id="printer-setup">
                      <SelectValue placeholder="Select default printer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system-default">System Default</SelectItem>
                      <SelectItem value="pdf">Save as PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="hardware-acceleration">Hardware Acceleration</Label>
                    <p className="text-sm text-muted-foreground">
                      Use GPU acceleration when available
                    </p>
                  </div>
                  <Switch 
                    id="hardware-acceleration" 
                    checked={uiSettings.hardwareAcceleration !== false}
                    onCheckedChange={(checked) => {
                      updateUISettings({ hardwareAcceleration: checked });
                      toast.success(`Hardware acceleration ${checked ? "enabled" : "disabled"}. Changes will apply after restart.`);
                    }}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => toast.success("System settings saved")}>
                  Apply System Settings
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Application Updates</CardTitle>
                <CardDescription>
                  Manage how the application updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-updates">Automatic Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically download and install updates
                    </p>
                  </div>
                  <Switch 
                    id="auto-updates" 
                    checked={uiSettings.autoUpdate !== false}
                    onCheckedChange={(checked) => {
                      updateUISettings({ autoUpdate: checked });
                      toast.success(`Automatic updates ${checked ? "enabled" : "disabled"}`);
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="update-channel">Update Channel</Label>
                  <Select 
                    value={uiSettings.updateChannel || "stable"} 
                    onValueChange={(value) => {
                      updateUISettings({ updateChannel: value });
                      toast.success(`Update channel set to ${value}`);
                    }}
                  >
                    <SelectTrigger id="update-channel">
                      <SelectValue placeholder="Select update channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stable">Stable</SelectItem>
                      <SelectItem value="beta">Beta</SelectItem>
                      <SelectItem value="dev">Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button variant="outline" className="w-full">
                  Check for Updates
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
