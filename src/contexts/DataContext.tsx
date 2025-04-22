
// Update the addStockEntry function to handle the new properties
const addStockEntry = (stockEntry: Omit<StockEntry, "id">) => {
  const newStockEntry = { ...stockEntry, id: uuidv4() };
  
  // Update stock records for each product in the entry
  stockEntry.items.forEach(item => {
    const { productId, quantity } = item;
    
    // Find most recent stock record for this product
    const latestRecord = [...stockRecords]
      .filter(record => record.productId === productId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    
    if (latestRecord) {
      // Create new stock record
      const newRecord: Omit<StockRecord, "id"> = {
        date: stockEntry.date,
        productId,
        openingStock: latestRecord.closingStock,
        received: quantity,
        dispatched: 0,
        closingStock: latestRecord.closingStock + quantity,
        supplierId: stockEntry.supplierId,
        minStockLevel: latestRecord.minStockLevel
      };
      
      addStockRecord(newRecord);
    } else {
      // No previous record, create first one
      const newRecord: Omit<StockRecord, "id"> = {
        date: stockEntry.date,
        productId,
        openingStock: 0,
        received: quantity,
        dispatched: 0,
        closingStock: quantity,
        supplierId: stockEntry.supplierId
      };
      
      addStockRecord(newRecord);
    }
  });
  
  // If supplier has outstandingBalance and paymentStatus is not "paid"
  if (stockEntry.paymentStatus !== "paid") {
    // Update supplier outstanding balance
    const updatedSuppliers = suppliers.map(supplier => {
      if (supplier.id === stockEntry.supplierId) {
        const currentBalance = supplier.outstandingBalance || 0;
        return {
          ...supplier,
          outstandingBalance: currentBalance + stockEntry.totalAmount
        };
      }
      return supplier;
    });
    
    setSuppliers(updatedSuppliers);
  }
  
  setStockEntries([...stockEntries, newStockEntry]);
  toast.success("Purchase recorded successfully");
};
