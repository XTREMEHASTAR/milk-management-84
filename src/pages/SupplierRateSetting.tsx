
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHead, TableRow, TableCell, TableHeader, TableBody } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Plus, FileText, Download, Calendar, Clock, DollarSign } from "lucide-react";
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
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";

// Sample suppliers
const dummySuppliers = [
  {id:1, name:"Mountain Dairy Farm", category:"Dairy", contact:"mountain@example.com"},
  {id:2, name:"Valley Milk Co-op", category:"Dairy", contact:"valley@example.com"}
];

// Sample products
const dummyProducts = [
  {id: '1', name: "G.COW H"}, {id:'2', name:"WARNA SPL"}, {id:'3', name:"AMUL TAZZA"}
];

// Sample rate history
const dummyRateHistory = [
  {id: 1, supplierId: 1, productId: '1', rate: 52, date: '2025-04-21', remarks: 'Summer Rate'},
  {id: 2, supplierId: 1, productId: '2', rate: 48, date: '2025-04-15', remarks: 'Regular'},
  {id: 3, supplierId: 2, productId: '1', rate: 51, date: '2025-04-20', remarks: 'Bulk discount'},
  {id: 4, supplierId: 2, productId: '3', rate: 45, date: '2025-04-10', remarks: 'Promotional'}
];

interface RateRecord {
  id: number;
  supplierId: number;
  productId: string;
  rate: number;
  date: string;
  remarks: string;
}

