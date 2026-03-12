// src/components/profile/settings/AccountSettings.jsx
import React from 'react';
import { FaCrown, FaTrashAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const AccountSettings = ({ isSubscribed, onSubscribe, onReset }) => {
  const { t } = useTranslation();
  return (
    <div style={{ marginBottom: 24 }}>
      <h4 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 12 }}>{t('account')}</h4>
      <div style={{ background: '#1a1a1a', borderRadius: 16, padding: 16, border: '1px solid #232329', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 14, color: '#aaa' }}>{t('subscription')}</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: isSubscribed ? '#2ed47a' : '#aaa' }}>
              {isSubscribed ? t('pro') : t('free')}
            </div>
          </div>
          {!isSubscribed && (
            <button
              onClick={onSubscribe}
              style={{
                padding: '8px 16px',
                borderRadius: 20,
                border: 'none',
                background: 'linear-gradient(135deg, #3a8dff, #1864ab)',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <FaCrown size={14} /> {t('upgrade')}
            </button>
          )}
        </div>
      </div>
      <button
        onClick={() => {
          if (window.confirm('Вы уверены? Все данные будут удалены.')) onReset();
        }}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: 16,
          border: '1px solid #ff6b6b',
          background: 'transparent',
          color: '#ff6b6b',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <FaTrashAlt size={16} /> {t('reset_data')}
      </button>
    </div>
  );
};

export default AccountSettings;