
import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Area, Customer } from "@/types";
import { Edit, MapPin, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

const AreaList = () => {
  const { customers, areas, addArea, updateArea, deleteArea } = useData();
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentArea, setCurrentArea] = useState<Area | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true
  });
  const [searchQuery, setSearchQuery] = useState("");

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      isActive: true
    });
    setCurrentArea(null);
    setEditMode(false);
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleEditArea = (area: Area) => {
    setCurrentArea(area);
    setFormData({
      name: area.name,
      description: area.description || "",
      isActive: area.isActive
    });
    setEditMode(true);
    setOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error("Area name is required");
      return;
    }

    if (editMode && currentArea) {
      updateArea(currentArea.id, formData);
      toast.success("Area updated successfully");
    } else {
      addArea({
        ...formData,
        isActive: true
      });
      toast.success("Area added successfully");
    }

    setOpen(false);
    resetForm();
  };

  const handleDeleteArea = (area: Area) => {
    // Check if area is in use by customers
    const customersInArea = customers.filter(c => c.area === area.name).length;
    
    if (customersInArea > 0) {
      toast.error(`Cannot delete area "${area.name}" as it is assigned to ${customersInArea} customers.`);
      return;
    }
    
    if (confirm(`Are you sure you want to delete ${area.name}?`)) {
      deleteArea(area.id);
      toast.success("Area deleted successfully");
    }
  };

  const filteredAreas = areas.filter(
    (area) =>
      area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (area.description && area.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getCustomerCountByArea = (areaName: string) => {
    return customers.filter(customer => customer.area === areaName).length;
  };

  return (
    <div className="space-y-6 bg-[#181A20] min-h-screen px-4 py-6 rounded-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Area List</h1>
          <p className="text-gray-400">
            Manage your delivery and customer areas
          </p>
        </div>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button className="bg-[#1cd7b6] text-white hover:bg-[#19c0a3]">
              <MapPin className="mr-2 h-4 w-4" />
              Add Area
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#23252b] text-white border-0">
            <DialogHeader>
              <DialogTitle>
                {editMode ? "Edit Area" : "Add New Area"}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {editMode
                  ? "Update area details below"
                  : "Enter area details below to add it to your system"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-white">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Area name"
                    required
                    className="bg-[#181A20] border-[#34343A] text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description" className="text-white">Description (Optional)</Label>
                  <Input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Area description"
                    className="bg-[#181A20] border-[#34343A] text-white"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)} className="border-gray-600 text-white hover:bg-gray-700">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#1cd7b6] text-white hover:bg-[#19c0a3]">
                  {editMode ? "Update Area" : "Add Area"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-[#23252b] border-0 shadow-lg rounded-xl overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Area Management</CardTitle>
              <CardDescription className="text-gray-400">
                Manage geographic areas for customer segmentation
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search areas..."
                className="pl-8 bg-[#181A20] border-[#34343A] text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {areas.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400 mb-4">No areas found</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-[#1cd7b6] text-white hover:bg-[#19c0a3]">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Area
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#23252b] text-white border-0">
                  {/* Same dialog content as above */}
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#1A1F2C]">
                  <TableRow className="border-b border-[#34343A] hover:bg-[#34343A]/50">
                    <TableHead className="text-white">Name</TableHead>
                    <TableHead className="text-white">Description</TableHead>
                    <TableHead className="text-white text-center">Customers</TableHead>
                    <TableHead className="text-white text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAreas.map((area) => (
                    <TableRow key={area.id} className="border-b border-[#34343A] hover:bg-[#34343A]/50">
                      <TableCell className="font-medium text-white">
                        {area.name}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {area.description || "-"}
                      </TableCell>
                      <TableCell className="text-center text-gray-300">
                        {getCustomerCountByArea(area.name)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditArea(area)}
                            className="text-gray-300 hover:text-white hover:bg-[#34343A]"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteArea(area)}
                            className="text-gray-300 hover:text-white hover:bg-[#34343A]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-[#1A1F2C] to-[#23252b] border-0 shadow-lg rounded-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-white">Area Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-[#34343A]/50 p-4 rounded-lg">
              <h3 className="text-xl font-medium text-white mb-2">Total Areas</h3>
              <p className="text-3xl font-bold text-[#1cd7b6]">{areas.length}</p>
            </div>
            <div className="bg-[#34343A]/50 p-4 rounded-lg">
              <h3 className="text-xl font-medium text-white mb-2">Most Populated</h3>
              {areas.length > 0 ? (
                <>
                  <p className="text-xl font-bold text-[#1cd7b6]">
                    {areas.reduce((prev, current) => 
                      getCustomerCountByArea(current.name) > getCustomerCountByArea(prev.name) 
                        ? current 
                        : prev, areas[0]).name}
                  </p>
                  <p className="text-gray-400">
                    {getCustomerCountByArea(areas.reduce((prev, current) => 
                      getCustomerCountByArea(current.name) > getCustomerCountByArea(prev.name) 
                        ? current 
                        : prev, areas[0]).name)} customers
                  </p>
                </>
              ) : (
                <p className="text-gray-400">No data</p>
              )}
            </div>
            <div className="bg-[#34343A]/50 p-4 rounded-lg">
              <h3 className="text-xl font-medium text-white mb-2">Unassigned Customers</h3>
              <p className="text-3xl font-bold text-[#1cd7b6]">
                {customers.filter(c => !c.area).length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AreaList;
