
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, UserCog, Shield, Users, Key } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const UserAccess = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Access Management</h1>
          <p className="text-muted-foreground">
            Control user roles, permissions, and access levels
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="roles">
            <UserCog className="mr-2 h-4 w-4" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="permissions">
            <Shield className="mr-2 h-4 w-4" />
            Permissions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and their roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Email</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Role</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4 align-middle">Aditya Sharma</td>
                      <td className="p-4 align-middle">aditya@example.com</td>
                      <td className="p-4 align-middle">
                        <Badge variant="secondary">Administrator</Badge>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                          Active
                        </div>
                      </td>
                      <td className="p-4 align-middle flex space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm" className="text-destructive border-destructive">Disable</Button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 align-middle">Priya Patel</td>
                      <td className="p-4 align-middle">priya@example.com</td>
                      <td className="p-4 align-middle">
                        <Badge variant="secondary">Manager</Badge>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                          Active
                        </div>
                      </td>
                      <td className="p-4 align-middle flex space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm" className="text-destructive border-destructive">Disable</Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 align-middle">Raj Kumar</td>
                      <td className="p-4 align-middle">raj@example.com</td>
                      <td className="p-4 align-middle">
                        <Badge variant="secondary">Salesperson</Badge>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500 mr-2"></div>
                          Inactive
                        </div>
                      </td>
                      <td className="p-4 align-middle flex space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">Enable</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="roles" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 text-white">
                <CardTitle className="text-white">Administrator</CardTitle>
                <CardDescription className="text-gray-300">
                  Full system access
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Users with this role: 1</p>
                    <Badge>Default</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Administrators have full access to all features and settings within the application.
                  </p>
                  <div className="pt-2">
                    <Button variant="outline" className="w-full">Edit Role</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Manager</CardTitle>
                <CardDescription>
                  Operational access
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Users with this role: 2</p>
                    <Badge variant="outline">Custom</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Managers can access and modify operational data but cannot modify system settings.
                  </p>
                  <div className="pt-2">
                    <Button variant="outline" className="w-full">Edit Role</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Salesperson</CardTitle>
                <CardDescription>
                  Limited access
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Users with this role: 3</p>
                    <Badge variant="outline">Custom</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Salespeople can create orders and view customer information but cannot access financial data.
                  </p>
                  <div className="pt-2">
                    <Button variant="outline" className="w-full">Edit Role</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-center">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Role
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Permission Matrix</CardTitle>
              <CardDescription>Configure access levels for different roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="h-12 px-4 text-left align-middle font-medium">Feature / Module</th>
                      <th className="h-12 px-4 text-center align-middle font-medium">Administrator</th>
                      <th className="h-12 px-4 text-center align-middle font-medium">Manager</th>
                      <th className="h-12 px-4 text-center align-middle font-medium">Salesperson</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b bg-slate-50">
                      <td className="p-4 align-middle font-medium" colSpan={4}>Customer Management</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 align-middle pl-8">View Customers</td>
                      <td className="p-4 text-center align-middle"><Switch defaultChecked disabled /></td>
                      <td className="p-4 text-center align-middle"><Switch defaultChecked disabled /></td>
                      <td className="p-4 text-center align-middle"><Switch defaultChecked disabled /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 align-middle pl-8">Add/Edit Customers</td>
                      <td className="p-4 text-center align-middle"><Switch defaultChecked disabled /></td>
                      <td className="p-4 text-center align-middle"><Switch defaultChecked disabled /></td>
                      <td className="p-4 text-center align-middle"><Switch defaultChecked /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 align-middle pl-8">Delete Customers</td>
                      <td className="p-4 text-center align-middle"><Switch defaultChecked disabled /></td>
                      <td className="p-4 text-center align-middle"><Switch disabled /></td>
                      <td className="p-4 text-center align-middle"><Switch disabled /></td>
                    </tr>
                    
                    <tr className="border-b bg-slate-50">
                      <td className="p-4 align-middle font-medium" colSpan={4}>Financial Data</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 align-middle pl-8">View Financial Reports</td>
                      <td className="p-4 text-center align-middle"><Switch defaultChecked disabled /></td>
                      <td className="p-4 text-center align-middle"><Switch defaultChecked disabled /></td>
                      <td className="p-4 text-center align-middle"><Switch disabled /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 align-middle pl-8">Manage Payments</td>
                      <td className="p-4 text-center align-middle"><Switch defaultChecked disabled /></td>
                      <td className="p-4 text-center align-middle"><Switch defaultChecked /></td>
                      <td className="p-4 text-center align-middle"><Switch disabled /></td>
                    </tr>
                    
                    <tr className="border-b bg-slate-50">
                      <td className="p-4 align-middle font-medium" colSpan={4}>System Settings</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 align-middle pl-8">User Management</td>
                      <td className="p-4 text-center align-middle"><Switch defaultChecked disabled /></td>
                      <td className="p-4 text-center align-middle"><Switch disabled /></td>
                      <td className="p-4 text-center align-middle"><Switch disabled /></td>
                    </tr>
                    <tr>
                      <td className="p-4 align-middle pl-8">System Configuration</td>
                      <td className="p-4 text-center align-middle"><Switch defaultChecked disabled /></td>
                      <td className="p-4 text-center align-middle"><Switch disabled /></td>
                      <td className="p-4 text-center align-middle"><Switch disabled /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserAccess;
