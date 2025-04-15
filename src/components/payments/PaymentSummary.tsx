
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Payment } from "@/types";

interface PaymentSummaryProps {
  payments: Payment[];
  selectedDate: Date;
}

export function PaymentSummary({ payments, selectedDate }: PaymentSummaryProps) {
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  
  const paymentMethods = {
    cash: payments.filter(p => p.paymentMethod === "cash").reduce((sum, p) => sum + p.amount, 0),
    upi: payments.filter(p => p.paymentMethod === "upi").reduce((sum, p) => sum + p.amount, 0),
    bank: payments.filter(p => p.paymentMethod === "bank").reduce((sum, p) => sum + p.amount, 0),
    other: payments.filter(p => p.paymentMethod === "other").reduce((sum, p) => sum + p.amount, 0),
  };

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{totalAmount.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            {payments.length} transactions today
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cash</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{paymentMethods.cash.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">UPI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{paymentMethods.upi.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bank</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{paymentMethods.bank.toFixed(2)}</div>
        </CardContent>
      </Card>
    </div>
  );
}
