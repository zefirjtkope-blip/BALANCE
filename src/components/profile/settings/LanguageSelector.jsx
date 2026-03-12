// src/components/profile/settings/LanguageSelector.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
];

const LanguageSelector = ({ currentLanguage, onChange }) => {
  const { t } = useTranslation();

  return (
    <div style={{ marginBottom: 24 }}>
      <h4 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 12 }}>{t('language')}</h4>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onChange(lang.code)}
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              border: '1px solid',
              borderColor: currentLanguage === lang.code ? '#3a8dff' : '#2a2a2a',
              background: currentLanguage === lang.code ? '#3a8dff20' : 'transparent',
              color: currentLanguage === lang.code ? '#3a8dff' : '#aaa',
              cursor: 'pointer',
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>{lang.flag}</span> {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;