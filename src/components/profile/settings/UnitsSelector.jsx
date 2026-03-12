// src/components/profile/settings/UnitsSelector.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const UnitsSelector = ({ units, onChange }) => {
  const { t } = useTranslation();
  return (
    <div style={{ marginBottom: 24 }}>
      <h4 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 12 }}>{t('units')}</h4>
      <div style={{ display: 'grid', gap: 16 }}>
        <div>
          <label style={{ fontSize: 14, color: '#aaa', display: 'block', marginBottom: 6 }}>{t('weight')}</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => onChange({ ...units, weight: 'kg' })}
              style={{
                padding: '8px 16px',
                borderRadius: 20,
                border: '1px solid',
                borderColor: units.weight === 'kg' ? '#3a8dff' : '#2a2a2a',
                background: units.weight === 'kg' ? '#3a8dff20' : 'transparent',
                color: units.weight === 'kg' ? '#3a8dff' : '#aaa',
                cursor: 'pointer',
                flex: 1,
              }}
            >
              {t('kg')}
            </button>
            <button
              onClick={() => onChange({ ...units, weight: 'lbs' })}
              style={{
                padding: '8px 16px',
                borderRadius: 20,
                border: '1px solid',
                borderColor: units.weight === 'lbs' ? '#3a8dff' : '#2a2a2a',
                background: units.weight === 'lbs' ? '#3a8dff20' : 'transparent',
                color: units.weight === 'lbs' ? '#3a8dff' : '#aaa',
                cursor: 'pointer',
                flex: 1,
              }}
            >
              {t('lbs')}
            </button>
          </div>
        </div>
        <div>
          <label style={{ fontSize: 14, color: '#aaa', display: 'block', marginBottom: 6 }}>{t('height')}</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => onChange({ ...units, height: 'cm' })}
              style={{
                padding: '8px 16px',
                borderRadius: 20,
                border: '1px solid',
                borderColor: units.height === 'cm' ? '#3a8dff' : '#2a2a2a',
                background: units.height === 'cm' ? '#3a8dff20' : 'transparent',
                color: units.height === 'cm' ? '#3a8dff' : '#aaa',
                cursor: 'pointer',
                flex: 1,
              }}
            >
              {t('cm')}
            </button>
            <button
              onClick={() => onChange({ ...units, height: 'ft' })}
              style={{
                padding: '8px 16px',
                borderRadius: 20,
                border: '1px solid',
                borderColor: units.height === 'ft' ? '#3a8dff' : '#2a2a2a',
                background: units.height === 'ft' ? '#3a8dff20' : 'transparent',
                color: units.height === 'ft' ? '#3a8dff' : '#aaa',
                cursor: 'pointer',
                flex: 1,
              }}
            >
              {t('ft')}
            </button>
          </div>
        </div>
        <div>
          <label style={{ fontSize: 14, color: '#aaa', display: 'block', marginBottom: 6 }}>{t('energy')}</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => onChange({ ...units, energy: 'kcal' })}
              style={{
                padding: '8px 16px',
                borderRadius: 20,
                border: '1px solid',
                borderColor: units.energy === 'kcal' ? '#3a8dff' : '#2a2a2a',
                background: units.energy === 'kcal' ? '#3a8dff20' : 'transparent',
                color: units.energy === 'kcal' ? '#3a8dff' : '#aaa',
                cursor: 'pointer',
                flex: 1,
              }}
            >
              {t('kcal')}
            </button>
            <button
              onClick={() => onChange({ ...units, energy: 'kj' })}
              style={{
                padding: '8px 16px',
                borderRadius: 20,
                border: '1px solid',
                borderColor: units.energy === 'kj' ? '#3a8dff' : '#2a2a2a',
                background: units.energy === 'kj' ? '#3a8dff20' : 'transparent',
                color: units.energy === 'kj' ? '#3a8dff' : '#aaa',
                cursor: 'pointer',
                flex: 1,
              }}
            >
              {t('kj')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitsSelector;