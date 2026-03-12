import React, { useState } from 'react';
import FoodSearch from './food/FoodSearch';
import FoodList from './food/FoodList';
import ScrollablePage from './ScrollablePage';
import { FaCalculator } from 'react-icons/fa';

function FoodTracker({ onFoodAdd }) {
  const [foodEntries, setFoodEntries] = useState([]);

  const handleFoodAdd = (newEntries) => {
    const entriesWithId = newEntries.map((entry) => ({
      ...entry,
      id: Date.now() + Math.random(),
      timestamp: new Date(),
    }));
    setFoodEntries((prev) => [...prev, ...entriesWithId]);
    onFoodAdd(entriesWithId);
  };

  const handleFoodEdit = (id, updatedEntry) => {
    setFoodEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...updatedEntry } : entry))
    );
  };

  const handleFoodDelete = (id) => {
    setFoodEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const totals = foodEntries.reduce(
    (acc, entry) => ({
      calories: acc.calories + (entry.calories || 0),
      protein: acc.protein + (entry.protein || 0),
      fat: acc.fat + (entry.fat || 0),
      carbs: acc.carbs + (entry.carbs || 0),
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );

  return (
    <ScrollablePage>
      <div style={{ padding: '16px 0' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4, color: '#fff' }}>
          Добавить еду
        </h1>
        <p style={{ fontSize: 14, color: '#888', marginBottom: 24 }}>
          Найди продукт, укажи вес — и мы всё посчитаем
        </p>

        <FoodSearch onFoodAdd={handleFoodAdd} />

        {foodEntries.length > 0 && (
          <>
            <div style={{ marginTop: 32, marginBottom: 16 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: '#fff' }}>
                Сегодня добавлено
              </h2>
            </div>

            <FoodList
              entries={foodEntries}
              onEdit={handleFoodEdit}
              onDelete={handleFoodDelete}
              showDate={false}
            />

            <div
              style={{
                marginTop: 24,
                padding: 20,
                background: '#1a1a1a',
                borderRadius: 16,
                border: '1px solid #2a2a2a',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <FaCalculator color="#4dabf7" />
                <span style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>
                  Итого за сегодня
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: '#888' }}>Калории</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#4dabf7' }}>
                    {Math.round(totals.calories)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#888' }}>Белки</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#51cf66' }}>
                    {Math.round(totals.protein)} г
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#888' }}>Жиры</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#ff922b' }}>
                    {Math.round(totals.fat)} г
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#888' }}>Углеводы</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#ffd43b' }}>
                    {Math.round(totals.carbs)} г
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </ScrollablePage>
  );
}

export default FoodTracker;