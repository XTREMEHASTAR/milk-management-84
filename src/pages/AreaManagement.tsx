
import React, { useState } from 'react';
import { useData } from '@/contexts/data/DataContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import { MapPin, Plus, Edit, Trash } from "lucide-react";

interface Area {
  id: string;
  name: string;
  code: string;
  description: string;
}

const AreaManagement = () => {
  const { customers, updateCustomer } = useData();
  const { toast } = useToast();
  
  // Since we don't have areas in the existing data model, we'll simulate them here
  const [areas, setAreas] = useState<Area[]>([
    { id: 'area1', name: 'North Zone', code: 'NZ', description: 'Northern part of the city' },
    { id: 'area2', name: 'South Zone', code: 'SZ', description: 'Southern part of the city' },
    { id: 'area3', name: 'East Zone', code: 'EZ', description: 'Eastern part of the city' },
    { id: 'area4', name: 'West Zone', code: 'WZ', description: 'Western part of the city' },
  ]);
  
  const [newArea, setNewArea] = useState({
    name: '',
    code: '',
    description: ''
  });
  
  const [editingArea, setEditingArea] = useState<string | null>(null);
  const [customerAreaAssignments, setCustomerAreaAssignments] = useState<{[key: string]: string}>({});

  const handleAddArea = () => {
    if (!newArea.name || !newArea.code) {
      toast({
        title: "Validation Error",
        description: "Area name and code are required",
        variant: "destructive",
      });
      return;
    }
    
    const newAreaObject = {
      ...newArea,
      id: `area${Date.now()}`
    };
    
    setAreas([...areas, newAreaObject]);
    setNewArea({ name: '', code: '', description: '' });
    
    toast({
      title: "Area Added",
      description: `${newArea.name} has been added to the areas`,
    });
  };

  const handleDeleteArea = (areaId: string) => {
    setAreas(areas.filter(area => area.id !== areaId));
    
    // Also remove this area from any customer assignments
    const newAssignments = { ...customerAreaAssignments };
    Object.keys(newAssignments).forEach(customerId => {
      if (newAssignments[customerId] === areaId) {
        delete newAssignments[customerId];
      }
    });
    setCustomerAreaAssignments(newAssignments);
    
    toast({
      title: "Area Deleted",
      description: "The area has been removed from the system",
    });
  };
  
  const handleUpdateArea = (areaId: string, field: keyof typeof newArea, value: string) => {
    setAreas(areas.map(area => 
      area.id === areaId ? { ...area, [field]: value } : area
    ));
  };
  
  const handleSaveEdit = () => {
    setEditingArea(null);
    toast({
      title: "Area Updated",
      description: "Area details have been updated",
    });
  };
  
  const handleAssignCustomerToArea = (customerId: string, areaId: string) => {
    setCustomerAreaAssignments({
      ...customerAreaAssignments,
      [customerId]: areaId
    });
    
    // Here in a real application, we would update the customer record
    // For now, we'll just show a toast
    toast({
      title: "Customer Assigned",
      description: "Customer has been assigned to the selected area",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Area Management</h1>
        <p className="text-muted-foreground">Manage delivery areas and assign customers to them</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Area Management Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Area Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 grid-cols-1">
              <Input 
                placeholder="Area Name" 
                value={newArea.name}
                onChange={(e) => setNewArea({...newArea, name: e.target.value})}
              />
              <Input 
                placeholder="Area Code" 
                value={newArea.code}
                onChange={(e) => setNewArea({...newArea, code: e.target.value})}
              />
              <Input 
                placeholder="Description (Optional)" 
                value={newArea.description}
                onChange={(e) => setNewArea({...newArea, description: e.target.value})}
              />
              <Button onClick={handleAddArea}>
                <Plus className="mr-2 h-4 w-4" />
                Add Area
              </Button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {areas.map((area) => (
                  <TableRow key={area.id}>
                    <TableCell>
                      {editingArea === area.id ? (
                        <Input 
                          value={area.name}
                          onChange={(e) => handleUpdateArea(area.id, 'name', e.target.value)}
                        />
                      ) : area.name}
                    </TableCell>
                    <TableCell>
                      {editingArea === area.id ? (
                        <Input 
                          value={area.code}
                          onChange={(e) => handleUpdateArea(area.id, 'code', e.target.value)}
                        />
                      ) : area.code}
                    </TableCell>
                    <TableCell>
                      {editingArea === area.id ? (
                        <Input 
                          value={area.description}
                          onChange={(e) => handleUpdateArea(area.id, 'description', e.target.value)}
                        />
                      ) : area.description}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingArea === area.id ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleSaveEdit}
                        >
                          Save
                        </Button>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setEditingArea(area.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteArea(area.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Customer Area Assignment Section */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Area Assignment</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Assigned Area</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.slice(0, 8).map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.address}</TableCell>
                    <TableCell>
                      <select 
                        className="border rounded p-1 w-full"
                        value={customerAreaAssignments[customer.id] || ''}
                        onChange={(e) => handleAssignCustomerToArea(customer.id, e.target.value)}
                      >
                        <option value="">Select Area</option>
                        {areas.map(area => (
                          <option key={area.id} value={area.id}>
                            {area.name} ({area.code})
                          </option>
                        ))}
                      </select>
                    </TableCell>
                  </TableRow>
                ))}
                {customers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4">
                      No customers available to assign.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AreaManagement;
