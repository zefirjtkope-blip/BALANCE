// src/components/ProfileEditPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCheck } from 'react-icons/fa';
import { LuMinus, LuPlus } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { calculateBMI, getBMICategory, calculateBMR, calculateTDEE } from '../utils/health';
import ScrollablePage from './ScrollablePage';

const SectionHeader = ({ title }) => (
  <div style={{ marginBottom: 12 }}>
    <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', letterSpacing: 0.3 }}>{title}</h3>
  </div>
);

const GenderToggle = ({ value, onChange }) => {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      {['male', 'female'].map((g) => (
        <button
          key={g}
          onClick={() => onChange(g)}
          style={{
            flex: 1,
            padding: '14px 16px',
            borderRadius: 16,
            border: '1px solid',
            borderColor: value === g ? '#3a8dff' : '#2a2a2a',
            background: value === g ? '#3a8dff10' : 'transparent',
            color: value === g ? '#3a8dff' : '#fff',
            fontSize: 16,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {g === 'male' ? 'Мужской' : 'Женский'}
        </button>
      ))}
    </div>
  );
};

const NumericField = ({ label, value, onChange, unit, min = 1, max = 300 }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) onChange(Math.min(max, Math.max(min, val)));
  };

  const increment = () => onChange(Math.min(max, value + 1));
  const decrement = () => onChange(Math.max(min, value - 1));

  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 13, color: '#aaa', marginBottom: 4 }}>{label}</div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: '#0a0a0a',
        borderRadius: 16,
        border: `1px solid ${isFocused ? '#3a8dff' : '#2a2a2a'}`,
        transition: 'border-color 0.2s',
        padding: '4px',
      }}>
        <button
          onClick={decrement}
          style={{
            width: 44,
            height: 44,
            border: 'none',
            background: 'transparent',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LuMinus size={20} />
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 600, color: '#fff' }}>{value}</div>
        </div>
        <button
          onClick={increment}
          style={{
            width: 44,
            height: 44,
            border: 'none',
            background: 'transparent',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LuPlus size={20} />
        </button>
        <span style={{ width: 40, fontSize: 14, color: '#888', textAlign: 'left' }}>{unit}</span>
      </div>
    </div>
  );
};

const GoalCards = ({ value, onChange }) => {
  const goals = [
    { value: 'lose', label: 'Похудение', icon: '📉', desc: 'Снижение веса' },
    { value: 'maintain', label: 'Поддержание', icon: '⚖️', desc: 'Удержание веса' },
    { value: 'gain', label: 'Набор массы', icon: '📈', desc: 'Увеличение массы' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
      {goals.map((g) => (
        <motion.button
          key={g.value}
          onClick={() => onChange(g.value)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            padding: '16px 12px',
            borderRadius: 20,
            border: '1px solid',
            borderColor: value === g.value ? '#3a8dff' : '#2a2a2a',
            background: value === g.value ? '#3a8dff10' : '#0a0a0a',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 32 }}>{g.icon}</span>
          <span style={{ fontSize: 15, fontWeight: 600, color: value === g.value ? '#3a8dff' : '#fff' }}>
            {g.label}
          </span>
          <span style={{ fontSize: 12, color: '#aaa' }}>{g.desc}</span>
        </motion.button>
      ))}
    </div>
  );
};

const LivePreview = ({ profile, targetCalories }) => {
  const bmi = useMemo(() => calculateBMI(profile.weight, profile.height), [profile]);
  const category = useMemo(() => getBMICategory(bmi), [bmi]);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a1a, #141418)',
      borderRadius: 24,
      padding: 20,
      border: '1px solid #232329',
      marginTop: 8,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 14, color: '#aaa' }}>ИМТ</span>
        <span style={{ fontSize: 28, fontWeight: 700, color: category.color }}>{bmi.toFixed(1)}</span>
      </div>
      <div style={{ fontSize: 15, color: category.color, marginBottom: 12 }}>{category.label}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 14, color: '#aaa' }}>Норма калорий</span>
        <span style={{ fontSize: 22, fontWeight: 700, color: '#3a8dff' }}>{targetCalories} ккал</span>
      </div>
    </div>
  );
};

const ProfileEditPage = ({ userProfile, onSave, onNavigate }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ ...userProfile });
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(JSON.stringify(formData) !== JSON.stringify(userProfile));
  }, [formData, userProfile]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSave(formData);
      setIsSaving(false);
      onNavigate('settings');
    }, 600);
  };

  const targetCalories = useMemo(() => {
    const bmr = calculateBMR(formData);
    const tdee = calculateTDEE(bmr, formData.activity);
    if (formData.goal === 'lose') return Math.round(tdee * 0.8);
    if (formData.goal === 'gain') return Math.round(tdee * 1.15);
    return tdee;
  }, [formData]);

  return (
    <ScrollablePage>
      <div style={{ padding: '20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <button
            onClick={() => onNavigate('settings')}
            style={{
              background: 'none',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
              fontSize: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <FaArrowLeft size={20} />
            <span style={{ fontSize: 16, color: '#fff' }}>Назад</span>
          </button>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff', margin: 0 }}>Редактировать</h1>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            style={{
              background: hasChanges ? 'linear-gradient(135deg, #3a8dff, #1864ab)' : '#333',
              border: 'none',
              borderRadius: 30,
              padding: '10px 20px',
              color: '#fff',
              fontSize: 16,
              fontWeight: 600,
              cursor: hasChanges ? 'pointer' : 'default',
              opacity: hasChanges ? 1 : 0.5,
              transition: 'all 0.2s',
            }}
          >
            {isSaving ? '...' : 'Сохранить'}
          </motion.button>
        </div>

        <SectionHeader title="Основные данные" />
        <div style={{ marginBottom: 24 }}>
          <GenderToggle value={formData.gender} onChange={(v) => handleChange('gender', v)} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 16 }}>
            <NumericField
              label="Возраст"
              value={formData.age || 25}
              onChange={(v) => handleChange('age', v)}
              unit="лет"
              min={12}
              max={100}
            />
            <NumericField
              label="Рост"
              value={formData.height || 170}
              onChange={(v) => handleChange('height', v)}
              unit="см"
              min={100}
              max={250}
            />
            <NumericField
              label="Вес"
              value={formData.weight || 70}
              onChange={(v) => handleChange('weight', v)}
              unit="кг"
              min={30}
              max={200}
            />
          </div>
        </div>

        <SectionHeader title="Цель" />
        <div style={{ marginBottom: 24 }}>
          <GoalCards value={formData.goal} onChange={(v) => handleChange('goal', v)} />
        </div>

        <SectionHeader title="Прогноз" />
        <LivePreview profile={formData} targetCalories={targetCalories} />
      </div>
    </ScrollablePage>
  );
};

export default ProfileEditPage;