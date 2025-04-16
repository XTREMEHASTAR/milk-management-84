
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings as SettingsIcon, 
  Palette, 
  Bell, 
  Globe, 
  User, 
  Shield, 
  Database,
  HardDrive,
  FileJson,
  Download,
  UploadCloud,
  RefreshCw,
  Sun,
  Moon
} from "lucide-react";
import { toast } from "sonner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [accentColor, setAccentColor] = useState("teal");
  const [fontFamily, setFontFamily] = useState("inter");
  const [borderRadius, setBorderRadius] = useState("medium");
  const [desktopNotifications, setDesktopNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState("daily");
  const [exportFormat, setExportFormat] = useState("json");
  const [apiKey, setApiKey] = useState("sk_live_51HZGu0JbMwZGgTV36i0tDFYLx5MHl");
  const [language, setLanguage] = useState("english");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [currencySymbol, setCurrencySymbol] = useState("₹");
  const [backupDate, setBackupDate] = useState<Date>(new Date());

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    toast.success(`Theme set to ${!darkMode ? "Dark" : "Light"} Mode`);
  };

  const saveSettings = () => {
    toast.success("Settings saved successfully");
  };

  const resetSettings = () => {
    toast.success("Settings reset to defaults");
    setAccentColor("teal");
    setFontFamily("inter");
    setBorderRadius("medium");
    setDesktopNotifications(true);
    setEmailNotifications(true);
    setBackupFrequency("daily");
    setExportFormat("json");
    setLanguage("english");
    setDateFormat("DD/MM/YYYY");
    setCurrencySymbol("₹");
  };

  const exportData = () => {
    toast.success(`Data exported in ${exportFormat.toUpperCase()} format`);
  };

  const runBackup = () => {
    toast.success("Backup completed successfully");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Configure your application preferences and settings</p>
      </div>

      <Tabs defaultValue="appearance" className="space-y-4">
        <TabsList className="grid w-full max-w-4xl grid-cols-4">
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" /> Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="localization" className="flex items-center gap-2">
            <Globe className="h-4 w-4" /> Localization
          </TabsTrigger>
          <TabsTrigger value="backups" className="flex items-center gap-2">
            <Database className="h-4 w-4" /> Backups & Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="dark-ui-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" /> 
                  Theme Settings
                </CardTitle>
                <CardDescription>
                  Customize how your application looks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                    </div>
                    <Switch
                      id="dark-mode"
                      checked={darkMode}
                      onCheckedChange={toggleTheme}
                    />
                  </div>
                  
                  <div className="pt-2">
                    <Label htmlFor="accent-color">Accent Color</Label>
                    <div className="grid grid-cols-5 gap-2 mt-1">
                      {["teal", "blue", "purple", "pink", "amber"].map(color => (
                        <button
                          key={color}
                          onClick={() => setAccentColor(color)}
                          className={`w-full h-10 rounded-md transition-all ${
                            accentColor === color ? "ring-2 ring-white scale-110" : ""
                          }`}
                          style={{ 
                            background: getColorValue(color),
                            boxShadow: accentColor === color ? `0 0 12px ${getColorValue(color)}` : 'none'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Label htmlFor="font-family">Font Family</Label>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger id="font-family" className="dark-select mt-1">
                        <SelectValue placeholder="Select font family" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inter">Inter</SelectItem>
                        <SelectItem value="roboto">Roboto</SelectItem>
                        <SelectItem value="poppins">Poppins</SelectItem>
                        <SelectItem value="system">System Font</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-2">
                    <Label htmlFor="border-radius">Border Radius</Label>
                    <Select value={borderRadius} onValueChange={setBorderRadius}>
                      <SelectTrigger id="border-radius" className="dark-select mt-1">
                        <SelectValue placeholder="Select border radius" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="dark-ui-card glow-teal">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" /> 
                  Interface Settings
                </CardTitle>
                <CardDescription>
                  Customize your workspace
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="compact-mode">Compact Mode</Label>
                    <Switch id="compact-mode" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="animations">UI Animations</Label>
                    <Switch id="animations" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sound-effects">Sound Effects</Label>
                    <Switch id="sound-effects" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-tooltips">Show Tooltips</Label>
                    <Switch id="show-tooltips" defaultChecked />
                  </div>
                  
                  <div className="pt-2">
                    <Label htmlFor="default-view">Default View</Label>
                    <Select defaultValue="dashboard">
                      <SelectTrigger id="default-view" className="dark-select mt-1">
                        <SelectValue placeholder="Select default view" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dashboard">Dashboard</SelectItem>
                        <SelectItem value="order-entry">Order Entry</SelectItem>
                        <SelectItem value="customers">Customers</SelectItem>
                        <SelectItem value="reports">Reports</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-2">
                    <Label htmlFor="sidebar-position">Sidebar Position</Label>
                    <Select defaultValue="left">
                      <SelectTrigger id="sidebar-position" className="dark-select mt-1">
                        <SelectValue placeholder="Select sidebar position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="dark-ui-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" /> 
                Preview Panel
              </CardTitle>
              <CardDescription>
                See your theme changes in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div 
                  className="p-4 rounded-xl text-center"
                  style={{ 
                    background: darkMode ? "#1a1e23" : "#ffffff",
                    color: darkMode ? "#ffffff" : "#1a1e23",
                    borderRadius: getBorderRadiusValue(borderRadius),
                    fontFamily: getFontFamilyValue(fontFamily),
                    border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                    boxShadow: `0 4px 20px ${darkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"}`,
                  }}
                >
                  <div 
                    className="w-12 h-12 mx-auto rounded-full mb-2 flex items-center justify-center text-xl font-bold"
                    style={{ 
                      background: getColorValue(accentColor),
                      boxShadow: `0 0 15px ${getColorValue(accentColor)}40`
                    }}
                  >
                    A
                  </div>
                  <h3 className="font-bold mb-1">Card Title</h3>
                  <p className="text-sm opacity-70">Card description text</p>
                </div>
                
                <div 
                  className="p-4 rounded-xl"
                  style={{ 
                    background: darkMode ? "#1a1e23" : "#ffffff",
                    color: darkMode ? "#ffffff" : "#1a1e23",
                    borderRadius: getBorderRadiusValue(borderRadius),
                    fontFamily: getFontFamilyValue(fontFamily),
                    border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                    boxShadow: `0 4px 20px ${darkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"}`,
                  }}
                >
                  <h3 className="font-bold mb-2">Form Example</h3>
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      placeholder="Input field"
                      className="w-full p-2 text-sm rounded-md"
                      style={{ 
                        background: darkMode ? "rgba(0,0,0,0.2)" : "#f1f5f9",
                        border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                        borderRadius: getBorderRadiusValue(borderRadius),
                        color: darkMode ? "#ffffff" : "#1a1e23",
                      }}
                    />
                    <button
                      className="w-full p-2 text-sm rounded-md text-white"
                      style={{ 
                        background: getColorValue(accentColor),
                        borderRadius: getBorderRadiusValue(borderRadius),
                      }}
                    >
                      Button
                    </button>
                  </div>
                </div>
                
                <div 
                  className="p-4 rounded-xl"
                  style={{ 
                    background: darkMode ? "#1a1e23" : "#ffffff",
                    color: darkMode ? "#ffffff" : "#1a1e23",
                    borderRadius: getBorderRadiusValue(borderRadius),
                    fontFamily: getFontFamilyValue(fontFamily),
                    border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                    boxShadow: `0 4px 20px ${darkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"}`,
                  }}
                >
                  <h3 className="font-bold mb-2">Progress</h3>
                  <div className="space-y-3">
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full" 
                        style={{ 
                          width: "70%", 
                          background: getColorValue(accentColor),
                        }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Label</span>
                      <span 
                        style={{ color: getColorValue(accentColor) }}
                      >70%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="dark-ui-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" /> 
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Desktop Notifications</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="desktop-notifications">Enable Desktop Notifications</Label>
                      <Switch
                        id="desktop-notifications"
                        checked={desktopNotifications}
                        onCheckedChange={setDesktopNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sound-notifications">Notification Sounds</Label>
                      <Switch id="sound-notifications" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-700 pt-4">
                  <h3 className="font-semibold mb-2">Email Notifications</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifications">Enable Email Notifications</Label>
                      <Switch
                        id="email-notifications"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="daily-summary">Daily Summary Email</Label>
                      <Switch id="daily-summary" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="payment-alerts">Payment Alerts</Label>
                      <Switch id="payment-alerts" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-700 pt-4">
                  <h3 className="font-semibold mb-2">Notification Events</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="new-order">New Order</Label>
                      <Switch id="new-order" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="payment-received">Payment Received</Label>
                      <Switch id="payment-received" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="low-stock">Low Stock Alert</Label>
                      <Switch id="low-stock" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="system-updates">System Updates</Label>
                      <Switch id="system-updates" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="localization" className="space-y-4">
          <Card className="dark-ui-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" /> 
                Localization Settings
              </CardTitle>
              <CardDescription>
                Configure language and regional preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language" className="dark-select mt-1">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="hindi">Hindi</SelectItem>
                        <SelectItem value="gujarati">Gujarati</SelectItem>
                        <SelectItem value="marathi">Marathi</SelectItem>
                        <SelectItem value="tamil">Tamil</SelectItem>
                        <SelectItem value="telugu">Telugu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="date-format">Date Format</Label>
                    <Select value={dateFormat} onValueChange={setDateFormat}>
                      <SelectTrigger id="date-format" className="dark-select mt-1">
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="time-format">Time Format</Label>
                    <Select defaultValue="12hour">
                      <SelectTrigger id="time-format" className="dark-select mt-1">
                        <SelectValue placeholder="Select time format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12hour">12-hour (AM/PM)</SelectItem>
                        <SelectItem value="24hour">24-hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select defaultValue="inr">
                      <SelectTrigger id="currency" className="dark-select mt-1">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inr">Indian Rupee (₹)</SelectItem>
                        <SelectItem value="usd">US Dollar ($)</SelectItem>
                        <SelectItem value="eur">Euro (€)</SelectItem>
                        <SelectItem value="gbp">British Pound (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="currency-symbol">Currency Symbol</Label>
                    <Input 
                      id="currency-symbol" 
                      value={currencySymbol}
                      onChange={(e) => setCurrencySymbol(e.target.value)}
                      className="dark-input mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="first-day-week">First Day of Week</Label>
                    <Select defaultValue="monday">
                      <SelectTrigger id="first-day-week" className="dark-select mt-1">
                        <SelectValue placeholder="Select first day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sunday">Sunday</SelectItem>
                        <SelectItem value="monday">Monday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backups" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="dark-ui-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" /> 
                  Backup Settings
                </CardTitle>
                <CardDescription>
                  Configure automatic backup options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-backup">Automatic Backups</Label>
                    <Switch id="auto-backup" defaultChecked />
                  </div>
                  
                  <div>
                    <Label htmlFor="backup-frequency">Backup Frequency</Label>
                    <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                      <SelectTrigger id="backup-frequency" className="dark-select mt-1">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="backup-time">Next Scheduled Backup</Label>
                    <div className="mt-1">
                      <DatePicker date={backupDate} setDate={setBackupDate} />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="retention-period">Retention Period</Label>
                    <Select defaultValue="30days">
                      <SelectTrigger id="retention-period" className="dark-select mt-1">
                        <SelectValue placeholder="Select retention period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7days">7 Days</SelectItem>
                        <SelectItem value="30days">30 Days</SelectItem>
                        <SelectItem value="90days">90 Days</SelectItem>
                        <SelectItem value="365days">1 Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={runBackup}
                    className="w-full mt-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <HardDrive className="mr-2 h-4 w-4" />
                    Run Backup Now
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="dark-ui-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileJson className="h-5 w-5" /> 
                  Data Export & Import
                </CardTitle>
                <CardDescription>
                  Export or import your data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="export-format">Export Format</Label>
                    <Select value={exportFormat} onValueChange={setExportFormat}>
                      <SelectTrigger id="export-format" className="dark-select mt-1">
                        <SelectValue placeholder="Select export format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="export-data">Export Options</Label>
                    <div className="space-y-2 mt-1">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="include-orders">Include Orders</Label>
                        <Switch id="include-orders" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="include-customers">Include Customers</Label>
                        <Switch id="include-customers" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="include-products">Include Products</Label>
                        <Switch id="include-products" defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={exportData}
                    className="w-full mt-2 bg-green-600 hover:bg-green-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                  
                  <div className="pt-2 border-t border-gray-700">
                    <Label htmlFor="import-data">Import Data</Label>
                    <div className="mt-2">
                      <Label 
                        htmlFor="file-upload" 
                        className="flex items-center justify-center gap-2 p-4 border border-dashed border-gray-600 rounded-md cursor-pointer hover:bg-gray-800/50"
                      >
                        <UploadCloud className="h-5 w-5" />
                        <span>Click to upload file</span>
                        <input id="file-upload" type="file" className="hidden" />
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="dark-ui-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" /> 
                Reset Options
              </CardTitle>
              <CardDescription>
                Reset your settings or application data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  onClick={resetSettings}
                  className="bg-white/10 hover:bg-white/20 text-white"
                >
                  Reset to Default Settings
                </Button>
                
                <Button 
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white"
                >
                  Clear Application Cache
                </Button>
                
                <Button 
                  variant="destructive"
                  onClick={() => toast.error("This action cannot be undone", {
                    description: "You would need to confirm with admin rights to proceed."
                  })}
                >
                  Reset All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={resetSettings}>
          Reset Settings
        </Button>
        <Button onClick={saveSettings}>
          Save Settings
        </Button>
      </div>
    </div>
  );
};

// Helper functions to handle theme preview
function getColorValue(color: string): string {
  const colorMap: Record<string, string> = {
    teal: "#38bd95",
    blue: "#3b82f6",
    purple: "#a855f7",
    pink: "#ec4899",
    amber: "#f59e0b"
  };
  return colorMap[color] || colorMap.teal;
}

function getBorderRadiusValue(size: string): string {
  const radiusMap: Record<string, string> = {
    small: "0.375rem",
    medium: "0.75rem",
    large: "1rem"
  };
  return radiusMap[size] || radiusMap.medium;
}

function getFontFamilyValue(font: string): string {
  const fontMap: Record<string, string> = {
    inter: "Inter, sans-serif",
    roboto: "Roboto, sans-serif",
    poppins: "Poppins, sans-serif",
    system: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
  };
  return fontMap[font] || fontMap.inter;
}

export default Settings;
