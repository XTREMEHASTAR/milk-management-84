
import { useState, useEffect } from 'react';
import { Order } from '@/types';
import { initialOrders } from '@/data/initialData';
import { useInvoices } from '@/contexts/InvoiceContext';

export function useOrderState() {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("orders");
    return saved ? JSON.parse(saved) : initialOrders;
  });

  // Get invoice context to create invoices
  const { createInvoiceFromOrder } = useInvoices();

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const addOrder = (order: Omit<Order, "id">) => {
    const newOrder = {
      ...order,
      id: `o${Date.now()}`
    };
    
    setOrders(prev => [...prev, newOrder]);
    
    // Create invoice from the new order automatically
    try {
      if (createInvoiceFromOrder) {
        setTimeout(() => {
          createInvoiceFromOrder(newOrder.id);
        }, 500); // Short delay to ensure state is updated
      }
    } catch (error) {
      console.error("Failed to create invoice from order:", error);
    }

    return newOrder;
  };

  const updateOrder = (id: string, orderData: Partial<Order>) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, ...orderData } : order
      )
    );
  };

  const deleteOrder = (id: string) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  // Batch add multiple orders
  const addBatchOrders = (newOrders: Omit<Order, "id">[]) => {
    const createdOrders = newOrders.map(order => ({
      ...order,
      id: `o${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    }));
    
    setOrders(prev => [...prev, ...createdOrders]);
    
    // Create invoices for each order
    try {
      if (createInvoiceFromOrder) {
        setTimeout(() => {
          createdOrders.forEach(order => {
            createInvoiceFromOrder(order.id);
          });
        }, 500);
      }
    } catch (error) {
      console.error("Failed to create invoices for batch orders:", error);
    }

    return createdOrders;
  };

  return {
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
    addBatchOrders
  };
}
