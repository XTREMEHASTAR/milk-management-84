
import { useState, useEffect } from 'react';
import { StockRecord, StockEntry } from '@/types';

export function useStockState(updateSupplier: Function) {
  const [stockRecords, setStockRecords] = useState<StockRecord[]>(() => {
    const saved = localStorage.getItem("stockRecords");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [stockEntries, setStockEntries] = useState<StockEntry[]>(() => {
    const saved = localStorage.getItem("stockEntries");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("stockRecords", JSON.stringify(stockRecords));
  }, [stockRecords]);
  
  useEffect(() => {
    localStorage.setItem("stockEntries", JSON.stringify(stockEntries));
  }, [stockEntries]);

  const addStockRecord = (record: Omit<StockRecord, "id">) => {
    const newRecord = {
      ...record,
      id: `sr${Date.now()}`
    };
    setStockRecords([...stockRecords, newRecord]);
  };

  const updateStockRecord = (id: string, recordData: Partial<StockRecord>) => {
    setStockRecords(
      stockRecords.map((record) =>
        record.id === id ? { ...record, ...recordData } : record
      )
    );
  };

  const deleteStockRecord = (id: string) => {
    setStockRecords(stockRecords.filter((record) => record.id !== id));
  };
  
  const addStockEntry = (entry: StockEntry) => {
    setStockEntries([...stockEntries, entry]);
    
    entry.items.forEach(item => {
      const latestRecord = [...stockRecords]
        .filter(record => record.productId === item.productId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      
      if (latestRecord) {
        const closingStock = latestRecord.closingStock + item.quantity;
        addStockRecord({
          date: entry.date,
          productId: item.productId,
          openingStock: latestRecord.closingStock,
          received: item.quantity,
          dispatched: 0,
          closingStock: closingStock,
          minStockLevel: latestRecord.minStockLevel
        });
      } else {
        addStockRecord({
          date: entry.date,
          productId: item.productId,
          openingStock: 0,
          received: item.quantity,
          dispatched: 0,
          closingStock: item.quantity
        });
      }
    });
    
    const supplier = { id: entry.supplierId, outstandingBalance: 0 }; // Using dummy object with required props
    const newBalance = (supplier.outstandingBalance || 0) + entry.totalAmount;
    updateSupplier(supplier.id, {
      outstandingBalance: newBalance
    });
  };

  const updateStockEntry = (id: string, entryData: Partial<StockEntry>) => {
    setStockEntries(
      stockEntries.map((entry) =>
        entry.id === id ? { ...entry, ...entryData } : entry
      )
    );
  };

  const deleteStockEntry = (id: string) => {
    setStockEntries(stockEntries.filter((entry) => entry.id !== id));
  };

  return {
    stockRecords,
    stockEntries,
    addStockRecord,
    updateStockRecord,
    deleteStockRecord,
    addStockEntry,
    updateStockEntry,
    deleteStockEntry
  };
}
