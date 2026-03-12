// src/components/profile/HealthMetrics.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { LuInfo } from 'react-icons/lu';

const CircularProgress = ({ value, max, color }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / max) * circumference;
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="#2a2a2a"
        strokeWidth="8"
      />
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />
    </svg>
  );
};

const BMIScale = ({ bmi }) => {
  const categories = [
    { label: 'Недостаточный', range: [0, 18.5], color: '#4dabf7' },
    { label: 'Нормальный', range: [18.5, 25], color: '#51cf66' },
    { label: 'Избыточный', range: [25, 30], color: '#ff922b' },
    { label: 'Ожирение', range: [30, 40], color: '#ff6b6b' },
  ];
  return (
    <div style={{ marginTop: 12, width: '100%' }}>
      <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden' }}>
        {categories.map((cat, idx) => {
          const width = ((cat.range[1] - cat.range[0]) / 40) * 100;
          return (
            <div
              key={idx}
              style={{
                width: `${width}%`,
                background: cat.color,
                opacity: bmi >= cat.range[0] && bmi < cat.range[1] ? 1 : 0.3,
                transition: 'opacity 0.2s',
              }}
            />
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: '#aaa' }}>
        <span>18.5</span>
        <span>25</span>
        <span>30</span>
        <span>40</span>
      </div>
    </div>
  );
};

const HealthMetrics = ({ bmi, category }) => {
  const { t } = useTranslation();
  const [showInfo, setShowInfo] = useState(false);

  const handleClick = () => {
    // При клике показываем информационный алерт (можно заменить на модал или тултип)
    alert('ИМТ (Индекс массы тела) — величина, позволяющая оценить соответствие массы человека его росту.\n\n' +
      '• <18.5: Недостаточный вес\n' +
      '• 18.5–24.9: Нормальный вес\n' +
      '• 25–29.9: Избыточный вес\n' +
      '• ≥30: Ожирение');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        background: '#141418',
        borderRadius: 20,
        padding: 16,
        border: '1px solid #232329',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <CircularProgress value={bmi} max={40} color={category.color} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, color: '#aaa' }}>{t('bmi')}</span>
            <LuInfo size={16} color="#666" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: category.color, lineHeight: 1.2 }}>
            {bmi.toFixed(1)}
          </div>
          <div style={{ fontSize: 14, color: category.color, marginTop: 4 }}>{category.label}</div>
        </div>
      </div>
      <BMIScale bmi={bmi} />
    </motion.div>
  );
};

export default HealthMetrics;