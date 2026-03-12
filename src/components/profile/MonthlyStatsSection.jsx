// src/components/profile/MonthlyStatsSection.jsx
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// Если recharts не установлен, используем простой placeholder
let LineChart, Line, XAxis, ResponsiveContainer;
try {
  const recharts = require('recharts');
  LineChart = recharts.LineChart;
  Line = recharts.Line;
  XAxis = recharts.XAxis;
  ResponsiveContainer = recharts.ResponsiveContainer;
} catch (e) {
  // recharts не установлен, оставляем undefined
}

const MonthlyStatsSection = ({ stats, foodEntries = [] }) => {
  const { t } = useTranslation();

  const chartData = useMemo(() => {
    if (!foodEntries || foodEntries.length === 0) return [];
    const data = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const total = foodEntries
        .filter(e => e && e.date === dateStr)
        .reduce((sum, e) => sum + (e.calories || 0), 0);
      data.push({ calories: total });
    }
    return data;
  }, [foodEntries]);

  const perfectDays = stats?.perfectDays || 0;
  const totalDays = 30;
  const perfectPercent = Math.min(100, Math.round((perfectDays / totalDays) * 100));

  const totalCalories = chartData.reduce((sum, d) => sum + (d.calories || 0), 0);
  const avgCalories = stats?.avgCalories || 0;
  const avgProtein = stats?.avgProtein || 0;
  const mostFrequentCategory = stats?.mostFrequentCategory;

  return (
    <div
      style={{
        background: '#141418',
        borderRadius: 20,
        padding: 16,
        border: '1px solid #232329',
      }}
    >
      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 12 }}>
        {t('stats_30d')}
      </h3>

      {/* Мини-график калорий (если recharts установлен) */}
      {LineChart && chartData.length > 0 && (
        <div style={{ height: 60, marginBottom: 16 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="calories"
                stroke="#3a8dff"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Метрики */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <div style={{ fontSize: 12, color: '#aaa' }}>Всего калорий</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>
            {Math.round(totalCalories)} ккал
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#aaa' }}>{t('avg_calories')}</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>
            {Math.round(avgCalories)} ккал
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#aaa' }}>{t('avg_protein')}</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>
            {Math.round(avgProtein)} г
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#aaa' }}>Идеальных дней</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>{perfectDays}</div>
        </div>
      </div>

      {/* Прогресс-бар идеальных дней */}
      <div style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#aaa', marginBottom: 4 }}>
          <span>Выполнение нормы</span>
          <span>{perfectPercent}%</span>
        </div>
        <div style={{ height: 4, background: '#2a2a2a', borderRadius: 2 }}>
          <div
            style={{
              width: `${perfectPercent}%`,
              height: '100%',
              background: '#2ed47a',
              borderRadius: 2,
            }}
          />
        </div>
      </div>

      {/* Самая частая категория */}
      {mostFrequentCategory && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #2a2a2a' }}>
          <div style={{ fontSize: 12, color: '#aaa', marginBottom: 4 }}>{t('freq_category')}</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>
            {mostFrequentCategory}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyStatsSection;