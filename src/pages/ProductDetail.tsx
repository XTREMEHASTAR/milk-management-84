
import React from 'react';
import { useParams } from 'react-router-dom';

export default function ProductDetail() {
  const { id } = useParams();
  
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Product Details</h1>
      <p className="text-muted-foreground">Details for product ID: {id}</p>
    </div>
  );
}
