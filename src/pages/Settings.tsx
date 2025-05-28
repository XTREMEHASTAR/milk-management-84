
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/data/DataContext";
import { Save, Upload } from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const { updateUISettings, uiSettings } = useData();
  const [activeTab, setActiveTab] = useState("general");
  
  // General settings
  const [companyName, setCompanyName] = useState(uiSettings?.companyName || "Milk Center");
  const [companyAddress, setCompanyAddress] = useState(uiSettings?.companyAddress || "");
  const [companyPhone, setCompanyPhone] = useState(uiSettings?.companyPhone || "");
  const [companyEmail, setCompanyEmail] = useState(uiSettings?.companyEmail || "");
  const [currency, setCurrency] = useState(uiSettings?.currency || "INR");
  
  // Invoice settings
  const [defaultInvoiceTerms, setDefaultInvoiceTerms] = useState(uiSettings?.defaultInvoiceTerms || "");
  const [defaultPaymentDays, setDefaultPaymentDays] = useState(uiSettings?.defaultPaymentDays?.toString() || "15");
  const [showGst, setShowGst] = useState(uiSettings?.showGst || false);
  const [gstNumber, setGstNumber] = useState(uiSettings?.gstNumber || "");
  const [selectedInvoiceTemplate, setSelectedInvoiceTemplate] = useState(uiSettings?.selectedInvoiceTemplate || "standard");
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(uiSettings?.emailNotifications || false);
  const [smsNotifications, setSmsNotifications] = useState(uiSettings?.smsNotifications || false);
  const [lowStockAlert, setLowStockAlert] = useState(uiSettings?.lowStockAlert || false);
  const [lowStockThreshold, setLowStockThreshold] = useState(uiSettings?.lowStockThreshold?.toString() || "10");
  const [paymentReminders, setPaymentReminders] = useState(uiSettings?.paymentReminders || false);
  
  // System settings
  const [dateFormat, setDateFormat] = useState(uiSettings?.dateFormat || "DD-MM-YYYY");
  const [timeFormat, setTimeFormat] = useState(uiSettings?.timeFormat || "24h");
  const [backupFrequency, setBackupFrequency] = useState(uiSettings?.backupFrequency || "daily");
  
  // Load settings from context when component mounts
  useEffect(() => {
    if (uiSettings) {
      setCompanyName(uiSettings.companyName || "Milk Center");
      setCompanyAddress(uiSettings.companyAddress || "");
      setCompanyPhone(uiSettings.companyPhone || "");
      setCompanyEmail(uiSettings.companyEmail || "");
      setCurrency(uiSettings.currency || "INR");
      
      setDefaultInvoiceTerms(uiSettings.defaultInvoiceTerms || "");
      setDefaultPaymentDays(uiSettings.defaultPaymentDays?.toString() || "15");
      setShowGst(uiSettings.showGst || false);
      setGstNumber(uiSettings.gstNumber || "");
      setSelectedInvoiceTemplate(uiSettings.selectedInvoiceTemplate || "standard");
      
      setEmailNotifications(uiSettings.emailNotifications || false);
      setSmsNotifications(uiSettings.smsNotifications || false);
      setLowStockAlert(uiSettings.lowStockAlert || false);
      setLowStockThreshold(uiSettings.lowStockThreshold?.toString() || "10");
      setPaymentReminders(uiSettings.paymentReminders || false);
      
      setDateFormat(uiSettings.dateFormat || "DD-MM-YYYY");
      setTimeFormat(uiSettings.timeFormat || "24h");
      setBackupFrequency(uiSettings.backupFrequency || "daily");
    }
  }, [uiSettings]);
  
  const saveSettings = () => {
    const settings = {
      companyName,
      companyAddress,
      companyPhone,
      companyEmail,
      currency,
      defaultInvoiceTerms,
      defaultPaymentDays: parseInt(defaultPaymentDays) || 15,
      showGst,
      gstNumber,
      selectedInvoiceTemplate,
      emailNotifications,
      smsNotifications,
      lowStockAlert,
      lowStockThreshold: parseInt(lowStockThreshold) || 10,
      paymentReminders,
      dateFormat,
      timeFormat,
      backupFrequency
    };
    
    updateUISettings(settings);
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully."
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your application settings and preferences
          </p>
        </div>
        <Button onClick={saveSettings}>
          <Save className="mr-2 h-4 w-4" />
          Save All Settings
        </Button>
      </div>
      
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="invoice">Invoice</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        
        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Update your company details which will appear on invoices and reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input 
                  id="company-name" 
                  value={companyName} 
                  onChange={e => setCompanyName(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-address">Company Address</Label>
                <Textarea 
                  id="company-address" 
                  value={companyAddress} 
                  onChange={e => setCompanyAddress(e.target.value)} 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-phone">Phone Number</Label>
                  <Input 
                    id="company-phone" 
                    value={companyPhone} 
                    onChange={e => setCompanyPhone(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-email">Email Address</Label>
                  <Input 
                    id="company-email" 
                    type="email" 
                    value={companyEmail} 
                    onChange={e => setCompanyEmail(e.target.value)} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                    <SelectItem value="USD">US Dollar ($)</SelectItem>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                    <SelectItem value="GBP">British Pound (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button onClick={() => saveSettings()}>
                <Save className="mr-2 h-4 w-4" />
                Save Company Info
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Company Logo</CardTitle>
              <CardDescription>
                Upload your company logo that will appear on invoices and receipts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-lg border-gray-300 bg-gray-50">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG, SVG up to 2MB</p>
                  </div>
                  <Button variant="outline" className="mt-4">Select Logo</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Invoice Settings */}
        <TabsContent value="invoice" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Preferences</CardTitle>
              <CardDescription>
                Customize default settings for your invoices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invoice-terms">Default Invoice Terms</Label>
                <Textarea 
                  id="invoice-terms" 
                  value={defaultInvoiceTerms} 
                  onChange={e => setDefaultInvoiceTerms(e.target.value)} 
                  placeholder="Enter your default terms and conditions to be included on invoices"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="payment-days">Default Payment Due Days</Label>
                <Input 
                  id="payment-days" 
                  type="number" 
                  min="0" 
                  value={defaultPaymentDays} 
                  onChange={e => setDefaultPaymentDays(e.target.value)} 
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="show-gst" 
                  checked={showGst} 
                  onCheckedChange={setShowGst} 
                />
                <Label htmlFor="show-gst">Show GST on Invoices</Label>
              </div>
              
              {showGst && (
                <div className="space-y-2">
                  <Label htmlFor="gst-number">GST Number</Label>
                  <Input 
                    id="gst-number" 
                    value={gstNumber} 
                    onChange={e => setGstNumber(e.target.value)} 
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="invoice-template">Default Invoice Template</Label>
                <Select value={selectedInvoiceTemplate} onValueChange={setSelectedInvoiceTemplate}>
                  <SelectTrigger id="invoice-template">
                    <SelectValue placeholder="Select template" />
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
            </CardContent>
            <CardFooter className="justify-end">
              <Button onClick={() => saveSettings()}>
                <Save className="mr-2 h-4 w-4" />
                Save Invoice Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Control how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="email-notifications" 
                  checked={emailNotifications} 
                  onCheckedChange={setEmailNotifications} 
                />
                <Label htmlFor="email-notifications">Email Notifications</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="sms-notifications" 
                  checked={smsNotifications} 
                  onCheckedChange={setSmsNotifications} 
                />
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="low-stock-alerts" 
                  checked={lowStockAlert} 
                  onCheckedChange={setLowStockAlert} 
                />
                <Label htmlFor="low-stock-alerts">Low Stock Alerts</Label>
              </div>
              
              {lowStockAlert && (
                <div className="space-y-2 pl-6">
                  <Label htmlFor="stock-threshold">Low Stock Threshold</Label>
                  <Input 
                    id="stock-threshold" 
                    type="number" 
                    min="0" 
                    value={lowStockThreshold} 
                    onChange={e => setLowStockThreshold(e.target.value)} 
                  />
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="payment-reminders" 
                  checked={paymentReminders} 
                  onCheckedChange={setPaymentReminders} 
                />
                <Label htmlFor="payment-reminders">Payment Due Reminders</Label>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button onClick={() => saveSettings()}>
                <Save className="mr-2 h-4 w-4" />
                Save Notification Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* System Settings */}
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Preferences</CardTitle>
              <CardDescription>
                Configure system-wide settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
                <Select value={dateFormat} onValueChange={setDateFormat}>
                  <SelectTrigger id="date-format">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD-MM-YYYY">DD-MM-YYYY</SelectItem>
                    <SelectItem value="MM-DD-YYYY">MM-DD-YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time-format">Time Format</Label>
                <Select value={timeFormat} onValueChange={setTimeFormat}>
                  <SelectTrigger id="time-format">
                    <SelectValue placeholder="Select time format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                    <SelectItem value="24h">24-hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="backup-frequency">Backup Frequency</Label>
                <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                  <SelectTrigger id="backup-frequency">
                    <SelectValue placeholder="Select backup frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button onClick={() => saveSettings()}>
                <Save className="mr-2 h-4 w-4" />
                Save System Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
