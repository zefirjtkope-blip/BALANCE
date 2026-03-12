// src/components/profile/MetabolismSection.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuInfo } from 'react-icons/lu';

const MetabolismSection = ({ bmr, tdee, targetCalories }) => {
  const { t } = useTranslation();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div style={{
      background: '#141418',
      borderRadius: 20,
      padding: 16,
      marginBottom: 16,
      border: '1px solid #232329',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{t('metabolism')}</div>
        <div style={{ position: 'relative' }}>
          <LuInfo
            size={18}
            color="#666"
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setShowInfo(true)}
            onMouseLeave={() => setShowInfo(false)}
          />
          {showInfo && (
            <div style={{
              position: 'absolute',
              bottom: '100%',
              right: 0,
              width: 220,
              background: '#1f1f27',
              border: '1px solid #2a2a2a',
              borderRadius: 12,
              padding: 10,
              fontSize: 12,
              color: '#ccc',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              zIndex: 10,
              marginBottom: 8,
            }}>
              <p style={{ margin: 0 }}><strong>BMR</strong> – базовый метаболизм (калории в покое).</p>
              <p style={{ margin: '8px 0 0' }}><strong>TDEE</strong> – общий расход с учётом активности.</p>
              <p style={{ margin: '8px 0 0' }}><strong>Суточная норма</strong> – калории для достижения цели.</p>
            </div>
          )}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <div style={{ fontSize: 12, color: '#aaa' }}>{t('bmr')}</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>{bmr} ккал</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#aaa' }}>{t('tdee')}</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>{tdee} ккал</div>
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 12, color: '#aaa' }}>{t('daily_norm')}</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#3a8dff' }}>{targetCalories} ккал</div>
      </div>
    </div>
  );
};

export default MetabolismSection;