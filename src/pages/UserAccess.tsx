
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, UserCog, Shield, Lock, Edit, Trash, Check, X } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "operator";
  status: "active" | "inactive";
  permissions: {
    customers: boolean;
    orders: boolean;
    payments: boolean;
    reports: boolean;
    settings: boolean;
    suppliers: boolean;
    stock: boolean;
    expenses: boolean;
  };
}

const mockUsers: User[] = [
  {
    id: "u1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    permissions: {
      customers: true,
      orders: true,
      payments: true,
      reports: true,
      settings: true,
      suppliers: true,
      stock: true,
      expenses: true,
    },
  },
  {
    id: "u2",
    name: "Manager User",
    email: "manager@example.com",
    role: "manager",
    status: "active",
    permissions: {
      customers: true,
      orders: true,
      payments: true,
      reports: true,
      settings: false,
      suppliers: true,
      stock: true,
      expenses: true,
    },
  },
  {
    id: "u3",
    name: "Operator User",
    email: "operator@example.com",
    role: "operator",
    status: "inactive",
    permissions: {
      customers: true,
      orders: true,
      payments: true,
      reports: false,
      settings: false,
      suppliers: false,
      stock: false,
      expenses: false,
    },
  },
];

const UserAccess = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState<Omit<User, "id">>({
    name: "",
    email: "",
    role: "operator",
    status: "active",
    permissions: {
      customers: false,
      orders: false,
      payments: false,
      reports: false,
      settings: false,
      suppliers: false,
      stock: false,
      expenses: false,
    },
  });

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setShowAddForm(false);
  };

  const handleAddNewUser = () => {
    setSelectedUser(null);
    setShowAddForm(true);
    setNewUser({
      name: "",
      email: "",
      role: "operator",
      status: "active",
      permissions: {
        customers: false,
        orders: false,
        payments: false,
        reports: false,
        settings: false,
        suppliers: false,
        stock: false,
        expenses: false,
      },
    });
  };

  const handlePermissionChange = (
    field: keyof User["permissions"],
    value: boolean
  ) => {
    if (selectedUser) {
      const updatedUser = {
        ...selectedUser,
        permissions: {
          ...selectedUser.permissions,
          [field]: value,
        },
      };
      setSelectedUser(updatedUser);
    } else if (showAddForm) {
      setNewUser({
        ...newUser,
        permissions: {
          ...newUser.permissions,
          [field]: value,
        },
      });
    }
  };

  const handleSaveUser = () => {
    if (selectedUser) {
      setUsers(
        users.map((user) => (user.id === selectedUser.id ? selectedUser : user))
      );
      toast.success("User permissions updated successfully");
    } else if (showAddForm) {
      const id = `u${Date.now()}`;
      const userToAdd = { ...newUser, id };
      setUsers([...users, userToAdd as User]);
      setShowAddForm(false);
      toast.success("New user added successfully");
    }
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
    if (selectedUser && selectedUser.id === id) {
      setSelectedUser(null);
    }
    toast.success("User deleted successfully");
  };

  const applyRoleTemplate = (role: "admin" | "manager" | "operator") => {
    if (selectedUser || showAddForm) {
      const permissions = {
        customers: role === "admin" || role === "manager" || role === "operator",
        orders: role === "admin" || role === "manager" || role === "operator",
        payments: role === "admin" || role === "manager" || role === "operator",
        reports: role === "admin" || role === "manager",
        settings: role === "admin",
        suppliers: role === "admin" || role === "manager",
        stock: role === "admin" || role === "manager",
        expenses: role === "admin" || role === "manager",
      };

      if (selectedUser) {
        setSelectedUser({
          ...selectedUser,
          role,
          permissions,
        });
      } else {
        setNewUser({
          ...newUser,
          role,
          permissions,
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Access Management</h1>
        <p className="text-muted-foreground">
          Manage user accounts and their access permissions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users List */}
        <Card className="lg:col-span-1 bg-gradient-to-br from-indigo-900/90 to-purple-900/90 text-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <UserCog className="mr-2 h-5 w-5" />
              User Accounts
            </CardTitle>
            <CardDescription className="text-gray-300">
              Manage system users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleAddNewUser} 
              className="w-full mb-4 bg-purple-600 hover:bg-purple-700"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add New User
            </Button>

            <div className="space-y-2 mt-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`p-3 rounded-md flex items-center justify-between cursor-pointer ${
                    selectedUser?.id === user.id
                      ? "bg-white/20"
                      : "bg-white/10 hover:bg-white/15"
                  }`}
                  onClick={() => handleSelectUser(user)}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-3 ${
                        user.status === "active" ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-gray-300">{user.email}</div>
                    </div>
                  </div>
                  <div className="text-xs font-medium px-2 py-1 rounded-full bg-white/10">
                    {user.role}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Details / Edit Form */}
        <Card className="lg:col-span-2 card-gradient">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              {selectedUser ? (
                <>
                  <Edit className="mr-2 h-5 w-5" />
                  Edit User Permissions
                </>
              ) : showAddForm ? (
                <>
                  <UserPlus className="mr-2 h-5 w-5" />
                  Add New User
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-5 w-5" />
                  User Permissions
                </>
              )}
            </CardTitle>
            <CardDescription className="text-gray-300">
              {selectedUser
                ? "Modify user access rights and permissions"
                : showAddForm
                ? "Create a new user account with specified permissions"
                : "Select a user to edit their permissions"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(selectedUser || showAddForm) ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter full name"
                      value={selectedUser ? selectedUser.name : newUser.name}
                      onChange={(e) => {
                        if (selectedUser) {
                          setSelectedUser({ ...selectedUser, name: e.target.value });
                        } else {
                          setNewUser({ ...newUser, name: e.target.value });
                        }
                      }}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@example.com"
                      value={selectedUser ? selectedUser.email : newUser.email}
                      onChange={(e) => {
                        if (selectedUser) {
                          setSelectedUser({ ...selectedUser, email: e.target.value });
                        } else {
                          setNewUser({ ...newUser, email: e.target.value });
                        }
                      }}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-white">Role</Label>
                    <Select
                      value={selectedUser ? selectedUser.role : newUser.role}
                      onValueChange={(value: "admin" | "manager" | "operator") => {
                        if (selectedUser) {
                          setSelectedUser({ ...selectedUser, role: value });
                          applyRoleTemplate(value);
                        } else {
                          setNewUser({ ...newUser, role: value });
                          applyRoleTemplate(value);
                        }
                      }}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="operator">Operator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-white">Status</Label>
                    <Select
                      value={selectedUser ? selectedUser.status : newUser.status}
                      onValueChange={(value: "active" | "inactive") => {
                        if (selectedUser) {
                          setSelectedUser({ ...selectedUser, status: value });
                        } else {
                          setNewUser({ ...newUser, status: value });
                        }
                      }}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-white mb-2 block">Permissions</Label>
                  <div className="bg-white/10 rounded-md overflow-hidden">
                    <Table>
                      <TableHeader className="bg-black/20">
                        <TableRow>
                          <TableHead className="text-white">Module</TableHead>
                          <TableHead className="text-white text-center">Access</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="border-t border-white/10">
                          <TableCell className="text-white font-medium">Customers</TableCell>
                          <TableCell className="text-center">
                            <Switch
                              checked={selectedUser ? selectedUser.permissions.customers : newUser.permissions.customers}
                              onCheckedChange={(checked) => handlePermissionChange("customers", checked)}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-t border-white/10">
                          <TableCell className="text-white font-medium">Orders</TableCell>
                          <TableCell className="text-center">
                            <Switch
                              checked={selectedUser ? selectedUser.permissions.orders : newUser.permissions.orders}
                              onCheckedChange={(checked) => handlePermissionChange("orders", checked)}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-t border-white/10">
                          <TableCell className="text-white font-medium">Payments</TableCell>
                          <TableCell className="text-center">
                            <Switch
                              checked={selectedUser ? selectedUser.permissions.payments : newUser.permissions.payments}
                              onCheckedChange={(checked) => handlePermissionChange("payments", checked)}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-t border-white/10">
                          <TableCell className="text-white font-medium">Reports</TableCell>
                          <TableCell className="text-center">
                            <Switch
                              checked={selectedUser ? selectedUser.permissions.reports : newUser.permissions.reports}
                              onCheckedChange={(checked) => handlePermissionChange("reports", checked)}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-t border-white/10">
                          <TableCell className="text-white font-medium">Settings</TableCell>
                          <TableCell className="text-center">
                            <Switch
                              checked={selectedUser ? selectedUser.permissions.settings : newUser.permissions.settings}
                              onCheckedChange={(checked) => handlePermissionChange("settings", checked)}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-t border-white/10">
                          <TableCell className="text-white font-medium">Suppliers</TableCell>
                          <TableCell className="text-center">
                            <Switch
                              checked={selectedUser ? selectedUser.permissions.suppliers : newUser.permissions.suppliers}
                              onCheckedChange={(checked) => handlePermissionChange("suppliers", checked)}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-t border-white/10">
                          <TableCell className="text-white font-medium">Stock</TableCell>
                          <TableCell className="text-center">
                            <Switch
                              checked={selectedUser ? selectedUser.permissions.stock : newUser.permissions.stock}
                              onCheckedChange={(checked) => handlePermissionChange("stock", checked)}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow className="border-t border-white/10">
                          <TableCell className="text-white font-medium">Expenses</TableCell>
                          <TableCell className="text-center">
                            <Switch
                              checked={selectedUser ? selectedUser.permissions.expenses : newUser.permissions.expenses}
                              onCheckedChange={(checked) => handlePermissionChange("expenses", checked)}
                            />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="flex justify-between mt-4">
                  <Button 
                    onClick={handleSaveUser} 
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    {selectedUser ? "Update User" : "Create User"}
                  </Button>
                  
                  {selectedUser && (
                    <Button 
                      onClick={() => handleDeleteUser(selectedUser.id)} 
                      variant="destructive"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete User
                    </Button>
                  )}
                  
                  {showAddForm && (
                    <Button 
                      onClick={() => setShowAddForm(false)} 
                      variant="outline"
                      className="bg-white/10 hover:bg-white/20 text-white"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Shield className="h-16 w-16 mb-4 text-white/60" />
                <h3 className="text-xl font-medium text-white mb-2">No User Selected</h3>
                <p className="text-white/60 mb-6">
                  Please select a user from the list to edit their permissions or add a new user.
                </p>
                <Button 
                  onClick={handleAddNewUser} 
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add New User
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserAccess;
