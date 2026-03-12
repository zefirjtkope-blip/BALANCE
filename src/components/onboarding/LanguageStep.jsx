// src/components/onboarding/LanguageStep.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../../store/settingsStore';

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
];

const LanguageStep = ({ data = {}, updateData }) => {
  const { i18n } = useTranslation();
  const { setLanguage } = useSettingsStore();
  const [selected, setSelected] = useState(data.language || i18n.language || 'en');

  const handleSelect = (langCode) => {
    setSelected(langCode);
    i18n.changeLanguage(langCode);
    setLanguage(langCode);
    updateData({ language: langCode });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ padding: 20 }}
    >
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: '#fff' }}>
        👋 Choose language
      </h2>
      <p style={{ fontSize: 14, color: '#888', marginBottom: 24 }}>
        Select your preferred language
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {languages.map((lang) => (
          <motion.button
            key={lang.code}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(lang.code)}
            style={{
              padding: '16px 20px',
              borderRadius: 16,
              border: '1px solid',
              borderColor: selected === lang.code ? '#3a8dff' : '#2a2a2a',
              background: selected === lang.code ? '#3a8dff10' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 32 }}>{lang.flag}</span>
            <span style={{ fontSize: 18, fontWeight: 500, color: '#fff' }}>
              {lang.label}
            </span>
            {selected === lang.code && (
              <span style={{ marginLeft: 'auto', color: '#3a8dff' }}>✓</span>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default LanguageStep;