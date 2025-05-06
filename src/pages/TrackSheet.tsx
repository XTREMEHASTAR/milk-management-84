
import React, { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Download } from "lucide-react";
import { generateTrackSheetPDF } from "@/utils/pdfUtils";

export default function TrackSheet() {
  const { products, customers, orders } = useData();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [productId, setProductId] = useState("");
  
  // Get customers who ordered the selected product
  const relevantCustomers = !productId 
    ? [] 
    : customers.filter(customer => 
        orders.some(order => 
          order.items.some(item => 
            item.customerId === customer.id && item.productId === productId
          )
        )
      );

  // Generate PDF
  const generatePDF = () => {
    const productName = products.find(p => p.id === productId)?.name || "";
    
    generateTrackSheetPDF({
      month: selectedMonth,
      productId,
      productName,
      customers: relevantCustomers,
      orders
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Track Sheet</h1>
          <p className="text-muted-foreground">
            Generate delivery track sheets as PDF documents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={generatePDF} disabled={!productId}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Create Track Sheet</CardTitle>
          <CardDescription>
            Generate a PDF track sheet for monthly product deliveries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Month</label>
              <DatePicker
                date={selectedMonth}
                setDate={setSelectedMonth}
                mode="month"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Product</label>
              <Select value={productId} onValueChange={setProductId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {!productId && (
            <div className="flex items-center justify-center p-8 border rounded-md bg-muted/10">
              <p className="text-muted-foreground">
                Please select a product to generate a track sheet
              </p>
            </div>
          )}
          
          {productId && relevantCustomers.length === 0 && (
            <div className="flex items-center justify-center p-8 border rounded-md bg-muted/10">
              <p className="text-muted-foreground">
                No data available for the selected product
              </p>
            </div>
          )}
          
          {productId && relevantCustomers.length > 0 && (
            <div className="flex items-center justify-center p-8 border rounded-md bg-accent/10">
              <p>
                Track sheet ready for <strong>{products.find(p => p.id === productId)?.name}</strong>. 
                Click the Download PDF button to generate the landscape document.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
