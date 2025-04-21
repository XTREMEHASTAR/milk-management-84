
import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, FileDown, Printer, Truck, User, MapPin, Filter } from "lucide-react";
import { format } from "date-fns";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CustomerDirectory() {
  const { customers, vehicles, salesmen, areas } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"none" | "vehicle" | "salesman" | "area">("none");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const filteredCustomers = customers.filter(
    (customer) => {
      // First apply search filter
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery) ||
        (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        customer.address.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;
      
      // Then apply dropdown filters
      if (filterType === "none") return true;
      if (filterType === "vehicle" && selectedFilter) return customer.vehicleId === selectedFilter;
      if (filterType === "salesman" && selectedFilter) return customer.salesmanId === selectedFilter;
      if (filterType === "area" && selectedFilter) return customer.area === selectedFilter;
      
      return true;
    }
  );

  const exportToCSV = () => {
    // Generate CSV content
    let csvContent = "Name,Phone,Address,Email,Area,Vehicle,Salesman,Outstanding Balance,Last Payment\n";
    
    filteredCustomers.forEach((customer) => {
      const lastPaymentInfo = customer.lastPaymentDate 
        ? `${customer.lastPaymentAmount} on ${customer.lastPaymentDate}` 
        : "No payments";
      
      const vehicle = vehicles.find(v => v.id === customer.vehicleId);
      const salesman = salesmen.find(s => s.id === customer.salesmanId);
      
      csvContent += `"${customer.name}","${customer.phone}","${customer.address}","${customer.email || ""}","${customer.area || ""}","${vehicle ? vehicle.name : ""}","${salesman ? salesman.name : ""}","${customer.outstandingBalance}","${lastPaymentInfo}"\n`;
    });
    
    // Create a download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const filterText = filterType !== "none" ? `-${filterType}-${selectedFilter}` : "";
    link.setAttribute("download", `customer-directory${filterText}-${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.click();
  };

  const printDirectory = () => {
    window.print();
  };

  // Get totals by type
  const getCustomerCountByVehicle = (vehicleId: string) => {
    return customers.filter(customer => customer.vehicleId === vehicleId).length;
  };
  
  const getCustomerCountBySalesman = (salesmanId: string) => {
    return customers.filter(customer => customer.salesmanId === salesmanId).length;
  };
  
  const getCustomerCountByArea = (areaName: string) => {
    return customers.filter(customer => customer.area === areaName).length;
  };

  return (
    <div className="space-y-6 bg-[#181A20] min-h-screen px-4 py-6 rounded-xl">
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Customer Directory</h1>
          <p className="text-gray-400">
            View and manage your customer database
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportToCSV} className="bg-[#1cd7b6] text-white hover:bg-[#19c0a3] border-none">
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={printDirectory} className="bg-[#1cd7b6] text-white hover:bg-[#19c0a3] border-none">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <Card className="bg-[#23252b] border-0 shadow-lg rounded-xl overflow-hidden">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-white">Customer List</CardTitle>
              <CardDescription className="text-gray-400">
                Complete customer database with contact information
              </CardDescription>
            </div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 print:hidden">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search customers..."
                  className="pl-8 bg-[#181A20] border-[#34343A] text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select 
                  value={filterType} 
                  onValueChange={(value: "none" | "vehicle" | "salesman" | "area") => {
                    setFilterType(value);
                    setSelectedFilter(null);
                  }}
                >
                  <SelectTrigger className="w-[160px] bg-[#181A20] border-[#34343A] text-white">
                    <SelectValue placeholder="Filter by..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#23252b] text-white border-[#34343A]">
                    <SelectItem value="none">No filter</SelectItem>
                    <SelectItem value="vehicle">By Vehicle</SelectItem>
                    <SelectItem value="salesman">By Salesman</SelectItem>
                    <SelectItem value="area">By Area</SelectItem>
                  </SelectContent>
                </Select>
                
                {filterType === "vehicle" && (
                  <Select 
                    value={selectedFilter || ""} 
                    onValueChange={setSelectedFilter}
                  >
                    <SelectTrigger className="w-[180px] bg-[#181A20] border-[#34343A] text-white">
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#23252b] text-white border-[#34343A]">
                      {vehicles.map(vehicle => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.name} ({getCustomerCountByVehicle(vehicle.id)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {filterType === "salesman" && (
                  <Select 
                    value={selectedFilter || ""} 
                    onValueChange={setSelectedFilter}
                  >
                    <SelectTrigger className="w-[180px] bg-[#181A20] border-[#34343A] text-white">
                      <SelectValue placeholder="Select salesman" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#23252b] text-white border-[#34343A]">
                      {salesmen.map(salesman => (
                        <SelectItem key={salesman.id} value={salesman.id}>
                          {salesman.name} ({getCustomerCountBySalesman(salesman.id)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {filterType === "area" && (
                  <Select 
                    value={selectedFilter || ""} 
                    onValueChange={setSelectedFilter}
                  >
                    <SelectTrigger className="w-[180px] bg-[#181A20] border-[#34343A] text-white">
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#23252b] text-white border-[#34343A]">
                      {areas.map(area => (
                        <SelectItem key={area.id} value={area.name}>
                          {area.name} ({getCustomerCountByArea(area.name)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>
          
          {/* Filter information for print */}
          {filterType !== "none" && selectedFilter && (
            <div className="hidden print:block mt-2 text-white">
              <p>
                Filtered by: {filterType === "vehicle" ? 
                  <span><Truck className="inline h-4 w-4 mr-1" /> {vehicles.find(v => v.id === selectedFilter)?.name}</span> : 
                  filterType === "salesman" ? 
                  <span><User className="inline h-4 w-4 mr-1" /> {salesmen.find(s => s.id === selectedFilter)?.name}</span> : 
                  <span><MapPin className="inline h-4 w-4 mr-1" /> {selectedFilter}</span>
                }
              </p>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#1A1F2C]">
                <TableRow className="border-b border-[#34343A] hover:bg-[#34343A]/50">
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Phone</TableHead>
                  <TableHead className="text-white">Address</TableHead>
                  <TableHead className="text-white">Email</TableHead>
                  <TableHead className="text-white">Area</TableHead>
                  <TableHead className="text-white">Vehicle</TableHead>
                  <TableHead className="text-white">Salesman</TableHead>
                  <TableHead className="text-white text-right">Outstanding Balance</TableHead>
                  <TableHead className="text-white text-right">Last Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => {
                  const vehicle = vehicles.find(v => v.id === customer.vehicleId);
                  const salesman = salesmen.find(s => s.id === customer.salesmanId);
                  
                  return (
                    <TableRow key={customer.id} className="border-b border-[#34343A] hover:bg-[#34343A]/50">
                      <TableCell className="font-medium text-white">{customer.name}</TableCell>
                      <TableCell className="text-gray-300">{customer.phone}</TableCell>
                      <TableCell className="text-gray-300">{customer.address}</TableCell>
                      <TableCell className="text-gray-300">{customer.email || "-"}</TableCell>
                      <TableCell className="text-gray-300">
                        {customer.area ? (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-[#1cd7b6]" />
                            <span>{customer.area}</span>
                          </div>
                        ) : "-"}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {vehicle ? (
                          <div className="flex items-center gap-1">
                            <Truck className="h-3.5 w-3.5 text-[#1cd7b6]" />
                            <span>{vehicle.name}</span>
                          </div>
                        ) : "-"}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {salesman ? (
                          <div className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5 text-[#1cd7b6]" />
                            <span>{salesman.name}</span>
                          </div>
                        ) : "-"}
                      </TableCell>
                      <TableCell className="text-right text-gray-300">₹{customer.outstandingBalance}</TableCell>
                      <TableCell className="text-right text-gray-300">
                        {customer.lastPaymentDate
                          ? `₹${customer.lastPaymentAmount} on ${customer.lastPaymentDate}`
                          : "No payments"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
        <Card className="bg-gradient-to-r from-[#1A1F2C] to-[#23252b] border-0 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <Truck className="h-5 w-5 text-[#1cd7b6]" /> Vehicle Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {vehicles.map(vehicle => (
                <div key={vehicle.id} className="flex justify-between items-center">
                  <div className="text-gray-300">{vehicle.name}</div>
                  <div className="text-[#1cd7b6] font-semibold">{getCustomerCountByVehicle(vehicle.id)}</div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 border-t border-[#34343A]">
                <div className="text-gray-300">Unassigned</div>
                <div className="text-[#1cd7b6] font-semibold">{customers.filter(c => !c.vehicleId).length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-[#1A1F2C] to-[#23252b] border-0 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <User className="h-5 w-5 text-[#1cd7b6]" /> Salesman Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {salesmen.map(salesman => (
                <div key={salesman.id} className="flex justify-between items-center">
                  <div className="text-gray-300">{salesman.name}</div>
                  <div className="text-[#1cd7b6] font-semibold">{getCustomerCountBySalesman(salesman.id)}</div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 border-t border-[#34343A]">
                <div className="text-gray-300">Unassigned</div>
                <div className="text-[#1cd7b6] font-semibold">{customers.filter(c => !c.salesmanId).length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-[#1A1F2C] to-[#23252b] border-0 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#1cd7b6]" /> Area Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {areas.map(area => (
                <div key={area.id} className="flex justify-between items-center">
                  <div className="text-gray-300">{area.name}</div>
                  <div className="text-[#1cd7b6] font-semibold">{getCustomerCountByArea(area.name)}</div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 border-t border-[#34343A]">
                <div className="text-gray-300">Unassigned</div>
                <div className="text-[#1cd7b6] font-semibold">{customers.filter(c => !c.area).length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
