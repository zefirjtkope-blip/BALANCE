import React from 'react';
import ProductCard from './ProductCard';

const FoodList = ({ entries, onEdit, onDelete }) => {
  if (!entries || entries.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {entries.map(entry => (
        <ProductCard
          key={entry.id}
          entry={entry}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default FoodList;