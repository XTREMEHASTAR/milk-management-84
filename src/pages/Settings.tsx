
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  PaintBucket, Laptop, Moon, Sun, Globe, 
  Save, RefreshCw, Building, Check, CircleDollarSign, Database
} from "lucide-react";

interface ThemeSettings {
  mode: "dark" | "light" | "system";
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  backgroundImageUrl: string;
  customCss: string;
}

interface BusinessSettings {
  businessName: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  gstin: string;
  logo: string;
}

interface CurrencySettings {
  currency: string;
  currencySymbol: string;
  decimalPlaces: number;
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState<"theme" | "business" | "currency" | "backup">("theme");
  
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    mode: "dark",
    primaryColor: "#8B5CF6",
    accentColor: "#EC4899",
    backgroundColor: "#1A1A2E",
    backgroundImageUrl: "",
    customCss: "",
  });
  
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
    businessName: "Milk Delivery Business",
    address: "123 Main Street, City, State - 123456",
    phone: "+1234567890",
    email: "contact@milk-delivery.com",
    website: "www.milk-delivery.com",
    gstin: "GSTIN1234567890",
    logo: "",
  });
  
  const [currencySettings, setCurrencySettings] = useState({
    currency: "INR",
    currencySymbol: "₹",
    decimalPlaces: 2,
  });
  
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: "daily",
    backupLocation: "local",
    lastBackup: "2025-04-14 10:30:25",
  });

  // Apply theme changes in real-time
  useEffect(() => {
    // Update CSS variables for theming
    document.documentElement.style.setProperty('--primary', themeSettings.primaryColor);
    document.documentElement.style.setProperty('--accent', themeSettings.accentColor);
    
    // Apply dark/light mode
    if (themeSettings.mode === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else if (themeSettings.mode === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    
    // Apply custom background if provided
    if (themeSettings.backgroundImageUrl) {
      document.body.style.backgroundImage = `url(${themeSettings.backgroundImageUrl})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
    } else {
      document.body.style.backgroundImage = 'none';
      document.body.style.backgroundColor = themeSettings.backgroundColor;
    }
  }, [themeSettings]);

  const handleThemeChange = (mode: "dark" | "light" | "system") => {
    setThemeSettings({ ...themeSettings, mode });
    toast.success(`Theme mode changed to ${mode}`);
  };

  const handleColorChange = (color: string, type: "primary" | "accent" | "background") => {
    if (type === "primary") {
      setThemeSettings({ ...themeSettings, primaryColor: color });
    } else if (type === "accent") {
      setThemeSettings({ ...themeSettings, accentColor: color });
    } else if (type === "background") {
      setThemeSettings({ ...themeSettings, backgroundColor: color });
    }
  };

  const handleSaveTheme = () => {
    // Save theme settings to localStorage
    localStorage.setItem("themeSettings", JSON.stringify(themeSettings));
    toast.success("Theme settings saved successfully");
  };

  const handleSaveBusinessSettings = () => {
    // Save business settings to localStorage
    localStorage.setItem("businessSettings", JSON.stringify(businessSettings));
    toast.success("Business settings saved successfully");
  };

  const handleSaveCurrencySettings = () => {
    // Save currency settings to localStorage
    localStorage.setItem("currencySettings", JSON.stringify(currencySettings));
    toast.success("Currency settings saved successfully");
  };

  const handleBackup = () => {
    // Simulate backup process
    toast.success("Backup created successfully");
    setBackupSettings({
      ...backupSettings,
      lastBackup: new Date().toLocaleString(),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure application settings and preferences
        </p>
      </div>

      <div className="flex space-x-6 overflow-x-auto pb-2 mb-4 scrollbar-thin">
        <Card 
          className={`w-40 shrink-0 cursor-pointer transition-all duration-200 ${
            activeTab === "theme" 
              ? "bg-gradient-to-br from-indigo-900 to-purple-900 text-white border-0 shadow-lg transform -translate-y-1" 
              : "bg-muted/30 hover:bg-muted/40 border border-border"
          }`}
          onClick={() => setActiveTab("theme")}
        >
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <PaintBucket className="h-10 w-10 mb-2" />
            <p className="font-medium">Theme Settings</p>
          </CardContent>
        </Card>
        
        <Card 
          className={`w-40 shrink-0 cursor-pointer transition-all duration-200 ${
            activeTab === "business" 
              ? "bg-gradient-to-br from-indigo-900 to-purple-900 text-white border-0 shadow-lg transform -translate-y-1" 
              : "bg-muted/30 hover:bg-muted/40 border border-border"
          }`}
          onClick={() => setActiveTab("business")}
        >
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Building className="h-10 w-10 mb-2" />
            <p className="font-medium">Business</p>
          </CardContent>
        </Card>
        
        <Card 
          className={`w-40 shrink-0 cursor-pointer transition-all duration-200 ${
            activeTab === "currency" 
              ? "bg-gradient-to-br from-indigo-900 to-purple-900 text-white border-0 shadow-lg transform -translate-y-1" 
              : "bg-muted/30 hover:bg-muted/40 border border-border"
          }`}
          onClick={() => setActiveTab("currency")}
        >
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <CircleDollarSign className="h-10 w-10 mb-2" />
            <p className="font-medium">Currency</p>
          </CardContent>
        </Card>
        
        <Card 
          className={`w-40 shrink-0 cursor-pointer transition-all duration-200 ${
            activeTab === "backup" 
              ? "bg-gradient-to-br from-indigo-900 to-purple-900 text-white border-0 shadow-lg transform -translate-y-1" 
              : "bg-muted/30 hover:bg-muted/40 border border-border"
          }`}
          onClick={() => setActiveTab("backup")}
        >
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Database className="h-10 w-10 mb-2" />
            <p className="font-medium">Backup & Restore</p>
          </CardContent>
        </Card>
      </div>

      {activeTab === "theme" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="text-white">
                <div className="flex items-center">
                  <PaintBucket className="h-5 w-5 mr-2" />
                  Appearance
                </div>
              </CardTitle>
              <CardDescription className="text-gray-300">
                Customize the look and feel of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label className="text-white">Theme Mode</Label>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`${
                      themeSettings.mode === "light"
                        ? "bg-white text-black"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                    onClick={() => handleThemeChange("light")}
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`${
                      themeSettings.mode === "dark"
                        ? "bg-purple-600 text-white"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                    onClick={() => handleThemeChange("dark")}
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`${
                      themeSettings.mode === "system"
                        ? "bg-blue-600 text-white"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                    onClick={() => handleThemeChange("system")}
                  >
                    <Laptop className="h-4 w-4 mr-2" />
                    System
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-white">Primary Color</Label>
                <div className="grid grid-cols-6 gap-2">
                  {["#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#3B82F6", "#EF4444"].map(
                    (color) => (
                      <div
                        key={color}
                        className={`w-10 h-10 rounded-full cursor-pointer ${
                          themeSettings.primaryColor === color
                            ? "ring-2 ring-offset-2 ring-white"
                            : ""
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorChange(color, "primary")}
                      ></div>
                    )
                  )}
                </div>
                <Input
                  type="text"
                  value={themeSettings.primaryColor}
                  onChange={(e) =>
                    handleColorChange(e.target.value, "primary")
                  }
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-white">Accent Color</Label>
                <div className="grid grid-cols-6 gap-2">
                  {["#EC4899", "#8B5CF6", "#F59E0B", "#10B981", "#3B82F6", "#EF4444"].map(
                    (color) => (
                      <div
                        key={color}
                        className={`w-10 h-10 rounded-full cursor-pointer ${
                          themeSettings.accentColor === color
                            ? "ring-2 ring-offset-2 ring-white"
                            : ""
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorChange(color, "accent")}
                      ></div>
                    )
                  )}
                </div>
                <Input
                  type="text"
                  value={themeSettings.accentColor}
                  onChange={(e) =>
                    handleColorChange(e.target.value, "accent")
                  }
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <Button onClick={handleSaveTheme} className="w-full bg-purple-600 hover:bg-purple-700">
                <Save className="mr-2 h-4 w-4" />
                Save Theme Settings
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 text-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">
                <div className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Background & Custom CSS
                </div>
              </CardTitle>
              <CardDescription className="text-gray-300">
                Configure background and advanced styling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label className="text-white">Background Color</Label>
                <div className="grid grid-cols-6 gap-2">
                  {["#1A1A2E", "#0F172A", "#262626", "#052e16", "#1E1B4B", "#450A0A"].map(
                    (color) => (
                      <div
                        key={color}
                        className={`w-10 h-10 rounded-full cursor-pointer ${
                          themeSettings.backgroundColor === color
                            ? "ring-2 ring-offset-2 ring-white"
                            : ""
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorChange(color, "background")}
                      ></div>
                    )
                  )}
                </div>
                <Input
                  type="text"
                  value={themeSettings.backgroundColor}
                  onChange={(e) =>
                    handleColorChange(e.target.value, "background")
                  }
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-white">Background Image URL</Label>
                <Input
                  type="text"
                  value={themeSettings.backgroundImageUrl}
                  onChange={(e) =>
                    setThemeSettings({
                      ...themeSettings,
                      backgroundImageUrl: e.target.value,
                    })
                  }
                  placeholder="Enter image URL (optional)"
                  className="bg-white/10 border-white/20 text-white"
                />
                <p className="text-xs text-gray-300">
                  Leave empty to use background color instead
                </p>
              </div>

              <div className="space-y-3">
                <Label className="text-white">Custom CSS (Advanced)</Label>
                <Textarea
                  value={themeSettings.customCss}
                  onChange={(e) =>
                    setThemeSettings({
                      ...themeSettings,
                      customCss: e.target.value,
                    })
                  }
                  placeholder=".my-custom-class { color: white; }"
                  className="bg-white/10 border-white/20 text-white h-32"
                />
                <p className="text-xs text-gray-300">
                  Add custom CSS styles (for advanced users)
                </p>
              </div>

              <div className="p-4 bg-white/10 rounded-md">
                <h3 className="font-medium mb-2 text-white">Theme Preview</h3>
                <div className="flex space-x-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: themeSettings.primaryColor }}
                  ></div>
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: themeSettings.accentColor }}
                  ></div>
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: themeSettings.backgroundColor }}
                  ></div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" style={{ backgroundColor: themeSettings.primaryColor }}>
                    Primary
                  </Button>
                  <Button size="sm" style={{ backgroundColor: themeSettings.accentColor }}>
                    Accent
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "business" && (
        <Card className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 text-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white">
              <div className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Business Information
              </div>
            </CardTitle>
            <CardDescription className="text-gray-300">
              Configure your business details for invoices and reports
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Business Name</Label>
                <Input
                  value={businessSettings.businessName}
                  onChange={(e) =>
                    setBusinessSettings({
                      ...businessSettings,
                      businessName: e.target.value,
                    })
                  }
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">GST/Tax Number</Label>
                <Input
                  value={businessSettings.gstin}
                  onChange={(e) =>
                    setBusinessSettings({
                      ...businessSettings,
                      gstin: e.target.value,
                    })
                  }
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Business Address</Label>
              <Textarea
                value={businessSettings.address}
                onChange={(e) =>
                  setBusinessSettings({
                    ...businessSettings,
                    address: e.target.value,
                  })
                }
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Phone Number</Label>
                <Input
                  value={businessSettings.phone}
                  onChange={(e) =>
                    setBusinessSettings({
                      ...businessSettings,
                      phone: e.target.value,
                    })
                  }
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Email Address</Label>
                <Input
                  value={businessSettings.email}
                  onChange={(e) =>
                    setBusinessSettings({
                      ...businessSettings,
                      email: e.target.value,
                    })
                  }
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Website</Label>
                <Input
                  value={businessSettings.website}
                  onChange={(e) =>
                    setBusinessSettings({
                      ...businessSettings,
                      website: e.target.value,
                    })
                  }
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Logo URL</Label>
                <Input
                  value={businessSettings.logo}
                  onChange={(e) =>
                    setBusinessSettings({
                      ...businessSettings,
                      logo: e.target.value,
                    })
                  }
                  placeholder="Enter logo URL"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>

            <Button onClick={handleSaveBusinessSettings} className="w-full bg-purple-600 hover:bg-purple-700">
              <Save className="mr-2 h-4 w-4" />
              Save Business Information
            </Button>
          </CardContent>
        </Card>
      )}

      {activeTab === "currency" && (
        <Card className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 text-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white">
              <div className="flex items-center">
                <CircleDollarSign className="h-5 w-5 mr-2" />
                Currency Settings
              </div>
            </CardTitle>
            <CardDescription className="text-gray-300">
              Configure currency and number formatting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Currency</Label>
                <Select
                  value={currencySettings.currency}
                  onValueChange={(value) =>
                    setCurrencySettings({
                      ...currencySettings,
                      currency: value,
                      currencySymbol: value === "INR" ? "₹" : value === "USD" ? "$" : "€",
                    })
                  }
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">Indian Rupee (INR)</SelectItem>
                    <SelectItem value="USD">US Dollar (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Currency Symbol</Label>
                <Input
                  value={currencySettings.currencySymbol}
                  onChange={(e) =>
                    setCurrencySettings({
                      ...currencySettings,
                      currencySymbol: e.target.value,
                    })
                  }
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Decimal Places</Label>
                <Select
                  value={currencySettings.decimalPlaces.toString()}
                  onValueChange={(value) =>
                    setCurrencySettings({
                      ...currencySettings,
                      decimalPlaces: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select number of decimal places" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-4 bg-white/10 rounded-md mt-4">
              <h3 className="font-medium mb-2 text-white">Format Preview</h3>
              <div className="grid grid-cols-2 gap-2 text-white">
                <div>Format:</div>
                <div>
                  {currencySettings.currencySymbol}
                  {(1234.56789).toFixed(currencySettings.decimalPlaces)}
                </div>
                <div>Currency Code:</div>
                <div>{currencySettings.currency}</div>
              </div>
            </div>

            <Button onClick={handleSaveCurrencySettings} className="w-full bg-purple-600 hover:bg-purple-700">
              <Save className="mr-2 h-4 w-4" />
              Save Currency Settings
            </Button>
          </CardContent>
        </Card>
      )}

      {activeTab === "backup" && (
        <Card className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 text-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white">
              <div className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Backup & Restore
              </div>
            </CardTitle>
            <CardDescription className="text-gray-300">
              Manage data backup and recovery options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/10 rounded-md">
              <div>
                <h3 className="font-medium text-white">Auto Backup</h3>
                <p className="text-sm text-gray-300">
                  Automatically create backups of your data
                </p>
              </div>
              <Switch
                checked={backupSettings.autoBackup}
                onCheckedChange={(checked) =>
                  setBackupSettings({ ...backupSettings, autoBackup: checked })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Backup Frequency</Label>
                <Select
                  value={backupSettings.backupFrequency}
                  onValueChange={(value) =>
                    setBackupSettings({
                      ...backupSettings,
                      backupFrequency: value,
                    })
                  }
                  disabled={!backupSettings.autoBackup}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Backup Location</Label>
                <Select
                  value={backupSettings.backupLocation}
                  onValueChange={(value) =>
                    setBackupSettings({
                      ...backupSettings,
                      backupLocation: value,
                    })
                  }
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local Storage</SelectItem>
                    <SelectItem value="download">Download File</SelectItem>
                    <SelectItem value="cloud">Cloud Storage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-4 bg-white/10 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-white">Last Backup</h3>
                  <p className="text-sm text-gray-300">
                    {backupSettings.lastBackup || "No backup yet"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 text-white"
                  onClick={handleBackup}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Create Backup Now
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Database className="mr-2 h-4 w-4" />
                  Export All Data
                </Button>
              </div>
              <div>
                <Button variant="outline" className="w-full bg-white/10 hover:bg-white/20 text-white">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Restore From Backup
                </Button>
              </div>
            </div>

            <div className="p-4 bg-amber-500/20 border border-amber-500/30 rounded-md">
              <h3 className="flex items-center font-medium text-amber-400 mb-2">
                <Check className="h-4 w-4 mr-2" />
                Data Safety Tips
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-amber-300/80">
                <li>Regular backups prevent data loss</li>
                <li>Export your data before major changes</li>
                <li>Store backups in multiple locations</li>
                <li>Test your backup restore process periodically</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Settings;
