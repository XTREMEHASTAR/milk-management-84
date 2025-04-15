
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Mail, Phone, Send, PlusCircle, Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Template {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
}

const emailTemplates: Template[] = [
  {
    id: "e1",
    name: "Payment Receipt",
    subject: "Payment Receipt - {{date}}",
    content: "Dear {{customer_name}},\n\nThank you for your payment of {{amount}} received on {{date}}. Your current outstanding balance is {{balance}}.\n\nRegards,\nYour Business",
    variables: ["customer_name", "amount", "date", "balance"],
  },
  {
    id: "e2",
    name: "Monthly Statement",
    subject: "Monthly Statement - {{month}}",
    content: "Dear {{customer_name}},\n\nPlease find attached your monthly statement for {{month}}. Your current outstanding balance is {{balance}}.\n\nRegards,\nYour Business",
    variables: ["customer_name", "month", "balance"],
  },
];

const smsTemplates: Template[] = [
  {
    id: "s1",
    name: "Payment Confirmation",
    subject: "",
    content: "Thank you {{customer_name}} for your payment of {{amount}}. Your current balance is {{balance}}.",
    variables: ["customer_name", "amount", "balance"],
  },
  {
    id: "s2",
    name: "Payment Reminder",
    subject: "",
    content: "Dear {{customer_name}}, your payment of {{amount}} is due on {{date}}. Please make the payment to avoid any inconvenience.",
    variables: ["customer_name", "amount", "date"],
  },
];

const whatsappTemplates: Template[] = [
  {
    id: "w1",
    name: "Delivery Confirmation",
    subject: "",
    content: "Hello {{customer_name}},\n\nYour order has been delivered. Total: {{amount}}. Please let us know if you have any feedback.\n\nRegards,\nYour Business",
    variables: ["customer_name", "amount"],
  },
  {
    id: "w2",
    name: "Order Confirmation",
    subject: "",
    content: "Hello {{customer_name}},\n\nYour order for {{product_list}} has been received and will be delivered on {{date}}.\n\nRegards,\nYour Business",
    variables: ["customer_name", "product_list", "date"],
  },
];

