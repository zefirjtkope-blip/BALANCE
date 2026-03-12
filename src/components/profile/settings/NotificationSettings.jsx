// src/components/profile/settings/NotificationSettings.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const NotificationSettings = ({ notifications, onChange }) => {
  const { t } = useTranslation();
  const toggle = (key) => {
    onChange({ ...notifications, [key]: !notifications[key] });
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <h4 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 12 }}>{t('notifications')}</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={notifications.mealReminder}
            onChange={() => toggle('mealReminder')}
            style={{ accentColor: '#3a8dff' }}
          />
          <span style={{ color: '#fff' }}>{t('meal_reminder')}</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={notifications.proteinReminder}
            onChange={() => toggle('proteinReminder')}
            style={{ accentColor: '#3a8dff' }}
          />
          <span style={{ color: '#fff' }}>{t('protein_reminder')}</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={notifications.dailyReport}
            onChange={() => toggle('dailyReport')}
            style={{ accentColor: '#3a8dff' }}
          />
          <span style={{ color: '#fff' }}>{t('daily_report')}</span>
        </label>
      </div>
    </div>
  );
};

export default NotificationSettings;