export default function SupplierRateSetting() {
  const [tab, setTab] = useState<"rates"|"history">("rates");
  const [rates, setRates] = useState<RateRecord[]>(dummyRateHistory);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRateForm, setCurrentRateForm] = useState<{
    supplierId: number | null;
    productId: string | null;
    rate: string;
    date: Date;
    remarks: string;
  }>({
    supplierId: null,
    productId: null,
    rate: '',
    date: new Date(),
    remarks: ''
  });

  const handleRateInputChange = (supplierId: number, productId: string, value: string) => {
    // This would update the rate in your state
    console.log(`Updating rate for supplier ${supplierId}, product ${productId} to ${value}`);
  };

  const handleAddRate = () => {
    setCurrentRateForm({
      supplierId: null,
      productId: null,
      rate: '',
      date: new Date(),
      remarks: ''
    });
    setIsDialogOpen(true);
  };

  const handleRateFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentRateForm({
      ...currentRateForm,
      [name]: value
    });
  };

  const handleSubmitRate = () => {
    const { supplierId, productId, rate, date, remarks } = currentRateForm;
    
    if (!supplierId || !productId || !rate) {
      toast.error("Please fill all required fields");
      return;
    }
    
    const newRate: RateRecord = {
      id: Date.now(),
      supplierId: parseInt(supplierId.toString()),
      productId: productId.toString(),
      rate: parseFloat(rate),
      date: format(date, 'yyyy-MM-dd'),
      remarks
    };
    
    setRates([...rates, newRate]);
    toast.success("Rate record added successfully");
    setIsDialogOpen(false);
  };

  const handleExportRateHistory = () => {
    // Would implement actual CSV/PDF export
    toast.success("Rate history exported successfully");
  };

  return (
    <div className="min-h-screen bg-[#181A20] px-8 py-8 rounded-2xl">
      <h1 className="text-3xl font-bold text-white mb-2">Supplier Rate Setting</h1>
      <div className="mb-8 text-gray-300">Manage and track fixed product rates per supplier</div>
      <div className="flex gap-2">
        <Button className="bg-[#1cd7b6] rounded-xl"><Plus className="mr-2" /> Add Supplier</Button>
        <Button 
          className="bg-black rounded-xl border border-[#23252b] text-white"
          onClick={handleAddRate}
        >
          <DollarSign className="mr-2" /> Record Rate
        </Button>
        {tab === "history" && (
          <Button 
            className="bg-black rounded-xl border border-[#23252b] text-white ml-auto"
            onClick={handleExportRateHistory}
          >
            <Download className="mr-2" /> Export History
          </Button>
        )}
      </div>
      <div className="flex my-6 gap-2 bg-[#101112] rounded-xl w-fit">
        <button className={`px-8 py-2 rounded-xl font-semibold text-base transition-all ${tab==="rates"?"bg-[#1cd7b6] text-black":"text-white"}`} onClick={()=>setTab("rates")}>Supplier Rates</button>
        <button className={`px-8 py-2 rounded-xl font-semibold text-base transition-all ${tab==="history"?"bg-[#1cd7b6] text-black":"text-white"}`} onClick={()=>setTab("history")}>Rate History</button>
      </div>
      <Card className="bg-white/5 rounded-2xl border-0 shadow mt-6">
        <CardContent>
        {tab==="rates" ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[#4e587c] px-3 py-2">Supplier</TableHead>
                {dummyProducts.map(p=>
                  <TableHead key={p.id} className="text-[#4e587c] px-3">{p.name}</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummySuppliers.map(supplier => (
                <TableRow key={supplier.id} className="border-t border-gray-700/30">
                  <TableCell className="font-semibold px-3 text-gray-200">{supplier.name}</TableCell>
                  {dummyProducts.map(p=> {
                    // Find the current rate for this supplier and product
                    const currentRate = rates.find(
                      r => r.supplierId === supplier.id && r.productId === p.id
                    );
                    return (
                      <TableCell key={p.id} className="px-3">
                        <div className="flex items-center">
                          <input 
                            type="number" 
                            className="w-20 bg-[#262930] p-1 rounded border border-gray-700 mr-2 text-gray-200" 
                            placeholder="Rate" 
                            defaultValue={currentRate?.rate || ""}
                            onChange={(e) => handleRateInputChange(supplier.id, p.id, e.target.value)}
                          />
                          <Switch checked={!!currentRate} />
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[#4e587c] px-3">Supplier</TableHead>
                <TableHead className="text-[#4e587c] px-3">Product</TableHead>
                <TableHead className="text-[#4e587c] px-3">Rate</TableHead>
                <TableHead className="text-[#4e587c] px-3">Date</TableHead>
                <TableHead className="text-[#4e587c] px-3">Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-400 py-5">No rate history records yet.</TableCell>
                </TableRow>
              ) : (
                rates.map(record => {
                  const supplier = dummySuppliers.find(s => s.id === record.supplierId);
                  const product = dummyProducts.find(p => p.id === record.productId);
                  return (
                    <TableRow key={record.id} className="border-t border-gray-700/30">
                      <TableCell className="text-gray-200">{supplier?.name || 'Unknown'}</TableCell>
                      <TableCell className="text-gray-200">{product?.name || 'Unknown'}</TableCell>
                      <TableCell className="text-gray-200">{record.rate}</TableCell>
                      <TableCell className="text-gray-200">{new Date(record.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-gray-200">{record.remarks}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
        </CardContent>
      </Card>

      {/* Add Rate Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#262930] text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Record New Rate</DialogTitle>
            <DialogDescription className="text-gray-400">
              Add a new rate for a specific supplier and product.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="supplierId" className="text-white">Supplier*</Label>
              <select 
                id="supplierId" 
                name="supplierId" 
                className="w-full bg-[#1f2228] border-gray-700 text-white p-2 rounded-md"
                value={currentRateForm.supplierId || ''}
                onChange={handleRateFormChange}
              >
                <option value="">Select Supplier</option>
                {dummySuppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="productId" className="text-white">Product*</Label>
              <select 
                id="productId" 
                name="productId" 
                className="w-full bg-[#1f2228] border-gray-700 text-white p-2 rounded-md"
                value={currentRateForm.productId || ''}
                onChange={handleRateFormChange}
              >
                <option value="">Select Product</option>
                {dummyProducts.map(product => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rate" className="text-white">Rate*</Label>
                <Input 
                  id="rate" 
                  name="rate" 
                  type="number" 
                  className="bg-[#1f2228] border-gray-700 text-white"
                  value={currentRateForm.rate}
                  onChange={handleRateFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Effective Date*</Label>
                <div className="bg-[#1f2228] rounded-md border border-gray-700 p-1">
                  <DatePicker 
                    date={currentRateForm.date} 
                    setDate={(date) => setCurrentRateForm({...currentRateForm, date})}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="remarks" className="text-white">Remarks</Label>
              <Input 
                id="remarks" 
                name="remarks" 
                className="bg-[#1f2228] border-gray-700 text-white"
                placeholder="Summer Rate, Promotional, etc."
                value={currentRateForm.remarks}
                onChange={handleRateFormChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-gray-600 text-gray-300 hover:bg-gray-800">
              Cancel
            </Button>
            <Button onClick={handleSubmitRate} className="bg-[#1cd7b6] text-black hover:bg-[#19c2a4]">
              Save Rate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