const Communication = () => {
  const [activeTab, setActiveTab] = useState("email");
  const [emailSettings, setEmailSettings] = useState({
    enabled: true,
    smtpServer: "smtp.example.com",
    smtpPort: "587",
    smtpUsername: "user@example.com",
    smtpPassword: "******",
    fromEmail: "business@example.com",
    fromName: "Your Business",
  });
  
  const [smsSettings, setSmsSettings] = useState({
    enabled: true,
    provider: "twilio",
    apiKey: "********",
    apiSecret: "********",
    fromNumber: "+1234567890",
  });
  
  const [whatsappSettings, setWhatsappSettings] = useState({
    enabled: true,
    provider: "twilio",
    apiKey: "********",
    apiSecret: "********",
    fromNumber: "+1234567890",
  });
  
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [activeTemplates, setActiveTemplates] = useState<Template[]>(emailTemplates);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSelectedTemplate(null);
    
    switch (value) {
      case "email":
        setActiveTemplates(emailTemplates);
        break;
      case "sms":
        setActiveTemplates(smsTemplates);
        break;
      case "whatsapp":
        setActiveTemplates(whatsappTemplates);
        break;
    }
  };
  
  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
  };
  
  const handleSaveSettings = () => {
    toast.success(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} settings saved successfully`);
  };
  
  const handleSaveTemplate = () => {
    if (selectedTemplate) {
      toast.success(`Template "${selectedTemplate.name}" saved successfully`);
    }
  };
  
  const handleTestSend = () => {
    if (selectedTemplate) {
      toast.success(`Test message sent using template "${selectedTemplate.name}"`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Communication Settings</h1>
        <p className="text-muted-foreground">
          Configure email, SMS, and WhatsApp notification settings
        </p>
      </div>

      <Tabs defaultValue="email" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="email" className="flex items-center">
            <Mail className="mr-2 h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            SMS
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center">
            <Phone className="mr-2 h-4 w-4" />
            WhatsApp
          </TabsTrigger>
        </TabsList>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Templates List */}
          <Card className="lg:col-span-1 bg-gradient-to-br from-indigo-900/90 to-purple-900/90 text-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Templates
              </CardTitle>
              <CardDescription className="text-gray-300">
                Manage message templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline"
                className="w-full mb-4 bg-white/10 hover:bg-white/20 text-white"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Template
              </Button>

              <div className="space-y-2 mt-2">
                {activeTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-3 rounded-md cursor-pointer ${
                      selectedTemplate?.id === template.id
                        ? "bg-white/20"
                        : "bg-white/10 hover:bg-white/15"
                    }`}
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <div className="font-medium">{template.name}</div>
                    <div className="text-xs text-gray-300 mt-1 line-clamp-2">
                      {template.content.substring(0, 60)}...
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Template Editor */}
          <Card className="lg:col-span-2 card-gradient">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                {selectedTemplate ? (
                  <>Edit Template: {selectedTemplate.name}</>
                ) : (
                  <>Template Editor</>
                )}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {selectedTemplate
                  ? "Modify the template content and settings"
                  : "Select a template to edit"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedTemplate ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="template-name" className="text-white">Template Name</Label>
                      <Input
                        id="template-name"
                        value={selectedTemplate.name}
                        onChange={(e) => {
                          setSelectedTemplate({
                            ...selectedTemplate,
                            name: e.target.value,
                          });
                        }}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    {activeTab === "email" && (
                      <div className="space-y-2">
                        <Label htmlFor="template-subject" className="text-white">Email Subject</Label>
                        <Input
                          id="template-subject"
                          value={selectedTemplate.subject}
                          onChange={(e) => {
                            setSelectedTemplate({
                              ...selectedTemplate,
                              subject: e.target.value,
                            });
                          }}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template-content" className="text-white">Message Content</Label>
                    <Textarea
                      id="template-content"
                      value={selectedTemplate.content}
                      onChange={(e) => {
                        setSelectedTemplate({
                          ...selectedTemplate,
                          content: e.target.value,
                        });
                      }}
                      rows={8}
                      className="bg-white/10 border-white/20 text-white"
                    />
                    <p className="text-xs text-gray-300 mt-1">
                      Use variables in double curly braces like {{"{{"}}variable_name{{"}}"}}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Available Variables</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.variables.map((variable) => (
                        <div
                          key={variable}
                          className="bg-white/10 text-white text-xs px-2 py-1 rounded"
                        >
                          {{"{{"}}{{variable}}{{"}}"}}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between mt-4">
                    <Button 
                      onClick={handleSaveTemplate} 
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Template
                    </Button>
                    
                    <Button 
                      onClick={handleTestSend} 
                      variant="outline"
                      className="bg-white/10 hover:bg-white/20 text-white"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Test Send
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <MessageSquare className="h-16 w-16 mb-4 text-white/60" />
                  <h3 className="text-xl font-medium text-white mb-2">No Template Selected</h3>
                  <p className="text-white/60 mb-6">
                    Please select a template from the list to edit or create a new one.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <TabsContent value="email" className="mt-6">
          <Card className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 text-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Email Configuration
              </CardTitle>
              <CardDescription className="text-gray-300">
                Configure your email server settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Switch 
                  id="email-enabled" 
                  checked={emailSettings.enabled}
                  onCheckedChange={(checked) => setEmailSettings({...emailSettings, enabled: checked})}
                />
                <Label htmlFor="email-enabled" className="text-white">Enable email notifications</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="smtp-server" className="text-white">SMTP Server</Label>
                  <Input
                    id="smtp-server"
                    value={emailSettings.smtpServer}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpServer: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    disabled={!emailSettings.enabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port" className="text-white">SMTP Port</Label>
                  <Input
                    id="smtp-port"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    disabled={!emailSettings.enabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-username" className="text-white">SMTP Username</Label>
                  <Input
                    id="smtp-username"
                    value={emailSettings.smtpUsername}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    disabled={!emailSettings.enabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-password" className="text-white">SMTP Password</Label>
                  <Input
                    id="smtp-password"
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    disabled={!emailSettings.enabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from-email" className="text-white">From Email</Label>
                  <Input
                    id="from-email"
                    value={emailSettings.fromEmail}
                    onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    disabled={!emailSettings.enabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from-name" className="text-white">From Name</Label>
                  <Input
                    id="from-name"
                    value={emailSettings.fromName}
                    onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    disabled={!emailSettings.enabled}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button 
                  onClick={handleSaveSettings} 
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={!emailSettings.enabled}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Email Settings
                </Button>
                
                <Button 
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white"
                  disabled={!emailSettings.enabled}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sms" className="mt-6">
          <Card className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 text-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                SMS Configuration
              </CardTitle>
              <CardDescription className="text-gray-300">
                Configure your SMS gateway settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Switch 
                  id="sms-enabled" 
                  checked={smsSettings.enabled}
                  onCheckedChange={(checked) => setSmsSettings({...smsSettings, enabled: checked})}
                />
                <Label htmlFor="sms-enabled" className="text-white">Enable SMS notifications</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="sms-provider" className="text-white">SMS Provider</Label>
                  <Input
                    id="sms-provider"
                    value={smsSettings.provider}
                    onChange={(e) => setSmsSettings({...smsSettings, provider: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    disabled={!smsSettings.enabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sms-from" className="text-white">From Number</Label>
                  <Input
                    id="sms-from"
                    value={smsSettings.fromNumber}
                    onChange={(e) => setSmsSettings({...smsSettings, fromNumber: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    disabled={!smsSettings.enabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sms-api-key" className="text-white">API Key</Label>
                  <Input
                    id="sms-api-key"
                    value={smsSettings.apiKey}
                    onChange={(e) => setSmsSettings({...smsSettings, apiKey: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    disabled={!smsSettings.enabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sms-api-secret" className="text-white">API Secret</Label>
                  <Input
                    id="sms-api-secret"
                    type="password"
                    value={smsSettings.apiSecret}
                    onChange={(e) => setSmsSettings({...smsSettings, apiSecret: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    disabled={!smsSettings.enabled}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button 
                  onClick={handleSaveSettings} 
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={!smsSettings.enabled}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save SMS Settings
                </Button>
                
                <Button 
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white"
                  disabled={!smsSettings.enabled}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Test SMS
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whatsapp" className="mt-6">
          <Card className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 text-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Phone className="mr-2 h-5 w-5" />
                WhatsApp Configuration
              </CardTitle>
              <CardDescription className="text-gray-300">
                Configure your WhatsApp Business API settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Switch 
                  id="whatsapp-enabled" 
                  checked={whatsappSettings.enabled}
                  onCheckedChange={(checked) => setWhatsappSettings({...whatsappSettings, enabled: checked})}
                />
                <Label htmlFor="whatsapp-enabled" className="text-white">Enable WhatsApp notifications</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp-provider" className="text-white">WhatsApp Provider</Label>
                  <Input
                    id="whatsapp-provider"
                    value={whatsappSettings.provider}
                    onChange={(e) => setWhatsappSettings({...whatsappSettings, provider: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    disabled={!whatsappSettings.enabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp-from" className="text-white">From Number</Label>
                  <Input
                    id="whatsapp-from"
                    value={whatsappSettings.fromNumber}
                    onChange={(e) => setWhatsappSettings({...whatsappSettings, fromNumber: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    disabled={!whatsappSettings.enabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp-api-key" className="text-white">API Key</Label>
                  <Input
                    id="whatsapp-api-key"
                    value={whatsappSettings.apiKey}
                    onChange={(e) => setWhatsappSettings({...whatsappSettings, apiKey: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    disabled={!whatsappSettings.enabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp-api-secret" className="text-white">API Secret</Label>
                  <Input
                    id="whatsapp-api-secret"
                    type="password"
                    value={whatsappSettings.apiSecret}
                    onChange={(e) => setWhatsappSettings({...whatsappSettings, apiSecret: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    disabled={!whatsappSettings.enabled}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button 
                  onClick={handleSaveSettings} 
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={!whatsappSettings.enabled}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save WhatsApp Settings
                </Button>
                
                <Button 
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white"
                  disabled={!whatsappSettings.enabled}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Test Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Communication;
