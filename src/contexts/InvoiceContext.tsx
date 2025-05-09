
import React, { createContext, useContext, ReactNode, useState } from 'react';

interface InvoiceContextType {
  // Add your context properties here
  // For example:
  createInvoice: Function | null;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

interface InvoiceProviderProps {
  children: ReactNode;
}

export const InvoiceProvider: React.FC<InvoiceProviderProps> = ({ children }) => {
  const [createInvoice, setCreateInvoice] = useState<Function | null>(null);

  const value = {
    createInvoice,
  };

  return (
    <InvoiceContext.Provider value={value}>
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};
