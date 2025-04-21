
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Edit, Trash2, Plus } from "lucide-react";

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

const initialVehicles: Vehicle[] = [];

export default function VehicleList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);

  return (
    <div className="min-h-screen bg-[#181A20] px-8 py-8 rounded-2xl">
      <h1 className="text-3xl font-bold text-white">Vehicle List</h1>
      <div className="mb-8 text-gray-300">Manage your delivery vehicles, drivers, and assignments.</div>
      <Button className="bg-[#1cd7b6] mb-5 px-4 py-2 rounded-xl"><Plus className="mr-2" /> Add New Vehicle</Button>
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
              {vehicles.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-gray-400 py-5">No vehicles added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
