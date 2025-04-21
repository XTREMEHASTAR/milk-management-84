
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Edit, Trash2, Plus, X, Check } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type Vehicle = {
  id: string;
  regNumber: string;
  type: string;
  driver: string;
  capacity: string;
  contact?: string;
  isActive: boolean;
  notes?: string;
};

// Sample data for demo purposes
const initialVehicles: Vehicle[] = [
  {
    id: "v1",
    regNumber: "MH 01 AB 1234",
    type: "Van",
    driver: "Rajesh Kumar",
    capacity: "500 liters",
    contact: "9876543210",
    isActive: true,
    notes: "For city routes only"
  },
  {
    id: "v2",
    regNumber: "MH 02 CD 5678",
    type: "Truck",
    driver: "Sunil Sharma",
    capacity: "1000 liters",
    contact: "8765432109",
    isActive: true,
    notes: "For long distance routes"
  }
];

export default function VehicleList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<Omit<Vehicle, 'id'>>({
    regNumber: "",
    type: "",
    driver: "",
    capacity: "",
    contact: "",
    isActive: true,
    notes: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      isActive: checked
    });
  };

  const handleAddVehicle = () => {
    setCurrentVehicle(null);
    setFormData({
      regNumber: "",
      type: "",
      driver: "",
      capacity: "",
      contact: "",
      isActive: true,
      notes: ""
    });
    setIsDialogOpen(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setCurrentVehicle(vehicle);
    setFormData({
      regNumber: vehicle.regNumber,
      type: vehicle.type,
      driver: vehicle.driver,
      capacity: vehicle.capacity,
      contact: vehicle.contact || "",
      isActive: vehicle.isActive,
      notes: vehicle.notes || ""
    });
    setIsDialogOpen(true);
  };

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    setCurrentVehicle(vehicle);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (currentVehicle) {
      setVehicles(vehicles.filter(v => v.id !== currentVehicle.id));
      toast.success("Vehicle deleted successfully");
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.regNumber || !formData.type || !formData.driver || !formData.capacity) {
      toast.error("Please fill all required fields");
      return;
    }

    if (currentVehicle) {
      // Update existing vehicle
      setVehicles(vehicles.map(v => 
        v.id === currentVehicle.id ? { ...formData, id: currentVehicle.id } : v
      ));
      toast.success("Vehicle updated successfully");
    } else {
      // Add new vehicle
      const newVehicle: Vehicle = {
        ...formData,
        id: `v${Date.now()}`
      };
      setVehicles([...vehicles, newVehicle]);
      toast.success("Vehicle added successfully");
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#181A20] px-8 py-8 rounded-2xl">
      <h1 className="text-3xl font-bold text-white">Vehicle List</h1>
      <div className="mb-8 text-gray-300">Manage your delivery vehicles, drivers, and assignments.</div>
      <Button className="bg-[#1cd7b6] mb-5 px-4 py-2 rounded-xl" onClick={handleAddVehicle}>
        <Plus className="mr-2" /> Add New Vehicle
      </Button>
      <Card className="bg-white/5 rounded-2xl border-0 shadow">
        <CardContent>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[#becbe3] text-lg">
                <th className="p-3">Reg No</th>
                <th>Type</th>
                <th>Driver</th>
                <th>Capacity</th>
                <th>Status</th>
                <th>Notes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-gray-400 py-5">No vehicles added yet.</td>
                </tr>
              ) : (
                vehicles.map(vehicle => (
                  <tr key={vehicle.id} className="border-t border-gray-700/30 text-gray-200">
                    <td className="p-3 font-medium">{vehicle.regNumber}</td>
                    <td>{vehicle.type}</td>
                    <td>{vehicle.driver}</td>
                    <td>{vehicle.capacity}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs ${vehicle.isActive ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
                        {vehicle.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="max-w-[200px] truncate">{vehicle.notes}</td>
                    <td className="flex gap-2 p-3">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-950/30"
                        onClick={() => handleEditVehicle(vehicle)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
                        onClick={() => handleDeleteVehicle(vehicle)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Add/Edit Vehicle Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#262930] text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>{currentVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {currentVehicle ? 'Update vehicle details below' : 'Fill in the details to add a new vehicle'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="regNumber" className="text-white">Registration Number*</Label>
                <Input 
                  id="regNumber" 
                  name="regNumber" 
                  value={formData.regNumber} 
                  onChange={handleInputChange} 
                  className="bg-[#1f2228] border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className="text-white">Vehicle Type*</Label>
                <Input 
                  id="type" 
                  name="type" 
                  value={formData.type} 
                  onChange={handleInputChange} 
                  className="bg-[#1f2228] border-gray-700 text-white"
                  placeholder="Van, Truck, Rickshaw..."
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="driver" className="text-white">Driver Name*</Label>
                <Input 
                  id="driver" 
                  name="driver" 
                  value={formData.driver} 
                  onChange={handleInputChange} 
                  className="bg-[#1f2228] border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity" className="text-white">Capacity*</Label>
                <Input 
                  id="capacity" 
                  name="capacity" 
                  value={formData.capacity} 
                  onChange={handleInputChange} 
                  className="bg-[#1f2228] border-gray-700 text-white"
                  placeholder="500 liters, 200 kgs..."
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact" className="text-white">Contact Number</Label>
                <Input 
                  id="contact" 
                  name="contact" 
                  value={formData.contact} 
                  onChange={handleInputChange} 
                  className="bg-[#1f2228] border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="isActive" className="text-white flex items-center justify-between">
                  <span>Active Status</span>
                  <Switch 
                    id="isActive" 
                    checked={formData.isActive} 
                    onCheckedChange={handleSwitchChange}
                  />
                </Label>
                <div className="text-xs text-gray-400 pt-2">
                  {formData.isActive ? 'Vehicle is active and available for assignments' : 'Vehicle is inactive or in maintenance'}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-white">Notes/Remarks</Label>
              <Textarea 
                id="notes" 
                name="notes" 
                value={formData.notes} 
                onChange={handleInputChange} 
                className="bg-[#1f2228] border-gray-700 text-white" 
                placeholder="Additional information about this vehicle..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-gray-600 text-gray-300 hover:bg-gray-800">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-[#1cd7b6] text-black hover:bg-[#19c2a4]">
              {currentVehicle ? 'Update Vehicle' : 'Add Vehicle'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-[#262930] text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this vehicle? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {currentVehicle && (
            <div className="py-4 px-2 bg-[#1f2228] rounded-md">
              <p className="font-semibold">{currentVehicle.regNumber} - {currentVehicle.type}</p>
              <p className="text-sm text-gray-400">Driver: {currentVehicle.driver}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="border-gray-600 text-gray-300 hover:bg-gray-800">
              Cancel
            </Button>
            <Button onClick={confirmDelete} variant="destructive">
              Delete Vehicle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
