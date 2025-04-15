
import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, MessageSquare, FileText } from "lucide-react";
import { format } from "date-fns";

export default function OutstandingAmounts() {
  const { customers } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const handleSendReminder = (customerId: string) => {
    // Implement reminder functionality
    console.log("Sending reminder to customer:", customerId);
  };

  const handleViewStatement = (customerId: string) => {
    // Implement statement view
    console.log("Viewing statement for customer:", customerId);
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Outstanding Amounts</h1>
        <p className="text-muted-foreground">
          Track and manage customer outstanding balances
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Due Collection</CardTitle>
          <CardDescription>View and manage outstanding payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex items-center gap-2">
                <span>From:</span>
                <DatePicker date={startDate} setDate={setStartDate} />
              </div>
              <div className="flex items-center gap-2">
                <span>To:</span>
                <DatePicker date={endDate} setDate={setEndDate} />
              </div>
              <div className="flex-1">
                <Input
                  placeholder="Search by customer name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Name</TableHead>
                    <TableHead className="text-right">Total Due (₹)</TableHead>
                    <TableHead>Last Payment</TableHead>
                    <TableHead className="text-right">Days Overdue</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        {customer.name}
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{customer.outstandingBalance}
                      </TableCell>
                      <TableCell>
                        {customer.lastPaymentDate
                          ? format(new Date(customer.lastPaymentDate), "PP")
                          : "No payments"}
                      </TableCell>
                      <TableCell className="text-right">
                        {customer.lastPaymentDate
                          ? Math.floor(
                              (new Date().getTime() -
                                new Date(customer.lastPaymentDate).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )
                          : "N/A"}
                      </TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>
                        <div className="flex justify-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSendReminder(customer.id)}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewStatement(customer.id)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
