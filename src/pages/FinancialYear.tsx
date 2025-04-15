
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CalendarDays, Save, History, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { format, addYears } from "date-fns";

const FinancialYear = () => {
  const [startDate, setStartDate] = useState<Date>(new Date(new Date().getFullYear(), 3, 1)); // April 1st
  const [endDate, setEndDate] = useState<Date>(new Date(new Date().getFullYear() + 1, 2, 31)); // March 31st
  const [isClosingYear, setIsClosingYear] = useState(false);
  const [backupEnabled, setBackupEnabled] = useState(true);

  const handleStartDateChange = (date: Date) => {
    setStartDate(date);
    // Set end date to one year minus one day from start date
    const newEndDate = new Date(date);
    newEndDate.setFullYear(newEndDate.getFullYear() + 1);
    newEndDate.setDate(newEndDate.getDate() - 1);
    setEndDate(newEndDate);
  };

  const saveFinancialYear = () => {
    toast.success("Financial year settings saved successfully");
  };

  const closeFinancialYear = () => {
    if (isClosingYear) {
      toast.success("Financial year closed successfully. New year created.");
      setIsClosingYear(false);

      // Calculate new dates for next financial year
      const newStartDate = addYears(startDate, 1);
      const newEndDate = addYears(endDate, 1);
      setStartDate(newStartDate);
      setEndDate(newEndDate);
    } else {
      setIsClosingYear(true);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financial Year Management</h1>
        <p className="text-muted-foreground">Configure your financial year settings and perform year-end closing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <CalendarDays className="mr-2 h-5 w-5" />
              Current Financial Year
            </CardTitle>
            <CardDescription className="text-gray-300">
              Define your active financial year period
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date" className="text-white">Start Date</Label>
                <div className="flex items-center space-x-2 bg-white/10 p-2 rounded-md">
                  <DatePicker date={startDate} setDate={handleStartDateChange} />
                  <div className="text-sm text-white/80">
                    {format(startDate, "dd MMMM yyyy")}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end-date" className="text-white">End Date</Label>
                <div className="flex items-center space-x-2 bg-white/10 p-2 rounded-md">
                  <DatePicker date={endDate} setDate={setEndDate} />
                  <div className="text-sm text-white/80">
                    {format(endDate, "dd MMMM yyyy")}
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={saveFinancialYear} 
              className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Financial Year Settings
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 text-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <History className="mr-2 h-5 w-5" />
              Year-End Closing
            </CardTitle>
            <CardDescription className="text-gray-300">
              Close current financial year and start a new one
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white/10 p-4 rounded-md">
              <p className="text-sm text-white/80 mb-4">
                Closing the financial year will:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-white/80">
                <li>Lock all transactions for the current financial year</li>
                <li>Generate year-end reports</li>
                <li>Create a new financial year</li>
                <li>Carry forward balances to the new year</li>
              </ul>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <Switch 
                id="backup" 
                checked={backupEnabled}
                onCheckedChange={setBackupEnabled}
              />
              <Label htmlFor="backup" className="text-white">Create backup before closing</Label>
            </div>

            <Button 
              onClick={closeFinancialYear} 
              variant={isClosingYear ? "destructive" : "outline"}
              className={isClosingYear 
                ? "w-full border-red-500 bg-red-600 hover:bg-red-700" 
                : "w-full bg-white/10 hover:bg-white/20 text-white"
              }
            >
              {isClosingYear ? (
                <>Confirm Year Closing</>
              ) : (
                <>Close Financial Year & Start New</>
              )}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            {isClosingYear && (
              <p className="text-amber-300 text-sm mt-2">
                ⚠️ This action cannot be undone. Please confirm to proceed.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 bg-gradient-to-r from-indigo-900/70 to-purple-800/70 border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-white">Financial Year History</CardTitle>
          <CardDescription className="text-gray-300">
            View previous financial years and their reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-black/20">
                <tr>
                  <th className="py-3 px-4 text-left text-sm text-white font-medium">Year</th>
                  <th className="py-3 px-4 text-left text-sm text-white font-medium">Period</th>
                  <th className="py-3 px-4 text-left text-sm text-white font-medium">Status</th>
                  <th className="py-3 px-4 text-left text-sm text-white font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-700/30">
                <tr className="bg-white/5 hover:bg-white/10">
                  <td className="py-3 px-4 text-sm text-white">2024-25</td>
                  <td className="py-3 px-4 text-sm text-white">01 Apr 2024 - 31 Mar 2025</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                      Active
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-white/10">
                      View Details
                    </Button>
                  </td>
                </tr>
                <tr className="bg-white/5 hover:bg-white/10">
                  <td className="py-3 px-4 text-sm text-white">2023-24</td>
                  <td className="py-3 px-4 text-sm text-white">01 Apr 2023 - 31 Mar 2024</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                      Closed
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-white/10">
                      View Reports
                    </Button>
                  </td>
                </tr>
                <tr className="bg-white/5 hover:bg-white/10">
                  <td className="py-3 px-4 text-sm text-white">2022-23</td>
                  <td className="py-3 px-4 text-sm text-white">01 Apr 2022 - 31 Mar 2023</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                      Closed
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-white/10">
                      View Reports
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialYear;
