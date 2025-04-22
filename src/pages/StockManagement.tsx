
// Updated code for line 100 in StockManagement.tsx
// Replace the object literal that includes an 'id' property with this:
{
  date: format(new Date(), "yyyy-MM-dd"),
  productId: selectedProduct?.id || "",
  openingStock: Number(openingStock),
  received: Number(received),
  dispatched: Number(dispatched),
  closingStock: Number(openingStock) + Number(received) - Number(dispatched),
  supplierId: selectedSupplier?.id,
  minStockLevel: selectedProduct?.minStockLevel
}
