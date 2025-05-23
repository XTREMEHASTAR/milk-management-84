
import { useState, useEffect } from 'react';
import { Order } from '@/types';
import { initialOrders } from '@/data/initialData';

export function useOrderState(createInvoiceFromOrderFunc?: Function | null) {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("orders");
    return saved ? JSON.parse(saved) : initialOrders;
  });

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const addOrder = (order: Omit<Order, "id">) => {
    const newOrder = {
      ...order,
      id: `o${Date.now()}`
    };
    
    setOrders(prev => [...prev, newOrder]);
    
    // Create invoice from the new order automatically if the function is provided
    if (createInvoiceFromOrderFunc) {
      try {
        setTimeout(() => {
          createInvoiceFromOrderFunc(newOrder.id);
        }, 500); // Short delay to ensure state is updated
      } catch (error) {
        console.error("Failed to create invoice from order:", error);
      }
    }

    return newOrder;
  };

  // Batch add multiple orders
  const addBatchOrders = (newOrders: Omit<Order, "id">[]) => {
    const createdOrders = newOrders.map(order => ({
      ...order,
      id: `o${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    }));
    
    setOrders(prev => [...prev, ...createdOrders]);
    
    // Create invoices for each order if invoice creation function is available
    if (createInvoiceFromOrderFunc) {
      try {
        setTimeout(() => {
          createdOrders.forEach(order => {
            createInvoiceFromOrderFunc(order.id);
          });
        }, 500);
      } catch (error) {
        console.error("Failed to create invoices for batch orders:", error);
      }
    }

    return createdOrders;
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

  return {
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
    addBatchOrders
  };
}
