import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// ========== Форматирование меток ==========
const formatHourLabel = (hour) => `${hour}:00`;
const formatDayLabel = (date) => {
  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  return days[date.getDay()];
};
const formatShortDay = (date) => date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });

// ========== Агрегация по часам ==========
const aggregateByHour = (entries, start, end) => {
  const hourMap = new Map();
  for (let i = 0; i < 24; i++) hourMap.set(i, 0);
  entries.forEach(entry => {
    const entryDate = new Date(entry.timestamp);
    if (entryDate >= start && entryDate <= end) {
      const hour = entryDate.getHours();
      hourMap.set(hour, (hourMap.get(hour) || 0) + (entry.calories || 0));
    }
  });
  return Array.from(hourMap, ([hour, calories]) => ({
    name: formatHourLabel(hour),
    calories,
  }));
};

// ========== Агрегация по дням ==========
const aggregateByDay = (entries, daysCount) => {
  const dayMap = new Map();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < daysCount; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dayMap.set(date.toDateString(), { date, total: 0 });
  }
  entries.forEach(entry => {
    const entryDate = new Date(entry.timestamp);
    entryDate.setHours(0, 0, 0, 0);
    const key = entryDate.toDateString();
    if (dayMap.has(key)) {
      dayMap.get(key).total += entry.calories || 0;
    }
  });
  return Array.from(dayMap.values())
    .sort((a, b) => a.date - b.date)
    .map(item => ({
      name: daysCount === 7 ? formatDayLabel(item.date) : formatShortDay(item.date),
      calories: Math.round(item.total),
    }));
};

// ========== Кастомный тултип ==========
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: '#1f1f27',
          border: '1px solid #333',
          borderRadius: 8,
          padding: '6px 10px',
          color: '#fff',
          fontSize: 13,
        }}
      >
        <div style={{ color: '#aaa', marginBottom: 2 }}>{label}</div>
        <div style={{ color: '#3a8dff', fontWeight: 600 }}>{payload[0].value} ккал</div>
      </div>
    );
  }
  return null;
};

// ========== Основной компонент ==========
const NutritionChart = ({ foodEntries }) => {
  const [period, setPeriod] = useState('week'); // 'hour', 'day', 'week', 'month'

  const chartData = useMemo(() => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    switch (period) {
      case 'hour': {
        const currentHour = now.getHours();
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), currentHour, 0, 0);
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), currentHour, 59, 59);
        return aggregateByHour(foodEntries, start, end);
      }
      case 'day': {
        const end = now;
        const start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        return aggregateByHour(foodEntries, start, end);
      }
      case 'week':
        return aggregateByDay(foodEntries, 7);
      case 'month':
        return aggregateByDay(foodEntries, 30);
      default:
        return [];
    }
  }, [foodEntries, period]);

  // Сегментированный переключатель (очень компактный)
  const segments = [
    { id: 'hour', label: '1ч' },
    { id: 'day', label: '24ч' },
    { id: 'week', label: '7д' },
    { id: 'month', label: '30д' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: 'rgba(20, 20, 28, 0.8)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: 24,
        padding: '20px 16px',
        marginBottom: 24,
        border: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      {/* Заголовок и переключатель */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', letterSpacing: 0.3 }}>Аналитика</h3>

        {/* Компактный переключатель */}
        <div style={{ display: 'flex', gap: 2, background: '#1f1f27', padding: 2, borderRadius: 16 }}>
          {segments.map(seg => (
            <motion.button
              key={seg.id}
              onClick={() => setPeriod(seg.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              style={{
                padding: '2px 8px',
                borderRadius: 14,
                border: 'none',
                background: period === seg.id ? '#3a8dff' : 'transparent',
                color: period === seg.id ? '#fff' : '#888',
                fontSize: 11,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              {seg.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* График с анимацией */}
      <AnimatePresence mode="wait">
        <motion.div
          key={period}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
        >
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="name" stroke="#666" tick={{ fill: '#888', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="calories"
                stroke="#3a8dff"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: '#3a8dff', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default NutritionChart;