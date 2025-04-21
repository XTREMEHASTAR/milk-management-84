
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Edit, Trash2, Plus } from "lucide-react";

type Salesman = {
  id: string;
  name: string;
  contact: string;
  area: string;
  joiningDate: string;
  commission: string;
  isActive: boolean;
};

const initialSalesmen: Salesman[] = [];

export default function SalesmanList() {
  const [salesmen, setSalesmen] = useState<Salesman[]>(initialSalesmen);

  return (
    <div className="min-h-screen bg-[#181A20] px-8 py-8 rounded-2xl">
      <h1 className="text-3xl font-bold text-white">Salesman List</h1>
      <div className="mb-8 text-gray-300">Manage and monitor your sales team.</div>
      <Button className="bg-[#1cd7b6] mb-5 px-4 py-2 rounded-xl"><Plus className="mr-2" /> Add New Salesman</Button>
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
              {salesmen.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-gray-400 py-5">No salesmen added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
