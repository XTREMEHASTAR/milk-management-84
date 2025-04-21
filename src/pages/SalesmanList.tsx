
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Edit, Trash2, Plus, Calendar } from "lucide-react";
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
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";

type Salesman = {
  id: string;
  name: string;
  contact: string;
  area: string;
  joiningDate: string;
  commission: string;
  isActive: boolean;
};

// Sample data for demo purposes
const initialSalesmen: Salesman[] = [
  {
    id: "s1",
    name: "Amit Patel",
    contact: "9876543210",
    area: "Andheri East",
    joiningDate: "2023-01-15",
    commission: "5%",
    isActive: true
  },
  {
    id: "s2",
    name: "Sandeep Singh",
    contact: "8765432109",
    area: "Borivali West",
    joiningDate: "2022-08-10",
    commission: "4.5%",
    isActive: true
  }
];

export default function SalesmanList() {
  const [salesmen, setSalesmen] = useState<Salesman[]>(initialSalesmen);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentSalesman, setCurrentSalesman] = useState<Salesman | null>(null);
  const [joiningDate, setJoiningDate] = useState<Date>(new Date());
  const [formData, setFormData] = useState<Omit<Salesman, 'id' | 'joiningDate'> & { joiningDate?: Date }>({
    name: "",
    contact: "",
    area: "",
    commission: "",
    isActive: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleAddSalesman = () => {
    setCurrentSalesman(null);
    setJoiningDate(new Date());
    setFormData({
      name: "",
      contact: "",
      area: "",
      commission: "",
      isActive: true
    });
    setIsDialogOpen(true);
  };

  const handleEditSalesman = (salesman: Salesman) => {
    setCurrentSalesman(salesman);
    setJoiningDate(new Date(salesman.joiningDate));
    setFormData({
      name: salesman.name,
      contact: salesman.contact,
      area: salesman.area,
      commission: salesman.commission,
      isActive: salesman.isActive
    });
    setIsDialogOpen(true);
  };

  const handleDeleteSalesman = (salesman: Salesman) => {
    setCurrentSalesman(salesman);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (currentSalesman) {
      setSalesmen(salesmen.filter(s => s.id !== currentSalesman.id));
      toast.success("Salesman deleted successfully");
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.name || !formData.contact || !formData.area || !formData.commission) {
      toast.error("Please fill all required fields");
      return;
    }

    const formattedDate = format(joiningDate, "yyyy-MM-dd");

    if (currentSalesman) {
      // Update existing salesman
      setSalesmen(salesmen.map(s => 
        s.id === currentSalesman.id ? 
        { ...formData, id: currentSalesman.id, joiningDate: formattedDate } : s
      ));
      toast.success("Salesman updated successfully");
    } else {
      // Add new salesman
      const newSalesman: Salesman = {
        ...formData,
        id: `s${Date.now()}`,
        joiningDate: formattedDate
      };
      setSalesmen([...salesmen, newSalesman]);
      toast.success("Salesman added successfully");
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#181A20] px-8 py-8 rounded-2xl">
      <h1 className="text-3xl font-bold text-white">Salesman List</h1>
      <div className="mb-8 text-gray-300">Manage and monitor your sales team.</div>
      <Button className="bg-[#1cd7b6] mb-5 px-4 py-2 rounded-xl" onClick={handleAddSalesman}>
        <Plus className="mr-2" /> Add New Salesman
      </Button>
      <Card className="bg-white/5 rounded-2xl border-0 shadow">
        <CardContent>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[#becbe3] text-lg">
                <th className="p-3">Name</th>
                <th>Contact No</th>
                <th>Area</th>
                <th>Joining</th>
                <th>Commission</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {salesmen.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-gray-400 py-5">No salesmen added yet.</td>
                </tr>
              ) : (
                salesmen.map(salesman => (
                  <tr key={salesman.id} className="border-t border-gray-700/30 text-gray-200">
                    <td className="p-3 font-medium">{salesman.name}</td>
                    <td>{salesman.contact}</td>
                    <td>{salesman.area}</td>
                    <td>{new Date(salesman.joiningDate).toLocaleDateString()}</td>
                    <td>{salesman.commission}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs ${salesman.isActive ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
                        {salesman.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="flex gap-2 p-3">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-950/30"
                        onClick={() => handleEditSalesman(salesman)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
                        onClick={() => handleDeleteSalesman(salesman)}
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

      {/* Add/Edit Salesman Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#262930] text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>{currentSalesman ? 'Edit Salesman' : 'Add New Salesman'}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {currentSalesman ? 'Update salesman details below' : 'Fill in the details to add a new salesman'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Name*</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  className="bg-[#1f2228] border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact" className="text-white">Contact Number*</Label>
                <Input 
                  id="contact" 
                  name="contact" 
                  value={formData.contact} 
                  onChange={handleInputChange} 
                  className="bg-[#1f2228] border-gray-700 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="area" className="text-white">Area/Route*</Label>
                <Input 
                  id="area" 
                  name="area" 
                  value={formData.area} 
                  onChange={handleInputChange} 
                  className="bg-[#1f2228] border-gray-700 text-white"
                  placeholder="Andheri, Borivali, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commission" className="text-white">Commission/Salary*</Label>
                <Input 
                  id="commission" 
                  name="commission" 
                  value={formData.commission} 
                  onChange={handleInputChange} 
                  className="bg-[#1f2228] border-gray-700 text-white"
                  placeholder="5%, 10000, etc."
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Joining Date*</Label>
                <div className="bg-[#1f2228] rounded-md border border-gray-700 p-1">
                  <DatePicker 
                    date={joiningDate} 
                    setDate={setJoiningDate}
                  />
                </div>
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
                  {formData.isActive ? 'Salesman is currently active' : 'Salesman is currently inactive'}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-gray-600 text-gray-300 hover:bg-gray-800">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-[#1cd7b6] text-black hover:bg-[#19c2a4]">
              {currentSalesman ? 'Update Salesman' : 'Add Salesman'}
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
              Are you sure you want to delete this salesman? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {currentSalesman && (
            <div className="py-4 px-2 bg-[#1f2228] rounded-md">
              <p className="font-semibold">{currentSalesman.name}</p>
              <p className="text-sm text-gray-400">Area: {currentSalesman.area} | Contact: {currentSalesman.contact}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="border-gray-600 text-gray-300 hover:bg-gray-800">
              Cancel
            </Button>
            <Button onClick={confirmDelete} variant="destructive">
              Delete Salesman
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
