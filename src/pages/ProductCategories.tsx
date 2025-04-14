
import React, { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Folder, 
  PackageOpen, 
  Plus, 
  Search 
} from "lucide-react";
import { toast } from "sonner";

const ProductCategories = () => {
  const { products } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Extract unique categories and count products in each
  const categoriesWithCount = Array.from(
    products.reduce((acc, product) => {
      const category = product.category;
      acc.set(category, (acc.get(category) || 0) + 1);
      return acc;
    }, new Map<string, number>())
  ).sort((a, b) => a[0].localeCompare(b[0]));

  // Filter categories based on search
  const filteredCategories = categoriesWithCount.filter(([category]) =>
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle adding new category (in a real app, this would update the backend)
  const handleAddCategory = () => {
    if (newCategory.trim() === "") {
      toast.error("Category name cannot be empty");
      return;
    }

    if (categoriesWithCount.some(([category]) => category === newCategory)) {
      toast.error("Category already exists");
      return;
    }

    toast.success(`Category "${newCategory}" created successfully`);
    setNewCategory("");
    setDialogOpen(false);
    // Note: In a real implementation, we would persist this new category
  };

  // Get products by category for display
  const getProductsByCategory = (category: string): Product[] => {
    return products.filter((product) => product.category === category);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Product Categories
        </h1>
        <p className="text-muted-foreground">
          Organize your products with categories
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Categories</CardTitle>
            <CardDescription>
              Manage product categories and view products in each category
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
                <DialogDescription>
                  Enter a name for the new product category
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right col-span-1">
                    Name
                  </label>
                  <Input
                    id="name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g., Dairy Products"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddCategory}>
                  Create Category
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="relative w-full md:w-72 mb-6">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search categories..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category Name</TableHead>
                  <TableHead className="text-right">Products</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No categories found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map(([category, count]) => (
                    <TableRow key={category}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Folder className="mr-2 h-4 w-4 text-muted-foreground" />
                          {category}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{count}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filteredCategories.map(([category]) => (
            <div key={`details-${category}`} className="mt-8">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Folder className="mr-2 h-4 w-4" />
                {category} Products
              </h3>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead className="text-right">Price (₹)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getProductsByCategory(category).map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <PackageOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                            {product.name}
                          </div>
                        </TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>{product.unit}</TableCell>
                        <TableCell className="text-right">
                          ₹{product.price.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductCategories;
