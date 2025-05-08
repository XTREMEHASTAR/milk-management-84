
import React from 'react';
import { useParams } from 'react-router-dom';

export default function InvoiceDetail() {
  const { id } = useParams();
  
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Invoice Details</h1>
      <p className="text-muted-foreground">Details for invoice ID: {id}</p>
    </div>
  );
}
