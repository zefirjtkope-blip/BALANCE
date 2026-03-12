import React from 'react';

const FoodItemCard = ({ food, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(food)}
      style={{
        padding: '12px',
        borderRadius: '12px',
        border: '1px solid #2a2a2a',
        background: '#1a1a1a',
        cursor: 'pointer',
        transition: 'all 0.2s',
        marginBottom: '8px',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = '#2a2a2a'}
      onMouseLeave={(e) => e.currentTarget.style.background = '#1a1a1a'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff' }}>{food.name}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>{food.category}</div>
        </div>
        <div style={{ fontSize: '14px', color: '#4dabf7' }}>{food.calories} ккал</div>
      </div>
    </div>
  );
};

export default FoodItemCard;