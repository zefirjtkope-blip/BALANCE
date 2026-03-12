// src/components/profile/settings/SettingsModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../../../store/settingsStore';
import LanguageSelector from './LanguageSelector';
import UnitsSelector from './UnitsSelector';
import NotificationSettings from './NotificationSettings';
import AccountSettings from './AccountSettings';

const SettingsModal = ({ isOpen, onClose, onReset, onSubscribe, isSubscribed }) => {
  const { t } = useTranslation();
  const { language, units, notifications, setLanguage, setUnits, setNotifications } = useSettingsStore();

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
              background: 'rgba(20,20,26,0.9)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: '24px 20px',
              zIndex: 1001,
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 -8px 30px rgba(0,0,0,0.4)',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: '#fff' }}>{t('settings')}</h3>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                <FaTimes size={24} />
              </button>
            </div>

            <LanguageSelector currentLanguage={language} onChange={setLanguage} />
            <UnitsSelector units={units} onChange={setUnits} />
            <NotificationSettings notifications={notifications} onChange={setNotifications} />
            <AccountSettings isSubscribed={isSubscribed} onSubscribe={onSubscribe} onReset={onReset} />

            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={onClose}
                style={{
                  padding: '10px 24px',
                  borderRadius: 20,
                  border: '1px solid #3a8dff',
                  background: 'transparent',
                  color: '#3a8dff',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {t('close')}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;