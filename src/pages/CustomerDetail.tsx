
import React from 'react';
import { useParams } from 'react-router-dom';

export default function CustomerDetail() {
  const { id } = useParams();
  
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Customer Details</h1>
      <p className="text-muted-foreground">Details for customer ID: {id}</p>
    </div>
  );
}
