
import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Save } from "lucide-react";
import { toast } from "sonner";

export default function ProductRates() {
  const { products, updateProduct } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [editedRates, setEditedRates] = useState<Record<string, number>>({});

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRateChange = (productId: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setEditedRates(prev => ({
        ...prev,
        [productId]: numValue
      }));
    }
  };

  const updateRate = (productId: string) => {
    const newRate = editedRates[productId];
    if (newRate !== undefined) {
      const product = products.find(p => p.id === productId);
      if (product && product.price !== newRate) {
        updateProduct(productId, { price: newRate });
        toast.success(`Price updated for ${product.name}`);
        
        // Clear the edited rate
        setEditedRates(prev => {
          const newRates = {...prev};
          delete newRates[productId];
          return newRates;
        });
      }
    }
  };

  const updateAllRates = () => {
    const updates = Object.entries(editedRates);
    if (updates.length === 0) {
      toast.error("No rates have been changed");
      return;
    }
    
    updates.forEach(([productId, newRate]) => {
      updateProduct(productId, { price: newRate });
    });
    
    toast.success(`Updated prices for ${updates.length} product(s)`);
    setEditedRates({});
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Rates</h1>
          <p className="text-muted-foreground">
            Manage and update product pricing
          </p>
        </div>
        <Button 
          onClick={updateAllRates}
          disabled={Object.keys(editedRates).length === 0}
        >
          <Save className="mr-2 h-4 w-4" />
          Save All Changes
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product Pricing</CardTitle>
              <CardDescription>
                Update default product rates that apply to all customers
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead className="text-right">Current Rate (₹)</TableHead>
                  <TableHead className="text-right">New Rate (₹)</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const isEdited = editedRates[product.id] !== undefined;
                  return (
                    <TableRow key={product.id}>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.unit}</TableCell>
                      <TableCell className="text-right">₹{product.price}</TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={editedRates[product.id] || ""}
                          onChange={(e) => handleRateChange(product.id, e.target.value)}
                          placeholder={`${product.price}`}
                          className="w-24 inline-block"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Button 
                          size="sm" 
                          onClick={() => updateRate(product.id)}
                          disabled={!isEdited}
                        >
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
