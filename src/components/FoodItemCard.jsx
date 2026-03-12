import React, { useState } from 'react';
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';

const FoodItemCard = ({ entry, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedWeight, setEditedWeight] = useState(entry.weight);

  const handleSaveEdit = () => {
    if (editedWeight > 0) {
      // Пересчитываем калории и макросы
      const multiplier = editedWeight / 100;
      const updatedEntry = {
        ...entry,
        weight: editedWeight,
        calories: Math.round(entry.foodData.calories * multiplier),
        protein: Math.round(entry.foodData.protein * multiplier * 10) / 10,
        fat: Math.round(entry.foodData.fat * multiplier * 10) / 10,
        carbs: Math.round(entry.foodData.carbs * multiplier * 10) / 10,
      };
      onEdit(entry.id, updatedEntry);
      setIsEditing(false);
    }
  };

  return (
    <div
      style={{
        background: '#1a1a1a',
        borderRadius: 16,
        padding: 16,
        border: '1px solid #2a2a2a',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
            {entry.name || entry.foodData?.name}
          </h3>
          {isEditing ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="number"
                value={editedWeight}
                onChange={(e) => setEditedWeight(parseFloat(e.target.value))}
                style={{
                  width: 80,
                  padding: '4px 8px',
                  background: '#0a0a0a',
                  border: '1px solid #4dabf7',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 14,
                }}
              />
              <span style={{ color: '#888' }}>г</span>
              <button
                onClick={handleSaveEdit}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#51cf66',
                  cursor: 'pointer',
                  fontSize: 18,
                }}
              >
                <FaCheck />
              </button>
              <button
                onClick={() => setIsEditing(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ff6b6b',
                  cursor: 'pointer',
                  fontSize: 18,
                }}
              >
                <FaTimes />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#888' }}>{entry.weight} г</span>
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4dabf7',
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                <FaEdit />
              </button>
            </div>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#4dabf7' }}>
            {Math.round(entry.calories)} ккал
          </div>
          <div style={{ display: 'flex', gap: 8, fontSize: 12, color: '#888', marginTop: 4 }}>
            <span style={{ color: '#51cf66' }}>Б {entry.protein?.toFixed(1)}г</span>
            <span style={{ color: '#ff922b' }}>Ж {entry.fat?.toFixed(1)}г</span>
            <span style={{ color: '#ffd43b' }}>У {entry.carbs?.toFixed(1)}г</span>
          </div>
        </div>
      </div>
      <button
        onClick={() => onDelete(entry.id)}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          background: 'none',
          border: 'none',
          color: '#ff6b6b',
          cursor: 'pointer',
          fontSize: 14,
        }}
      >
        <FaTrash />
      </button>
    </div>
  );
};

export default FoodItemCard;