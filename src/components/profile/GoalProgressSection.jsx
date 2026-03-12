import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const GoalProgressSection = ({ currentWeight, targetWeight, progress, units }) => {
  const { t } = useTranslation();
  const remaining = Math.abs(currentWeight - targetWeight).toFixed(1);
  const isLosing = currentWeight > targetWeight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.05 }}
      style={{
        background: '#141418',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        border: '1px solid #232329',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 14, color: '#aaa' }}>{t('goal_progress')}</span>
        <span style={{ fontSize: 14, color: '#aaa' }}>{currentWeight} / {targetWeight} {units}</span>
      </div>
      <div style={{ position: 'relative', height: 6, background: '#2a2a2a', borderRadius: 3, marginBottom: 8 }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          style={{
            height: '100%',
            background: progress >= 100 ? '#2ed47a' : '#3a8dff',
            borderRadius: 3,
          }}
        />
      </div>
      <div style={{ fontSize: 13, color: '#aaa' }}>
        {parseFloat(remaining) > 0 ? (
          isLosing ? `${t('remaining')} сбросить ${remaining} ${units}` : `${t('remaining')} набрать ${remaining} ${units}`
        ) : (
          'Цель достигнута!'
        )}
      </div>
    </motion.div>
  );
};

export default GoalProgressSection;