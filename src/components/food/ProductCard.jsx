import React from 'react';
import * as Icons from 'react-icons/lu';
import { getCategoryIcon, getCategoryColor } from '../../utils/categoryUtils';
const ProductCard = ({ product, onSelect }) => {
  // Если product не передан или undefined — ничего не рендерим
  if (!product) return null;

  const Icon = getCategoryIcon(product.category) || Icons.LuPackage;
  const color = getCategoryColor(product.category);
  // остальной код...

  return (
    <div
      onClick={() => onSelect(product)}
      style={{
        background: '#1a1a1a',
        border: '1px solid #2a2a2a',
        borderRadius: 18,
        padding: 14,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        cursor: 'pointer',
        transition: 'transform 0.2s',
      }}
    >
      <div style={{
        width: 36,
        height: 36,
        background: 'rgba(255,255,255,0.04)',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Icon size={22} color={color} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 500, color: '#fff' }}>{product.name}</div>
        <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>{product.calories} ккал / 100г</div>
      </div>
      <Icons.LuPlus size={20} color="#3a8dff" />
    </div>
  );
};

export default ProductCard;