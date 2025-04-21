
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHead, TableRow, TableCell, TableHeader, TableBody } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";

const dummySuppliers = [
  {id:1, name:"Mountain Dairy Farm", category:"Dairy", contact:"mountain@example.com"},
  {id:2, name:"Valley Milk Co-op", category:"Dairy", contact:"valley@example.com"}
];

const dummyProducts = [
  {id: '1', name: "G.COW H"}, {id:'2', name:"WARNA SPL"}, {id:'3', name:"AMUL TAZZA"}
];

export default function SupplierRateSetting() {
  const [tab, setTab] = useState<"rates"|"history">("rates");
  return (
    <div className="min-h-screen bg-[#181A20] px-8 py-8 rounded-2xl">
      <h1 className="text-3xl font-bold text-white mb-2">Supplier Rate Setting</h1>
      <div className="mb-8 text-gray-300">Manage and track fixed product rates per supplier</div>
      <div className="flex gap-2">
        <Button className="bg-[#1cd7b6] rounded-xl"><Plus className="mr-2" /> Add Supplier</Button>
        <Button className="bg-black rounded-xl border border-[#23252b] text-white">Record Rate</Button>
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
                <TableRow key={supplier.id}>
                  <TableCell className="font-semibold px-3">{supplier.name}</TableCell>
                  {dummyProducts.map(p=>
                    <TableCell key={p.id} className="px-3">
                      <input type="number" className="w-20 bg-white/80 p-1 rounded border border-gray-300 mr-2 text-gray-900" placeholder="Rate" />
                      <Switch checked={true} />
                    </TableCell>
                  )}
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
              <TableRow>
                <TableCell>Mountain Dairy Farm</TableCell>
                <TableCell>G.COW H</TableCell>
                <TableCell>52</TableCell>
                <TableCell>2025-04-21</TableCell>
                <TableCell>Summer Rate</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
        </CardContent>
      </Card>
    </div>
  );
}
