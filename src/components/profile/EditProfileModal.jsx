// src/components/profile/EditProfileModal.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCamera } from 'react-icons/fa';
import { calculateBMI, getBMICategory, calculateBMR, calculateTDEE } from '../../utils/health';

const GenderToggle = ({ value, onChange }) => {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
      {['male', 'female'].map((g) => (
        <button
          key={g}
          onClick={() => onChange(g)}
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: 12,
            border: '1px solid',
            borderColor: value === g ? '#3a8dff' : '#2a2a2a',
            background: value === g ? '#3a8dff10' : 'transparent',
            color: value === g ? '#3a8dff' : '#fff',
            fontSize: 14,
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

const InputField = ({ label, value, onChange, unit, type = 'text', min, max }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value !== undefined && value !== null ? String(value) : '');

  useEffect(() => {
    setInputValue(value !== undefined && value !== null ? String(value) : '');
  }, [value]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (type === 'number') {
      let str = inputValue.replace(',', '.');
      let num = parseFloat(str);
      if (isNaN(num)) {
        setInputValue(value !== undefined ? String(value) : '');
        return;
      }
      if (min !== undefined && num < min) num = min;
      if (max !== undefined && num > max) num = max;
      setInputValue(String(num));
      onChange(num);
    } else {
      onChange(inputValue);
    }
  };

  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 12, color: '#aaa', marginBottom: 4 }}>{label}</div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: '#0a0a0a',
          borderRadius: 12,
          border: `1px solid ${isFocused ? '#3a8dff' : '#2a2a2a'}`,
          transition: 'border-color 0.2s',
          padding: '0 12px',
        }}
      >
        <input
          type={type === 'number' ? 'text' : type}
          inputMode={type === 'number' ? 'numeric' : undefined}
          value={inputValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          style={{
            width: '100%',
            padding: '12px 0',
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: 16,
            outline: 'none',
          }}
        />
        {unit && <span style={{ fontSize: 14, color: '#888', marginLeft: 4 }}>{unit}</span>}
      </div>
    </div>
  );
};

const GoalSelector = ({ value, onChange }) => {
  const goals = [
    { value: 'lose', label: 'Похудение' },
    { value: 'maintain', label: 'Поддержание' },
    { value: 'gain', label: 'Набор массы' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
      {goals.map((g) => (
        <button
          key={g.value}
          onClick={() => onChange(g.value)}
          style={{
            padding: '12px 8px',
            borderRadius: 12,
            border: '1px solid',
            borderColor: value === g.value ? '#3a8dff' : '#2a2a2a',
            background: value === g.value ? '#3a8dff10' : '#0a0a0a',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            color: value === g.value ? '#3a8dff' : '#fff',
          }}
        >
          {g.label}
        </button>
      ))}
    </div>
  );
};

const CompactPreview = ({ profile, targetCalories }) => {
  const bmi = calculateBMI(profile.weight, profile.height);
  const category = getBMICategory(bmi);
  return (
    <div
      style={{
        background: '#1a1a1a',
        borderRadius: 16,
        padding: 16,
        border: '1px solid #2a2a2a',
        marginBottom: 16,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 13, color: '#aaa' }}>ИМТ</span>
        <span style={{ fontSize: 18, fontWeight: 600, color: category.color }}>{bmi.toFixed(1)}</span>
      </div>
      <div style={{ fontSize: 12, color: category.color, marginBottom: 8 }}>{category.label}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: '#aaa' }}>Норма калорий</span>
        <span style={{ fontSize: 16, fontWeight: 600, color: '#3a8dff' }}>{targetCalories} ккал</span>
      </div>
    </div>
  );
};

const EditProfileModal = ({ isOpen, onClose, profile, onSave }) => {
  if (!profile) return null;

  const [formData, setFormData] = useState({ 
    ...profile,
    startWeight: profile.startWeight || profile.weight
  });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(JSON.stringify(formData) !== JSON.stringify(profile));
  }, [formData, profile]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const bmr = calculateBMR(formData);
  const tdee = calculateTDEE(bmr, formData.activity);
  let targetCalories = tdee;
  if (formData.goal === 'lose') targetCalories = Math.round(tdee * 0.8);
  if (formData.goal === 'gain') targetCalories = Math.round(tdee * 1.15);

  const initials = formData.name
    ? formData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 1000,
            }}
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'rgba(20, 20, 26, 0.9)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: '24px 20px',
              zIndex: 1001,
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 -8px 30px rgba(0,0,0,0.4)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>Редактировать профиль</h2>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                <FaTimes size={24} />
              </button>
            </div>

            {/* Аватар */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  background: 'linear-gradient(135deg, #3a8dff, #1864ab)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 32,
                  fontWeight: 600,
                  color: '#fff',
                }}>
                  {initials}
                </div>
                <button
                  onClick={() => alert('Функция смены аватара будет добавлена позже')}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    background: '#3a8dff',
                    border: '2px solid #0a0a0a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#fff',
                  }}
                >
                  <FaCamera size={14} />
                </button>
              </div>
            </div>

            {/* Имя */}
            <InputField
              label="Имя"
              type="text"
              value={formData.name || ''}
              onChange={(v) => handleChange('name', v)}
            />

            {/* Пол */}
            <div style={{ marginTop: 16 }}>
              <GenderToggle value={formData.gender} onChange={(v) => handleChange('gender', v)} />
            </div>

            {/* Возраст, рост, вес */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 16, marginBottom: 16 }}>
              <InputField
                label="Возраст"
                type="number"
                value={formData.age || ''}
                onChange={(v) => handleChange('age', v)}
                unit="лет"
                min={12}
                max={100}
              />
              <InputField
                label="Рост"
                type="number"
                value={formData.height || ''}
                onChange={(v) => handleChange('height', v)}
                unit="см"
                min={100}
                max={250}
              />
              <InputField
                label="Вес"
                type="number"
                value={formData.weight || ''}
                onChange={(v) => handleChange('weight', v)}
                unit="кг"
                min={30}
                max={200}
              />
            </div>

            {/* Стартовый вес */}
            <InputField
              label="Стартовый вес"
              type="number"
              value={formData.startWeight || ''}
              onChange={(v) => handleChange('startWeight', v)}
              unit="кг"
              min={30}
              max={200}
            />

            {/* Цель */}
            <div style={{ marginTop: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: '#aaa', marginBottom: 4 }}>Цель</div>
              <GoalSelector value={formData.goal} onChange={(v) => handleChange('goal', v)} />
            </div>

            {/* Целевой вес */}
            <InputField
              label="Целевой вес"
              type="number"
              value={formData.targetWeight || formData.weight || ''}
              onChange={(v) => handleChange('targetWeight', v)}
              unit="кг"
              min={30}
              max={200}
            />

            {/* Превью */}
            <CompactPreview profile={formData} targetCalories={targetCalories} />

            {/* Кнопка сохранения */}
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              style={{
                width: '100%',
                padding: 16,
                borderRadius: 16,
                border: 'none',
                background: hasChanges ? 'linear-gradient(135deg, #3a8dff, #1864ab)' : '#333',
                color: '#fff',
                fontSize: 16,
                fontWeight: 600,
                cursor: hasChanges ? 'pointer' : 'default',
                opacity: hasChanges ? 1 : 0.5,
                transition: 'all 0.2s',
                marginTop: 16,
              }}
            >
              Сохранить изменения
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;