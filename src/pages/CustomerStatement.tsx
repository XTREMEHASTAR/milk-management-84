
import { useState } from "react";
import { useParams } from "react-router-dom";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Mail, Printer } from "lucide-react";
import { format } from "date-fns";

export default function CustomerStatement() {
  const { customerId } = useParams();
  const { customers, payments } = useData();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const customer = customers.find((c) => c.id === customerId);
  const customerPayments = payments.filter((p) => p.customerId === customerId);

  const handleDownloadPDF = () => {
    // Implement PDF download
    console.log("Downloading PDF...");
  };

  const handleEmailStatement = () => {
    // Implement email functionality
    console.log("Emailing statement...");
  };

  const handlePrintStatement = () => {
    // Implement print functionality
    console.log("Printing statement...");
  };

  if (!customer) {
    return <div>Customer not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Customer Statement
          </h1>
          <p className="text-muted-foreground">
            Statement for {customer.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleDownloadPDF}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" onClick={handleEmailStatement}>
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>
          <Button variant="outline" onClick={handlePrintStatement}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Statement Details</CardTitle>
              <CardDescription>Transaction history and balance</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span>From:</span>
                <DatePicker date={startDate} setDate={setStartDate} />
              </div>
              <div className="flex items-center gap-2">
                <span>To:</span>
                <DatePicker date={endDate} setDate={setEndDate} />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Debit (₹)</TableHead>
                  <TableHead className="text-right">Credit (₹)</TableHead>
                  <TableHead className="text-right">Balance (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {format(new Date(payment.date), "PP")}
                    </TableCell>
                    <TableCell>
                      Payment - {payment.paymentMethod.toUpperCase()}
                    </TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell className="text-right">
                      {payment.amount}
                    </TableCell>
                    <TableCell className="text-right">
                      {customer.outstandingBalance}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
