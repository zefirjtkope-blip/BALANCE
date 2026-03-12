import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Простая SVG иконка пламени (линейный стиль)
const FireIcon = ({ color = '#fff', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2C12 2 8 6 8 10C8 13.5 10 16 12 16C14 16 16 13.5 16 10C16 6 12 2 12 2Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M12 16V22"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M9 20H15"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const StreakCard = ({ currentStreak, foodEntries }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [bestStreak, setBestStreak] = useState(0);

  // Вычисляем лучший стрик на основе записей
  useEffect(() => {
    if (!foodEntries || foodEntries.length === 0) {
      setBestStreak(0);
      return;
    }
    const dates = [...new Set(foodEntries.map(e => e.date))].sort((a, b) => new Date(a) - new Date(b));
    let maxStreak = 0;
    let current = 1;
    for (let i = 1; i < dates.length; i++) {
      const diff = (new Date(dates[i]) - new Date(dates[i-1])) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        current++;
      } else {
        maxStreak = Math.max(maxStreak, current);
        current = 1;
      }
    }
    maxStreak = Math.max(maxStreak, current);
    setBestStreak(maxStreak);
  }, [foodEntries]);

  // Статус ударного режима (если стрик больше 7)
  const isBeastMode = currentStreak >= 7;

  // Условия потери режима (пропуск одного дня)
  const lossCondition = 'Пропуск одного дня сбросит счётчик.';

  // Аналитика за месяц: среднее количество записей в день за последние 30 дней
  const monthlyAvg = (() => {
    const now = new Date();
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const monthEntries = foodEntries.filter(e => new Date(e.date) >= monthAgo);
    const daysCount = 30;
    const avg = monthEntries.length / daysCount;
    return avg.toFixed(1);
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        background: '#1a1a1a',
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        border: '1px solid #2a2a2a',
        cursor: 'pointer',
      }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Заголовок карточки (всегда видим) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <FireIcon color="#ff922b" size={24} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, color: '#888', marginBottom: 4 }}>Серия дней</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#fff' }}>{currentStreak}</div>
        </div>
        <div style={{ color: '#888', fontSize: 20, transform: `rotate(${isExpanded ? 180 : 0}deg)`, transition: 'transform 0.3s ease' }}>
          ▼
        </div>
      </div>

      {/* Раскрывающаяся часть */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #2a2a2a' }}>
              {/* Лучший результат */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: '#888' }}>Лучший результат</span>
                <span style={{ fontSize: 20, fontWeight: 600, color: '#fff' }}>{bestStreak} дней</span>
              </div>

              {/* Статус ударного режима */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: '#888' }}>Ударный режим</span>
                <span style={{ fontSize: 20, fontWeight: 600, color: isBeastMode ? '#ff922b' : '#888' }}>
                  {isBeastMode ? 'Активен' : 'Неактивен'}
                </span>
              </div>

              {/* Условия потери */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: '#888' }}>Потеря режима</span>
                <span style={{ fontSize: 14, color: '#ccc', textAlign: 'right' }}>Пропуск одного дня</span>
              </div>

              {/* Аналитика за месяц */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span style={{ color: '#888' }}>В среднем в день (месяц)</span>
                <span style={{ fontSize: 20, fontWeight: 600, color: '#fff' }}>{monthlyAvg} записей</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StreakCard;