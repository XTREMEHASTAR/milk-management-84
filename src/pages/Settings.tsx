
import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { useNavigate } from "react-router-dom";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { 
  Sun, Moon, Computer, Palette, ChevronsLeftRight, Layout, Database, 
  Info, Bell, LogOut, Save, Undo 
} from "lucide-react";
import { toast } from "sonner";
import { UISettings } from "@/types";

const Settings = () => {
  const { uiSettings, updateUISettings } = useData();
  const navigate = useNavigate();
  
  const [tempSettings, setTempSettings] = useState<UISettings>({ ...uiSettings });
  
  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    setTempSettings({ ...tempSettings, theme });
  };
  
  const handleAccentColorChange = (accentColor: string) => {
    setTempSettings({ ...tempSettings, accentColor });
  };
  
  const handleSidebarStyleChange = (sidebarStyle: "default" | "compact" | "expanded" | "gradient") => {
    setTempSettings({ ...tempSettings, sidebarStyle });
  };
  
  const handleSidebarColorChange = (sidebarColor: string) => {
    setTempSettings({ ...tempSettings, sidebarColor });
  };
  
  const handleTableStyleChange = (tableStyle: "default" | "bordered" | "striped") => {
    setTempSettings({ ...tempSettings, tableStyle });
  };
  
  const saveSettings = () => {
    updateUISettings(tempSettings);
    toast.success("Settings saved successfully");
  };
  
  const resetSettings = () => {
    const defaultSettings: UISettings = {
      theme: "light",
      accentColor: "teal",
      sidebarStyle: "default",
      sidebarColor: "default",
      tableStyle: "default"
    };
    
    setTempSettings(defaultSettings);
    updateUISettings(defaultSettings);
    toast.success("Settings reset to defaults");
  };
  
  const getThemeClass = () => {
    return tempSettings.theme === "dark" 
      ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white border-0" 
      : "bg-gradient-to-br from-gray-50 to-white";
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Configure application settings and preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="appearance" className="space-y-4">
        <TabsList className="bg-teal-700/10 dark:bg-teal-900/30 grid w-full grid-cols-3">
          <TabsTrigger value="appearance" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="sidebar" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            <Layout className="h-4 w-4 mr-2" />
            Sidebar
          </TabsTrigger>
          <TabsTrigger value="data" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            <Database className="h-4 w-4 mr-2" />
            Data Management
          </TabsTrigger>
        </TabsList>
        
        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className={`${getThemeClass()} shadow-lg rounded-xl`}>
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
                <CardDescription className={tempSettings.theme === "dark" ? "text-gray-300" : ""}>
                  Customize the application's visual theme
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Theme Mode</Label>
                  <RadioGroup 
                    defaultValue={tempSettings.theme} 
                    onValueChange={(value: "light" | "dark" | "system") => handleThemeChange(value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5">
                      <RadioGroupItem value="light" id="light" />
                      <Label htmlFor="light" className="flex items-center cursor-pointer">
                        <Sun className="h-4 w-4 mr-2" />
                        Light
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5">
                      <RadioGroupItem value="dark" id="dark" />
                      <Label htmlFor="dark" className="flex items-center cursor-pointer">
                        <Moon className="h-4 w-4 mr-2" />
                        Dark
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5">
                      <RadioGroupItem value="system" id="system" />
                      <Label htmlFor="system" className="flex items-center cursor-pointer">
                        <Computer className="h-4 w-4 mr-2" />
                        System
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {["teal", "blue", "purple", "amber", "red", "emerald", "pink", "indigo"].map(color => (
                      <Button
                        key={color}
                        type="button"
                        variant="outline"
                        onClick={() => handleAccentColorChange(color)}
                        className={`h-10 rounded-md p-0 relative ${
                          tempSettings.accentColor === color 
                            ? "ring-2 ring-offset-2 ring-teal-500 dark:ring-teal-400" 
                            : ""
                        }`}
                      >
                        <div
                          className="absolute inset-0.5 rounded-sm"
                          style={{ backgroundColor: `var(--${color}-600)` }}
                        />
                        <span className="sr-only">{color}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Table Style</Label>
                  <Select
                    defaultValue={tempSettings.tableStyle}
                    onValueChange={(value: "default" | "bordered" | "striped") => handleTableStyleChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select table style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="bordered">Bordered</SelectItem>
                      <SelectItem value="striped">Striped</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            {/* Preview card */}
            <Card className={`${
              tempSettings.theme === "dark" 
                ? "bg-gray-800 text-white border-gray-700" 
                : "bg-white"
            } shadow-lg rounded-xl border`}>
              <CardHeader>
                <CardTitle>Theme Preview</CardTitle>
                <CardDescription className={tempSettings.theme === "dark" ? "text-gray-300" : ""}>
                  See how your settings look
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`p-4 rounded-md ${
                  tempSettings.theme === "dark" 
                    ? "bg-gray-900" 
                    : "bg-gray-50"
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`h-3 w-3 rounded-full bg-${tempSettings.accentColor}-500`}></div>
                    <span className="font-medium">Sample Header</span>
                  </div>
                  <p className={`text-sm ${
                    tempSettings.theme === "dark" 
                      ? "text-gray-300" 
                      : "text-gray-500"
                  }`}>
                    This is how text will appear with your selected theme.
                  </p>
                </div>
                
                <div>
                  <div className={`h-8 w-full rounded-t-md ${
                    tempSettings.theme === "dark" 
                      ? `bg-${tempSettings.accentColor}-900/50` 
                      : `bg-${tempSettings.accentColor}-600/30`
                  } flex items-center px-3`}>
                    <span className="text-xs font-medium">Table Header</span>
                  </div>
                  <div className={`h-7 w-full ${
                    tempSettings.theme === "dark" 
                      ? "bg-gray-800" 
                      : "bg-white"
                  } ${
                    tempSettings.tableStyle === "bordered" 
                      ? "border border-gray-200 dark:border-gray-700" 
                      : ""
                  } ${
                    tempSettings.tableStyle === "striped" 
                      ? "bg-opacity-50 dark:bg-opacity-50" 
                      : ""
                  } flex items-center px-3`}>
                    <span className="text-xs">Row 1</span>
                  </div>
                  <div className={`h-7 w-full ${
                    tempSettings.theme === "dark" 
                      ? "bg-gray-800" 
                      : "bg-white"
                  } ${
                    tempSettings.tableStyle === "bordered" 
                      ? "border border-gray-200 dark:border-gray-700" 
                      : ""
                  } ${
                    tempSettings.tableStyle === "striped" 
                      ? `${tempSettings.theme === "dark" ? "bg-gray-900/50" : "bg-gray-50/50"}` 
                      : ""
                  } flex items-center px-3`}>
                    <span className="text-xs">Row 2</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    className={`bg-${tempSettings.accentColor}-600 hover:bg-${tempSettings.accentColor}-700 text-white`}
                  >
                    Primary Button
                  </Button>
                  <Button size="sm" variant="outline">
                    Secondary
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Sidebar Settings */}
        <TabsContent value="sidebar">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className={`${getThemeClass()} shadow-lg rounded-xl`}>
              <CardHeader>
                <CardTitle>Sidebar Configuration</CardTitle>
                <CardDescription className={tempSettings.theme === "dark" ? "text-gray-300" : ""}>
                  Customize the appearance of the navigation sidebar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Sidebar Style</Label>
                  <RadioGroup 
                    defaultValue={tempSettings.sidebarStyle} 
                    onValueChange={(value: "default" | "compact" | "expanded" | "gradient") => handleSidebarStyleChange(value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5">
                      <RadioGroupItem value="default" id="default" />
                      <Label htmlFor="default" className="flex items-center cursor-pointer">
                        <Layout className="h-4 w-4 mr-2" />
                        Default
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5">
                      <RadioGroupItem value="compact" id="compact" />
                      <Label htmlFor="compact" className="flex items-center cursor-pointer">
                        <ChevronsLeftRight className="h-4 w-4 mr-2" />
                        Compact
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5">
                      <RadioGroupItem value="expanded" id="expanded" />
                      <Label htmlFor="expanded" className="flex items-center cursor-pointer">
                        <Layout className="h-4 w-4 mr-2" />
                        Expanded
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5">
                      <RadioGroupItem value="gradient" id="gradient" />
                      <Label htmlFor="gradient" className="flex items-center cursor-pointer">
                        <Palette className="h-4 w-4 mr-2" />
                        Gradient
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label>Sidebar Color</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {["default", "teal", "blue", "purple", "amber", "gray", "emerald", "indigo"].map(color => (
                      <Button
                        key={color}
                        type="button"
                        variant="outline"
                        onClick={() => handleSidebarColorChange(color)}
                        className={`h-10 rounded-md p-0 relative ${
                          tempSettings.sidebarColor === color 
                            ? "ring-2 ring-offset-2 ring-teal-500 dark:ring-teal-400" 
                            : ""
                        }`}
                      >
                        <div
                          className={`absolute inset-0.5 rounded-sm ${
                            color === "default" 
                              ? tempSettings.theme === "dark" 
                                ? "bg-gray-800" 
                                : "bg-white" 
                              : ""
                          }`}
                          style={color !== "default" ? { backgroundColor: `var(--${color}-600)` } : {}}
                        />
                        <span className="sr-only">{color}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-active-indicator">Show Active Indicator</Label>
                    <Switch id="show-active-indicator" defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Sidebar Preview */}
            <Card className={`${
              tempSettings.theme === "dark" 
                ? "bg-gray-800 text-white border-gray-700" 
                : "bg-white"
            } shadow-lg rounded-xl border h-[400px]`}>
              <CardHeader>
                <CardTitle>Sidebar Preview</CardTitle>
                <CardDescription className={tempSettings.theme === "dark" ? "text-gray-300" : ""}>
                  Preview of your sidebar appearance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`w-56 h-64 rounded-md overflow-hidden border ${
                  tempSettings.theme === "dark" 
                    ? "border-gray-700" 
                    : "border-gray-200"
                }`}>
                  {/* Sidebar header */}
                  <div className={`p-3 ${
                    tempSettings.sidebarStyle === "gradient"
                      ? `bg-gradient-to-b from-${tempSettings.sidebarColor === "default" ? "teal" : tempSettings.sidebarColor}-700 to-${tempSettings.sidebarColor === "default" ? "teal" : tempSettings.sidebarColor}-900 text-white`
                      : tempSettings.sidebarColor === "default"
                        ? tempSettings.theme === "dark" 
                          ? "bg-gray-900 text-white" 
                          : "bg-gray-100 text-gray-800"
                        : `bg-${tempSettings.sidebarColor}-600 text-white`
                  }`}>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-white"></div>
                      <span className="font-semibold text-sm">Milk Delivery App</span>
                    </div>
                  </div>
                  
                  {/* Sidebar content */}
                  <div className={`p-2 ${
                    tempSettings.sidebarStyle === "gradient"
                      ? `bg-gradient-to-b from-${tempSettings.sidebarColor === "default" ? "teal" : tempSettings.sidebarColor}-800 to-${tempSettings.sidebarColor === "default" ? "teal" : tempSettings.sidebarColor}-900 text-white h-full`
                      : tempSettings.sidebarColor === "default"
                        ? tempSettings.theme === "dark" 
                          ? "bg-gray-900 text-gray-300" 
                          : "bg-white text-gray-700"
                        : `bg-${tempSettings.sidebarColor}-700 text-white h-full`
                  }`}>
                    <div className={`flex items-center ${
                      tempSettings.sidebarStyle === "compact" ? "" : "space-x-2"
                    } p-2 rounded-md ${
                      tempSettings.sidebarStyle === "compact" 
                        ? "justify-center" 
                        : ""
                    } ${
                      tempSettings.sidebarColor === "default"
                        ? tempSettings.theme === "dark" 
                          ? "bg-gray-800 text-white" 
                          : "bg-gray-100 text-gray-800"
                        : `bg-${tempSettings.sidebarColor}-600/80 text-white`
                    }`}>
                      <Layout className="h-4 w-4" />
                      {tempSettings.sidebarStyle !== "compact" && <span className="text-sm">Dashboard</span>}
                    </div>
                    
                    <div className={`flex items-center ${
                      tempSettings.sidebarStyle === "compact" ? "" : "space-x-2"
                    } p-2 mt-1 rounded-md ${
                      tempSettings.sidebarStyle === "compact" 
                        ? "justify-center" 
                        : ""
                    }`}>
                      <Database className="h-4 w-4" />
                      {tempSettings.sidebarStyle !== "compact" && <span className="text-sm">Orders</span>}
                    </div>
                    
                    <div className={`flex items-center ${
                      tempSettings.sidebarStyle === "compact" ? "" : "space-x-2"
                    } p-2 mt-1 rounded-md ${
                      tempSettings.sidebarStyle === "compact" 
                        ? "justify-center" 
                        : ""
                    }`}>
                      <Info className="h-4 w-4" />
                      {tempSettings.sidebarStyle !== "compact" && <span className="text-sm">Reports</span>}
                    </div>
                    
                    <div className={`flex items-center ${
                      tempSettings.sidebarStyle === "compact" ? "" : "space-x-2"
                    } p-2 mt-1 rounded-md ${
                      tempSettings.sidebarStyle === "compact" 
                        ? "justify-center" 
                        : ""
                    }`}>
                      <Bell className="h-4 w-4" />
                      {tempSettings.sidebarStyle !== "compact" && <span className="text-sm">Notifications</span>}
                    </div>
                    
                    <div className={`flex items-center ${
                      tempSettings.sidebarStyle === "compact" ? "" : "space-x-2"
                    } p-2 mt-1 rounded-md ${
                      tempSettings.sidebarStyle === "compact" 
                        ? "justify-center" 
                        : ""
                    }`}>
                      <Palette className="h-4 w-4" />
                      {tempSettings.sidebarStyle !== "compact" && <span className="text-sm">Settings</span>}
                    </div>
                    
                    <div className={`flex items-center ${
                      tempSettings.sidebarStyle === "compact" ? "" : "space-x-2"
                    } p-2 mt-1 rounded-md ${
                      tempSettings.sidebarStyle === "compact" 
                        ? "justify-center" 
                        : ""
                    }`}>
                      <LogOut className="h-4 w-4" />
                      {tempSettings.sidebarStyle !== "compact" && <span className="text-sm">Logout</span>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Data Management Settings */}
        <TabsContent value="data">
          <Card className="shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Import, export, or reset application data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border border-gray-200 dark:border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Export Data</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4">
                      Export your data for backup or migrating to another system
                    </p>
                    <Select defaultValue="all">
                      <SelectTrigger className="mb-4">
                        <SelectValue placeholder="Select data to export" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Export Options</SelectLabel>
                          <SelectItem value="all">All Data</SelectItem>
                          <SelectItem value="customers">Customers Only</SelectItem>
                          <SelectItem value="orders">Orders Only</SelectItem>
                          <SelectItem value="products">Products Only</SelectItem>
                          <SelectItem value="suppliers">Suppliers Only</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                      Export as JSON
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="border border-gray-200 dark:border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Import Data</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4">
                      Import data from a JSON file
                    </p>
                    <div className="flex items-center justify-center h-20 border-2 border-dashed rounded-md border-gray-300 dark:border-gray-700 p-2 mb-4">
                      <p className="text-sm text-center text-muted-foreground">
                        Drag and drop a JSON file or click to browse
                      </p>
                    </div>
                    <Button variant="outline" className="w-full">
                      Browse Files
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="border border-red-200 dark:border-red-900 mt-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-red-600 dark:text-red-400">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4">
                    Reset or delete application data. These actions cannot be undone.
                  </p>
                  <div className="flex flex-col space-y-2">
                    <Button variant="destructive" className="w-full">
                      Reset All Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex items-center justify-end space-x-4">
        <Button variant="outline" onClick={resetSettings} className="flex items-center">
          <Undo className="mr-2 h-4 w-4" />
          Reset to Defaults
        </Button>
        <Button onClick={saveSettings} className="bg-teal-600 hover:bg-teal-700 text-white">
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
