
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search, Calendar, Check, AlertCircle } from 'lucide-react';
import { useData } from '@/contexts/data/DataContext';
import { Badge } from '@/components/ui/badge';

export default function PaymentList() {
  const { payments } = useData();
  const navigate = useNavigate();

  // Sample payments for demo
  const demoPayments = [
    { id: '1', date: '2023-05-01', customer: 'Rahul Sharma', amount: 1200, status: 'completed' },
    { id: '2', date: '2023-05-02', customer: 'Priya Patel', amount: 850, status: 'pending' },
    { id: '3', date: '2023-05-03', customer: 'Amit Kumar', amount: 2100, status: 'completed' },
    { id: '4', date: '2023-05-04', customer: 'Sita Verma', amount: 950, status: 'failed' },
  ];

  const allPayments = payments?.length ? payments : demoPayments;

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed':
        return <Badge className="bg-green-500"><Check className="mr-1 h-3 w-3" /> Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500"><Calendar className="mr-1 h-3 w-3" /> Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500"><AlertCircle className="mr-1 h-3 w-3" /> Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment History</h1>
          <p className="text-muted-foreground">Track all customer payments</p>
        </div>
        <Button onClick={() => navigate('/payment-create')}>
          <Plus className="mr-2 h-4 w-4" /> Record Payment
        </Button>
      </div>

      <div className="flex items-center py-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search payments..."
            className="pl-8"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          {/* Additional filter buttons can go here */}
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {payment.date}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{payment.customer}</TableCell>
                <TableCell>₹{payment.amount.toFixed(2)}</TableCell>
                <TableCell>{getStatusBadge(payment.status)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/payment/${payment.id}`)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
